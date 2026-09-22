import { describe, it, expect } from "vitest";
import {
  getPublishedProjects,
  getPublishedProjectBySlug,
  getPublishedSkills,
  getPublishedProfile,
} from "@/lib/server/db/repositories/content";
import { assertResourceAccess } from "@/lib/server/auth/authorization";

describe("Database Content & Publishing Boundary", () => {
  it("fetches published developer profile with authentic data", async () => {
    const profile = await getPublishedProfile();
    expect(profile).toBeDefined();
    expect(profile?.name).toBe("Siddharth Varpe");
    expect(profile?.title).toContain("Software Engineer");
  });

  it("getPublishedProjects only returns projects with status = 'published'", async () => {
    const projects = await getPublishedProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.status).toBe("published");
      expect(project.slug).toBeDefined();
      expect(project.title).toBeDefined();
    }
  });

  it("resolves published project by slug correctly", async () => {
    const project = await getPublishedProjectBySlug("crm-sr-enterprises");
    expect(project).toBeDefined();
    expect(project?.title).toContain("CRM");
    expect(project?.status).toBe("published");
  });

  it("returns null for non-existent or unpublished project slugs (Prevents Draft Leaks)", async () => {
    const nonExistent = await getPublishedProjectBySlug("non-existent-draft-project-slug");
    expect(nonExistent).toBeNull();
  });

  it("getPublishedSkills only returns published skills sorted by order", async () => {
    const skills = await getPublishedSkills();
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) {
      expect(skill.status).toBe("published");
    }

    // Verify ordering
    for (let i = 0; i < skills.length - 1; i++) {
      expect((skills[i].order ?? 0) <= (skills[i + 1].order ?? 0)).toBe(true);
    }
  });

  describe("IDOR / BOLA Authorization Guard (assertResourceAccess)", () => {
    it("allows access when current user ID matches resource owner ID", () => {
      expect(() => {
        assertResourceAccess("admin_user_123", "admin_user_123");
      }).not.toThrow();
    });

    it("throws Authorization Violation when user ID differs from resource owner ID", () => {
      expect(() => {
        assertResourceAccess("admin_user_123", "attacker_user_456");
      }).toThrow(/AUTHORIZATION VIOLATION/);
    });

    it("throws Authorization Violation when resource owner ID is missing", () => {
      expect(() => {
        assertResourceAccess(null, "admin_user_123");
      }).toThrow(/missing/i);
    });
  });
});
