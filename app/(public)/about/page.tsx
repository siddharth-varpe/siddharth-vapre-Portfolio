import { buildMetadata, generateBreadcrumbJsonLd, generateProfilePageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { getPublishedAboutPageData } from "@/lib/server/db/repositories/content";
import { AboutContent } from "@/components/public/about-content";

export const metadata: Metadata = buildMetadata({
  title: "About | Siddharth Varpe — Software Engineer",
  description:
    "Professional background, engineering philosophy, and problem-solving mindset of Siddharth Varpe — Full-Stack Software Engineer.",
  pathname: "/about",
});

export default async function AboutPage() {
  const { config, profile, metrics } = await getPublishedAboutPageData();

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "About", path: "/about" }]);
  const profilePageSchema = generateProfilePageJsonLd(profile);

  return (
    <div className="w-full">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={profilePageSchema} />

      {/* STRICT REFERENCE-LOCKED ABOUT PAGE RECONSTRUCTION */}
      <AboutContent config={config} metrics={metrics} profile={profile} />
    </div>
  );
}
