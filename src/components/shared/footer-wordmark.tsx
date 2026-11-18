"use client";

import { Fragment, useEffect, useId, useRef, type ReactNode } from "react";
import {
  WORDMARK_KEY_BOUNDS,
  WORDMARK_KEYS,
  WORDMARK_SHAPES,
  WORDMARK_VIEWBOX,
  WORDMARK_WIDTH,
  type WordmarkKey,
  type WordmarkShape,
} from "./footer-wordmark-shapes";

// Giant closing wordmark, drawn inline from the real logo's paths.
//  - Base layer: the old dim monochrome logo (unrevealed state).
//  - Logo layer: dark letters with a faint outline; the Q's rings keep their colours.
//    Revealed bottom → top by a soft mask as the wordmark scrolls into view.
//  - Piano keys: the letters J A Z Z H Q are keys (the dot is not). Hovering a key
//    lifts it with a soft edge glow and bounces its neighbours; Q also pulses its
//    rings once. A tap plays one J → Q ripple. Reduced motion: highlight only.
//    Stationary transparent hit areas take the pointer; the moving shapes never do.
// Nothing in here is focusable or announced; the container stays aria-hidden.

type Variant = "base" | "logo";

/** Room (viewBox units) around the logo layer so lifted keys and their glow never clip. */
const PAD = 12;
const [, , , VIEW_H] = WORDMARK_VIEWBOX.split(" ").map(Number);
const LOGO_VIEWBOX = `${-PAD} ${-PAD} ${WORDMARK_WIDTH + 2 * PAD} ${VIEW_H + PAD}`;

// Motion values (CSS px; converted to viewBox units at run time).
const NEIGHBOUR_DELAY = 70;
const NEIGHBOUR_BOUNCE = 3;
const BOUNCE_MS = 360;
const RING_PULSE_SCALE = 1.05;
const RING_PULSE_MS = 420;
const RIPPLE_STAGGER = 60;
const RIPPLE_LIFT = 4;
const RIPPLE_MS = 320;
const FLASH_MS = 600;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const TOUCH = "(hover: none), (pointer: coarse)";

function Shape({ shape, variant, highlight }: { shape: WordmarkShape; variant: Variant; highlight?: string }) {
  const paint = highlight
    ? { className: "wm-hl", fill: highlight }
    : shape.kind === "ring"
      ? shape.paint === "stroke"
        ? { fill: "none", stroke: shape.color, strokeWidth: 2, strokeMiterlimit: 10 }
        : { fill: shape.color }
      : variant === "base"
        ? { fill: "#fff" } // the asset's original paint
        : { className: "site-wordmark__letter" };
  if (shape.tag === "path") return <path d={shape.d} {...paint} />;
  if (shape.tag === "polygon") return <polygon points={shape.points} {...paint} />;
  return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...paint} />;
}

/** One key: lift group (CSS transition) › bounce group (Web Animations) › shapes.
 *  Shapes keep the asset's paint order; consecutive rings share one pulse group,
 *  drawn after the highlights so the glow never tints them. */
function Key({ id, variant, gradient }: { id: WordmarkKey; variant: Variant; gradient: string }) {
  const shapes = WORDMARK_SHAPES.filter((shape) => shape.key === id);
  const children: ReactNode[] = [];
  let rings: ReactNode[] = [];
  const flushRings = () => {
    if (rings.length) children.push(<g key={`rings${children.length}`} className="wm-key__rings">{rings}</g>);
    rings = [];
  };
  shapes.forEach((shape, i) => {
    if (shape.kind === "ring") { rings.push(<Shape key={i} shape={shape} variant={variant} />); return; }
    flushRings();
    children.push(
      <Fragment key={i}>
        <Shape shape={shape} variant={variant} />
        {variant === "logo" && <Shape shape={shape} variant={variant} highlight={`url(#${gradient})`} />}
      </Fragment>,
    );
  });
  flushRings();
  return (
    <g className="wm-key" data-key={id}>
      <g className="wm-key__lift"><g className="wm-key__bounce">{children}</g></g>
    </g>
  );
}

