import { describe, it, expect } from "vitest";
import {
  skillsPageSettingsSchema,
  skillCategoryMutationSchema,
  skillMutationSchema,
} from "@/lib/validations/models";
import {
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS_PAGE_SETTINGS,
} from "@/lib/server/db/default-skills-page-settings";
import {
  getPublishedSkillsPageData,
  getPublishedSkillCategories,
  getPublishedSkills,
} from "@/lib/server/db/repositories/content";
import {
  getAdminSkillCategories,
  createAdminSkillCategory,
  updateAdminSkillCategory,
  deleteAdminSkillCategory,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
} from "@/lib/server/db/repositories/admin";

describe("Strict Skills Page Reconstruction & Orbit System", () => {
  it("validates default skills page settings against Zod schema", () => {
    const parsed = skillsPageSettingsSchema.safeParse(DEFAULT_SKILLS_PAGE_SETTINGS);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.eyebrow).toBe("SKILLS");
      expect(parsed.data.titlePrimary).toBe("Tools, Technologies and Skills");
      expect(parsed.data.titleAccent).toBe("I Work With.");
      expect(parsed.data.orbitEnabled).toBe(true);
      expect(parsed.data.orbitSpeed).toBe("slow");
      expect(parsed.data.orbitDirection).toBe("clockwise");
      expect(parsed.data.maxOrbitNodes).toBe(8);
      expect(parsed.data.metrics.length).toBe(4);
      expect(parsed.data.approachBanner.enabled).toBe(true);
    }
  });

  it("validates dynamic skill category schema", () => {
    const validCat = skillCategoryMutationSchema.safeParse({
      name: "Cloud & Infrastructure",
      description: "Cloud computing and deployment services",
      icon: "cloud",
      accent: "blue",
      display_order: 5,
      enabled: true,
    });
    expect(validCat.success).toBe(true);

    const invalidCat = skillCategoryMutationSchema.safeParse({
      name: "", // empty name
    });
    expect(invalidCat.success).toBe(false);
  });

  it("validates skill mutation with dynamic category and orbit_enabled flag", () => {
    const validSkill = skillMutationSchema.safeParse({
      name: "Docker",
      category: "Tools & Systems",
      level: "Proficient",
      years: 2,
      orbit_enabled: true,
      order: 6,
      status: "published",
    });
    expect(validSkill.success).toBe(true);
    if (validSkill.success) {
      expect(validSkill.data.orbit_enabled).toBe(true);
      expect(validSkill.data.category).toBe("Tools & Systems");
    }
  });

  it("derives hero metrics factually from real database counts", async () => {
    const pageData = await getPublishedSkillsPageData();

    expect(pageData.settings).toBeDefined();
    expect(pageData.categories.length).toBeGreaterThan(0);
    expect(pageData.skills.length).toBeGreaterThan(0);

    // Metric #1: Technology Count derived from actual published skills
    const techMetric = pageData.metrics.find((m) => m.label === "Technologies");
    expect(techMetric).toBeDefined();
    expect(techMetric?.value).toBe(`${pageData.skills.length}+`);

    // Metric #2: Domain Count derived from actual active categories
    const domainMetric = pageData.metrics.find((m) => m.label === "Domains");
    expect(domainMetric).toBeDefined();
    expect(domainMetric?.value).toBe(`${pageData.categories.length}+`);

    // Qualitative metrics are CMS-controlled, not hardcoded
    const learningMetric = pageData.metrics.find((m) => m.supportingText === "Learning" || m.label === "Continuous");
    expect(learningMetric).toBeDefined();
  });

  it("verifies categories CRUD and safe deletion policy", async () => {
    // 1. Create temporary category
    const createdCat = await createAdminSkillCategory(
      {
        name: "Test IoT Domain",
        description: "Embedded and IoT devices",
        icon: "cpu",
        accent: "emerald",
        display_order: 99,
        enabled: true,
      },
      "test-agent"
    );
    expect(createdCat.id).toBeDefined();
    expect(createdCat.name).toBe("Test IoT Domain");

    // 2. Read back
    const categories = await getAdminSkillCategories();
    expect(categories.some((c) => c.name === "Test IoT Domain")).toBe(true);

    // 3. Update category
    const updated = await updateAdminSkillCategory(
      createdCat.id!,
      { description: "Updated IoT description" },
      "test-agent"
    );
    expect(updated?.description).toBe("Updated IoT description");

    // 4. Safe delete when empty
    const delResult = await deleteAdminSkillCategory(createdCat.id!, "test-agent");
    expect(delResult.success).toBe(true);

    // Verify gone
    const categoriesAfter = await getAdminSkillCategories();
    expect(categoriesAfter.some((c) => c.name === "Test IoT Domain")).toBe(false);
  });

  it("prevents deleting a category that has active skills", async () => {
    // Attempting to delete a category that has active skills (e.g. Frontend)
    const categories = await getAdminSkillCategories();
    const frontendCat = categories.find((c) => c.name === "Frontend");
    expect(frontendCat).toBeDefined();

    if (frontendCat && frontendCat.id) {
      const delResult = await deleteAdminSkillCategory(frontendCat.id, "test-agent");
      expect(delResult.success).toBe(false);
      expect(delResult.error).toContain("active skill(s) belong to it");
    }
  });

  it("verifies dynamic metric updates when a skill is created and deleted", async () => {
    const initialData = await getPublishedSkillsPageData();
    const initialCount = initialData.skills.length;

    // Add a new skill
    const newSkill = await createAdminSkill(
      {
        name: "Vitest Testing Framework",
        category: "Tools & Systems",
        level: "Proficient",
        years: 1,
        featured: false,
        orbit_enabled: false,
        order: 99,
        status: "published",
      },
      "test-agent"
    );

    // Verify count increased by 1
    const afterAddData = await getPublishedSkillsPageData();
    expect(afterAddData.skills.length).toBe(initialCount + 1);
    const techMetricAfterAdd = afterAddData.metrics.find((m) => m.label === "Technologies");
    expect(techMetricAfterAdd?.value).toBe(`${initialCount + 1}+`);

    // Clean up: delete the test skill
    await deleteAdminSkill(newSkill.id!, "test-agent");

    // Verify count reverted
    const afterDeleteData = await getPublishedSkillsPageData();
    expect(afterDeleteData.skills.length).toBe(initialCount);
    const techMetricAfterDel = afterDeleteData.metrics.find((m) => m.label === "Technologies");
    expect(techMetricAfterDel?.value).toBe(`${initialCount}+`);
  });
});
