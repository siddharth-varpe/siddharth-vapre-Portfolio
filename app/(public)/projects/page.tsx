import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/server/db/repositories/content";
import { PageIntro } from "@/components/public/page-intro";
import { Container } from "@/components/ui";
import { ProjectsExplorer } from "@/components/public/projects-explorer";

export const metadata: Metadata = buildMetadata({
  title: "Engineering Projects & Case Studies | Siddharth Varpe",
  description:
    "Production software, distributed system architectures, enterprise platforms, and verified technical case studies engineered by Siddharth Varpe.",
  pathname: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Projects", path: "/projects" }]);

  return (
    <div className="space-y-10 pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="SYSTEMS & CASE STUDIES // PRODUCTION IMPLEMENTATIONS"
        title="Engineering Projects"
        description="Production software, distributed system architectures, and enterprise platforms engineered for high throughput, sub-second latency, and measurable business impact."
      />

      <Container size="public">
        <ProjectsExplorer projects={projects} />
      </Container>
    </div>
  );
}

