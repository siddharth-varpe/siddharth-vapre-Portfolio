import "server-only";
import { withDatabaseErrorHandling } from "../errors";
import { getStore } from "../store";
import { deleteBlob } from "@/lib/server/storage/blob";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  mapProfileFromDb,
  mapProfileToDb,
  mapHeroFromDb,
  mapHeroToDb,
  mapAboutFromDb,
  mapAboutToDb,
  mapSkillFromDb,
  mapSkillToDb,
  mapExperienceFromDb,
  mapExperienceToDb,
  mapProjectFromDb,
  mapProjectToDb,
  mapAchievementFromDb,
  mapAchievementToDb,
  mapCertificationFromDb,
  mapCertificationToDb,
  mapMetricFromDb,
  mapMetricToDb,
  mapContactSettingsFromDb,
  mapContactSettingsToDb,
  mapResumeFromDb,
  mapResumeToDb,
  mapMediaFromDb,
  mapMediaToDb,
  mapSeoFromDb,
  mapSeoToDb,
  mapSiteContentFromDb,
  mapSiteContentToDb,
  mapContactMessageFromDb,
  mapRevisionFromDb,
  mapActivityLogFromDb,
} from "../mappers";
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
import crypto from "node:crypto";

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

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

// -----------------------------------------------------------------------------
// AUDITING & REVISION HELPERS
// -----------------------------------------------------------------------------

export async function logAdminActivity(
  activity: Omit<ActivityLogDocument, "_id" | "id" | "timestamp">
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("log");
    const timestamp = new Date();
    const doc: ActivityLogDocument = {
      ...activity,
      id,
      _id: id,
      timestamp,
    };
    store.activityLogs.unshift(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbRow = {
        id,
        event: doc.event,
        category: doc.category,
        status: doc.status,
        actor: doc.actor,
        ip_address_masked: doc.ipAddressMasked || null,
        user_agent: doc.userAgent || null,
        details: doc.details || null,
        timestamp: timestamp.toISOString(),
      };
      await supabase.from("activity_logs").insert(dbRow);
    }
  }, "Failed to record activity log");
}

export async function recordRevision(
  revision: Omit<RevisionDocument, "_id" | "id" | "timestamp">
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("rev");
    const timestamp = new Date();
    const doc: RevisionDocument = {
      ...revision,
      id,
      _id: id,
      timestamp,
    };
    store.revisions.unshift(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbRow = {
        id,
        content_type: doc.contentType,
        content_id: doc.contentId,
        action: doc.action,
        previous_state: doc.previousState || null,
        new_state: doc.newState || null,
        actor: doc.actor,
        timestamp: timestamp.toISOString(),
      };
      await supabase.from("revisions").insert(dbRow);
    }
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
    const store = getStore();

    const projectsTotal = store.projects.length;
    const projectsPublished = store.projects.filter((p) => p.status === "published").length;
    const projectsDraft = store.projects.filter((p) => p.status === "draft").length;
    const projectsArchived = store.projects.filter((p) => p.status === "archived").length;
    const projectsFeatured = store.projects.filter((p) => p.featured === true).length;

    const messagesTotal = store.contactMessages.length;
    const messagesUnread = store.contactMessages.filter((m) => m.status === "unread").length;

    const recentActivity = store.activityLogs.slice(0, 5);
    const recentRevisions = store.revisions.slice(0, 5);
    const latestRevision = store.revisions[0]?.timestamp?.toISOString() ?? null;

    return {
      counts: {
        projectsTotal,
        projectsPublished,
        projectsDraft,
        projectsArchived,
        projectsFeatured,
        skills: store.skills.length,
        experience: store.experience.length,
        achievements: store.achievements.length,
        certifications: store.certifications.length,
        metrics: store.metrics.length,
        messagesTotal,
        messagesUnread,
      },
      recentActivity,
      recentRevisions,
      lastUpdated: latestRevision,
    };
  }, "Failed to compile admin dashboard metrics");
}

// -----------------------------------------------------------------------------
// 1. PROFILE
// -----------------------------------------------------------------------------

export async function getAdminProfile(): Promise<ProfileDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return mapProfileFromDb(data);
      }
    }
    const store = getStore();
    return store.profile || null;
  }, "Failed to retrieve profile");
}

