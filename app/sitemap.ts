import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/server/db/repositories/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Dynamic Production Sitemap Generator (Phase 12).
 *
 * Rules:
 * - Includes only verified, public, published portfolio routes.
 * - Dynamically queries published case studies from Cloud Firestore.
 * - Strictly excludes administrative (/admin/*), API (/api/*), and internal utility routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/experience`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/skills`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/achievements`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/certifications`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic published project routes
  try {
    const publishedProjects = await getPublishedProjects();

    const projectRoutes: MetadataRoute.Sitemap = publishedProjects
      .filter((project) => project.status === "published" && Boolean(project.slug))
      .map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: project.updatedAt || project.createdAt || currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...projectRoutes];
  } catch (error) {
    console.error("[Sitemap Generation Warning]: Failed to fetch published projects from Firestore:", error);
    return staticRoutes;
  }
}
