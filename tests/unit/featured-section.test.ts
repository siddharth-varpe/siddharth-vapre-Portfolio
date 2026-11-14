import { describe, it, expect } from "vitest";
import {
  getPublishedFeaturedSection,
} from "@/lib/server/db/repositories/content";
import {
  getAdminFeaturedSection,
  updateAdminFeaturedSection,
} from "@/lib/server/db/repositories/admin";
import {
  featuredSectionConfigSchema,
  featuredItemSchema,
} from "@/lib/validations/models";

describe("Featured Highlights Section Repository & Validation", () => {
  it("fetches published featured section with 4 reference slots", async () => {
    const featured = await getPublishedFeaturedSection();
    expect(featured).toBeDefined();
    expect(featured.enabled).toBe(true);
    expect(featured.items.length).toBe(4);

    const types = featured.items.map((i) => i.type);
    expect(types).toContain("project");
    expect(types).toContain("experience");
    expect(types).toContain("achievement");
    expect(types).toContain("certification");
  });

  it("validates authentic default featured configuration against Zod schema", async () => {
    const featured = await getAdminFeaturedSection();
    const result = featuredSectionConfigSchema.safeParse(featured);
    expect(result.success).toBe(true);
  });

  it("rejects invalid accent values not in design token enum", () => {
    const invalidItem = {
      id: "feat-test",
      type: "project",
      enabled: true,
      order: 1,
      accent: "hotpink", // Not an approved design token!
      title: "Test Project",
      description: "Test description",
    };

    const result = featuredItemSchema.safeParse(invalidItem);
    expect(result.success).toBe(false);
  });

  it("rejects invalid item types outside the 4 approved types", () => {
    const invalidTypeItem = {
      id: "feat-test-2",
      type: "blog_post", // Not an approved item type!
      enabled: true,
      order: 1,
      accent: "blue",
      title: "Blog Post",
      description: "Test description",
    };

    const result = featuredItemSchema.safeParse(invalidTypeItem);
    expect(result.success).toBe(false);
  });

  it("rejects unsafe javascript: URLs in CTA links", () => {
    const unsafeCtaConfig = {
      enabled: true,
      title: "Featured Highlights",
      ctaText: "View All",
      ctaLink: "javascript:alert(1)",
      items: [],
    };

    const result = featuredSectionConfigSchema.safeParse(unsafeCtaConfig);
    expect(result.success).toBe(false);
  });

  it("updates and retrieves admin featured configuration", async () => {
    const current = await getAdminFeaturedSection();
    const updated = {
      ...current,
      title: "Featured Highlights Updated",
    };

    await updateAdminFeaturedSection(updated, "test-admin");
    const fetched = await getAdminFeaturedSection();
    expect(fetched.title).toBe("Featured Highlights Updated");

    // Restore original title
    await updateAdminFeaturedSection(current, "test-admin");
  });
});
