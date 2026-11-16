"use client";

import Link from "next/link";
import { BASICS_HEADING_ID, BASICS_NAV_ATTR, closeBasics, isPlainLeftClick } from "@/lib/basics-navigation";
import { BASICS_CONTACT_HREF, BASICS_COPY, BASICS_PRODUCTS } from "@/data/basics-content";
import type { BasicsResourceFilter } from "@/data/basics-resources";
import { BasicsHero, BASICS_PRODUCTS_ID, BASICS_RESOURCES_ID } from "./basics-hero";
import { ProductCard } from "./product-card";
import { ResourceCollection } from "./resource-collection";
import { ComingNext } from "./coming-next";
import "./basics.css";

// The Basics view: JazzHQ's own products and resources, rendered in place of
// the Home <main> at `/#basics` (shared header and footer stay mounted).
export function BasicsView({ filter, onFilterChange, query, onQueryChange }: {
  filter: BasicsResourceFilter; onFilterChange: (value: BasicsResourceFilter) => void;
  query: string; onQueryChange: (value: string) => void;
}) {
  const help = BASICS_COPY.help;
  const products = BASICS_COPY.products;
  return (
    <main className="bx-view flex-1" aria-labelledby={BASICS_HEADING_ID}>
      <div className="bx-back mx-auto w-full">
        <Link
          href="/"
          {...{ [BASICS_NAV_ATTR]: "" }}
          className="bx-back__link"
          onClick={(event) => {
            if (!isPlainLeftClick(event)) return; // new tab: plain link to Home
            event.preventDefault();
            closeBasics();
          }}
        >
          <span><span aria-hidden="true">← </span>{BASICS_COPY.back}</span>
        </Link>
      </div>

      <BasicsHero />

      <section id={BASICS_PRODUCTS_ID} className="bx-section bx-products bx-container" aria-labelledby={`${BASICS_PRODUCTS_ID}-title`}>
        <div className="bx-section-head">
          <p className="bx-eyebrow">{products.label}</p>
          <h2 id={`${BASICS_PRODUCTS_ID}-title`} className="bx-section-title">{products.heading}</h2>
        </div>
        <div className="bx-products__grid">
          {BASICS_PRODUCTS.map((product) => <ProductCard key={product.key} product={product} />)}
        </div>
      </section>

      <ResourceCollection id={BASICS_RESOURCES_ID} filter={filter} onFilterChange={onFilterChange} query={query} onQueryChange={onQueryChange} />

      <ComingNext />

      <section className="bx-section bx-section--quiet bx-container bx-help-wrap" aria-labelledby="basics-help-title">
        <div className="bx-help">
          <div>
            <h2 id="basics-help-title" className="bx-help__title">{help.heading}</h2>
            <p className="bx-help__desc">{help.description}</p>
          </div>
          {BASICS_CONTACT_HREF && (
            <a href={BASICS_CONTACT_HREF} className="bx-btn bx-btn--primary">{help.cta}<span aria-hidden="true">→</span></a>
          )}
        </div>
      </section>
    </main>
  );
}
