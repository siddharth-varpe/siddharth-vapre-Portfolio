"use client";

import * as React from "react";
import type {
  ExperienceDocument,
  PageHeroConfig,
  OperationalEvidenceItem,
  ProfileDocument,
} from "@/types/models";
import { ExperienceHero } from "./experience-hero";
import { OperationalEvidenceSection } from "./operational-evidence-section";
import { ExperienceTimeline } from "./experience-timeline";
import { StackAppliedCard } from "./stack-applied-card";
import { LocationCard } from "./location-card";

interface ExperiencePageViewProps {
  experiences: ExperienceDocument[];
  heroConfig?: PageHeroConfig | null;
  operationalEvidence: OperationalEvidenceItem[];
  profile?: ProfileDocument | null;
}

export function ExperiencePageView({
  experiences,
  heroConfig,
  operationalEvidence,
  profile,
}: ExperiencePageViewProps) {
  // Aggregate distinct technologies from all published experiences
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    experiences.forEach((exp) => {
      (exp.technologies || []).forEach((t) => techSet.add(t));
    });
    return Array.from(techSet);
  }, [experiences]);

  const location = profile?.location || experiences[0]?.location || "Pune, Maharashtra, India";

  return (
    <div className="w-full pb-16 sm:pb-24">
      {/* 1. HERO SECTION (Full-width, fills the width with no side gaps) */}
      <div className="w-full">
        <ExperienceHero config={heroConfig} />
      </div>

      {/* 2. MOBILE ONLY: Operational Evidence Ribbon (Directly below Hero) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
        <OperationalEvidenceSection
          metrics={operationalEvidence}
          isSidebar={false}
        />
      </div>

      {/* 3. MAIN SECTION (Desktop Split 2-Column Grid / Mobile Stacked) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Professional Journey Chronological Timeline (lg:col-span-8) */}
          <div className="lg:col-span-8 w-full min-w-0">
            <ExperienceTimeline experiences={experiences} />
          </div>

          {/* Right Column: Stacked Sidebar on Desktop (lg:col-span-4) */}
          <aside
            aria-label="Experience Highlights & Context"
            className="lg:col-span-4 w-full space-y-6 sm:space-y-8"
          >
            {/* Desktop Only: Operational Evidence in Sidebar */}
            <div className="hidden lg:block">
              <OperationalEvidenceSection
                metrics={operationalEvidence}
                isSidebar={true}
              />
            </div>

            {/* Core Stack Applied Badges */}
            {allTechnologies.length > 0 && (
              <StackAppliedCard technologies={allTechnologies} />
            )}

            {/* Engineering Location Card */}
            <LocationCard location={location} />
          </aside>
        </div>
      </main>
    </div>
  );
}
