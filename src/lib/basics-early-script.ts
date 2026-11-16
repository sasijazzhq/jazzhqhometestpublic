// Server-safe constants for the pre-hydration check on `/#basics` loads.
// Rendered inline by app/page.tsx: before the page paints, it hides the
// server-rendered Home <main> (layout is kept, so the footer does not jump).
// useBasicsViewTransitions() removes the style once the Basics view renders,
// and a 3s fallback reveals Home if JavaScript never runs.
export const BASICS_PENDING_STYLE_ID = "basics-pending-style";

export const BASICS_EARLY_SCRIPT =
  `if(location.hash==="#basics"){var s=document.createElement("style");s.id="${BASICS_PENDING_STYLE_ID}";` +
  `s.textContent="main.dh-home{visibility:hidden;animation:basics-unhide 0s 3s forwards}@keyframes basics-unhide{to{visibility:visible}}";` +
  `document.head.appendChild(s)}`;
