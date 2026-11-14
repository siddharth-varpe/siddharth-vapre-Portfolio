import { describe, it, expect } from "vitest";
import {
  getPublishedTechnicalTaxonomy,
} from "@/lib/server/db/repositories/content";
import {
  getAdminTechnicalTaxonomy,
  updateAdminTechnicalTaxonomy,
} from "@/lib/server/db/repositories/admin";
import {
  technicalTaxonomyConfigSchema,
  taxonomySkillItemSchema,
} from "@/lib/validations/models";

describe("Technical Taxonomy Section Repository & Validation", () => {
  it("fetches published technical taxonomy with 8 authentic reference skills", async () => {
    const taxonomy = await getPublishedTechnicalTaxonomy();
    expect(taxonomy).toBeDefined();
    expect(taxonomy.enabled).toBe(true);
    expect(taxonomy.skills.length).toBe(8);

    const names = taxonomy.skills.map((s) => s.name);
    expect(names).toContain("React.js");
    expect(names).toContain("Next.js");
    expect(names).toContain("Node.js");
    expect(names).toContain("Python");
    expect(names).toContain("PostgreSQL");
    expect(names).toContain("FastAPI");
    expect(names).toContain("WebSockets");
    expect(names).toContain("Git");
  });

  it("validates authentic default taxonomy configuration against Zod schema", async () => {
    const taxonomy = await getAdminTechnicalTaxonomy();
    const result = technicalTaxonomyConfigSchema.safeParse(taxonomy);
    expect(result.success).toBe(true);
  });

  it("rejects invalid position presets outside top-right | center-right | bottom-right", () => {
    const invalidConfig = {
      enabled: true,
      eyebrow: "TECHNICAL TAXONOMY",
      titlePrimary: "Technical",
      titleAccent: "Taxonomy",
      description: "Sample description",
      sectionIcon: "code",
      decorativeVisual: {
        enabled: true,
        assetUrl: "/images/taxonomy-window-illustration.png",
        position: "invalid-top-left", // Not an allowed position!
        mobileVisibility: "show",
        opacityPreset: "medium",
        accentVariant: "blue",
      },
      cta: {
        enabled: true,
        text: "Explore",
        destination: "/skills",
      },
      skills: [],
    };

    const result = technicalTaxonomyConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("rejects unsafe javascript: URLs in CTA destination", () => {
    const unsafeConfig = {
      enabled: true,
      eyebrow: "TECHNICAL TAXONOMY",
      titlePrimary: "Technical",
      titleAccent: "Taxonomy",
      description: "Sample description",
      sectionIcon: "code",
      decorativeVisual: {
        enabled: true,
        assetUrl: "/images/taxonomy-window-illustration.png",
        position: "top-right",
        mobileVisibility: "show",
        opacityPreset: "medium",
        accentVariant: "blue",
      },
      cta: {
        enabled: true,
        text: "Explore",
        destination: "javascript:alert('xss')", // Security check!
      },
      skills: [],
    };

    const result = technicalTaxonomyConfigSchema.safeParse(unsafeConfig);
    expect(result.success).toBe(false);
  });

  it("rejects skill item with empty name or category", () => {
    const invalidSkill = {
      id: "tax-test",
      name: "", // Empty name not allowed
      category: "Frontend",
      icon: "react",
      order: 1,
      enabled: true,
    };

    const result = taxonomySkillItemSchema.safeParse(invalidSkill);
    expect(result.success).toBe(false);
  });

  it("updates and retrieves admin technical taxonomy configuration", async () => {
    const current = await getAdminTechnicalTaxonomy();
    const updated = {
      ...current,
      titlePrimary: "Engineered",
      titleAccent: "Taxonomy",
    };

    await updateAdminTechnicalTaxonomy(updated, "test-admin");
    const fetched = await getAdminTechnicalTaxonomy();
    expect(fetched.titlePrimary).toBe("Engineered");

    // Restore original values
    await updateAdminTechnicalTaxonomy(current, "test-admin");
  });
});
