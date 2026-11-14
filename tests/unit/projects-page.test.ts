import { describe, it, expect } from "vitest";
import { getProjectDisplayImage } from "@/components/public/projects/project-image-helper";
import { getPublishedProjects } from "@/lib/server/db/repositories/content";
import type { ProjectDocument } from "@/types/models";

describe("Strict Projects Page Reconstruction & Dynamic Showcase", () => {
  const mockCampusBuddy: ProjectDocument = {
    id: "proj-1",
    title: "Campus Buddy – AI Campus Management System",
    slug: "campus-buddy",
    shortDescription: "AI-powered campus platform",
    fullDescription: "Campus buddy system",
    category: "AI & Full-Stack",
    year: "2024",
    role: "Lead Engineer",
    problem: "Campus operations",
    objective: "Streamline campus operations",
    solution: "AI platform",
    architectureSummary: "Full-stack nextjs",
    implementation: ["Next.js", "Gemini API"],
    decisions: ["AI First"],
    challenges: ["Scale"],
    impact: ["60% faster"],
    metrics: ["60% build time reduction"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API", "React"],
    featured: true,
    status: "published",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCRM: ProjectDocument = {
    ...mockCampusBuddy,
    id: "proj-2",
    title: "CRM — SR Enterprises",
    slug: "crm-sr-enterprises",
    category: "Enterprise Solution",
  };

  const mockInventory: ProjectDocument = {
    ...mockCampusBuddy,
    id: "proj-3",
    title: "Inventory Management Platform",
    slug: "inventory-management-platform",
    category: "Full-Stack Systems",
  };

  const mockPortfolio: ProjectDocument = {
    ...mockCampusBuddy,
    id: "proj-4",
    title: "Portfolio Website",
    slug: "portfolio-website",
    category: "Web Platform",
  };

  it("resolves authentic verified screenshots for all 4 real portfolio projects", () => {
    expect(getProjectDisplayImage(mockCampusBuddy)).toBe("/uploads/blob/portfolio/project/card-campus-buddy@2x.png");
    expect(getProjectDisplayImage(mockCRM)).toBe("/uploads/blob/portfolio/project/1788715622610-126ed882-crm-sr-enterprises-dashboard.png");
    expect(getProjectDisplayImage(mockInventory)).toBe("/uploads/blob/portfolio/project/1788715627670-8ce575a1-stockmanager-enterprise-dashboard.png");
    expect(getProjectDisplayImage(mockPortfolio)).toBe("/images/current_desktop_light.png");
  });

  it("handles fallback gracefully if coverImage is provided or slug is unknown", () => {
    const customProject: ProjectDocument = {
      ...mockCampusBuddy,
      slug: "custom-app",
      coverImage: "https://example.com/custom.png",
    };
    expect(getProjectDisplayImage(customProject)).toBe("https://example.com/custom.png");

    const fallbackProject: ProjectDocument = {
      ...mockCampusBuddy,
      slug: "unknown-slug",
      coverImage: undefined,
    };
    expect(getProjectDisplayImage(fallbackProject)).toBe("/images/featured/campusbuddy-preview.png");
  });

  it("calculates circular carousel offsets correctly for 4 items", () => {
    const total = 4;
    const calculateOffset = (index: number, activeIndex: number) => {
      let diff = (index - activeIndex) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    };

    // When activeIndex is 0 (Campus Buddy)
    expect(calculateOffset(0, 0)).toBe(0); // active
    expect(calculateOffset(1, 0)).toBe(1); // next
    expect(calculateOffset(3, 0)).toBe(-1); // prev

    // When activeIndex is 1 (CRM)
    expect(calculateOffset(1, 1)).toBe(0); // active
    expect(calculateOffset(0, 1)).toBe(-1); // prev
    expect(calculateOffset(2, 1)).toBe(1); // next

    // When activeIndex is 3 (Portfolio)
    expect(calculateOffset(3, 3)).toBe(0); // active
    expect(calculateOffset(0, 3)).toBe(1); // next (wraps around)
    expect(calculateOffset(2, 3)).toBe(-1); // prev
  });

  it("fetches approved portfolio projects from database repository", async () => {
    const published = await getPublishedProjects();
    expect(Array.isArray(published)).toBe(true);
    expect(published.length).toBeGreaterThanOrEqual(4);

    const slugs = published.map((p) => p.slug);
    expect(slugs).toContain("campus-buddy");
    expect(slugs).toContain("crm-sr-enterprises");
    expect(slugs).toContain("inventory-management-platform");
    expect(slugs).toContain("portfolio-website");

    // Strictly ensure reference-only projects are NOT present
    expect(slugs).not.toContain("byfarm");
    expect(slugs).not.toContain("swasthyaid");
    expect(slugs).not.toContain("pothole-mapping");
  });
});