function WordmarkSvg({ variant, className, gradient }: { variant: Variant; className: string; gradient: string }) {
  return (
    <svg
      className={`site-footer__wordmark ${className}`}
      viewBox={variant === "logo" ? LOGO_VIEWBOX : WORDMARK_VIEWBOX}
      focusable="false"
      aria-hidden="true"
    >
      {variant === "logo" && (
        <defs>
          {/* Soft top-lit sheen for a lifted key (over the dark letter fill). */}
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".55" stopColor="#fff" stopOpacity=".06" />
            <stop offset="1" stopColor="#fff" stopOpacity=".03" />
          </linearGradient>
        </defs>
      )}
      {WORDMARK_KEYS.map((id) => <Key key={id} id={id} variant={variant} gradient={gradient} />)}
      <g className="wm-dot">
        {WORDMARK_SHAPES.filter((shape) => shape.key === "dot").map((shape, i) => <Shape key={i} shape={shape} variant={variant} />)}
      </g>
    </svg>
  );
}

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const gradient = `wordmark-sheen-${useId().replace(/:/g, "")}`;

  // Scroll reveal (unchanged behaviour). Once fully revealed the mask is dropped
  // (.is-revealed) so lifted keys can rise into the room above the logo.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(REDUCED_MOTION).matches) return;
    el.classList.add("is-scroll-reveal");

    // Blend band of the soft mask (must match --band in footer.css).
    const BAND = 32;
    let frame = 0;
    let current = -1;
    let target = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the wordmark starts entering; 1 only once it is ~fully visible (page bottom).
      const start = vh * 0.98;
      const end = vh - rect.height * 0.96;
      target = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    };
    const paint = () => {
      frame = 0;
      // Light easing toward the scroll position; settles within a few frames.
      current = current < 0 ? target : current + (target - current) * 0.18;
      if (Math.abs(target - current) < 0.002) current = target;
      // Band starts fully below the logo (0) and has passed the top at 1.
      el.style.setProperty("--reveal", `${(current * (100 + BAND) - BAND).toFixed(2)}%`);
      el.classList.toggle("is-revealed", current >= 1);
      if (current !== target) frame = requestAnimationFrame(paint);
    };
    const onScroll = () => { measure(); if (!frame) frame = requestAnimationFrame(paint); };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Piano keys. Classes and Web Animations through the DOM only: no React state,
  // no animation loop. Hit areas are stationary, so a lifted key never re-triggers.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(REDUCED_MOTION);
    const touch = window.matchMedia(TOUCH);
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    };
    let rippling = false;

    // CSS px → viewBox units (transforms on SVG content are in user units).
    const syncUnit = () => {
      const unit = WORDMARK_WIDTH / (el.clientWidth || WORDMARK_WIDTH);
      el.style.setProperty("--u", unit.toFixed(4));
      return unit;
    };
    syncUnit();

    const parts = (key: WordmarkKey, selector: string) =>
      el.querySelectorAll<SVGGElement>(`.wm-key[data-key="${key}"]${selector ? ` ${selector}` : ""}`);
    const setState = (key: WordmarkKey, name: string, on: boolean) => parts(key, "").forEach((g) => g.classList.toggle(name, on));
    const keyOf = (target: EventTarget | null) => {
      const key = target instanceof Element ? target.getAttribute("data-hit") : null;
      return WORDMARK_KEYS.includes(key as WordmarkKey) ? (key as WordmarkKey) : null;
    };

    const bounce = (key: WordmarkKey, px: number, duration: number, delay: number, unit: number) =>
      parts(key, ".wm-key__bounce").forEach((g) =>
        g.animate(
          [
            { transform: "translateY(0)" },
            { transform: `translateY(${(-px * unit).toFixed(3)}px)`, offset: 0.4, easing: "ease-in-out" },
            { transform: `translateY(${(px * 0.2 * unit).toFixed(3)}px)`, offset: 0.75, easing: "ease-in-out" },
            { transform: "translateY(0)" },
          ],
          { duration, delay, easing: "ease-out" },
        ),
      );
    const pulseRings = () =>
      parts("Q", ".wm-key__rings").forEach((g) =>
        g.animate([{ transform: "scale(1)" }, { transform: `scale(${RING_PULSE_SCALE})`, offset: 0.4 }, { transform: "scale(1)" }], {
          duration: RING_PULSE_MS,
          easing: "ease-in-out",
        }),
      );

    // Reduced motion: fade a key's highlight in, then out. No movement.
    const flash = (key: WordmarkKey) => {
      setState(key, "is-flash", true);
      later(() => setState(key, "is-flash", false), FLASH_MS);
    };

    // Hover (mouse / pen): once per entry into a key's hit area.
    const onOver = (event: PointerEvent) => {
      const key = keyOf(event.target);
      if (!key || event.pointerType === "touch") return;
      setState(key, "is-on", true);
      if (reduced.matches) return;
      const unit = syncUnit();
      const index = WORDMARK_KEYS.indexOf(key);
      for (const neighbour of [WORDMARK_KEYS[index - 1], WORDMARK_KEYS[index + 1]]) {
        if (neighbour) bounce(neighbour, NEIGHBOUR_BOUNCE, BOUNCE_MS, NEIGHBOUR_DELAY, unit);
      }
      if (key === "Q") pulseRings();
    };
    const onOut = (event: PointerEvent) => {
      const key = keyOf(event.target);
      if (key) setState(key, "is-on", false);
    };
    const onLeave = () => WORDMARK_KEYS.forEach((key) => setState(key, "is-on", false));

    // Touch: a tap (click, never touchstart, never preventDefault) plays one ripple.
    const onClick = (event: MouseEvent) => {
      const pointerType = (event as PointerEvent).pointerType;
      if (pointerType ? pointerType !== "touch" : !touch.matches) return;
      if (reduced.matches) {
        const key = keyOf(event.target);
        if (key) flash(key);
        return;
      }
      if (rippling) return;
      rippling = true;
      const unit = syncUnit();
      WORDMARK_KEYS.forEach((key, i) => bounce(key, RIPPLE_LIFT, RIPPLE_MS, i * RIPPLE_STAGGER, unit));
      later(() => { rippling = false; }, (WORDMARK_KEYS.length - 1) * RIPPLE_STAGGER + RIPPLE_MS);
    };

    el.addEventListener("pointerover", onOver);
    el.addEventListener("pointerout", onOut);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("pointerover", onOver);
      el.removeEventListener("pointerout", onOut);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      el.getAnimations?.({ subtree: true }).forEach((animation) => animation.cancel());
      el.querySelectorAll(".is-on, .is-flash").forEach((g) => g.classList.remove("is-on", "is-flash"));
    };
  }, []);

  return (
    <div ref={ref} className="site-footer__wordmark-reveal" aria-hidden="true">
      <WordmarkSvg variant="base" className="site-footer__wordmark--base" gradient={gradient} />
      <WordmarkSvg variant="logo" className="site-footer__wordmark--reveal" gradient={gradient} />
      {/* Stationary hit areas at each key's resting bounds. */}
      <svg className="site-footer__wordmark site-footer__wordmark--hits" viewBox={WORDMARK_VIEWBOX} focusable="false" aria-hidden="true">
        {WORDMARK_KEYS.map((key) => {
          const [x, y, width, height] = WORDMARK_KEY_BOUNDS[key];
          return <rect key={key} className="wm-hit" data-hit={key} x={x} y={y} width={width} height={height} />;
        })}
      </svg>
    </div>
  );
}
