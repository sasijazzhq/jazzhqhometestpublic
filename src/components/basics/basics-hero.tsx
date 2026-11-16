"use client";

import { BASICS_HEADING_ID, scrollToBasicsSection } from "@/lib/basics-navigation";
import { BASICS_COPY } from "@/data/basics-content";

export const BASICS_PRODUCTS_ID = "basics-products";
export const BASICS_RESOURCES_ID = "basics-resources";

// Compact, centred hero. Its buttons scroll with JS and never change the hash.
export function BasicsHero() {
  const copy = BASICS_COPY.hero;
  return (
    <section className="bx-hero bx-container" aria-labelledby={BASICS_HEADING_ID}>
      <p className="bx-eyebrow">{copy.eyebrow}</p>
      <h1 id={BASICS_HEADING_ID} className="bx-hero__title" tabIndex={-1}>
        {copy.titleLead} <span className="bx-hero__accent">{copy.titleAccent}</span>
      </h1>
      <p className="bx-hero__supporting">{copy.supporting}</p>
      <p className="bx-hero__desc">{copy.description}</p>
      <div className="bx-hero__actions">
        <button type="button" className="bx-btn bx-btn--primary" onClick={() => scrollToBasicsSection(BASICS_PRODUCTS_ID)}>
          {copy.primary}<span aria-hidden="true">↓</span>
        </button>
        <button type="button" className="bx-btn bx-btn--secondary" onClick={() => scrollToBasicsSection(BASICS_RESOURCES_ID)}>
          {copy.secondary}<span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  );
}
