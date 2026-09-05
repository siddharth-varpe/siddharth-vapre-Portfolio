import "server-only";
import {
  getProfileCollection,
  getHeroCollection,
  getAboutCollection,
  getSkillsCollection,
  getExperienceCollection,
  getProjectsCollection,
  getAchievementsCollection,
  getCertificationsCollection,
  getMetricsCollection,
  getContactSettingsCollection,
  getResumesCollection,
  getSeoCollection,
  getSiteContentCollection,
} from "../collections";
import { withDatabaseErrorHandling } from "../errors";
import type {
  ProfileDocument,
  HeroDocument,
  AboutDocument,
  SkillDocument,
  ExperienceDocument,
  ProjectDocument,
  AchievementDocument,
  CertificationDocument,
  MetricDocument,
  ContactSettingsDocument,
  ResumeMetadataDocument,
  SeoMetadataDocument,
  SiteContentDocument,
} from "@/types/models";

const MAX_PUBLIC_LIMIT = 50;

/**
 * Fetch the public developer profile.
 */
export async function getPublishedProfile(): Promise<ProfileDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProfileCollection();
    return collection.findOne({}, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } });
  }, "Failed to retrieve public profile");
}

/**
 * Fetch published hero section data.
 */
export async function getPublishedHero(): Promise<HeroDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getHeroCollection();
    return collection.findOne(
      { status: "published" },
      { projection: { _id: 0, createdAt: 0, updatedAt: 0 } }
    );
  }, "Failed to retrieve hero section");
}

/**
 * Fetch published about section data.
 */
export async function getPublishedAbout(): Promise<AboutDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAboutCollection();
    return collection.findOne(
      { status: "published" },
      { projection: { _id: 0, createdAt: 0, updatedAt: 0 } }
    );
  }, "Failed to retrieve about section");
}

/**
 * Fetch published skills sorted by order ascending.
 */
export async function getPublishedSkills(
  category?: SkillDocument["category"]
): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSkillsCollection();
    const query: Record<string, unknown> = { status: "published" };
    if (category) {
      query.category = category;
    }
    return collection
      .find(query, {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        sort: { order: 1 },
      })
      .toArray();
  }, "Failed to retrieve published skills");
}

/**
 * Fetch published projects with optional featured filter and bounded limit.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProjectDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const query: Record<string, unknown> = { status: "published" };
    if (options?.featuredOnly) {
      query.featured = true;
    }
    const safeLimit = Math.min(Math.max(1, options?.limit ?? MAX_PUBLIC_LIMIT), MAX_PUBLIC_LIMIT);

    return collection
      .find(query, {
        projection: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
          // Exclude full text fields for list queries to minimize payload
          fullDescription: 0,
          decisions: 0,
          challenges: 0,
        },
        sort: { order: 1 },
        limit: safeLimit,
      })
      .toArray() as Promise<ProjectDocument[]>;
  }, "Failed to retrieve published projects");
}

/**
 * Fetch a single published project by its unique slug.
 */
export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    return collection.findOne(
      { slug, status: "published" },
      { projection: { _id: 0, createdAt: 0, updatedAt: 0 } }
    );
  }, "Failed to retrieve project details");
}

/**
 * Fetch published experience timeline items sorted by order ascending.
 */
export async function getPublishedExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getExperienceCollection();
    return collection
      .find(
        { status: "published" },
        {
          projection: { _id: 0, createdAt: 0, updatedAt: 0 },
          sort: { order: 1 },
        }
      )
      .toArray();
  }, "Failed to retrieve published experience");
}

/**
 * Fetch published achievements sorted by order ascending.
 */
export async function getPublishedAchievements(options?: {
  featuredOnly?: boolean;
}): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAchievementsCollection();
    const query: Record<string, unknown> = { status: "published" };
    if (options?.featuredOnly) {
      query.featured = true;
    }
    return collection
      .find(query, {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        sort: { order: 1 },
      })
      .toArray();
  }, "Failed to retrieve published achievements");
}

/**
 * Fetch published certifications sorted by order ascending.
 */
export async function getPublishedCertifications(options?: {
  featuredOnly?: boolean;
}): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getCertificationsCollection();
    const query: Record<string, unknown> = { status: "published" };
    if (options?.featuredOnly) {
      query.featured = true;
    }
    return collection
      .find(query, {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        sort: { order: 1 },
      })
      .toArray();
  }, "Failed to retrieve published certifications");
}

/**
 * Fetch published key metrics sorted by order ascending.
 */
export async function getPublishedMetrics(options?: {
  featuredOnly?: boolean;
}): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMetricsCollection();
    const query: Record<string, unknown> = { status: "published" };
    if (options?.featuredOnly) {
      query.featured = true;
    }
    return collection
      .find(query, {
        projection: { _id: 0, createdAt: 0, updatedAt: 0, evidenceNote: 0 },
        sort: { order: 1 },
      })
      .toArray();
  }, "Failed to retrieve published metrics");
}

/**
 * Fetch public contact settings and social links.
 */
export async function getPublishedContactSettings(): Promise<ContactSettingsDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactSettingsCollection();
    return collection.findOne({}, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } });
  }, "Failed to retrieve contact settings");
}

/**
 * Fetch current active resume metadata for download.
 */
export async function getActiveResume(): Promise<ResumeMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getResumesCollection();
    return collection.findOne(
      { active: true, archived: false, downloadEnabled: true },
      { projection: { _id: 0, createdAt: 0, updatedAt: 0 } }
    );
  }, "Failed to retrieve active resume");
}

/**
 * Fetch global SEO metadata.
 */
export async function getPublishedSeo(): Promise<SeoMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSeoCollection();
    return collection.findOne({}, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } });
  }, "Failed to retrieve SEO metadata");
}

/**
 * Fetch site content elements (footer, global CTA, microcopy).
 */
export async function getPublishedSiteContent(): Promise<SiteContentDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSiteContentCollection();
    return collection.findOne({}, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } });
  }, "Failed to retrieve site content");
}
