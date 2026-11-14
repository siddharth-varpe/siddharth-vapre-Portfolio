import { describe, it, expect } from "vitest";
import {
  footerMetricsConfigSchema,
  footerConnectConfigSchema,
  footerArtworkConfigSchema,
  footerBottomBarConfigSchema,
  footerSectionConfigSchema,
  siteContentMutationSchema,
} from "@/lib/validations/models";
import { DEFAULT_FOOTER_SECTION } from "@/lib/server/db/default-footer-section";
import {
  getPublishedFooterData,
  getPublishedFooterSection,
} from "@/lib/server/db/repositories/content";
import {
  getAdminFooterSection,
  updateAdminFooterSection,
} from "@/lib/server/db/repositories/admin";

describe("Strict Footer Reconstruction System", () => {
  it("validates default footer configuration against Zod schema", () => {
    const parsed = footerSectionConfigSchema.safeParse(DEFAULT_FOOTER_SECTION);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.title).toBe("Siddharth Varpe");
      expect(parsed.data.professionalTitle).toBe("SOFTWARE ENGINEER | AI & FULL-STACK");
      expect(parsed.data.metrics.projectsLabel).toBe("Projects");
      expect(parsed.data.metrics.awardsLabel).toBe("Awards");
      expect(parsed.data.bottomBar.tagline).toBe("ENGINEER • BUILD • IMPACT");
    }
  });

  it("validates individual sub-schemas strictly", () => {
    const validMetrics = footerMetricsConfigSchema.safeParse({
      projectsLabel: "Shipped Apps",
      showProjects: true,
      awardsLabel: "Distinctions",
      showAwards: false,
      opportunitiesLabel: "Status",
      opportunitiesValue: "Open",
      showOpportunities: true,
    });
    expect(validMetrics.success).toBe(true);

    const validConnect = footerConnectConfigSchema.safeParse({
      enabled: true,
      title: "Get in touch",
      description: "Let's connect soon.",
      primaryButtonLabel: "Contact Me",
      primaryButtonHref: "/contact",
      githubUrl: "https://github.com/test",
    });
    expect(validConnect.success).toBe(true);

    const validArtwork = footerArtworkConfigSchema.safeParse({
      enabled: true,
      desktopArtworkUrl: "/custom-art.png",
      mobileArtworkUrl: "/custom-art-mob.png",
      desktopVisibility: "show",
      mobileVisibility: "hide",
      positionPreset: "right",
      opacityPreset: "medium",
    });
    expect(validArtwork.success).toBe(true);

    const validBottomBar = footerBottomBarConfigSchema.safeParse({
      tagline: "BUILD • SHIP • SCALE",
      adminLinkText: "Admin Portal",
      showPrivacy: false,
      privacyText: "Privacy Policy",
      showTerms: false,
      termsText: "Terms of Service",
    });
    expect(validBottomBar.success).toBe(true);
  });

  it("integrates footerSection into siteContentMutationSchema", () => {
    const parsed = siteContentMutationSchema.safeParse({
      footerText: "Custom footer description",
      copyright: "© 2026 Test",
      globalCta: {
        headline: "CTA headline",
        subheadline: "CTA subheadline",
        buttonLabel: "Click",
        buttonDestination: "/contact",
      },
      footerSection: DEFAULT_FOOTER_SECTION,
    });
    expect(parsed.success).toBe(true);
  });

  it("retrieves published footer data with dynamically derived metrics", async () => {
    const footerData = await getPublishedFooterData();
    expect(footerData).toBeDefined();
    expect(footerData.config).toBeDefined();
    expect(footerData.brand.name).toBeTruthy();
    expect(footerData.brand.title).toBeTruthy();
    // Dynamic counts
    expect(footerData.derivedMetrics.projectsCount).toBeDefined();
    expect(footerData.derivedMetrics.awardsCount).toBeDefined();
    expect(footerData.derivedMetrics.opportunitiesStatus).toBe("Opportunities");
    // Social links
    expect(footerData.socialLinks.github).toContain("github.com");
    expect(footerData.socialLinks.email).toContain("@");

    const sectionConfig = await getPublishedFooterSection();
    expect(sectionConfig.title).toBe(footerData.brand.name);
  });

  it("updates and retrieves admin footer section configuration", async () => {
    const initial = await getAdminFooterSection();
    expect(initial).toBeDefined();

    const modified = {
      ...initial,
      title: "Siddharth Varpe (Updated)",
      bottomBar: {
        ...initial.bottomBar,
        tagline: "DESIGN • ENGINEER • DEPLOY",
      },
    };

    const updated = await updateAdminFooterSection(modified, "test-suite");
    expect(updated.title).toBe("Siddharth Varpe (Updated)");
    expect(updated.bottomBar.tagline).toBe("DESIGN • ENGINEER • DEPLOY");

    const retrieved = await getAdminFooterSection();
    expect(retrieved.title).toBe("Siddharth Varpe (Updated)");
    expect(retrieved.bottomBar.tagline).toBe("DESIGN • ENGINEER • DEPLOY");

    // Revert back to default
    await updateAdminFooterSection(DEFAULT_FOOTER_SECTION, "test-suite");
    const reverted = await getAdminFooterSection();
    expect(reverted.title).toBe("Siddharth Varpe");
  });
});
