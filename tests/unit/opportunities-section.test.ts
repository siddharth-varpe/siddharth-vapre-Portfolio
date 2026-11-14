import { describe, it, expect, beforeEach } from "vitest";
import {
  opportunitiesSectionConfigSchema,
  opportunityBadgeSchema,
} from "@/lib/validations/models";
import { DEFAULT_OPPORTUNITIES_SECTION } from "@/lib/server/db/default-opportunities-section";
import {
  getPublishedOpportunitiesSection,
  getAdminOpportunitiesSection,
  updateAdminOpportunitiesSection,
} from "@/lib/server/db";
import { getStore } from "@/lib/server/db/store";

describe("Open For Opportunities Section System", () => {
  beforeEach(() => {
    const store = getStore();
    if (store.siteContent) {
      store.siteContent.opportunitiesSection = undefined;
    }
  });

  it("validates default opportunities configuration against Zod schema", () => {
    const parsed = opportunitiesSectionConfigSchema.safeParse(DEFAULT_OPPORTUNITIES_SECTION);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.eyebrow).toBe("OPEN FOR OPPORTUNITIES");
      expect(parsed.data.titlePrimary).toBe("Ready to engineer high-impact systems");
      expect(parsed.data.titleAccent).toBe("together.");
      expect(parsed.data.primaryCtaText).toBe("Get in Touch");
      expect(parsed.data.primaryCtaLink).toBe("/contact");
      expect(parsed.data.secondaryCtaText).toBe("Download Resume PDF");
      expect(parsed.data.secondaryCtaLink).toBe("/api/resume/download");
      expect(parsed.data.badges).toHaveLength(3);
    }
  });

  it("validates individual badge schema", () => {
    const validBadge = {
      id: "badge-fullstack",
      label: "Full-Stack Development",
      icon: "users" as const,
    };
    const parsed = opportunityBadgeSchema.safeParse(validBadge);
    expect(parsed.success).toBe(true);

    const invalidBadge = {
      id: "",
      label: "",
      icon: "invalid-icon",
    };
    const invalidParsed = opportunityBadgeSchema.safeParse(invalidBadge);
    expect(invalidParsed.success).toBe(false);
  });

  it("fetches published opportunities section with defaults", async () => {
    const config = await getPublishedOpportunitiesSection();
    expect(config.enabled).toBe(true);
    expect(config.eyebrow).toBe("OPEN FOR OPPORTUNITIES");
    expect(config.titlePrimary).toContain("Ready to engineer");
    expect(config.titleAccent).toBe("together.");
    expect(config.badges.length).toBeGreaterThanOrEqual(3);
  });

  it("updates and retrieves admin opportunities section configuration", async () => {
    const customConfig = {
      ...DEFAULT_OPPORTUNITIES_SECTION,
      eyebrow: "CAREER OPPORTUNITIES",
      titlePrimary: "Let's build scalable distributed architectures",
      titleAccent: "now.",
      description: "Available for Senior Full-Stack Engineering roles.",
    };

    const updated = await updateAdminOpportunitiesSection(customConfig, "test-admin");
    expect(updated.eyebrow).toBe("CAREER OPPORTUNITIES");
    expect(updated.titleAccent).toBe("now.");

    const retrieved = await getAdminOpportunitiesSection();
    expect(retrieved.eyebrow).toBe("CAREER OPPORTUNITIES");
    expect(retrieved.titlePrimary).toBe("Let's build scalable distributed architectures");
    expect(retrieved.titleAccent).toBe("now.");
  });
});
