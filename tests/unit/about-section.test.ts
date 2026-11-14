import { describe, it, expect } from "vitest";
import {
  aboutMetricItemSchema,
  aboutTimelineItemSchema,
  aboutPillarItemSchema,
  aboutSectionConfigSchema,
  siteContentMutationSchema,
} from "@/lib/validations/models";
import { DEFAULT_ABOUT_SECTION } from "@/lib/server/db/default-about-section";
import {
  getPublishedAboutPageData,
  getPublishedAboutSection,
} from "@/lib/server/db/repositories/content";
import {
  getAdminAboutSection,
  updateAdminAboutSection,
} from "@/lib/server/db/repositories/admin";

describe("Strict About Page Reconstruction System", () => {
  it("validates default about section configuration against Zod schema", () => {
    const parsed = aboutSectionConfigSchema.safeParse(DEFAULT_ABOUT_SECTION);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.eyebrow).toBe("ABOUT ME");
      expect(parsed.data.titlePrimary).toBe("Turning Ideas into");
      expect(parsed.data.titleAccent).toBe("Real Impact.");
      expect(parsed.data.portraitAsset).toBe(DEFAULT_ABOUT_SECTION.portraitAsset);
      expect(parsed.data.contextBadge.label).toBe("Currently Learning");
      expect(parsed.data.personalDetails.location).toBe("Pune, Maharashtra, India");
      expect(parsed.data.pillars.length).toBe(3);
      expect(parsed.data.timeline.length).toBe(3);
    }
  });

  it("validates individual sub-schemas strictly", () => {
    const validMetric = aboutMetricItemSchema.safeParse({
      id: "metric-1",
      enabled: true,
      sourceType: "projects",
      label: "Projects Built",
      icon: "code",
      order: 1,
    });
    expect(validMetric.success).toBe(true);

    const validTimeline = aboutTimelineItemSchema.safeParse({
      id: "tl-1",
      enabled: true,
      period: "2026 – Present",
      title: "Software Developer Intern",
      organization: "Opstech Solution Pvt. Ltd.",
      bullets: ["Worked on full-stack solutions."],
      category: "work",
      order: 1,
    });
    expect(validTimeline.success).toBe(true);

    const validPillar = aboutPillarItemSchema.safeParse({
      id: "pil-1",
      enabled: true,
      number: "01",
      icon: "cube",
      title: "Production Systems",
      description: "Designing and building scalable applications.",
      destinationUrl: "/projects",
      order: 1,
    });
    expect(validPillar.success).toBe(true);
  });

  it("validates siteContentMutationSchema accepts aboutSection", () => {
    const payload = {
      footerText: "Designed & engineered with Next.js 15",
      copyright: "© 2026 Siddharth Varpe",
      globalCta: {
        headline: "Let's connect",
        subheadline: "Reach out to discuss building systems",
        buttonLabel: "Contact",
        buttonDestination: "#contact",
      },
      aboutSection: DEFAULT_ABOUT_SECTION,
    };
    const parsed = siteContentMutationSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it("retrieves published about page data and derives real metrics", async () => {
    const data = await getPublishedAboutPageData();
    expect(data).toBeDefined();
    expect(data.config).toBeDefined();
    expect(data.metrics).toBeDefined();
    expect(Array.isArray(data.metrics)).toBe(true);

    // Verify dynamic metrics resolution
    const projectMetric = data.metrics.find((m) => m.label === "Projects Built");
    expect(projectMetric).toBeDefined();
    expect(projectMetric?.value).toMatch(/\d+/);

    const ranksMetric = data.metrics.find((m) => m.label === "University Ranks");
    expect(ranksMetric).toBeDefined();
    expect(ranksMetric?.value).toMatch(/\d+/);

    const publishedConfig = await getPublishedAboutSection();
    expect(publishedConfig).toBeDefined();
    expect(publishedConfig.enabled).toBe(true);
  });

  it("retrieves admin about section configuration and supports updates", async () => {
    const current = await getAdminAboutSection();
    expect(current).toBeDefined();
    expect(current.eyebrow).toBe("ABOUT ME");

    const updated = await updateAdminAboutSection(
      {
        ...current,
        titleAccent: "Real Impact (Verified).",
      },
      "test-suite"
    );

    expect(updated.titleAccent).toBe("Real Impact (Verified).");

    // Restore default
    await updateAdminAboutSection(DEFAULT_ABOUT_SECTION, "test-suite");
    const restored = await getAdminAboutSection();
    expect(restored.titleAccent).toBe("Real Impact.");
  });
});
