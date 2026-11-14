import { buildMetadata } from "@/lib/seo";
import * as React from "react";
import type { Metadata } from "next";
import {
  getPublishedProfile,
  getPublishedHero,
  getPublishedMetrics,
  getLatestPublishedExperience,
  getPublishedFeaturedSection,
  getPublishedTechnicalTaxonomy,
  getPublishedDistinctionsSection,
  getLatestPublishedCertifications,
  getDistinctionMetrics,
  getPublishedOpportunitiesSection,
  getPublishedProjects,
} from "@/lib/server/db/repositories/content";
import {
  HeroSection,
  FeaturedHighlightsSection,
  TechnicalTaxonomySection,
  ProfessionalTrackSection,
  VerifiedDistinctionsSection,
  OpenForOpportunitiesSection,
} from "@/components/public";

export const metadata: Metadata = buildMetadata({
  title: "Siddharth Varpe | Software Engineer | AI & Full-Stack",
  description:
    "Personal portfolio and proof-of-work platform for Siddharth Varpe — Full-Stack Software Engineer specializing in production-grade CRM and inventory systems, distributed architectures, and AI-assisted engineering.",
  pathname: "/",
});

/**
 * Public Home Page (Phase 8 — Master Design Direction Reset).
 *
 * DEFINITIVE VISUAL DIRECTION: Dark Systems / Technical Editorial
 * - Expansive desktop canvas (max-w-screen-2xl) with controlled text measure
 * - Asymmetric, one-piece editorial hero composition
 * - Future professional visual asset slot (pre-calibrated architectural zone)
 * - Open, horizontal evidence ribbon (no "card soup")
 * - High-density editorial project previews
 * - Zero fake telemetry; strictly authentic verified resume evidence
 */
export default async function HomePage() {
  const [
    profile,
    hero,
    metrics,
    latestExperience,
    featuredSection,
    taxonomyConfig,
    distinctionsConfig,
    latestCertifications,
    distinctionsMetrics,
    opportunitiesConfig,
    projects,
  ] = await Promise.all([
    getPublishedProfile(),
    getPublishedHero(),
    getPublishedMetrics(),
    getLatestPublishedExperience(),
    getPublishedFeaturedSection(),
    getPublishedTechnicalTaxonomy(),
    getPublishedDistinctionsSection(),
    getLatestPublishedCertifications(2),
    getDistinctionMetrics(),
    getPublishedOpportunitiesSection(),
    getPublishedProjects(),
  ]);

  const eyebrow = hero?.eyebrow || "SOFTWARE ENGINEER";
  const headline =
    hero?.headline || profile?.tagline || "Building Real Solutions with Code, AI and Impact.";
  const description =
    hero?.description ||
    profile?.summary ||
    "Full-Stack Software Engineer with experience building production-grade CRM and inventory systems. Skilled in JavaScript, React.js, Node.js, Python, PostgreSQL, and REST APIs, with hands-on AI-powered application development.";

  const availability = profile?.availability || "Available for Software Engineering roles";

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24 pb-14 sm:pb-20">
      {/* ========================================================================= */}
      {/* 1. HIGH-FIDELITY STRICT REFERENCE HERO & INTEGRATED PROOF SYSTEM           */}
      {/* Seamless composition: Content + Portrait + Overlay + Metrics + Transition */}
      {/* ========================================================================= */}
      <HeroSection
        eyebrow={eyebrow}
        headline={headline}
        description={description}
        availability={availability}
        primaryCtaText={hero?.ctaLabel || "View My Work"}
        primaryCtaLink={hero?.ctaUrl || "/projects"}
        secondaryCtaText="Download Resume"
        secondaryCtaLink="/api/resume/download"
        imageOverlay={hero?.imageOverlay}
        metrics={metrics}
        projects={projects}
      />

      {/* ========================================================================= */}
      {/* 2. DYNAMIC FEATURED HIGHLIGHTS (STRICT REFERENCE 2x2 / 2-COL COMPOSITION)  */}
      {/* Direct below Hero, full CMS controlled, zero hardcoded content            */}
      {/* ========================================================================= */}
      <FeaturedHighlightsSection config={featuredSection} />

      {/* ========================================================================= */}
      {/* 4. PROFESSIONAL TRACK RECORD & EXPERIENCE SNAPSHOT                        */}
      {/* Strict reference implementation: automatic semantic icons, company logo, */}
      {/* continuous timeline, highlighted metrics, and Stack Applied panel         */}
      {/* ========================================================================= */}
      {latestExperience && (
        <ProfessionalTrackSection track={latestExperience} />
      )}

      {/* ========================================================================= */}
      {/* 5. TECHNICAL TAXONOMY                                                     */}
      {/* Strict reference replacement matching desktop & mobile specifications     */}
      {/* ========================================================================= */}
      <TechnicalTaxonomySection config={taxonomyConfig} />

      {/* ========================================================================= */}
      {/* 5B. VERIFIED DISTINCTIONS (STRICT REFERENCE IMPLEMENTATION)               */}
      {/* Dynamic 2-card latest published preview + real database metrics           */}
      {/* ========================================================================= */}
      {distinctionsConfig.enabled && (
        <VerifiedDistinctionsSection
          config={distinctionsConfig}
          certifications={latestCertifications}
          metrics={distinctionsMetrics}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. OPEN FOR OPPORTUNITIES (STRICT REFERENCE IMPLEMENTATION)                */}
      {/* Asymmetric composition matching desktop & mobile references:               */}
      {/* Briefcase squircle badge, dual action CTAs, 3D paper airplane origami art  */}
      {/* with trajectory trail, dot grid, and floating pill specialization badges   */}
      {/* ========================================================================= */}
      {opportunitiesConfig.enabled && (
        <OpenForOpportunitiesSection config={opportunitiesConfig} />
      )}
    </div>
  );
}
