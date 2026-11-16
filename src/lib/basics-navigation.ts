// JazzHQ Basics: an in-place view on the homepage, addressed by `/#basics`.
//
// This module is the single source of truth for switching between the Home
// view and the Basics view. `location.hash === "#basics"` means Basics; any
// other URL means Home. Components only call `openBasics(trigger)`,
// `closeBasics()` and `scrollToBasicsSection(id)`, and the page shell reads
// the view with `useBasicsView()` and runs `useBasicsViewTransitions()`.
//
// Next.js note: the App Router patches history.pushState/replaceState and
// reloads on popstate entries without its `__NA` marker. We strip Next's own
// keys before calling push/replace so its patch re-adds them and syncs its
// router URL; custom keys are preserved by Next on later updates.

import { useEffect, useLayoutEffect, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import { BASICS_PENDING_STYLE_ID } from "./basics-early-script";

export const BASICS_HASH = "#basics";
export const BASICS_TITLE = "JazzHQ Basics | JazzHQ";
export const BASICS_HEADING_ID = "basics-view-title";
/** Links carrying this attribute are handled by their own onClick, never intercepted. */
export const BASICS_NAV_ATTR = "data-basics-nav";

type ReturnPoint = { scrollY: number; triggerId: string | null; previousHash: string; title: string };
type BasicsHistoryState = Record<string, unknown> & {
  basicsReturn?: ReturnPoint;
  basics?: boolean;
  fromHome?: boolean;
  basicsDoc?: string;
};

type PendingTransition =
  | { kind: "basics-top" }
  | { kind: "home-restore"; point: ReturnPoint }
  | { kind: "home-top"; focusMain: boolean }
  | { kind: "home-target"; hash: string };

const NEXT_HISTORY_KEYS = ["__NA", "__PRIVATE_NEXTJS_INTERNALS_TREE"];
const isBrowser = typeof window !== "undefined";
// Identifies this document, so a `fromHome` entry survives a refresh but is
// then treated as a direct entry (its Home entry belongs to an older document).
const DOCUMENT_ID = isBrowser ? Math.random().toString(36).slice(2) : "";

const listeners = new Set<() => void>();
let lastIsBasics: boolean | null = null;
let pending: PendingTransition | null = null;
let homeTitle: string | null = null;

const readState = (): BasicsHistoryState | null => {
  const state = isBrowser ? window.history.state : null;
  return state && typeof state === "object" ? (state as BasicsHistoryState) : null;
};

/** Current history state without Next.js's own keys (its patch re-adds them). */
function customState(): BasicsHistoryState {
  const state = { ...(readState() ?? {}) };
  for (const key of NEXT_HISTORY_KEYS) delete state[key];
  return state;
}

function withoutBasicsKeys(state: BasicsHistoryState): BasicsHistoryState {
  const next = { ...state };
  delete next.basics;
  delete next.fromHome;
  delete next.basicsDoc;
  delete next.basicsReturn;
  return next;
}

const homeUrl = (hash = "") => `${window.location.pathname}${window.location.search}${hash}`;

export function isBasicsUrl(): boolean {
  return isBrowser && window.location.hash === BASICS_HASH;
}

export const prefersReducedMotion = () =>
  isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function notify() {
  lastIsBasics = isBasicsUrl();
  listeners.forEach((listener) => listener());
}

function rememberHomeTitle() {
  if (homeTitle === null && document.title !== BASICS_TITLE) homeTitle = document.title;
}

/** True for a plain primary click: no modifier keys, not already handled. */
export function isPlainLeftClick(event: MouseEvent | ReactMouseEvent): boolean {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

// ── Public actions ───────────────────────────────────────────────────

/** Switch to the Basics view, remembering where the user was on Home. */
export function openBasics(trigger?: HTMLElement | null) {
  if (!isBrowser || isBasicsUrl()) return;
  rememberHomeTitle();
  const base = withoutBasicsKeys(customState());
  const point: ReturnPoint = {
    scrollY: window.scrollY,
    triggerId: trigger?.id || null,
    previousHash: window.location.hash,
    title: document.title,
  };
  window.history.replaceState({ ...base, basicsReturn: point }, "");
  window.history.pushState({ ...base, basics: true, fromHome: true, basicsDoc: DOCUMENT_ID }, "", homeUrl(BASICS_HASH));
  pending = { kind: "basics-top" };
  notify();
}

/** "← Back to Home": go back if we came from Home in this document, else replace. */
export function closeBasics() {
  if (!isBrowser || !isBasicsUrl()) return;
  const state = readState();
  if (state?.fromHome && state.basicsDoc === DOCUMENT_ID) {
    window.history.back(); // popstate restores scroll, focus and title
    return;
  }
  window.history.replaceState(withoutBasicsKeys(customState()), "", homeUrl());
  pending = { kind: "home-top", focusMain: true };
  notify();
}

/** Scroll to a section inside the Basics view without touching the URL. */
export function scrollToBasicsSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  // scroll-margin-top = the sticky header's real height (73px incl. border by
  // default; taller while the mobile menu is open).
  const header = document.querySelector<HTMLElement>(".site-header");
  if (header) target.style.scrollMarginTop = `${Math.round(header.getBoundingClientRect().height)}px`;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

// ── Navigation from the Basics view to Home links (logo, Home, /#anchor) ──

function goHome(hash: string) {
  window.history.pushState(withoutBasicsKeys(customState()), "", homeUrl(hash));
  pending = hash ? { kind: "home-target", hash } : { kind: "home-top", focusMain: false };
  notify();
}

// Capture phase on window runs before React's and Next's handlers. Next's
// <Link> still runs its onClick props (e.g. closing the mobile menu) but
// skips its own navigation because the event is defaultPrevented.
function onClickCapture(event: MouseEvent) {
  if (!isBasicsUrl() || !isPlainLeftClick(event)) return;
  const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor || anchor.hasAttribute(BASICS_NAV_ATTR) || anchor.hasAttribute("download")) return;
  if (anchor.target && anchor.target !== "_self") return;
  const url = new URL(anchor.href, window.location.href);
  const { origin, pathname, search } = window.location;
  if (url.origin !== origin || url.pathname !== pathname || url.search !== search) return;
  event.preventDefault();
  if (url.hash === BASICS_HASH) return; // already here
  goHome(url.hash);
}

// popstate / hashchange / currententrychange: derive the view from the hash.
// Several can fire for one change, so only act when the view actually changes.
function onLocationChange() {
  const nowBasics = isBasicsUrl();
  if (nowBasics === lastIsBasics) return;
  if (nowBasics) {
    pending = { kind: "basics-top" };
  } else {
    const point = readState()?.basicsReturn;
    const hash = window.location.hash;
    pending = point ? { kind: "home-restore", point } : hash ? { kind: "home-target", hash } : { kind: "home-top", focusMain: true };
  }
  notify();
}

// Next.js router navigations (router.push, <Link>) update the URL through
// history.pushState, which fires neither popstate nor hashchange. Where the
// Navigation API exists, `currententrychange` reports every same-document URL
// change, so the view also follows programmatic router navigations. Links are
// additionally handled by onClickCapture in every browser.
type NavigationLike = Pick<EventTarget, "addEventListener" | "removeEventListener">;
const navigationApi = (): NavigationLike | null =>
  (isBrowser && (window as unknown as { navigation?: NavigationLike }).navigation) || null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    lastIsBasics = isBasicsUrl();
    if (lastIsBasics) pending = { kind: "basics-top" }; // direct load or refresh on /#basics
    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("hashchange", onLocationChange);
    window.addEventListener("click", onClickCapture, true);
    navigationApi()?.addEventListener("currententrychange", onLocationChange);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("hashchange", onLocationChange);
      window.removeEventListener("click", onClickCapture, true);
      navigationApi()?.removeEventListener("currententrychange", onLocationChange);
    }
  };
}

