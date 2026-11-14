import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import {
  getPublishedExperienceTimeline,
  getPageHero,
  getPublishedProfile,
  getPublishedOperationalEvidence,
} from "@/lib/server/db/repositories/content";
import { ExperiencePageView } from "@/components/public/experience/experience-page-view";

export const metadata: Metadata = buildMetadata({
  title: "Engineering Experience | Siddharth Varpe — Software Engineer",
  description:
    "A chronological record of software engineering roles, enterprise platforms delivered, and measurable operational outcomes in real-world production environments.",
  pathname: "/experience",
});

export default async function ExperiencePage() {
  const [experiences, pageHero, profile] = await Promise.all([
    getPublishedExperienceTimeline(),
    getPageHero("experience"),
    getPublishedProfile(),
  ]);

  const operationalEvidence = getPublishedOperationalEvidence(experiences);
  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Experience", path: "/experience" }]);

  return (
    <div className="w-full">
      <JsonLd data={breadcrumbs} />
      <ExperiencePageView
        experiences={experiences}
        heroConfig={pageHero}
        operationalEvidence={operationalEvidence}
        profile={profile}
      />
    </div>
  );
}