export async function updateAdminProfile(
  data: Omit<ProfileDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ProfileDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const existing = store.profile;
    const now = new Date();

    const updated: ProfileDocument = {
      ...existing,
      ...data,
      id: existing?.id || "profile_root",
      _id: existing?._id || "profile_root",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    store.profile = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapProfileToDb(updated);
      await supabase.from("profiles").upsert({ id: updated.id, ...dbPayload });
    }

    await recordRevision({
      contentType: "profile",
      contentId: updated.id!,
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

    return updated;
  }, "Failed to update profile");
}

// -----------------------------------------------------------------------------
// 2. HERO
// -----------------------------------------------------------------------------

export async function getAdminHero(): Promise<HeroDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("heroes").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return mapHeroFromDb(data);
      }
    }
    const store = getStore();
    return store.hero || null;
  }, "Failed to retrieve hero section");
}

export async function updateAdminHero(
  data: Omit<HeroDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<HeroDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const existing = store.hero;
    const now = new Date();

    const updated: HeroDocument = {
      ...existing,
      ...data,
      id: existing?.id || "hero_root",
      _id: existing?._id || "hero_root",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    store.hero = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapHeroToDb(updated);
      await supabase.from("heroes").upsert({ id: updated.id, ...dbPayload });
    }

    await recordRevision({
      contentType: "hero",
      contentId: updated.id!,
      action: data.status && data.status !== existing?.status ? (data.status === "published" ? "publish" : "update") : "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_hero",
      category: "content",
      status: "success",
      actor,
      details: { fields: Object.keys(data) },
    });

    return updated;
  }, "Failed to update hero section");
}

// -----------------------------------------------------------------------------
// 3. ABOUT
// -----------------------------------------------------------------------------

export async function getAdminAbout(): Promise<AboutDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("abouts").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return mapAboutFromDb(data);
      }
    }
    const store = getStore();
    return store.about || null;
  }, "Failed to retrieve about section");
}

export async function updateAdminAbout(
  data: Omit<AboutDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<AboutDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const existing = store.about;
    const now = new Date();

    const updated: AboutDocument = {
      ...existing,
      ...data,
      id: existing?.id || "about_root",
      _id: existing?._id || "about_root",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    store.about = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapAboutToDb(updated);
      await supabase.from("abouts").upsert({ id: updated.id, ...dbPayload });
    }

    await recordRevision({
      contentType: "about",
      contentId: updated.id!,
      action: data.status && data.status !== existing?.status ? (data.status === "published" ? "publish" : "update") : "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_about",
      category: "content",
      status: "success",
      actor,
      details: { fields: Object.keys(data) },
    });

    return updated;
  }, "Failed to update about section");
}

// -----------------------------------------------------------------------------
// 4. SKILLS
// -----------------------------------------------------------------------------

export async function getAdminSkills(category?: SkillDocument["category"]): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase.from("skills").select("*").order("order", { ascending: true });
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(mapSkillFromDb);
      }
    }
    const store = getStore();
    if (category) {
      return store.skills.filter((s) => s.category === category).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return store.skills.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve skills");
}

export async function createAdminSkill(
  data: Omit<SkillDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SkillDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("skill");
    const now = new Date();

    const doc: SkillDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.skills.push(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapSkillToDb(doc);
      await supabase.from("skills").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "skill",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_skill",
      category: "content",
      status: "success",
      actor,
      details: { name: doc.name, category: doc.category },
    });

    return doc;
  }, "Failed to create skill");
}

export async function updateAdminSkill(
  id: string,
  data: Partial<SkillDocument>,
  actor: string
): Promise<SkillDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.skills.findIndex((s) => s.id === id || s._id === id);
    if (idx === -1) return null;

    const existing = store.skills[idx];
    const updated: SkillDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.skills[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapSkillToDb(updated);
      await supabase.from("skills").update(dbPayload).eq("id", id);
    }

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
      details: { id, name: updated.name },
    });

    return updated;
  }, "Failed to update skill");
}

export async function deleteAdminSkill(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.skills.findIndex((s) => s.id === id || s._id === id);
    if (idx === -1) return false;

    const existing = store.skills[idx];
    store.skills.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("skills").delete().eq("id", id);
    }

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
// 5. EXPERIENCE
// -----------------------------------------------------------------------------

export async function getAdminExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("experiences").select("*").order("order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapExperienceFromDb);
      }
    }
    const store = getStore();
    return store.experience.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve experience items");
}

