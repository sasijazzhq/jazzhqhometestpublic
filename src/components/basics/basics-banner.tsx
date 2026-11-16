"use client";

import { BASICS_HASH, isPlainLeftClick, openBasics } from "@/lib/basics-navigation";

export const BASICS_BANNER_CTA_ID = "basics-banner-cta";

// Phase 1 placeholder banner (navigation model only).
export function BasicsBanner() {
  return (
    <section className="dh-container" aria-labelledby="basics-banner-title" style={{ paddingTop: 80 }}>
      <h2 id="basics-banner-title">Tools for your next move.</h2>
      <a id={BASICS_BANNER_CTA_ID} href={`/${BASICS_HASH}`} onClick={(e) => { if (isPlainLeftClick(e)) { e.preventDefault(); openBasics(e.currentTarget); } }}>Explore JazzHQ Basics →</a>
    </section>
  );
}
