"use client";

import { useState, type ReactNode } from "react";
import { useBasicsView, useBasicsViewTransitions } from "@/lib/basics-navigation";
import type { BasicsResourceFilter } from "@/data/basics-resources";
import { BasicsView } from "./basics-view";

// Renders exactly one view inside the shared header/footer shell: the Home
// <main> (passed in from the server page) or the Basics <main>. The inactive
// view is unmounted. Resource filter/search state lives here, above the
// Basics view, so it survives Home ↔ Basics switches (never in the URL).
export function BasicsShell({ home }: { home: ReactNode }) {
  const isBasics = useBasicsView();
  useBasicsViewTransitions(isBasics);
  const [filter, setFilter] = useState<BasicsResourceFilter>("all");
  const [query, setQuery] = useState("");

  if (!isBasics) return <>{home}</>;
  return <BasicsView filter={filter} onFilterChange={setFilter} query={query} onQueryChange={setQuery} />;
}