export async function createAdminExperience(
  data: Omit<ExperienceDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ExperienceDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("exp");
    const now = new Date();

    const doc: ExperienceDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.experience.push(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapExperienceToDb(doc);
      await supabase.from("experiences").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "experience",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_experience",
      category: "content",
      status: "success",
      actor,
      details: { role: doc.role, company: doc.company },
    });

    return doc;
  }, "Failed to create experience record");
}

export async function updateAdminExperience(
  id: string,
  data: Partial<ExperienceDocument>,
  actor: string
): Promise<ExperienceDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.experience.findIndex((e) => e.id === id || e._id === id);
    if (idx === -1) return null;

    const existing = store.experience[idx];
    const updated: ExperienceDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.experience[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapExperienceToDb(updated);
      await supabase.from("experiences").update(dbPayload).eq("id", id);
    }

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
      details: { id, company: updated.company },
    });

    return updated;
  }, "Failed to update experience record");
}

export async function deleteAdminExperience(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.experience.findIndex((e) => e.id === id || e._id === id);
    if (idx === -1) return false;

    const existing = store.experience[idx];
    store.experience.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("experiences").delete().eq("id", id);
    }

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
  }, "Failed to delete experience record");
}

// -----------------------------------------------------------------------------
// 6. PROJECTS
// -----------------------------------------------------------------------------

