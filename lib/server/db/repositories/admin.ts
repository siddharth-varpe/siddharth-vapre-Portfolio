import "server-only";
import { ObjectId, type Filter } from "mongodb";
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
  getRevisionsCollection,
  getActivityLogsCollection,
  getContactMessagesCollection,
  getMediaCollection,
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
  RevisionDocument,
  ActivityLogDocument,
  ContactMessageDocument,
  MediaMetadataDocument,
  ContentStatus,
} from "@/types";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function sanitizePagination(params?: PaginationParams): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Math.floor(params?.page ?? DEFAULT_PAGE));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(params?.limit ?? DEFAULT_LIMIT)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function parseObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId format");
  }
  return new ObjectId(id);
}

// -----------------------------------------------------------------------------
// AUDITING & REVISION HELPERS
// -----------------------------------------------------------------------------

export async function logAdminActivity(
  activity: Omit<ActivityLogDocument, "_id" | "timestamp">
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getActivityLogsCollection();
    await collection.insertOne({
      ...activity,
      timestamp: new Date(),
    });
  }, "Failed to record activity log");
}

export async function recordRevision(
  revision: Omit<RevisionDocument, "_id" | "timestamp">
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getRevisionsCollection();
    await collection.insertOne({
      ...revision,
      timestamp: new Date(),
    });
  }, "Failed to record content revision");
}

// -----------------------------------------------------------------------------
// DASHBOARD STATS AGGREGATION
// -----------------------------------------------------------------------------

export interface DashboardStats {
  counts: {
    projectsTotal: number;
    projectsPublished: number;
    projectsDraft: number;
    projectsArchived: number;
    projectsFeatured: number;
    skills: number;
    experience: number;
    achievements: number;
    certifications: number;
    metrics: number;
    messagesTotal: number;
    messagesUnread: number;
  };
  recentActivity: ActivityLogDocument[];
  recentRevisions: RevisionDocument[];
  lastUpdated: string | null;
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  return withDatabaseErrorHandling(async () => {
    const projectsCol = await getProjectsCollection();
    const skillsCol = await getSkillsCollection();
    const expCol = await getExperienceCollection();
    const achieveCol = await getAchievementsCollection();
    const certCol = await getCertificationsCollection();
    const metricCol = await getMetricsCollection();
    const messagesCol = await getContactMessagesCollection();
    const activityCol = await getActivityLogsCollection();
    const revisionsCol = await getRevisionsCollection();

    // 1. Projects aggregation with single-trip $facet
    const [projectFacet] = await projectsCol
      .aggregate<{
        total: [{ count: number }];
        published: [{ count: number }];
        draft: [{ count: number }];
        archived: [{ count: number }];
        featured: [{ count: number }];
      }>([
        {
          $facet: {
            total: [{ $count: "count" }],
            published: [{ $match: { status: "published" } }, { $count: "count" }],
            draft: [{ $match: { status: "draft" } }, { $count: "count" }],
            archived: [{ $match: { status: "archived" } }, { $count: "count" }],
            featured: [{ $match: { featured: true } }, { $count: "count" }],
          },
        },
      ])
      .toArray();

    // 2. Messages aggregation with single-trip $facet
    const [messageFacet] = await messagesCol
      .aggregate<{
        total: [{ count: number }];
        unread: [{ count: number }];
      }>([
        {
          $facet: {
            total: [{ $count: "count" }],
            unread: [{ $match: { status: "unread" } }, { $count: "count" }],
          },
        },
      ])
      .toArray();

    // 3. Simple counts
    const [skillsCount, expCount, achieveCount, certCount, metricCount] = await Promise.all([
      skillsCol.countDocuments(),
      expCol.countDocuments(),
      achieveCol.countDocuments(),
      certCol.countDocuments(),
      metricCol.countDocuments(),
    ]);

    // 4. Activity & Revisions
    const [recentActivity, recentRevisions] = await Promise.all([
      activityCol.find({}).sort({ timestamp: -1 }).limit(5).toArray(),
      revisionsCol.find({}).sort({ timestamp: -1 }).limit(5).toArray(),
    ]);

    const latestActivity = recentActivity[0]?.timestamp?.toISOString() ?? null;

    return {
      counts: {
        projectsTotal: projectFacet?.total?.[0]?.count ?? 0,
        projectsPublished: projectFacet?.published?.[0]?.count ?? 0,
        projectsDraft: projectFacet?.draft?.[0]?.count ?? 0,
        projectsArchived: projectFacet?.archived?.[0]?.count ?? 0,
        projectsFeatured: projectFacet?.featured?.[0]?.count ?? 0,
        skills: skillsCount,
        experience: expCount,
        achievements: achieveCount,
        certifications: certCount,
        metrics: metricCount,
        messagesTotal: messageFacet?.total?.[0]?.count ?? 0,
        messagesUnread: messageFacet?.unread?.[0]?.count ?? 0,
      },
      recentActivity,
      recentRevisions,
      lastUpdated: latestActivity,
    };
  }, "Failed to retrieve dashboard stats");
}

