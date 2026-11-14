import { describe, it, expect, beforeEach } from "vitest";
import {
  getPublishedExperience,
  getPublishedOperationalEvidence,
} from "@/lib/server/db/repositories/content";
import {
  createAdminExperience,
} from "@/lib/server/db/repositories/admin";
import { getStore } from "@/lib/server/db/store";
import { formatDateRange } from "@/lib/utils/date-format";
import { experienceMutationSchema } from "@/lib/validations/models";
import type { ExperienceDocument } from "@/types/models";

describe("Strict Experience Page System — Chronological, Scalable & Dynamic", () => {
  beforeEach(() => {
    // Reset store.experience to known empty state
    const store = getStore();
    store.experience = [];
  });

  it("1. Deterministic chronological sorting: start_date DESC -> created_at DESC", async () => {
    // Add experiences in non-chronological order
    await createAdminExperience(
      {
        type: "work",
        company: "Past Company 2024",
        role: "Software Engineer",
        employmentType: "Full-time",
        location: "Pune, India",
        startDate: "2024-06",
        endDate: "2024-12",
        current: false,
        description: "Built microservices.",
        responsibilities: [],
        technologies: ["Node.js"],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        type: "work",
        company: "Recent Company 2026",
        role: "Senior Engineer",
        employmentType: "Full-time",
        location: "Pune, India",
        startDate: "2026-06",
        endDate: "2026-10",
        current: false,
        description: "Engineered CRM systems.",
        responsibilities: [],
        technologies: ["React.js", "Python"],
        order: 2,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        type: "work",
        company: "Mid Company 2025",
        role: "Software Developer",
        employmentType: "Full-time",
        location: "Pune, India",
        startDate: "2025-01",
        endDate: "2025-12",
        current: false,
        description: "Developed APIs.",
        responsibilities: [],
        technologies: ["FastAPI"],
        order: 3,
        status: "published",
      },
      "test_admin"
    );

    const published = await getPublishedExperience();
    expect(published.map((e) => e.company)).toEqual([
      "Recent Company 2026",
      "Mid Company 2025",
      "Past Company 2024",
    ]);
  });

  it("2. Scalability: Arbitrary number of records (1, 2, 5, 10+) without hardcoded assumptions", async () => {
    for (let i = 1; i <= 12; i++) {
      const year = 2020 + i;
      await createAdminExperience(
        {
          type: i % 4 === 0 ? "education" : "work",
          company: `Company ${year}`,
          role: `Role ${i}`,
          employmentType: "Full-time",
          location: "Pune, India",
          startDate: `${year}-01`,
          endDate: `${year}-12`,
          current: i === 12,
          description: `Description for record ${i}`,
          responsibilities: [`Resp ${i}`],
          technologies: ["React.js", "PostgreSQL"],
          order: i,
          status: "published",
        },
        "test_admin"
      );
    }

    const timeline = await getPublishedExperience();
    expect(timeline).toHaveLength(12);
    // Verify first is the newest year (2032)
    expect(timeline[0].company).toBe("Company 2032");
    expect(timeline[11].company).toBe("Company 2021");
  });

  it("3. Future Experience Test: Adding D to [A, B, C] automatically extends order to [D, A, B, C]", async () => {
    await createAdminExperience(
      {
        type: "work",
        company: "Company A",
        role: "Engineer",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2025-01",
        current: false,
        description: "Desc A",
        responsibilities: [],
        technologies: [],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        type: "work",
        company: "Company B",
        role: "Engineer",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2024-01",
        current: false,
        description: "Desc B",
        responsibilities: [],
        technologies: [],
        order: 2,
        status: "published",
      },
      "test_admin"
    );

    let list = await getPublishedExperience();
    expect(list.map((e) => e.company)).toEqual(["Company A", "Company B"]);

    // Add D with newer date (2026-06)
    await createAdminExperience(
      {
        type: "work",
        company: "Company D",
        role: "Lead Engineer",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2026-06",
        current: true,
        description: "Desc D",
        responsibilities: [],
        technologies: [],
        order: 3,
        status: "published",
      },
      "test_admin"
    );

    list = await getPublishedExperience();
    expect(list.map((e) => e.company)).toEqual(["Company D", "Company A", "Company B"]);
  });

  it("4. Private draft and archived records are excluded from public timeline", async () => {
    await createAdminExperience(
      {
        type: "work",
        company: "Published Record",
        role: "Software Developer",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2025-01",
        current: false,
        description: "Publicly visible",
        responsibilities: [],
        technologies: [],
        order: 1,
        status: "published",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        type: "work",
        company: "Draft Record",
        role: "Upcoming Role",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2026-01",
        current: false,
        description: "Confidential upcoming role",
        responsibilities: [],
        technologies: [],
        order: 2,
        status: "draft",
      },
      "test_admin"
    );

    await createAdminExperience(
      {
        type: "work",
        company: "Archived Record",
        role: "Past Role",
        employmentType: "Full-time",
        location: "Pune",
        startDate: "2023-01",
        current: false,
        description: "Historical archived entry",
        responsibilities: [],
        technologies: [],
        order: 3,
        status: "archived",
      },
      "test_admin"
    );

    const publicList = await getPublishedExperience();
    expect(publicList).toHaveLength(1);
    expect(publicList[0].company).toBe("Published Record");
  });

  it("5. Operational Evidence generation: dynamically resolves structured metrics", () => {
    const mockExperiences: ExperienceDocument[] = [
      {
        id: "exp-1",
        _id: "exp-1",
        type: "work",
        company: "Opstech Solution Pvt. Ltd.",
        role: "Software Developer Intern",
        employmentType: "Internship",
        workMode: "Hybrid",
        location: "Pune, India",
        startDate: "Jun 2026",
        endDate: "Oct 2026",
        current: false,
        description: "CRM and inventory platform development.",
        responsibilities: [],
        technologies: ["React.js", "Node.js", "PostgreSQL"],
        highlights: [
          {
            id: "hl-1",
            title: "Built & Deployed Full-Stack CRM",
            description: "Managed 2,000–3,000+ customer records.",
            type: "crm",
            metrics: ["2,000–3,000+", "~90%", "~65%"],
            order: 1,
            enabled: true,
          },
          {
            id: "hl-2",
            title: "Scalable Inventory Management Platform",
            description: "Supported 10,000+ transactions with 65–75% reduction.",
            type: "inventory",
            metrics: ["1,000+", "10,000+", "65–75%", "80–90%"],
            order: 2,
            enabled: true,
          },
        ],
        order: 1,
        status: "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const evidence = getPublishedOperationalEvidence(mockExperiences);
    expect(evidence.length).toBeGreaterThanOrEqual(4);

    const labels = evidence.map((e) => e.label);
    expect(labels).toContain("Customers Managed");
    expect(labels).toContain("Daily Transactions");
    expect(labels).toContain("Manual Operations Reduced");
    expect(labels).toContain("Faster Data Retrieval");

    const custItem = evidence.find((e) => e.label === "Customers Managed");
    expect(custItem?.value).toBe("2,000–3,000+");

    const txItem = evidence.find((e) => e.label === "Daily Transactions");
    expect(txItem?.value).toBe("10,000+");
  });

  it("6. Date Range and Derived Duration: handles year-only, month-year, and current roles", () => {
    // Standard month-year range
    const r1 = formatDateRange("Jun 2026", "Oct 2026", false, { verboseDuration: true });
    expect(r1.rangeText).toBe("Jun 2026 – Oct 2026");
    expect(r1.durationText).toBe("5 Months");

    // Year-only range (Education: 2024 - 2028)
    const r2 = formatDateRange("2024", "2028", false, { verboseDuration: true });
    expect(r2.rangeText).toBe("2024 – 2028");
    expect(r2.durationText).toBe("4 Years");

    // Current role
    const r3 = formatDateRange("Jun 2026", undefined, true, { verboseDuration: true });
    expect(r3.rangeText).toBe("Jun 2026 – Present");
  });

  it("7. Experience Mutation Schema validates Record Type and Employment Type correctly", () => {
    const valid = experienceMutationSchema.safeParse({
      type: "education",
      company: "Savitribai Phule Pune University (SPPU)",
      role: "Undergraduate Engineer",
      employmentType: "Education",
      workMode: "On-site",
      location: "Pune, Maharashtra, India",
      startDate: "2024",
      endDate: "2028",
      current: false,
      description: "Pursuing undergraduate degree in E&TC.",
      responsibilities: ["B.E. in Electronics & Telecommunication"],
      technologies: [],
      order: 2,
      status: "published",
    });

    expect(valid.success).toBe(true);

    const invalidType = experienceMutationSchema.safeParse({
      type: "invalid_unsupported_category",
      company: "Invalid Co",
      role: "Role",
      employmentType: "Full-time",
      location: "Pune",
      startDate: "2024",
      description: "Short desc",
      responsibilities: [],
      technologies: [],
    });

    expect(invalidType.success).toBe(false);
  });
});
