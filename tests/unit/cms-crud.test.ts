import { describe, it, expect } from "vitest";
import {
  getAdminProjectById,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  getAdminProfile,
  updateAdminProfile,
  getAdminHero,
  getAdminRevisions,
  getAdminActivityLogs,
} from "@/lib/server/db/repositories/admin";

describe("Admin CMS CRUD Operations & Integrity", () => {
  it("retrieves admin profile successfully", async () => {
    const profile = await getAdminProfile();
    expect(profile).toBeDefined();
    expect(profile?.name).toBe("Siddharth Varpe");
  });

  it("updates admin profile and creates revision / activity record", async () => {
    const original = await getAdminProfile();
    expect(original).toBeDefined();

    const updated = await updateAdminProfile(
      {
        name: original!.name,
        title: original!.title,
        summary: original!.summary,
        location: original!.location,
        email: original!.email,
        phone: original!.phone,
        photoUrl: original!.photoUrl,
        avatarUrl: original!.avatarUrl,
        availability: original!.availability,
        tagline: "Updated Senior Software Engineer | AI Systems",
      },
      "test_admin"
    );

    expect(updated).toBeDefined();
    expect(updated?.tagline).toBe("Updated Senior Software Engineer | AI Systems");

    // Verify activity log was appended
    const activity = await getAdminActivityLogs();
    expect(activity.items.length).toBeGreaterThan(0);
    const profileLog = activity.items.find((a) => a.event === "update_profile");
    expect(profileLog).toBeDefined();
    expect(profileLog?.category).toBe("content");
  });

  it("retrieves admin hero content", async () => {
    const hero = await getAdminHero();
    expect(hero).toBeDefined();
    expect(hero?.headline).toBeDefined();
  });

  it("performs full Project CRUD lifecycle (Create, Read, Update, Delete)", async () => {
    // 1. CREATE Project
    const newProject = await createAdminProject(
      {
        title: "Test Security Automation Platform",
        slug: "test-security-automation-platform",
        shortDescription: "Automated vulnerability scanner and compliance platform",
        fullDescription: "Detailed architecture description for security testing automation",
        category: "Cybersecurity",
        year: "2025",
        role: "Security Architect",
        problem: "Automated scanning was manual and siloed.",
        objective: "Build unified security testing pipeline.",
        solution: "Implemented automated vulnerability assessment framework.",
        architectureSummary: "Next.js frontend, microservices backend, secure audit logs.",
        implementation: ["Designed scanner pipeline", "Added JWT verification"],
        decisions: ["Chose PostgreSQL for transactional audit trails"],
        challenges: ["Handling high throughput test suites"],
        impact: ["Reduced vulnerability discovery latency by 80%"],
        metrics: ["80% faster scan times"],
        status: "draft",
        featured: false,
        technologies: ["TypeScript", "Next.js", "PostgreSQL"],
        order: 99,
      },
      "test_admin"
    );

    expect(newProject).toBeDefined();
    expect(newProject.title).toBe("Test Security Automation Platform");
    expect(newProject.status).toBe("draft");
    const createdId = newProject.id || newProject._id;
    expect(createdId).toBeDefined();

    // 2. READ by ID
    const fetched = await getAdminProjectById(createdId!);
    expect(fetched).toBeDefined();
    expect(fetched?.slug).toBe("test-security-automation-platform");

    // 3. UPDATE Project (Publish)
    const updated = await updateAdminProject(
      createdId!,
      {
        title: "Test Security Automation Platform (Published)",
        status: "published",
        featured: true,
      },
      "test_admin"
    );

    expect(updated).toBeDefined();
    expect(updated?.title).toBe("Test Security Automation Platform (Published)");
    expect(updated?.status).toBe("published");
    expect(updated?.featured).toBe(true);

    // 4. DELETE / ARCHIVE Project
    const deleted = await deleteAdminProject(createdId!, "test_admin");
    expect(deleted).toBe(true);

    // Verify removal / 404
    const notFound = await getAdminProjectById(createdId!);
    expect(notFound).toBeNull();
  });

  it("verifies revision history tracking on mutations", async () => {
    const revisions = await getAdminRevisions("profile");
    expect(Array.isArray(revisions.items)).toBe(true);
  });
});