// -----------------------------------------------------------------------------
// 1. PROFILE SINGLETON
// -----------------------------------------------------------------------------

export async function getAdminProfile(): Promise<ProfileDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProfileCollection();
    return collection.findOne({});
  }, "Failed to retrieve profile");
}

export async function updateAdminProfile(
  data: Omit<ProfileDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ProfileDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProfileCollection();
    const existing = await collection.findOne({});
    const now = new Date();

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: now } }
      );
      await recordRevision({
        contentType: "profile",
        contentId: existing._id.toString(),
        action: "update",
        previousState: existing as unknown as Record<string, unknown>,
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "update_profile",
        category: "content",
        status: "success",
        actor,
        details: { fields: Object.keys(data) },
      });
      return { ...existing, ...data, updatedAt: now };
    } else {
      const newDoc: ProfileDocument = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const res = await collection.insertOne(newDoc);
      await recordRevision({
        contentType: "profile",
        contentId: res.insertedId.toString(),
        action: "create",
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "create_profile",
        category: "content",
        status: "success",
        actor,
      });
      return { ...newDoc, _id: res.insertedId };
    }
  }, "Failed to update profile");
}

// -----------------------------------------------------------------------------
// 2. HERO SINGLETON
// -----------------------------------------------------------------------------

export async function getAdminHero(): Promise<HeroDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getHeroCollection();
    return collection.findOne({});
  }, "Failed to retrieve hero section");
}

export async function updateAdminHero(
  data: Omit<HeroDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<HeroDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getHeroCollection();
    const existing = await collection.findOne({});
    const now = new Date();

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: now } }
      );
      await recordRevision({
        contentType: "hero",
        contentId: existing._id.toString(),
        action: "update",
        previousState: existing as unknown as Record<string, unknown>,
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "update_hero",
        category: "content",
        status: "success",
        actor,
      });
      return { ...existing, ...data, updatedAt: now };
    } else {
      const newDoc: HeroDocument = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const res = await collection.insertOne(newDoc);
      await recordRevision({
        contentType: "hero",
        contentId: res.insertedId.toString(),
        action: "create",
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "create_hero",
        category: "content",
        status: "success",
        actor,
      });
      return { ...newDoc, _id: res.insertedId };
    }
  }, "Failed to update hero section");
}

// -----------------------------------------------------------------------------
// 3. ABOUT SINGLETON
// -----------------------------------------------------------------------------

export async function getAdminAbout(): Promise<AboutDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAboutCollection();
    return collection.findOne({});
  }, "Failed to retrieve about section");
}

