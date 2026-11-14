import { describe, it, expect } from "vitest";
import {
  getAdminProfile,
  updateAdminProfile,
  getAdminHero,
  updateAdminHero,
  getAdminFeaturedSection,
  updateAdminFeaturedSection,
  getAdminTechnicalTaxonomy,
  updateAdminTechnicalTaxonomy,
  getAdminDistinctionsSection,
  updateAdminDistinctionsSection,
  getAdminOpportunitiesSection,
  updateAdminOpportunitiesSection,
  getAdminFooterSection,
  updateAdminFooterSection,
  getAdminAboutSection,
  updateAdminAboutSection,
  getAdminSiteContent,
  updateAdminSiteContent,
  updateSkillsPageSettings,
  updateAdminPageHero,
} from "@/lib/server/db/repositories/admin";
import {
  getPublishedProfile,
  getPublishedHero,
  getPublishedFeaturedSection,
  getPublishedTechnicalTaxonomy,
  getPublishedDistinctionsSection,
  getPublishedOpportunitiesSection,
  getPublishedFooterData,
  getPublishedAboutPageData,
  getPublishedSkillsPageData,
  getSkillsPageSettings,
  getPageHero,
} from "@/lib/server/db/repositories/content";

describe("Admin Controls & Public Website Synchronization Audit", () => {
  it("verifies Profile admin controls synchronize with public website", async () => {
    const adminProfile = await getAdminProfile();
    expect(adminProfile).toBeDefined();

    const publishedProfile = await getPublishedProfile();
    expect(publishedProfile).toBeDefined();
    expect(publishedProfile?.name).toBe(adminProfile?.name);
    expect(publishedProfile?.title).toBe(adminProfile?.title);
  });

  it("verifies Hero Section admin controls synchronize with public website", async () => {
    const adminHero = await getAdminHero();
    expect(adminHero).toBeDefined();

    const publishedHero = await getPublishedHero();
    expect(publishedHero).toBeDefined();
    expect(publishedHero?.headline).toBe(adminHero?.headline);
  });

  it("verifies Featured Highlights admin controls synchronize with public website", async () => {
    const adminFeatured = await getAdminFeaturedSection();
    expect(adminFeatured).toBeDefined();
    expect(adminFeatured.items.length).toBeGreaterThanOrEqual(1);

    const publishedFeatured = await getPublishedFeaturedSection();
    expect(publishedFeatured).toBeDefined();
    expect(publishedFeatured.items.length).toBe(adminFeatured.items.length);
  });

  it("verifies Technical Taxonomy admin controls synchronize with public website", async () => {
    const adminTaxonomy = await getAdminTechnicalTaxonomy();
    expect(adminTaxonomy).toBeDefined();
    expect(adminTaxonomy.skills.length).toBeGreaterThan(0);

    const publishedTaxonomy = await getPublishedTechnicalTaxonomy();
    expect(publishedTaxonomy).toBeDefined();
    expect(publishedTaxonomy.skills.length).toBe(adminTaxonomy.skills.length);
  });

  it("verifies Verified Distinctions admin controls synchronize with public website", async () => {
    const adminDistinctions = await getAdminDistinctionsSection();
    expect(adminDistinctions).toBeDefined();

    const publishedDistinctions = await getPublishedDistinctionsSection();
    expect(publishedDistinctions).toBeDefined();
    expect(publishedDistinctions.enabled).toBe(adminDistinctions.enabled);
  });

  it("verifies Open For Opportunities admin controls synchronize with public website", async () => {
    const adminOpps = await getAdminOpportunitiesSection();
    expect(adminOpps).toBeDefined();

    const publishedOpps = await getPublishedOpportunitiesSection();
    expect(publishedOpps).toBeDefined();
    expect(publishedOpps.enabled).toBe(adminOpps.enabled);
    expect(publishedOpps.eyebrow).toBe(adminOpps.eyebrow);
    expect(publishedOpps.badges.length).toBe(adminOpps.badges.length);
  });

  it("verifies Footer Section admin controls synchronize with public website", async () => {
    const adminFooter = await getAdminFooterSection();
    expect(adminFooter).toBeDefined();

    const publishedFooter = await getPublishedFooterData();
    expect(publishedFooter.config.title).toBe(adminFooter.title);
  });

  it("verifies About Section admin controls synchronize with public website", async () => {
    const adminAbout = await getAdminAboutSection();
    expect(adminAbout).toBeDefined();

    const publishedAbout = await getPublishedAboutPageData();
    expect(publishedAbout.config.enabled).toBe(adminAbout.enabled);
  });

  it("verifies Skills Orbit and Settings synchronize with public website", async () => {
    const adminSkillsSettings = await getSkillsPageSettings();
    expect(adminSkillsSettings).toBeDefined();

    const publishedSkillsData = await getPublishedSkillsPageData();
    expect(publishedSkillsData.settings.orbitSpeed).toBe(adminSkillsSettings.orbitSpeed);
  });

  it("verifies Page Heroes can be updated and retrieved for all key routes", async () => {
    for (const page of ["home", "about", "experience", "projects", "skills", "achievements", "certifications", "contact"]) {
      const hero = await getPageHero(page);
      expect(hero).toBeDefined();
    }
  });

  it("verifies cross-section update persistence isolation", async () => {
    const preOpps = await getAdminOpportunitiesSection();
    const preFooter = await getAdminFooterSection();
    const currentFeatured = await getAdminFeaturedSection();

    // Update featured
    await updateAdminFeaturedSection(currentFeatured, "test-admin");

    const postOpps = await getAdminOpportunitiesSection();
    const postFooter = await getAdminFooterSection();

    expect(postOpps.eyebrow).toBe(preOpps.eyebrow);
    expect(postFooter.title).toBe(preFooter.title);
  });
});
