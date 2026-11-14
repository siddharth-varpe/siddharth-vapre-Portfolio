import { describe, it, expect, beforeEach } from "vitest";
import {
  getLatestPublishedExperience,
  getPublishedExperience,
} from "@/lib/server/db/repositories/content";
import {
  createAdminExperience,
  updateAdminExperience,
} from "@/lib/server/db/repositories/admin";
import { getStore } from "@/lib/server/db/store";
import {
  experienceMutationSchema,
  semanticWorkTypeSchema,
} from "@/lib/validations/models";
import { SEMANTIC_WORK_TYPE_LABELS } from "@/components/public/semantic-work-icon";
import { formatDateRange } from "@/lib/utils/date-format";

describe("Professional Track System — Business Logic & State", () => {
  beforeEach(() => {
    // Reset store.experience to known state
    const store = getStore();
    store.experience = [];
  });

  it("TEST 1: Track A Published -> Home = A, Experience = [A]", async () => {
    await createAdminExperience(
      {
        company: "Company A",
        role: "Software Engineer",
        employmentType: "Full-time",
        location: "Pune, India",
        startDate: "2025-01",
        endDate: "2025-06",
        current: false,
        description: "Built scalable enterprise services.",
        responsibilities: ["Developed core APIs."],
        technologies: ["React.js", "Node.js"],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    const homeTrack = await getLatestPublishedExperience();
    const expList = await getPublishedExperience();

    expect(homeTrack).not.toBeNull();
    expect(homeTrack?.company).toBe("Company A");
    expect(expList).toHaveLength(1);
    expect(expList[0].company).toBe("Company A");
  });

  it("TEST 2: Track B Draft -> Home = A, Experience = [A]", async () => {
    // Create Track A (Published)
    await createAdminExperience(
      {
        company: "Company A",
        role: "Software Engineer",
        employmentType: "Full-time",
        location: "Pune, India",
        startDate: "2025-01",
        endDate: "2025-06",
        current: false,
        description: "Built scalable enterprise services.",
        responsibilities: ["Developed core APIs."],
        technologies: ["React.js", "Node.js"],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    // Create Track B (Draft, even with a newer date)
    await createAdminExperience(
      {
        company: "Company B",
        role: "Senior Software Engineer",
        employmentType: "Full-time",
        location: "Mumbai, India",
        startDate: "2026-01",
        current: true,
        description: "Drafting confidential internal platform.",
        responsibilities: ["Engineering new workflows."],
        technologies: ["Python", "FastAPI"],
        order: 2,
        status: "draft",
      },
      "test_admin"
    );

    const homeTrack = await getLatestPublishedExperience();
    const expList = await getPublishedExperience();

    expect(homeTrack?.company).toBe("Company A");
    expect(expList).toHaveLength(1);
    expect(expList[0].company).toBe("Company A");
  });

  it("TEST 3: Publish B -> Home = B, Experience = [B, A]", async () => {
    await createAdminExperience(
      {
        company: "Company A",
        role: "Software Engineer",
        employmentType: "Full-time",
        location: "Pune, India",
        startDate: "2025-01",
        endDate: "2025-06",
        current: false,
        description: "Track A description",
        responsibilities: ["Resp A"],
        technologies: ["Node.js"],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    const docB = await createAdminExperience(
      {
        company: "Company B",
        role: "Senior Engineer",
        employmentType: "Full-time",
        location: "Bengaluru, India",
        startDate: "2026-01",
        current: true,
        description: "Track B description",
        responsibilities: ["Resp B"],
        technologies: ["Python"],
        order: 2,
        status: "draft",
      },
      "test_admin"
    );

    // Publish B
    await updateAdminExperience(docB.id!, { status: "published" }, "test_admin");

    const homeTrack = await getLatestPublishedExperience();
    const expList = await getPublishedExperience();

    expect(homeTrack?.company).toBe("Company B");
    expect(expList).toHaveLength(2);
    expect(expList[0].company).toBe("Company B");
    expect(expList[1].company).toBe("Company A");
  });

  it("TEST 4: Create + Publish C (newer date) -> Home = C, Experience = [C, B, A]", async () => {
    await createAdminExperience(
      {
        company: "Company A",
        role: "Junior Dev",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2024-01",
        current: false,
        description: "Role A",
        responsibilities: [],
        technologies: [],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        company: "Company B",
        role: "Mid Dev",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2025-01",
        current: false,
        description: "Role B",
        responsibilities: [],
        technologies: [],
        order: 2,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        company: "Company C",
        role: "Lead Architect",
        employmentType: "Full-time",
        location: "Remote",
        startDate: "2026-06",
        current: true,
        description: "Role C",
        responsibilities: [],
        technologies: [],
        order: 3,
        status: "published",
      },
      "test_admin"
    );

    const homeTrack = await getLatestPublishedExperience();
    const expList = await getPublishedExperience();

    expect(homeTrack?.company).toBe("Company C");
    expect(expList).toHaveLength(3);
    expect(expList.map((e) => e.company)).toEqual(["Company C", "Company B", "Company A"]);
  });

  it("TEST 5: Archive C -> Home = B, Experience = [B, A]", async () => {
    await createAdminExperience(
      {
        company: "Company A",
        role: "Dev",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2024-01",
        current: false,
        description: "Role A",
        responsibilities: [],
        technologies: [],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        company: "Company B",
        role: "Engineer",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2025-01",
        current: false,
        description: "Role B",
        responsibilities: [],
        technologies: [],
        order: 2,
        status: "published",
      },
      "test_admin"
    );

    const docC = await createAdminExperience(
      {
        company: "Company C",
        role: "Lead",
        employmentType: "Full-time",
        location: "Remote",
        startDate: "2026-06",
        current: true,
        description: "Role C",
        responsibilities: [],
        technologies: [],
        order: 3,
        status: "published",
      },
      "test_admin"
    );

    // Archive C
    await updateAdminExperience(docC.id!, { status: "archived" }, "test_admin");

    const homeTrack = await getLatestPublishedExperience();
    const expList = await getPublishedExperience();

    expect(homeTrack?.company).toBe("Company B");
    expect(expList).toHaveLength(2);
    expect(expList.map((e) => e.company)).toEqual(["Company B", "Company A"]);
  });

  it("TEST 6: Edit A (without changing date to be newer) -> Home remains B, Experience remains [B, A]", async () => {
    const docA = await createAdminExperience(
      {
        company: "Company A",
        role: "Dev",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2024-01",
        current: false,
        description: "Role A",
        responsibilities: [],
        technologies: [],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        company: "Company B",
        role: "Engineer",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2025-01",
        current: false,
        description: "Role B",
        responsibilities: [],
        technologies: [],
        order: 2,
        status: "published",
      },
      "test_admin"
    );

    // Edit A's description
    await updateAdminExperience(
      docA.id!,
      { description: "Updated description for A without changing date" },
      "test_admin"
    );

    const homeTrack = await getLatestPublishedExperience();
    const expList = await getPublishedExperience();

    expect(homeTrack?.company).toBe("Company B");
    expect(expList[0].company).toBe("Company B");
    expect(expList[1].company).toBe("Company A");
  });

  describe("Automatic Semantic Work Icon & Validation Mapping", () => {
    it("supports all required semantic work types", () => {
      const types = [
        "crm",
        "inventory",
        "api",
        "ai",
        "automation",
        "database",
        "frontend",
        "backend",
        "fullstack",
        "infrastructure",
        "other",
      ];

      for (const t of types) {
        expect(semanticWorkTypeSchema.safeParse(t).success).toBe(true);
        expect(SEMANTIC_WORK_TYPE_LABELS[t as keyof typeof SEMANTIC_WORK_TYPE_LABELS]).toBeDefined();
      }
    });

    it("rejects unknown semantic work types to prevent arbitrary input", () => {
      const invalid = semanticWorkTypeSchema.safeParse("arbitrary_unapproved_icon");
      expect(invalid.success).toBe(false);
    });

    it("validates structured professional track payload via Zod", () => {
      const validPayload = {
        role: "Software Developer Intern",
        company: "Opstech Solution Pvt. Ltd.",
        companyLogoUrl: "https://example.com/logo.png",
        workMode: "Hybrid",
        employmentType: "Internship",
        location: "Pune, Maharashtra, India",
        startDate: "2026-06",
        endDate: "2026-10",
        current: false,
        description: "Engineered and deployed production-grade full-stack CRM.",
        responsibilities: ["Built full stack CRM"],
        technologies: ["React.js", "Node.js", "FastAPI"],
        highlights: [
          {
            id: "hl-1",
            title: "Built & Deployed Full-Stack CRM",
            description: "Managed 2,000–3,000+ customer records.",
            type: "crm",
            metrics: ["2,000–3,000+", "~90%"],
            technologies: ["React.js"],
            order: 0,
            enabled: true,
          },
        ],
        ctaLabel: "Full Timeline",
        ctaUrl: "/experience",
        order: 0,
        status: "published",
      };

      const parsed = experienceMutationSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);
    });

    it("correctly calculates date ranges and durations", () => {
      const range1 = formatDateRange("2026-06", "2026-10", false);
      expect(range1.rangeText).toBe("Jun 2026 – Oct 2026");
      expect(range1.durationText).toBe("5 mos");

      const rangeCurrent = formatDateRange("2026-06", undefined, true);
      expect(rangeCurrent.rangeText).toBe("Jun 2026 – Present");
    });
  });
});