export async function updateAdminAbout(
  data: Omit<AboutDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<AboutDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAboutCollection();
    const existing = await collection.findOne({});
    const now = new Date();

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: now } }
      );
      await recordRevision({
        contentType: "about",
        contentId: existing._id.toString(),
        action: "update",
        previousState: existing as unknown as Record<string, unknown>,
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "update_about",
        category: "content",
        status: "success",
        actor,
      });
      return { ...existing, ...data, updatedAt: now };
    } else {
      const newDoc: AboutDocument = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const res = await collection.insertOne(newDoc);
      await recordRevision({
        contentType: "about",
        contentId: res.insertedId.toString(),
        action: "create",
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "create_about",
        category: "content",
        status: "success",
        actor,
      });
      return { ...newDoc, _id: res.insertedId };
    }
  }, "Failed to update about section");
}

// -----------------------------------------------------------------------------
// 4. SKILLS MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminSkills(category?: SkillDocument["category"]): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSkillsCollection();
    const filter: Filter<SkillDocument> = {};
    if (category) {
      filter.category = category;
    }
    return collection.find(filter).sort({ order: 1, updatedAt: -1 }).toArray();
  }, "Failed to retrieve skills");
}

export async function createAdminSkill(
  data: Omit<SkillDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SkillDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSkillsCollection();
    const now = new Date();
    const newDoc: SkillDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await recordRevision({
      contentType: "skill",
      contentId: res.insertedId.toString(),
      action: "create",
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_skill",
      category: "content",
      status: "success",
      actor,
      details: { name: data.name, category: data.category },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create skill");
}

export async function updateAdminSkill(
  id: string,
  data: Partial<Omit<SkillDocument, "_id" | "createdAt" | "updatedAt">>,
  actor: string
): Promise<SkillDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSkillsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await recordRevision({
      contentType: "skill",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_skill",
      category: "content",
      status: "success",
      actor,
      details: { id, name: existing.name },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update skill");
}

export async function deleteAdminSkill(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSkillsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await recordRevision({
      contentType: "skill",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_skill",
      category: "content",
      status: "success",
      actor,
      details: { id, name: existing.name },
    });
    return true;
  }, "Failed to delete skill");
}

// -----------------------------------------------------------------------------
// 5. EXPERIENCE MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getExperienceCollection();
    return collection.find({}).sort({ order: 1, updatedAt: -1 }).toArray();
  }, "Failed to retrieve experience");
}

export async function createAdminExperience(
  data: Omit<ExperienceDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ExperienceDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getExperienceCollection();
    const now = new Date();
    const newDoc: ExperienceDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await recordRevision({
      contentType: "experience",
      contentId: res.insertedId.toString(),
      action: "create",
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_experience",
      category: "content",
      status: "success",
      actor,
      details: { company: data.company, role: data.role },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create experience");
}

export async function updateAdminExperience(
  id: string,
  data: Partial<Omit<ExperienceDocument, "_id" | "createdAt" | "updatedAt">>,
  actor: string
): Promise<ExperienceDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getExperienceCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await recordRevision({
      contentType: "experience",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_experience",
      category: "content",
      status: "success",
      actor,
      details: { id, company: existing.company },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update experience");
}

export async function deleteAdminExperience(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getExperienceCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await recordRevision({
      contentType: "experience",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_experience",
      category: "content",
      status: "success",
      actor,
      details: { id, company: existing.company },
    });
    return true;
  }, "Failed to delete experience");
}

// -----------------------------------------------------------------------------
// 6. PROJECTS MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminProjects(options?: {
  page?: number;
  limit?: number;
  status?: ContentStatus;
  search?: string;
}): Promise<PaginatedResult<ProjectDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<ProjectDocument> = {};
    if (options?.status) {
      filter.status = options.status;
    }
    if (options?.search) {
      filter.$or = [
        { title: { $regex: options.search, $options: "i" } },
        { shortDescription: { $regex: options.search, $options: "i" } },
        { category: { $regex: options.search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve administrative projects");
}

export async function getAdminProjectById(id: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const objId = parseObjectId(id);
    return collection.findOne({ _id: objId });
  }, "Failed to retrieve project by ID");
}

export async function createAdminProject(
  data: Omit<ProjectDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ProjectDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const now = new Date();
    const newDoc: ProjectDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await recordRevision({
      contentType: "project",
      contentId: res.insertedId.toString(),
      action: "create",
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_project",
      category: "content",
      status: "success",
      actor,
      details: { title: data.title, slug: data.slug, status: data.status },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create project");
}

export async function updateAdminProject(
  id: string,
  data: Partial<Omit<ProjectDocument, "_id" | "createdAt" | "updatedAt">>,
  actor: string
): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await recordRevision({
      contentType: "project",
      contentId: id,
      action: data.status && data.status !== existing.status ? (data.status === "published" ? "publish" : "update") : "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_project",
      category: "content",
      status: "success",
      actor,
      details: { id, title: existing.title, newStatus: data.status },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update project");
}

export async function deleteAdminProject(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await recordRevision({
      contentType: "project",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_project",
      category: "content",
      status: "success",
      actor,
      details: { id, title: existing.title },
    });
    return true;
  }, "Failed to delete project");
}

// -----------------------------------------------------------------------------
// 7. ACHIEVEMENTS MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminAchievements(): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAchievementsCollection();
    return collection.find({}).sort({ order: 1, updatedAt: -1 }).toArray();
  }, "Failed to retrieve achievements");
}

