import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Production Robots Configuration (Phase 12).
 *
 * Rules:
 * - Authorizes search engine indexing of all public portfolio sections and project routes.
 * - Strictly disallows crawling of administration (/admin/*), API endpoints (/api/*), and internal design utilities.
 * - Advertises the canonical XML sitemap location.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/experience",
          "/projects",
          "/projects/*",
          "/skills",
          "/achievements",
          "/certifications",
          "/contact",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/design-system",
          "/design-system/*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
