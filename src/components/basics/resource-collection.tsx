"use client";

import { useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  BASICS_RESOURCE_FILTERS, BASICS_RESOURCE_TYPE_LABEL, BASICS_RESOURCES, BASICS_RESOURCES_ARE_SAMPLES,
  filterBasicsResources, type BasicsResource, type BasicsResourceFilter,
} from "@/data/basics-resources";
import { BASICS_COPY } from "@/data/basics-content";
import { ResourcePreview } from "./basics-previews";
import { ResourcePreviewDialog } from "./resource-preview-dialog";

function ResourceCard({ resource, onPreview }: { resource: BasicsResource; onPreview: (resource: BasicsResource) => void }) {
  const titleId = `basics-resource-${resource.id}`;
  return (
    <li className={`bx-resource bx-resource--${resource.type}`}>
      <article aria-labelledby={titleId} className="bx-resource__inner">
        <div className="bx-resource__preview" aria-hidden="true"><ResourcePreview kind={resource.preview} /></div>
        <div className="bx-resource__body">
          <span className={`bx-badge bx-badge--${resource.type}`}>{BASICS_RESOURCE_TYPE_LABEL[resource.type]}</span>
          <h3 id={titleId} className="bx-resource__title">{resource.title}</h3>
          <p className="bx-resource__desc">{resource.description}</p>
          {resource.format && <p className="bx-resource__format">{resource.format}</p>}
          <button type="button" className="bx-link-btn" aria-haspopup="dialog" onClick={() => onPreview(resource)}>
            {resource.action}<span className="sr-only">: {resource.title}</span><span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    </li>
  );
}

const countText = (n: number) => (n === 1 ? "Showing 1 resource" : `Showing ${n} resources`);

// Filters + search over data/basics-resources.ts. State is owned by the page
// shell so it survives Home ↔ Basics switches; it is never written to the URL.
export function ResourceCollection({ id, filter, onFilterChange, query, onQueryChange }: {
  id: string;
  filter: BasicsResourceFilter; onFilterChange: (value: BasicsResourceFilter) => void;
  query: string; onQueryChange: (value: string) => void;
}) {
  const copy = BASICS_COPY.resources;
  const [previewing, setPreviewing] = useState<BasicsResource | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const results = filterBasicsResources(BASICS_RESOURCES, filter, query);
  const filtered = filter !== "all" || query.trim() !== "";

  const clear = () => {
    onFilterChange("all");
    onQueryChange("");
    searchRef.current?.focus(); // the Clear button disappears with the empty state
  };

  return (
    <section id={id} className="bx-section bx-resources bx-container" aria-labelledby={`${id}-title`}>
      <div className="bx-section-head">
        {BASICS_RESOURCES_ARE_SAMPLES && <p className="bx-eyebrow">{copy.sampleLabel}</p>}
        <h2 id={`${id}-title`} className="bx-section-title">{copy.heading}</h2>
        <p className="bx-section-desc">{copy.description}</p>
      </div>

      <div className="bx-controls">
        <div className="bx-filters" role="group" aria-label="Filter resources by type">
          {BASICS_RESOURCE_FILTERS.map((item) => (
            <button key={item.value} type="button" className="bx-filter" aria-pressed={filter === item.value} onClick={() => onFilterChange(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="bx-search" role="search">
          <label htmlFor={`${id}-search`} className="sr-only">{copy.searchLabel}</label>
          <Search className="bx-search__icon" size={18} strokeWidth={2} aria-hidden="true" />
          <input
            ref={searchRef} id={`${id}-search`} type="search" value={query} placeholder={copy.searchLabel}
            autoComplete="off" onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </div>

      {/* Polite live region; visually hidden when the empty state says the same. */}
      <p className={results.length ? "bx-count" : "sr-only"} aria-live="polite" aria-atomic="true">
        {results.length ? countText(results.length) + (filtered ? " (filtered)" : "") : copy.emptyTitle}
      </p>

      {results.length ? (
        <ul className="bx-grid" role="list">
          {results.map((resource) => <ResourceCard key={resource.id} resource={resource} onPreview={setPreviewing} />)}
        </ul>
      ) : (
        <div className="bx-empty">
          <p className="bx-empty__title">{copy.emptyTitle}</p>
          <p className="bx-empty__body">{copy.emptyBody}</p>
          <button type="button" className="bx-btn bx-btn--secondary" onClick={clear}>{copy.clear}</button>
        </div>
      )}

      <ResourcePreviewDialog resource={previewing} onClose={() => setPreviewing(null)} />
    </section>
  );
}