export async function createAdminAchievement(
  data: Omit<AchievementDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<AchievementDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAchievementsCollection();
    const now = new Date();
    const newDoc: AchievementDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await recordRevision({
      contentType: "achievement",
      contentId: res.insertedId.toString(),
      action: "create",
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_achievement",
      category: "content",
      status: "success",
      actor,
      details: { title: data.title, organization: data.organization },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create achievement");
}

export async function updateAdminAchievement(
  id: string,
  data: Partial<Omit<AchievementDocument, "_id" | "createdAt" | "updatedAt">>,
  actor: string
): Promise<AchievementDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAchievementsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await recordRevision({
      contentType: "achievement",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_achievement",
      category: "content",
      status: "success",
      actor,
      details: { id, title: existing.title },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update achievement");
}

export async function deleteAdminAchievement(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getAchievementsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await recordRevision({
      contentType: "achievement",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_achievement",
      category: "content",
      status: "success",
      actor,
      details: { id, title: existing.title },
    });
    return true;
  }, "Failed to delete achievement");
}

// -----------------------------------------------------------------------------
// 8. CERTIFICATIONS MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminCertifications(): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getCertificationsCollection();
    return collection.find({}).sort({ order: 1, updatedAt: -1 }).toArray();
  }, "Failed to retrieve certifications");
}

export async function createAdminCertification(
  data: Omit<CertificationDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<CertificationDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getCertificationsCollection();
    const now = new Date();
    const newDoc: CertificationDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await recordRevision({
      contentType: "certification",
      contentId: res.insertedId.toString(),
      action: "create",
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_certification",
      category: "content",
      status: "success",
      actor,
      details: { name: data.name, issuer: data.issuer },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create certification");
}

export async function updateAdminCertification(
  id: string,
  data: Partial<Omit<CertificationDocument, "_id" | "createdAt" | "updatedAt">>,
  actor: string
): Promise<CertificationDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getCertificationsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await recordRevision({
      contentType: "certification",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_certification",
      category: "content",
      status: "success",
      actor,
      details: { id, name: existing.name },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update certification");
}

export async function deleteAdminCertification(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getCertificationsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await recordRevision({
      contentType: "certification",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_certification",
      category: "content",
      status: "success",
      actor,
      details: { id, name: existing.name },
    });
    return true;
  }, "Failed to delete certification");
}

// -----------------------------------------------------------------------------
// 9. METRICS MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminMetrics(): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMetricsCollection();
    return collection.find({}).sort({ order: 1, updatedAt: -1 }).toArray();
  }, "Failed to retrieve metrics");
}

