"use client";

import { BASICS_HASH, isPlainLeftClick, openBasics } from "@/lib/basics-navigation";
import { BASICS_COPY } from "@/data/basics-content";
import { PrmPreview, RehearsePreview, TemplatePreview } from "./basics-previews";
import "./basics.css";

export const BASICS_BANNER_CTA_ID = "basics-banner-cta";

// Homepage banner between "How it works" and the RehearseHQ section. One real
// link (`/#basics`, so new-tab, middle-click and no-JS work); the preview tiles
// are decorative. The link is stretched over the card, so the whole card is
// clickable without nesting interactive elements.
export function BasicsBanner() {
  const copy = BASICS_COPY.banner;
  return (
    <section className="bx-banner dh-container" aria-labelledby="basics-banner-title">
      <div className="bx-banner__card">
        <div className="bx-banner__copy">
          <p className="bx-eyebrow">{copy.label}</p>
          <h2 id="basics-banner-title" className="bx-banner__title">{copy.heading}</h2>
          <p className="bx-banner__desc">{copy.description}</p>
          <a
            id={BASICS_BANNER_CTA_ID}
            href={`/${BASICS_HASH}`}
            className="bx-btn bx-btn--primary bx-banner__cta"
            onClick={(event) => {
              if (!isPlainLeftClick(event)) return; // new tab / window: browser default
              event.preventDefault();
              openBasics(event.currentTarget);
            }}
          >
            {copy.cta}<span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="bx-banner__visual" aria-hidden="true">
          <div className="bx-banner__tile bx-banner__tile--prm"><PrmPreview compact /></div>
          <div className="bx-banner__tile bx-banner__tile--rehearse"><RehearsePreview compact /></div>
          <div className="bx-banner__tile bx-banner__tile--template"><TemplatePreview /></div>
        </div>
      </div>
    </section>
  );
}
