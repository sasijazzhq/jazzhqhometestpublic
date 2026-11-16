import type { Metadata } from "next";
import { GridBackground } from "@/components/layout/grid-background";
import { Header } from "@/components/layout/header";
import Footer from "@/components/shared/footer";
import { TrustedByStrip } from "@/components/home/trusted-by-strip";
import { DistributionHero } from "@/components/home/distribution/hero";
import { MarketplaceTabs } from "@/components/home/marketplace-tabs";
import { RehearseSection } from "@/components/home/rehearse-section";
import { JazzClubClose } from "@/components/home/distribution/jazzclub-section";
import { CustomerProof } from "@/components/home/customer-proof";
import { DataResponsibilitySection } from "@/components/home/data-responsibility-section";
import { BasicsBanner } from "@/components/basics/basics-banner";
import { BasicsShell } from "@/components/basics/basics-shell";
import { BASICS_EARLY_SCRIPT } from "@/lib/basics-early-script";
import { pageSeo } from "@/lib/seo";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";
import "@/components/home/distribution/homepage.css";

export const metadata: Metadata = pageSeo({
  title: "AI Distribution Platform | JazzHQ",
  description: "JazzHQ connects companies looking for AI with the vendors building it and the trusted partners who can sell, implement and support it.",
  path: "/",
});

export default function HomePage() {
  return <GridBackground>
    <Header />
    {/* Before first paint on /#basics: hide the server-rendered Home view. */}
    <script dangerouslySetInnerHTML={{ __html: BASICS_EARLY_SCRIPT }} />
    {/* Home view and the in-place Basics view (/#basics) share this shell. */}
    <BasicsShell home={
      <main className={`dh-home flex-1${IS_FIGMA_EXPORT ? " dh-figma-export" : ""}`}>
        <DistributionHero />
        <TrustedByStrip />
        <MarketplaceTabs />
        <BasicsBanner />
        <RehearseSection />
        <DataResponsibilitySection />
        <CustomerProof />
        <JazzClubClose />
      </main>
    } />
    <Footer />
  </GridBackground>;
}