export async function createAdminMetric(
  data: Omit<MetricDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<MetricDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMetricsCollection();
    const now = new Date();
    const newDoc: MetricDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await recordRevision({
      contentType: "metric",
      contentId: res.insertedId.toString(),
      action: "create",
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_metric",
      category: "content",
      status: "success",
      actor,
      details: { label: data.label, value: data.value },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create metric");
}

export async function updateAdminMetric(
  id: string,
  data: Partial<Omit<MetricDocument, "_id" | "createdAt" | "updatedAt">>,
  actor: string
): Promise<MetricDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMetricsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await recordRevision({
      contentType: "metric",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_metric",
      category: "content",
      status: "success",
      actor,
      details: { id, label: existing.label },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update metric");
}

export async function deleteAdminMetric(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMetricsCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await recordRevision({
      contentType: "metric",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_metric",
      category: "content",
      status: "success",
      actor,
      details: { id, label: existing.label },
    });
    return true;
  }, "Failed to delete metric");
}

// -----------------------------------------------------------------------------
// 10. CONTACT / SOCIAL SETTINGS SINGLETON
// -----------------------------------------------------------------------------

export async function getAdminContactSettings(): Promise<ContactSettingsDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactSettingsCollection();
    return collection.findOne({});
  }, "Failed to retrieve contact settings");
}

export async function updateAdminContactSettings(
  data: Omit<ContactSettingsDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ContactSettingsDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactSettingsCollection();
    const existing = await collection.findOne({});
    const now = new Date();

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: now } }
      );
      await recordRevision({
        contentType: "contact_settings",
        contentId: existing._id.toString(),
        action: "update",
        previousState: existing as unknown as Record<string, unknown>,
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "update_contact_settings",
        category: "content",
        status: "success",
        actor,
      });
      return { ...existing, ...data, updatedAt: now };
    } else {
      const newDoc: ContactSettingsDocument = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const res = await collection.insertOne(newDoc);
      await recordRevision({
        contentType: "contact_settings",
        contentId: res.insertedId.toString(),
        action: "create",
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "create_contact_settings",
        category: "content",
        status: "success",
        actor,
      });
      return { ...newDoc, _id: res.insertedId };
    }
  }, "Failed to update contact settings");
}

// -----------------------------------------------------------------------------
// 11. RESUME METADATA MANAGEMENT
// -----------------------------------------------------------------------------

export async function getAdminResumes(): Promise<ResumeMetadataDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getResumesCollection();
    return collection.find({}).sort({ uploadTimestamp: -1 }).toArray();
  }, "Failed to retrieve resume metadata");
}

export async function createAdminResume(
  data: Omit<ResumeMetadataDocument, "_id" | "createdAt" | "updatedAt" | "uploadTimestamp">,
  actor: string
): Promise<ResumeMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getResumesCollection();
    const now = new Date();

    if (data.active) {
      await collection.updateMany({}, { $set: { active: false, updatedAt: now } });
    }

    const newDoc: ResumeMetadataDocument = {
      ...data,
      uploadTimestamp: now,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await logAdminActivity({
      event: "create_resume_metadata",
      category: "content",
      status: "success",
      actor,
      details: { filename: data.filename, version: data.version },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create resume metadata");
}

export async function updateAdminResume(
  id: string,
  data: Partial<Omit<ResumeMetadataDocument, "_id" | "createdAt" | "updatedAt" | "uploadTimestamp">>,
  actor: string
): Promise<ResumeMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getResumesCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    if (data.active) {
      await collection.updateMany({ _id: { $ne: objId } }, { $set: { active: false, updatedAt: now } });
    }

    await collection.updateOne(
      { _id: objId },
      { $set: { ...data, updatedAt: now } }
    );
    await logAdminActivity({
      event: "update_resume_metadata",
      category: "content",
      status: "success",
      actor,
      details: { id, filename: existing.filename },
    });
    return { ...existing, ...data, updatedAt: now };
  }, "Failed to update resume metadata");
}

export async function deleteAdminResume(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getResumesCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await logAdminActivity({
      event: "delete_resume_metadata",
      category: "content",
      status: "success",
      actor,
      details: { id, filename: existing.filename },
    });
    return true;
  }, "Failed to delete resume metadata");
}

// -----------------------------------------------------------------------------
// 12. MEDIA METADATA MANAGEMENT (Phase 5 Boundary)
// -----------------------------------------------------------------------------

