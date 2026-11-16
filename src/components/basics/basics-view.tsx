"use client";

import Link from "next/link";
import { BASICS_HEADING_ID, BASICS_NAV_ATTR, closeBasics, isPlainLeftClick, scrollToBasicsSection } from "@/lib/basics-navigation";
import { BASICS_RESOURCE_FILTERS, BASICS_RESOURCES, filterBasicsResources, type BasicsResourceFilter } from "@/data/basics-resources";

// Phase 1 placeholder content (navigation model only).
export function BasicsView({ filter, onFilterChange, query, onQueryChange }: {
  filter: BasicsResourceFilter; onFilterChange: (value: BasicsResourceFilter) => void;
  query: string; onQueryChange: (value: string) => void;
}) {
  const results = filterBasicsResources(BASICS_RESOURCES, filter, query);
  return (
    <main className="bx-view flex-1" aria-labelledby={BASICS_HEADING_ID}>
      <Link href="/" {...{ [BASICS_NAV_ATTR]: "" }} onClick={(e) => { if (isPlainLeftClick(e)) { e.preventDefault(); closeBasics(); } }}>← Back to Home</Link>
      <h1 id={BASICS_HEADING_ID} tabIndex={-1}>JazzHQ Basics.</h1>
      <button type="button" onClick={() => scrollToBasicsSection("basics-products")}>Explore products ↓</button>
      <button type="button" onClick={() => scrollToBasicsSection("basics-resources")}>Browse resources ↓</button>
      <section id="basics-products" style={{ minHeight: 1200, scrollMarginTop: 73 }}><h2>Tools built for your everyday work.</h2></section>
      <section id="basics-resources" style={{ minHeight: 1200, scrollMarginTop: 73 }}>
        <h2>A head start on your next task.</h2>
        {BASICS_RESOURCE_FILTERS.map((f) => <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => onFilterChange(f.value)}>{f.label}</button>)}
        <label>Search resources <input type="search" value={query} onChange={(e) => onQueryChange(e.target.value)} /></label>
        <p aria-live="polite">{results.length} resources</p>
      </section>
    </main>
  );
}