/** True while the Basics view is active. The server always renders Home. */
export function useBasicsView(): boolean {
  return useSyncExternalStore(subscribe, isBasicsUrl, () => false);
}

// ── After-render work: scroll, focus and title ───────────────────────

function focusWithoutScroll(element: HTMLElement | null) {
  if (!element) return false;
  if (!element.matches("a[href], button, input, select, textarea, [tabindex]")) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  return document.activeElement === element;
}

const jumpTo = (top: number) => window.scrollTo({ top, left: 0, behavior: "instant" });

function applyTransition(transition: PendingTransition) {
  switch (transition.kind) {
    case "basics-top": {
      rememberHomeTitle();
      jumpTo(0);
      focusWithoutScroll(document.getElementById(BASICS_HEADING_ID));
      document.title = BASICS_TITLE;
      return;
    }
    case "home-restore": {
      const { scrollY, triggerId, title } = transition.point;
      jumpTo(scrollY);
      // Images and fonts can still shift layout; re-apply once after a frame.
      requestAnimationFrame(() => { if (Math.abs(window.scrollY - scrollY) > 1) jumpTo(scrollY); });
      const trigger = triggerId ? document.getElementById(triggerId) : null;
      if (!focusWithoutScroll(trigger)) focusWithoutScroll(document.querySelector("main"));
      document.title = title || homeTitle || document.title;
      return;
    }
    case "home-top": {
      jumpTo(0);
      const focusLost = !document.activeElement || document.activeElement === document.body || !document.activeElement.isConnected;
      if (transition.focusMain || focusLost) focusWithoutScroll(document.querySelector("main"));
      if (homeTitle) document.title = homeTitle;
      return;
    }
    case "home-target": {
      let target: HTMLElement | null = null;
      try { target = document.getElementById(decodeURIComponent(transition.hash.slice(1))); } catch { target = null; }
      if (target) target.scrollIntoView(); else jumpTo(0);
      if (!document.activeElement || document.activeElement === document.body) focusWithoutScroll(document.querySelector("main"));
      if (homeTitle) document.title = homeTitle;
      return;
    }
  }
}

/** Runs once the active view has rendered (before paint). Used by the page shell. */
export function useBasicsViewTransitions(isBasics: boolean) {
  useLayoutEffect(() => {
    // During hydration of `/#basics` the first commit still shows Home.
    if (isBasics !== isBasicsUrl()) return;
    document.getElementById(BASICS_PENDING_STYLE_ID)?.remove();
    const transition = pending;
    pending = null;
    if (transition) applyTransition(transition);
  }, [isBasics]);

  // Next.js streams the page's metadata <title> after hydration, which can
  // overwrite the Basics title on a direct load. Keep it while Basics is active.
  useEffect(() => {
    if (!isBasics) return;
    const keepTitle = () => { if (isBasicsUrl() && document.title !== BASICS_TITLE) document.title = BASICS_TITLE; };
    const observer = new MutationObserver(keepTitle);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    keepTitle();
    return () => observer.disconnect();
  }, [isBasics]);
}