export async function getAdminMedia(): Promise<MediaMetadataDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMediaCollection();
    return collection.find({}).sort({ createdAt: -1 }).toArray();
  }, "Failed to retrieve media library metadata");
}

export async function createAdminMedia(
  data: Omit<MediaMetadataDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<MediaMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMediaCollection();
    const now = new Date();
    const newDoc: MediaMetadataDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await collection.insertOne(newDoc);
    await logAdminActivity({
      event: "create_media_metadata",
      category: "media",
      status: "success",
      actor,
      details: { filename: data.filename, category: data.category },
    });
    return { ...newDoc, _id: res.insertedId };
  }, "Failed to create media metadata");
}

export async function deleteAdminMedia(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getMediaCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await logAdminActivity({
      event: "delete_media_metadata",
      category: "media",
      status: "success",
      actor,
      details: { id, filename: existing.filename },
    });
    return true;
  }, "Failed to delete media metadata");
}

// -----------------------------------------------------------------------------
// 13. SEO METADATA SINGLETON
// -----------------------------------------------------------------------------

export async function getAdminSeo(): Promise<SeoMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSeoCollection();
    return collection.findOne({});
  }, "Failed to retrieve SEO metadata");
}

export async function updateAdminSeo(
  data: Omit<SeoMetadataDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SeoMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSeoCollection();
    const existing = await collection.findOne({});
    const now = new Date();

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: now } }
      );
      await recordRevision({
        contentType: "seo",
        contentId: existing._id.toString(),
        action: "update",
        previousState: existing as unknown as Record<string, unknown>,
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "update_seo",
        category: "content",
        status: "success",
        actor,
      });
      return { ...existing, ...data, updatedAt: now };
    } else {
      const newDoc: SeoMetadataDocument = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const res = await collection.insertOne(newDoc);
      await recordRevision({
        contentType: "seo",
        contentId: res.insertedId.toString(),
        action: "create",
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "create_seo",
        category: "content",
        status: "success",
        actor,
      });
      return { ...newDoc, _id: res.insertedId };
    }
  }, "Failed to update SEO metadata");
}

// -----------------------------------------------------------------------------
// 14. SITE CONTENT SINGLETON
// -----------------------------------------------------------------------------

export async function getAdminSiteContent(): Promise<SiteContentDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSiteContentCollection();
    return collection.findOne({});
  }, "Failed to retrieve site content");
}

export async function updateAdminSiteContent(
  data: Omit<SiteContentDocument, "_id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SiteContentDocument> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getSiteContentCollection();
    const existing = await collection.findOne({});
    const now = new Date();

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: now } }
      );
      await recordRevision({
        contentType: "site_content",
        contentId: existing._id.toString(),
        action: "update",
        previousState: existing as unknown as Record<string, unknown>,
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "update_site_content",
        category: "content",
        status: "success",
        actor,
      });
      return { ...existing, ...data, updatedAt: now };
    } else {
      const newDoc: SiteContentDocument = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const res = await collection.insertOne(newDoc);
      await recordRevision({
        contentType: "site_content",
        contentId: res.insertedId.toString(),
        action: "create",
        newState: data as unknown as Record<string, unknown>,
        actor,
      });
      await logAdminActivity({
        event: "create_site_content",
        category: "content",
        status: "success",
        actor,
      });
      return { ...newDoc, _id: res.insertedId };
    }
  }, "Failed to update site content");
}

// -----------------------------------------------------------------------------
// 15. CONTACT MESSAGES INBOX
// -----------------------------------------------------------------------------

export async function getAdminContactMessages(options?: {
  page?: number;
  limit?: number;
  status?: ContactMessageDocument["status"];
}): Promise<PaginatedResult<ContactMessageDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactMessagesCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<ContactMessageDocument> = {};
    if (options?.status) {
      filter.status = options.status;
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve contact messages");
}

