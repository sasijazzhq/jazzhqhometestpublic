// JazzHQ Basics: templates, apps and resources.
// SAMPLE CONTENT. No real resource inventory exists in this repo yet, so these
// six entries are illustrative previews. Replace them with real entries here;
// the Basics view reads only this file.

export type BasicsResourceType = "template" | "app" | "resource";
export type BasicsResourceFilter = "all" | BasicsResourceType;

export type BasicsResource = {
  id: string;
  type: BasicsResourceType;
  title: string;
  /** One benefit line. */
  description: string;
  /** Format or platform, only where known. Null for the samples. */
  format: string | null;
  /** Specific action label on the card. */
  action: string;
  /** Shown in the preview dialog. Never claim an asset is available until it is. */
  availability: string;
  /** Which illustrative preview to draw (card thumbnail + dialog). */
  preview: "checklist" | "calculator" | "guide" | "planner" | "meeting" | "conversation";
};

/** True while the list below is sample data; controls the "Sample resources" label. */
export const BASICS_RESOURCES_ARE_SAMPLES = true;

export const BASICS_RESOURCE_TYPE_LABEL: Record<BasicsResourceType, string> = {
  template: "Template",
  app: "App",
  resource: "Resource",
};

export const BASICS_RESOURCE_FILTERS: { value: BasicsResourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "template", label: "Templates" },
  { value: "app", label: "Apps" },
  { value: "resource", label: "Resources" },
];

const NOT_AVAILABLE = "Not available yet. This is an illustrative preview.";

export const BASICS_RESOURCES: BasicsResource[] = [
  { id: "partner-onboarding-checklist", type: "template", title: "Partner onboarding checklist", description: "A step-by-step checklist to get new partners up and running.", format: null, action: "Preview template", availability: NOT_AVAILABLE, preview: "checklist" },
  { id: "commission-calculator", type: "app", title: "Commission calculator", description: "Estimate partner commissions for different deal values and rates.", format: null, action: "Preview app", availability: "Illustrative preview. You can try the calculation above; the full app is not available yet.", preview: "calculator" },
  { id: "partnership-discovery-guide", type: "resource", title: "Partnership discovery guide", description: "Questions to uncover needs and build stronger partnerships.", format: null, action: "Preview guide", availability: NOT_AVAILABLE, preview: "guide" },
  { id: "sales-outreach-planner", type: "template", title: "Sales outreach planner", description: "Plan and track your sales and partnership outreach.", format: null, action: "Preview template", availability: NOT_AVAILABLE, preview: "planner" },
  { id: "meeting-prep-assistant", type: "app", title: "Meeting prep assistant", description: "Organise your talking points before your next meeting.", format: null, action: "Preview app", availability: NOT_AVAILABLE, preview: "meeting" },
  { id: "better-sales-conversations", type: "resource", title: "Better sales conversations", description: "Practical tips to make your conversations clearer and more useful.", format: null, action: "Preview guide", availability: NOT_AVAILABLE, preview: "conversation" },
];

/** Search matches title, description, type and format; filters combine with it. */
export function filterBasicsResources(resources: BasicsResource[], filter: BasicsResourceFilter, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return resources.filter((resource) => {
    if (filter !== "all" && resource.type !== filter) return false;
    if (!terms.length) return true;
    const haystack = [resource.title, resource.description, resource.type, BASICS_RESOURCE_TYPE_LABEL[resource.type], resource.format ?? ""].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