export async function getAdminProjects(options?: {
  status?: ContentStatus;
  featuredOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<ProjectDocument>> {
  return withDatabaseErrorHandling(async () => {
    const { page, limit, skip } = sanitizePagination(options);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase.from("projects").select("*", { count: "exact" }).order("order", { ascending: true });
      if (options?.status) {
        query = query.eq("status", options.status);
      }
      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,short_description.ilike.%${options.search}%`);
      }
      query = query.range(skip, skip + limit - 1);
      const { data, count, error } = await query;
      if (!error && data) {
        const total = count ?? data.length;
        return {
          items: data.map(mapProjectFromDb),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    }

    const store = getStore();
    let filtered = [...store.projects];
    if (options?.status) {
      filtered = filtered.filter((p) => p.status === options.status);
    }
    if (options?.featuredOnly) {
      filtered = filtered.filter((p) => p.featured === true);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.fullDescription && p.fullDescription.toLowerCase().includes(q))
      );
    }
    filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }, "Failed to retrieve projects");
}

export async function getAdminProjectById(id: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      if (!error && data) {
        return mapProjectFromDb(data);
      }
    }
    const store = getStore();
    return store.projects.find((p) => p.id === id || p._id === id) || null;
  }, "Failed to retrieve project details");
}

export async function createAdminProject(
  data: Omit<ProjectDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ProjectDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("proj");
    const now = new Date();

    const doc: ProjectDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.projects.push(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapProjectToDb(doc);
      await supabase.from("projects").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "project",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_project",
      category: "content",
      status: "success",
      actor,
      details: { title: doc.title, slug: doc.slug },
    });

    return doc;
  }, "Failed to create project");
}

export async function updateAdminProject(
  id: string,
  data: Partial<ProjectDocument>,
  actor: string
): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.projects.findIndex((p) => p.id === id || p._id === id);
    if (idx === -1) return null;

    const existing = store.projects[idx];
    const updated: ProjectDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.projects[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapProjectToDb(updated);
      await supabase.from("projects").update(dbPayload).eq("id", id);
    }

    await recordRevision({
      contentType: "project",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_project",
      category: "content",
      status: "success",
      actor,
      details: { id, title: updated.title },
    });

    return updated;
  }, "Failed to update project");
}

export async function deleteAdminProject(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.projects.findIndex((p) => p.id === id || p._id === id);
    if (idx === -1) return false;

    const existing = store.projects[idx];
    store.projects.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("projects").delete().eq("id", id);
    }

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
// 7. ACHIEVEMENTS
// -----------------------------------------------------------------------------

export async function getAdminAchievements(): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("achievements").select("*").order("order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapAchievementFromDb);
      }
    }
    const store = getStore();
    return store.achievements.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve achievements");
}

export async function createAdminAchievement(
  data: Omit<AchievementDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<AchievementDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("ach");
    const now = new Date();

    const doc: AchievementDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.achievements.push(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapAchievementToDb(doc);
      await supabase.from("achievements").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "achievement",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_achievement",
      category: "content",
      status: "success",
      actor,
      details: { title: doc.title },
    });

    return doc;
  }, "Failed to create achievement");
}

export async function updateAdminAchievement(
  id: string,
  data: Partial<AchievementDocument>,
  actor: string
): Promise<AchievementDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.achievements.findIndex((a) => a.id === id || a._id === id);
    if (idx === -1) return null;

    const existing = store.achievements[idx];
    const updated: AchievementDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.achievements[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapAchievementToDb(updated);
      await supabase.from("achievements").update(dbPayload).eq("id", id);
    }

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
      details: { id, title: updated.title },
    });

    return updated;
  }, "Failed to update achievement");
}

export async function deleteAdminAchievement(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.achievements.findIndex((a) => a.id === id || a._id === id);
    if (idx === -1) return false;

    const existing = store.achievements[idx];
    store.achievements.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("achievements").delete().eq("id", id);
    }

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
// 8. CERTIFICATIONS
// -----------------------------------------------------------------------------

export async function getAdminCertifications(): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("certifications").select("*").order("order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapCertificationFromDb);
      }
    }
    const store = getStore();
    return store.certifications.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve certifications");
}

export async function createAdminCertification(
  data: Omit<CertificationDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<CertificationDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("cert");
    const now = new Date();

    const doc: CertificationDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.certifications.push(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapCertificationToDb(doc);
      await supabase.from("certifications").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "certification",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_certification",
      category: "content",
      status: "success",
      actor,
      details: { name: doc.name, issuer: doc.issuer },
    });

    return doc;
  }, "Failed to create certification");
}

export async function updateAdminCertification(
  id: string,
  data: Partial<CertificationDocument>,
  actor: string
): Promise<CertificationDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.certifications.findIndex((c) => c.id === id || c._id === id);
    if (idx === -1) return null;

    const existing = store.certifications[idx];
    const updated: CertificationDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.certifications[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapCertificationToDb(updated);
      await supabase.from("certifications").update(dbPayload).eq("id", id);
    }

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
      details: { id, name: updated.name },
    });

    return updated;
  }, "Failed to update certification");
}

export async function deleteAdminCertification(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.certifications.findIndex((c) => c.id === id || c._id === id);
    if (idx === -1) return false;

    const existing = store.certifications[idx];
    store.certifications.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("certifications").delete().eq("id", id);
    }

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
// 9. METRICS
// -----------------------------------------------------------------------------

export async function getAdminMetrics(): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("metrics").select("*").order("order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapMetricFromDb);
      }
    }
    const store = getStore();
    return store.metrics.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve metrics");
}

export async function createAdminMetric(
  data: Omit<MetricDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<MetricDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("met");
    const now = new Date();

    const doc: MetricDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.metrics.push(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapMetricToDb(doc);
      await supabase.from("metrics").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "metric",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "create_metric",
      category: "content",
      status: "success",
      actor,
      details: { label: doc.label, value: doc.value },
    });

    return doc;
  }, "Failed to create metric");
}

export async function updateAdminMetric(
  id: string,
  data: Partial<MetricDocument>,
  actor: string
): Promise<MetricDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.metrics.findIndex((m) => m.id === id || m._id === id);
    if (idx === -1) return null;

    const existing = store.metrics[idx];
    const updated: MetricDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.metrics[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapMetricToDb(updated);
      await supabase.from("metrics").update(dbPayload).eq("id", id);
    }

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
      details: { id, label: updated.label },
    });

    return updated;
  }, "Failed to update metric");
}

export async function deleteAdminMetric(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.metrics.findIndex((m) => m.id === id || m._id === id);
    if (idx === -1) return false;

    const existing = store.metrics[idx];
    store.metrics.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("metrics").delete().eq("id", id);
    }

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
// 10. CONTACT SETTINGS
// -----------------------------------------------------------------------------

export async function getAdminContactSettings(): Promise<ContactSettingsDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("contact_settings").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return mapContactSettingsFromDb(data);
      }
    }
    const store = getStore();
    return store.contactSettings || null;
  }, "Failed to retrieve contact settings");
}

export async function updateAdminContactSettings(
  data: Omit<ContactSettingsDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<ContactSettingsDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const existing = store.contactSettings;
    const now = new Date();

    const updated: ContactSettingsDocument = {
      ...existing,
      ...data,
      id: existing?.id || "contact_settings_root",
      _id: existing?._id || "contact_settings_root",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    store.contactSettings = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapContactSettingsToDb(updated);
      await supabase.from("contact_settings").upsert({ id: updated.id, ...dbPayload });
    }

    await recordRevision({
      contentType: "contact_settings",
      contentId: updated.id!,
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
      details: { fields: Object.keys(data) },
    });

    return updated;
  }, "Failed to update contact settings");
}

// -----------------------------------------------------------------------------
// 11. RESUMES
// -----------------------------------------------------------------------------

export async function getAdminResumes(): Promise<ResumeMetadataDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("resumes").select("*").order("uploaded_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapResumeFromDb);
      }
    }
    const store = getStore();
    return store.resumes.sort((a, b) => new Date(b.uploadTimestamp).getTime() - new Date(a.uploadTimestamp).getTime());
  }, "Failed to retrieve resumes");
}

export async function createAdminResume(
  data: Omit<ResumeMetadataDocument, "_id" | "id" | "createdAt" | "updatedAt" | "uploadTimestamp"> & {
    uploadTimestamp?: Date;
  },
  actor: string
): Promise<ResumeMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("res");
    const now = new Date();

    if (data.active) {
      store.resumes.forEach((r) => {
        r.active = false;
      });
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("resumes").update({ active: false }).neq("id", id);
      }
    }

    const doc: ResumeMetadataDocument = {
      ...data,
      id,
      _id: id,
      uploadTimestamp: data.uploadTimestamp || now,
      createdAt: now,
      updatedAt: now,
    };
    store.resumes.unshift(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapResumeToDb(doc);
      await supabase.from("resumes").insert({ id, ...dbPayload });
    }

    await recordRevision({
      contentType: "resume",
      contentId: id,
      action: "create",
      newState: doc as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "upload_resume",
      category: "content",
      status: "success",
      actor,
      details: { filename: doc.filename, version: doc.version },
    });

    return doc;
  }, "Failed to create resume record");
}

export async function updateAdminResume(
  id: string,
  data: Partial<ResumeMetadataDocument>,
  actor: string
): Promise<ResumeMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.resumes.findIndex((r) => r.id === id || r._id === id);
    if (idx === -1) return null;

    if (data.active) {
      store.resumes.forEach((r) => {
        if (r.id !== id && r._id !== id) r.active = false;
      });
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("resumes").update({ active: false }).neq("id", id);
      }
    }

    const existing = store.resumes[idx];
    const updated: ResumeMetadataDocument = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    store.resumes[idx] = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapResumeToDb(updated);
      await supabase.from("resumes").update(dbPayload).eq("id", id);
    }

    await recordRevision({
      contentType: "resume",
      contentId: id,
      action: "update",
      previousState: existing as unknown as Record<string, unknown>,
      newState: data as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "update_resume",
      category: "content",
      status: "success",
      actor,
      details: { id, version: updated.version },
    });

    return updated;
  }, "Failed to update resume record");
}

export async function deleteAdminResume(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.resumes.findIndex((r) => r.id === id || r._id === id);
    if (idx === -1) return false;

    const existing = store.resumes[idx];
    if (existing.storageUrl) {
      try {
        await deleteBlob(existing.storageUrl);
      } catch (err) {
        console.error("Failed to delete blob from storage:", err);
      }
    }

    store.resumes.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("resumes").delete().eq("id", id);
    }

    await recordRevision({
      contentType: "resume",
      contentId: id,
      action: "delete",
      previousState: existing as unknown as Record<string, unknown>,
      actor,
    });
    await logAdminActivity({
      event: "delete_resume",
      category: "content",
      status: "success",
      actor,
      details: { id, filename: existing.filename },
    });

    return true;
  }, "Failed to delete resume record");
}

// -----------------------------------------------------------------------------
// 12. MEDIA
// -----------------------------------------------------------------------------

export async function getAdminMedia(): Promise<MediaMetadataDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapMediaFromDb);
      }
    }
    const store = getStore();
    return store.media;
  }, "Failed to retrieve media library");
}

export async function createAdminMedia(
  data: Omit<MediaMetadataDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<MediaMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const id = generateId("med");
    const now = new Date();

    const doc: MediaMetadataDocument = {
      ...data,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    store.media.unshift(doc);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapMediaToDb(doc);
      await supabase.from("media").insert({ id, ...dbPayload });
    }

    await logAdminActivity({
      event: "upload_media",
      category: "media",
      status: "success",
      actor,
      details: { id, filename: doc.filename, mimeType: doc.mimeType },
    });

    return doc;
  }, "Failed to create media metadata");
}

export async function createAdminMediaWithAssociation(
  data: Omit<MediaMetadataDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<MediaMetadataDocument> {
  return await createAdminMedia(data, actor);
}

export async function deleteAdminMedia(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.media.findIndex((m) => m.id === id || m._id === id);
    if (idx === -1) return false;

    const existing = store.media[idx];
    if (existing.storageKey) {
      try {
        await deleteBlob(existing.storageKey);
      } catch (err) {
        console.error("Failed to delete blob from Vercel storage:", err);
      }
    }

    store.media.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("media").delete().eq("id", id);
    }

    await logAdminActivity({
      event: "delete_media",
      category: "media",
      status: "success",
      actor,
      details: { id, filename: existing.filename },
    });

    return true;
  }, "Failed to delete media asset");
}

// -----------------------------------------------------------------------------
// 13. SEO METADATA
// -----------------------------------------------------------------------------

export async function getAdminSeo(): Promise<SeoMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("seo").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return mapSeoFromDb(data);
      }
    }
    const store = getStore();
    return store.seo || null;
  }, "Failed to retrieve SEO configuration");
}

export async function updateAdminSeo(
  data: Omit<SeoMetadataDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SeoMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const existing = store.seo;
    const now = new Date();

    const updated: SeoMetadataDocument = {
      ...existing,
      ...data,
      id: existing?.id || "seo_root",
      _id: existing?._id || "seo_root",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    store.seo = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapSeoToDb(updated);
      await supabase.from("seo").upsert({ id: updated.id, ...dbPayload });
    }

    await recordRevision({
      contentType: "seo",
      contentId: updated.id!,
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
      details: { fields: Object.keys(data) },
    });

    return updated;
  }, "Failed to update SEO configuration");
}

// -----------------------------------------------------------------------------
// 14. SITE CONTENT
// -----------------------------------------------------------------------------

export async function getAdminSiteContent(): Promise<SiteContentDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from("site_content").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return mapSiteContentFromDb(data);
      }
    }
    const store = getStore();
    return store.siteContent || null;
  }, "Failed to retrieve site content elements");
}

export async function updateAdminSiteContent(
  data: Omit<SiteContentDocument, "_id" | "id" | "createdAt" | "updatedAt">,
  actor: string
): Promise<SiteContentDocument> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const existing = store.siteContent;
    const now = new Date();

    const updated: SiteContentDocument = {
      ...existing,
      ...data,
      id: existing?.id || "site_content_root",
      _id: existing?._id || "site_content_root",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    store.siteContent = updated;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = mapSiteContentToDb(updated);
      await supabase.from("site_content").upsert({ id: updated.id, ...dbPayload });
    }

    await recordRevision({
      contentType: "site_content",
      contentId: updated.id!,
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
      details: { fields: Object.keys(data) },
    });

    return updated;
  }, "Failed to update site content");
}

// -----------------------------------------------------------------------------
// 15. CONTACT MESSAGES
// -----------------------------------------------------------------------------

export async function getAdminContactMessages(options?: {
  status?: ContactMessageDocument["status"];
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<ContactMessageDocument>> {
  return withDatabaseErrorHandling(async () => {
    const { page, limit, skip } = sanitizePagination(options);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase.from("contact_messages").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (options?.status) {
        query = query.eq("status", options.status);
      }
      query = query.range(skip, skip + limit - 1);
      const { data, count, error } = await query;
      if (!error && data) {
        const total = count ?? data.length;
        return {
          items: data.map(mapContactMessageFromDb),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    }

    const store = getStore();
    let filtered = [...store.contactMessages];
    if (options?.status) {
      filtered = filtered.filter((m) => m.status === options.status);
    }
    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }, "Failed to retrieve contact inquiries");
}

export async function updateContactMessageStatus(
  id: string,
  action: "mark-read" | "mark-unread" | "archive",
  actor: string
): Promise<ContactMessageDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const msg = store.contactMessages.find((m) => m.id === id || m._id === id);
    if (!msg) return null;

    const now = new Date();
    const dbUpdate: Record<string, unknown> = {};

    if (action === "mark-read") {
      msg.status = "read";
      msg.readAt = now;
      dbUpdate.status = "read";
      dbUpdate.read_at = now.toISOString();
    } else if (action === "mark-unread") {
      msg.status = "unread";
      msg.readAt = undefined;
      dbUpdate.status = "unread";
      dbUpdate.read_at = null;
    } else if (action === "archive") {
      msg.status = "archived";
      msg.archivedAt = now;
      dbUpdate.status = "archived";
      dbUpdate.archived_at = now.toISOString();
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("contact_messages").update(dbUpdate).eq("id", id);
    }

    await logAdminActivity({
      event: `message_${action}`,
      category: "content",
      status: "success",
      actor,
      details: { id, sender: msg.name, action },
    });

    return msg;
  }, "Failed to update contact message status");
}

export async function deleteContactMessage(id: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const idx = store.contactMessages.findIndex((m) => m.id === id || m._id === id);
    if (idx === -1) return false;

    const existing = store.contactMessages[idx];
    store.contactMessages.splice(idx, 1);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("contact_messages").delete().eq("id", id);
    }

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
    const { page, limit, skip } = sanitizePagination(options);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase.from("revisions").select("*", { count: "exact" }).order("timestamp", { ascending: false });
      if (contentId) {
        query = query.eq("content_id", contentId);
      }
      query = query.range(skip, skip + limit - 1);
      const { data, count, error } = await query;
      if (!error && data) {
        const total = count ?? data.length;
        return {
          items: data.map(mapRevisionFromDb),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    }

    const store = getStore();
    let filtered = [...store.revisions];
    if (contentId) {
      filtered = filtered.filter((r) => r.contentId === contentId);
    }

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }, "Failed to retrieve document revisions");
}

export async function restoreRevision(revisionId: string, actor: string): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const store = getStore();
    const revision = store.revisions.find((r) => r.id === revisionId || r._id === revisionId);
    if (!revision) {
      throw new Error("Revision record not found");
    }

    const stateToRestore = revision.previousState || revision.newState;
    if (!stateToRestore) {
      throw new Error("Revision does not contain valid state data to restore");
    }

    const cleanState = { ...stateToRestore };
    delete cleanState._id;
    delete cleanState.id;
    delete cleanState.createdAt;
    cleanState.updatedAt = new Date();

    switch (revision.contentType) {
      case "profile":
        Object.assign(store.profile, cleanState);
        break;
      case "hero":
        Object.assign(store.hero, cleanState);
        break;
      case "about":
        Object.assign(store.about, cleanState);
        break;
      case "skill": {
        const item = store.skills.find((s) => s.id === revision.contentId || s._id === revision.contentId);
        if (item) Object.assign(item, cleanState);
        break;
      }
      case "experience": {
        const item = store.experience.find((e) => e.id === revision.contentId || e._id === revision.contentId);
        if (item) Object.assign(item, cleanState);
        break;
      }
      case "project": {
        const item = store.projects.find((p) => p.id === revision.contentId || p._id === revision.contentId);
        if (item) Object.assign(item, cleanState);
        break;
      }
      case "achievement": {
        const item = store.achievements.find((a) => a.id === revision.contentId || a._id === revision.contentId);
        if (item) Object.assign(item, cleanState);
        break;
      }
      case "certification": {
        const item = store.certifications.find((c) => c.id === revision.contentId || c._id === revision.contentId);
        if (item) Object.assign(item, cleanState);
        break;
      }
      case "metric": {
        const item = store.metrics.find((m) => m.id === revision.contentId || m._id === revision.contentId);
        if (item) Object.assign(item, cleanState);
        break;
      }
      case "contact_settings":
        Object.assign(store.contactSettings, cleanState);
        break;
      case "seo":
        Object.assign(store.seo, cleanState);
        break;
      case "site_content":
        Object.assign(store.siteContent, cleanState);
        break;
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
    const { page, limit, skip } = sanitizePagination(options);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase.from("activity_logs").select("*", { count: "exact" }).order("timestamp", { ascending: false });
      if (options?.category) {
        query = query.eq("category", options.category);
      }
      query = query.range(skip, skip + limit - 1);
      const { data, count, error } = await query;
      if (!error && data) {
        const total = count ?? data.length;
        return {
          items: data.map(mapActivityLogFromDb),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    }

    const store = getStore();
    let filtered = [...store.activityLogs];
    if (options?.category) {
      filtered = filtered.filter((a) => a.category === options.category);
    }

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }, "Failed to retrieve activity audit logs");
}