export async function updateContactMessageStatus(
  id: string,
  action: "mark-read" | "mark-unread" | "archive",
  actor: string
): Promise<ContactMessageDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactMessagesCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return null;

    const now = new Date();
    const updateFields: Record<string, unknown> = {};

    if (action === "mark-read") {
      updateFields.status = "read";
      updateFields.readAt = now;
    } else if (action === "mark-unread") {
      updateFields.status = "unread";
      updateFields.readAt = null;
    } else if (action === "archive") {
      updateFields.status = "archived";
      updateFields.archivedAt = now;
    }

    await collection.updateOne({ _id: objId }, { $set: updateFields });
    await logAdminActivity({
      event: `message_${action}`,
      category: "content",
      status: "success",
      actor,
      details: { id, sender: existing.name, action },
    });

    return { ...existing, ...updateFields } as ContactMessageDocument;
  }, "Failed to update contact message status");
}

export async function deleteContactMessage(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactMessagesCollection();
    const objId = parseObjectId(id);
    const existing = await collection.findOne({ _id: objId });
    if (!existing) return false;

    await collection.deleteOne({ _id: objId });
    await logAdminActivity({
      event: "delete_contact_message",
      category: "content",
      status: "success",
      actor,
      details: { id, sender: existing.name },
    });
    return true;
  }, "Failed to delete contact message");
}

export const updateAdminContactMessageStatus = updateContactMessageStatus;
export const deleteAdminContactMessage = deleteContactMessage;

// -----------------------------------------------------------------------------
// 16. REVISIONS & RESTORATION
// -----------------------------------------------------------------------------

export async function getAdminRevisions(
  contentId?: string,
  options?: PaginationParams
): Promise<PaginatedResult<RevisionDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getRevisionsCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<RevisionDocument> = {};
    if (contentId) {
      filter.contentId = contentId;
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve document revisions");
}

export async function restoreRevision(revisionId: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const revCol = await getRevisionsCollection();
    const objId = parseObjectId(revisionId);
    const revision = await revCol.findOne({ _id: objId });
    if (!revision) {
      throw new Error("Revision record not found");
    }

    const stateToRestore = revision.previousState || revision.newState;
    if (!stateToRestore) {
      throw new Error("Revision does not contain valid state data to restore");
    }

    const cleanState = { ...stateToRestore };
    delete cleanState._id;
    delete cleanState.createdAt;
    cleanState.updatedAt = new Date();

    const targetId = parseObjectId(revision.contentId);

    switch (revision.contentType) {
      case "profile": {
        const col = await getProfileCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "hero": {
        const col = await getHeroCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "about": {
        const col = await getAboutCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "skill": {
        const col = await getSkillsCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "experience": {
        const col = await getExperienceCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "project": {
        const col = await getProjectsCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "achievement": {
        const col = await getAchievementsCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "certification": {
        const col = await getCertificationsCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "metric": {
        const col = await getMetricsCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "contact_settings": {
        const col = await getContactSettingsCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "seo": {
        const col = await getSeoCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      case "site_content": {
        const col = await getSiteContentCollection();
        await col.updateOne({ _id: targetId }, { $set: cleanState });
        break;
      }
      default:
        throw new Error(`Unsupported content type for revision restoration: ${revision.contentType}`);
    }

    await recordRevision({
      contentType: revision.contentType,
      contentId: revision.contentId,
      action: "update",
      newState: cleanState,
      actor,
    });

    await logAdminActivity({
      event: "restore_revision",
      category: "content",
      status: "success",
      actor,
      details: { revisionId, contentType: revision.contentType, contentId: revision.contentId },
    });

    return true;
  }, "Failed to restore content revision");
}

// -----------------------------------------------------------------------------
// 17. ACTIVITY AUDIT LOGS
// -----------------------------------------------------------------------------

export async function getAdminActivityLogs(options?: {
  page?: number;
  limit?: number;
  category?: ActivityLogDocument["category"];
}): Promise<PaginatedResult<ActivityLogDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getActivityLogsCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<ActivityLogDocument> = {};
    if (options?.category) {
      filter.category = options.category;
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve activity audit logs");
}
