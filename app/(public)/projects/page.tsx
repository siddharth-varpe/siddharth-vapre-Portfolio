import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { getPublishedProjects, getPageHero } from "@/lib/server/db/repositories/content";
import { ProjectsPageView } from "@/components/public/projects";

export const metadata: Metadata = buildMetadata({
  title: "Engineering Projects & Case Studies | Siddharth Varpe",
  description:
    "A collection of projects where I combine engineering, design, and modern technologies to solve real-world problems. Production software and enterprise platforms engineered by Siddharth Varpe.",
  pathname: "/projects",
});

export default async function ProjectsPage() {
  const [projects, pageHero] = await Promise.all([
    getPublishedProjects(),
    getPageHero("projects"),
  ]);

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Projects", path: "/projects" }]);

  return (
    <div className="w-full">
      <JsonLd data={breadcrumbs} />
      <ProjectsPageView projects={projects} heroConfig={pageHero} />
    </div>
  );
}
