import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { getPublishedSkillsPageData } from "@/lib/server/db/repositories/content";
import { SkillsPageView } from "@/components/public/skills/skills-page-view";

export const metadata: Metadata = buildMetadata({
  title: "Skills & Technologies | Siddharth Varpe",
  description:
    "Comprehensive technical taxonomy of languages, distributed backend systems, databases, and AI tooling applied by Siddharth Varpe.",
  pathname: "/skills",
});

export default async function SkillsPage() {
  const pageData = await getPublishedSkillsPageData();
  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Skills", path: "/skills" }]);

  return (
    <div className="min-h-screen pb-16 sm:pb-24">
      <JsonLd data={breadcrumbs} />
      <SkillsPageView
        settings={pageData.settings}
        categories={pageData.categories}
        skills={pageData.skills}
        metrics={pageData.metrics}
      />
    </div>
  );
}
