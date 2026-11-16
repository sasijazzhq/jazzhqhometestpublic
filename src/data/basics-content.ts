// JazzHQ Basics: copy and destinations for the banner and the Basics view.
// Resources live separately in basics-resources.ts.

export type BasicsProductKey = "prm" | "rehearse";

export type BasicsProduct = {
  key: BasicsProductKey;
  name: string;
  headline: string;
  description: string;
  cta: string;
  /** Label on the decorative preview. */
  previewLabel: string;
  /** Real product URL. TODO: none exists in this repo yet, so the CTA opens
   *  an overview dialog instead. Never put a made-up URL here. */
  href: string | null;
};

/** Status shown in the overview dialog while `href` is null. */
export const PRODUCT_LINK_PENDING = "Product link coming soon";

export const BASICS_PRODUCTS: BasicsProduct[] = [
  {
    key: "prm",
    name: "JazzHQ PRM",
    headline: "Keep your partnerships moving.",
    description: "Manage partners, track leads and stay on top of commissions in one place.",
    cta: "Explore PRM",
    previewLabel: "Sample workspace",
    href: null,
  },
  {
    key: "rehearse",
    name: "RehearseHQ",
    headline: "Go into your next conversation prepared.",
    description: "Practise sales and partnership conversations with AI role-plays and feedback.",
    cta: "Explore RehearseHQ",
    previewLabel: "Sample session",
    href: null,
  },
];

/** Existing public contact destination (same address as the homepage's
 *  "How it works" CTA in data/how-it-works.ts). */
export const BASICS_CONTACT_HREF: string | null = "mailto:contact@jazzhq.ai";

/** Working newsletter / notification integration. None exists, so "Coming next"
 *  is information only (no email field, no simulated success). */
export const BASICS_UPDATES_SIGNUP: null = null;

export const BASICS_COPY = {
  banner: {
    label: "JAZZHQ BASICS",
    heading: "Tools for your next move.",
    description: "Manage partnerships, practise conversations and get started with templates and apps. Built by JazzHQ.",
    cta: "Explore JazzHQ Basics",
  },
  back: "Back to Home",
  hero: {
    eyebrow: "BUILT BY JAZZHQ",
    titleLead: "JazzHQ",
    titleAccent: "Basics.",
    supporting: "Your next move starts here.",
    description: "Products, templates and apps to manage partnerships, practise conversations and bring ideas to life.",
    primary: "Explore products",
    secondary: "Browse resources",
  },
  products: {
    label: "OUR PRODUCTS",
    heading: "Tools built for your everyday work.",
  },
  resources: {
    sampleLabel: "Sample resources · Preview collection",
    heading: "A head start on your next task.",
    description: "Ready-to-use templates, practical apps and helpful resources.",
    searchLabel: "Search resources",
    emptyTitle: "No resources found.",
    emptyBody: "Try another keyword or clear your filters.",
    clear: "Clear filters",
  },
  comingNext: {
    label: "COMING NEXT",
    heading: "More useful tools are on the way.",
    description: "We’re building more ways to help you work, practise and get started.",
  },
  help: {
    heading: "Not sure where to start?",
    description: "We’ll help you find the right tool.",
    cta: "Talk to us",
  },
} as const;
