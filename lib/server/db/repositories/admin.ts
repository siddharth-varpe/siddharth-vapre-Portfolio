import "server-only";
import { withDatabaseErrorHandling } from "../errors";
import { adminDb } from "@/lib/firebase/admin";
import { deleteFileFromStorage } from "@/lib/firebase/storage";
import type { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
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

export function sanitizePagination(params?: PaginationParams): { page: number; limit: number; offset: number } {
  const page = Math.max(1, Math.floor(params?.page ?? DEFAULT_PAGE));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(params?.limit ?? DEFAULT_LIMIT)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

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
    resumes: number;
    media: number;
    messagesTotal: number;
    messagesUnread: number;
  };
  recentActivity: ActivityLogDocument[];
  recentRevisions: RevisionDocument[];
  latestRevision: string | null;
}

// ---------------------------------------------------------------------------
// Audit & Revision Logging
// ---------------------------------------------------------------------------

export async function logAdminActivity(
  event: string,
  category: "auth" | "content" | "media" | "security" | "system" = "content",
  status: "success" | "failure" | "warning" = "success",
  actor: string = "admin",
  details: Record<string, unknown> = {},
  ipAddressMasked?: string,
  userAgent?: string
): Promise<void> {
  try {
    const id = `log_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const logDoc: ActivityLogDocument = {
      id,
      _id: id,
      event,
      category,
      status,
      actor,
      ipAddressMasked,
      userAgent,
      details,
      timestamp: new Date(),
    };
    await adminDb.collection("activityLogs").doc(id).set(logDoc);
  } catch (err) {
    console.warn("[Activity Log Error]: Failed to persist activity log to Firestore:", err);
  }
}

export async function recordRevision(
  contentType: string,
  contentId: string,
  previousState: Record<string, unknown> | null | undefined,
  newState: Record<string, unknown> | null | undefined,
  actor: string = "admin",
  action: "create" | "update" | "delete" | "publish" | "archive" = "update"
): Promise<void> {
  try {
    const id = `rev_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const revDoc: RevisionDocument = {
      id,
      _id: id,
      contentType,
      contentId,
      action,
      previousState: previousState ? (JSON.parse(JSON.stringify(previousState)) as Record<string, unknown>) : undefined,
      newState: (newState ? JSON.parse(JSON.stringify(newState)) : {}) as Record<string, unknown>,
      actor,
      timestamp: new Date(),
    };
    await adminDb.collection("revisions").doc(id).set(revDoc);
  } catch (err) {
    console.warn("[Revision Error]: Failed to record revision to Firestore:", err);
  }
}

// ---------------------------------------------------------------------------
// Dashboard Statistics
// ---------------------------------------------------------------------------

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  return withDatabaseErrorHandling(async () => {
    // 1. Projects Breakdown
    const projectsSnap = await adminDb.collection("projects").get();
    const projects = projectsSnap.docs.map((d: QueryDocumentSnapshot) => d.data());
    const projectsTotal = projects.length;
    const projectsPublished = projects.filter((p: Record<string, unknown>) => p.status === "published").length;
    const projectsDraft = projects.filter((p: Record<string, unknown>) => p.status === "draft").length;
    const projectsArchived = projects.filter((p: Record<string, unknown>) => p.status === "archived").length;
    const projectsFeatured = projects.filter((p: Record<string, unknown>) => p.featured === true).length;

    // 2. Collection counts
    const [skillsSnap, expSnap, achSnap, certSnap, metricSnap, resumeSnap, mediaSnap, msgSnap] =
      await Promise.all([
        adminDb.collection("skills").count().get(),
        adminDb.collection("experience").count().get(),
        adminDb.collection("achievements").count().get(),
        adminDb.collection("certifications").count().get(),
        adminDb.collection("metrics").count().get(),
        adminDb.collection("resumes").count().get(),
        adminDb.collection("media").count().get(),
        adminDb.collection("contactMessages").get(),
      ]);

    const messages = msgSnap.docs.map((d: QueryDocumentSnapshot) => d.data());
    const messagesTotal = messages.length;
    const messagesUnread = messages.filter((m: Record<string, unknown>) => m.status === "unread").length;

    // 3. Recent Activity & Revisions
    const [activitySnap, revisionSnap] = await Promise.all([
      adminDb.collection("activityLogs").orderBy("timestamp", "desc").limit(5).get(),
      adminDb.collection("revisions").orderBy("timestamp", "desc").limit(5).get(),
    ]);

    const recentActivity = activitySnap.docs.map((d: QueryDocumentSnapshot) => mapActivityLogFromDb(d.data(), d.id));
    const recentRevisions = revisionSnap.docs.map((d: QueryDocumentSnapshot) => mapRevisionFromDb(d.data(), d.id));
    const latestRevision = recentRevisions[0]?.timestamp?.toISOString() ?? null;

    return {
      counts: {
        projectsTotal,
        projectsPublished,
        projectsDraft,
        projectsArchived,
        projectsFeatured,
        skills: skillsSnap.data().count,
        experience: expSnap.data().count,
        achievements: achSnap.data().count,
        certifications: certSnap.data().count,
        metrics: metricSnap.data().count,
        resumes: resumeSnap.data().count,
        media: mediaSnap.data().count,
        messagesTotal,
        messagesUnread,
      },
      recentActivity,
      recentRevisions,
      latestRevision,
    };
  }, "Failed to retrieve admin dashboard stats from Cloud Firestore");
}

// ---------------------------------------------------------------------------
// 1. Profile Domain
// ---------------------------------------------------------------------------

export async function getAdminProfile(): Promise<ProfileDocument> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("profiles").doc("profile_root").get();
    if (snap.exists) {
      return mapProfileFromDb(snap.data(), snap.id);
    }
    return mapProfileFromDb({}, "profile_root");
  }, "Failed to retrieve admin profile");
}

export async function updateAdminProfile(
  data: Partial<ProfileDocument>,
  author: string = "admin"
): Promise<ProfileDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("profiles").doc("profile_root");
    const prevSnap = await ref.get();
    const prevData = prevSnap.exists ? prevSnap.data() : null;

    const payload = mapProfileToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapProfileFromDb(updatedSnap.data(), updatedSnap.id);

    await recordRevision("profile", "profile_root", prevData, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("profile_update", "content", "success", author, { updatedFields: Object.keys(data) });

    return updated;
  }, "Failed to update profile");
}

// ---------------------------------------------------------------------------
// 2. Hero Domain
// ---------------------------------------------------------------------------

export async function getAdminHero(): Promise<HeroDocument> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("hero").doc("hero_root").get();
    if (snap.exists) {
      return mapHeroFromDb(snap.data(), snap.id);
    }
    return mapHeroFromDb({}, "hero_root");
  }, "Failed to retrieve hero section");
}

export async function updateAdminHero(
  data: Partial<HeroDocument>,
  author: string = "admin"
): Promise<HeroDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("hero").doc("hero_root");
    const prevSnap = await ref.get();
    const prevData = prevSnap.exists ? prevSnap.data() : null;

    const payload = mapHeroToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapHeroFromDb(updatedSnap.data(), updatedSnap.id);

    await recordRevision("hero", "hero_root", prevData, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("hero_update", "content", "success", author, { updatedFields: Object.keys(data) });

    return updated;
  }, "Failed to update hero section");
}

// ---------------------------------------------------------------------------
// 3. About Domain
// ---------------------------------------------------------------------------

export async function getAdminAbout(): Promise<AboutDocument> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("about").doc("about_root").get();
    if (snap.exists) {
      return mapAboutFromDb(snap.data(), snap.id);
    }
    return mapAboutFromDb({}, "about_root");
  }, "Failed to retrieve about section");
}

export async function updateAdminAbout(
  data: Partial<AboutDocument>,
  author: string = "admin"
): Promise<AboutDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("about").doc("about_root");
    const prevSnap = await ref.get();
    const prevData = prevSnap.exists ? prevSnap.data() : null;

    const payload = mapAboutToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapAboutFromDb(updatedSnap.data(), updatedSnap.id);

    await recordRevision("about", "about_root", prevData, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("about_update", "content", "success", author, { updatedFields: Object.keys(data) });

    return updated;
  }, "Failed to update about section");
}

// ---------------------------------------------------------------------------
// 4. Skills Domain
// ---------------------------------------------------------------------------

export async function getAdminSkills(category?: SkillDocument["category"]): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    let query: Query = adminDb.collection("skills");
    if (category) {
      query = query.where("category", "==", category);
    }
    const snap = await query.orderBy("order", "asc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapSkillFromDb(doc.data(), doc.id));
  }, "Failed to retrieve skills");
}

export async function createAdminSkill(
  data: Omit<SkillDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<SkillDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `skill_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapSkillToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("skills").doc(id).set(payload);
    const created = mapSkillFromDb(payload, id);

    await recordRevision("skill", id, null, payload, author, "create");
    await logAdminActivity("skill_create", "content", "success", author, { name: data.name });

    return created;
  }, "Failed to create skill");
}

export async function updateAdminSkill(
  id: string,
  data: Partial<SkillDocument>,
  author: string = "admin"
): Promise<SkillDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("skills").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Skill with ID ${id} not found.`);

    const payload = mapSkillToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapSkillFromDb(updatedSnap.data(), id);

    await recordRevision("skill", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("skill_update", "content", "success", author, { name: updated.name });

    return updated;
  }, "Failed to update skill");
}

export async function deleteAdminSkill(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("skills").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await recordRevision("skill", id, snap.data() || null, {}, author, "delete");
    await logAdminActivity("skill_delete", "content", "success", author, { name: snap.data()?.name });
    return true;
  }, "Failed to delete skill");
}

// ---------------------------------------------------------------------------
// 5. Experience Domain
// ---------------------------------------------------------------------------

export async function getAdminExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("experience").orderBy("order", "asc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapExperienceFromDb(doc.data(), doc.id));
  }, "Failed to retrieve experience records");
}

export async function createAdminExperience(
  data: Omit<ExperienceDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<ExperienceDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `exp_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapExperienceToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("experience").doc(id).set(payload);
    const created = mapExperienceFromDb(payload, id);

    await recordRevision("experience", id, null, payload, author, "create");
    await logAdminActivity("experience_create", "content", "success", author, { role: data.role, company: data.company });

    return created;
  }, "Failed to create experience record");
}

export async function updateAdminExperience(
  id: string,
  data: Partial<ExperienceDocument>,
  author: string = "admin"
): Promise<ExperienceDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("experience").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Experience record with ID ${id} not found.`);

    const payload = mapExperienceToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapExperienceFromDb(updatedSnap.data(), id);

    await recordRevision("experience", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("experience_update", "content", "success", author, { role: updated.role, company: updated.company });

    return updated;
  }, "Failed to update experience record");
}

export async function deleteAdminExperience(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("experience").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await recordRevision("experience", id, snap.data() || null, {}, author, "delete");
    await logAdminActivity("experience_delete", "content", "success", author, { role: snap.data()?.role });
    return true;
  }, "Failed to delete experience record");
}

// ---------------------------------------------------------------------------
// 6. Projects Domain
// ---------------------------------------------------------------------------

export async function getAdminProjects(
  params?: PaginationParams & { status?: ContentStatus; search?: string }
): Promise<PaginatedResult<ProjectDocument>> {
  return withDatabaseErrorHandling(async () => {
    const { page, limit, offset } = sanitizePagination(params);

    let query: Query = adminDb.collection("projects");
    if (params?.status) {
      query = query.where("status", "==", params.status);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query.orderBy("order", "asc").offset(offset).limit(limit).get();
    let items = snap.docs.map((doc: QueryDocumentSnapshot) => mapProjectFromDb(doc.data(), doc.id));

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (p: ProjectDocument) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }

    const totalPages = Math.ceil(total / limit) || 1;
    return { items, total, page, limit, totalPages };
  }, "Failed to retrieve admin projects");
}

export async function getAdminProjectById(id: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("projects").doc(id).get();
    if (!snap.exists) return null;
    return mapProjectFromDb(snap.data(), snap.id);
  }, `Failed to retrieve project ${id}`);
}

export async function createAdminProject(
  data: Omit<ProjectDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<ProjectDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `proj_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapProjectToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("projects").doc(id).set(payload);
    const created = mapProjectFromDb(payload, id);

    await recordRevision("project", id, null, payload, author, "create");
    await logAdminActivity("project_create", "content", "success", author, { title: data.title, slug: data.slug });

    return created;
  }, "Failed to create project");
}

export async function updateAdminProject(
  id: string,
  data: Partial<ProjectDocument>,
  author: string = "admin"
): Promise<ProjectDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("projects").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Project with ID ${id} not found.`);

    const payload = mapProjectToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapProjectFromDb(updatedSnap.data(), id);

    await recordRevision("project", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("project_update", "content", "success", author, { title: updated.title });

    return updated;
  }, "Failed to update project");
}

export async function deleteAdminProject(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("projects").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await recordRevision("project", id, snap.data() || null, {}, author, "delete");
    await logAdminActivity("project_delete", "content", "success", author, { title: snap.data()?.title });
    return true;
  }, "Failed to delete project");
}

// ---------------------------------------------------------------------------
// 7. Achievements Domain
// ---------------------------------------------------------------------------

export async function getAdminAchievements(): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("achievements").orderBy("order", "asc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapAchievementFromDb(doc.data(), doc.id));
  }, "Failed to retrieve achievements");
}

export async function createAdminAchievement(
  data: Omit<AchievementDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<AchievementDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `ach_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapAchievementToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("achievements").doc(id).set(payload);
    const created = mapAchievementFromDb(payload, id);

    await recordRevision("achievement", id, null, payload, author, "create");
    await logAdminActivity("achievement_create", "content", "success", author, { title: data.title });

    return created;
  }, "Failed to create achievement");
}

export async function updateAdminAchievement(
  id: string,
  data: Partial<AchievementDocument>,
  author: string = "admin"
): Promise<AchievementDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("achievements").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Achievement with ID ${id} not found.`);

    const payload = mapAchievementToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapAchievementFromDb(updatedSnap.data(), id);

    await recordRevision("achievement", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("achievement_update", "content", "success", author, { title: updated.title });

    return updated;
  }, "Failed to update achievement");
}

export async function deleteAdminAchievement(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("achievements").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await recordRevision("achievement", id, snap.data() || null, {}, author, "delete");
    await logAdminActivity("achievement_delete", "content", "success", author, { title: snap.data()?.title });
    return true;
  }, "Failed to delete achievement");
}

// ---------------------------------------------------------------------------
// 8. Certifications Domain
// ---------------------------------------------------------------------------

export async function getAdminCertifications(): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("certifications").orderBy("order", "asc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapCertificationFromDb(doc.data(), doc.id));
  }, "Failed to retrieve certifications");
}

export async function createAdminCertification(
  data: Omit<CertificationDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<CertificationDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `cert_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapCertificationToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("certifications").doc(id).set(payload);
    const created = mapCertificationFromDb(payload, id);

    await recordRevision("certification", id, null, payload, author, "create");
    await logAdminActivity("certification_create", "content", "success", author, { name: data.name });

    return created;
  }, "Failed to create certification");
}

export async function updateAdminCertification(
  id: string,
  data: Partial<CertificationDocument>,
  author: string = "admin"
): Promise<CertificationDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("certifications").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Certification with ID ${id} not found.`);

    const payload = mapCertificationToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapCertificationFromDb(updatedSnap.data(), id);

    await recordRevision("certification", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("certification_update", "content", "success", author, { name: updated.name });

    return updated;
  }, "Failed to update certification");
}

export async function deleteAdminCertification(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("certifications").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await recordRevision("certification", id, snap.data() || null, {}, author, "delete");
    await logAdminActivity("certification_delete", "content", "success", author, { name: snap.data()?.name });
    return true;
  }, "Failed to delete certification");
}

// ---------------------------------------------------------------------------
// 9. Metrics Domain
// ---------------------------------------------------------------------------

export async function getAdminMetrics(): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("metrics").orderBy("order", "asc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapMetricFromDb(doc.data(), doc.id));
  }, "Failed to retrieve metrics");
}

export async function createAdminMetric(
  data: Omit<MetricDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<MetricDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `metric_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapMetricToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("metrics").doc(id).set(payload);
    const created = mapMetricFromDb(payload, id);

    await recordRevision("metric", id, null, payload, author, "create");
    await logAdminActivity("metric_create", "content", "success", author, { label: data.label, value: data.value });

    return created;
  }, "Failed to create metric");
}

export async function updateAdminMetric(
  id: string,
  data: Partial<MetricDocument>,
  author: string = "admin"
): Promise<MetricDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("metrics").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Metric with ID ${id} not found.`);

    const payload = mapMetricToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapMetricFromDb(updatedSnap.data(), id);

    await recordRevision("metric", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("metric_update", "content", "success", author, { label: updated.label });

    return updated;
  }, "Failed to update metric");
}

export async function deleteAdminMetric(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("metrics").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await recordRevision("metric", id, snap.data() || null, {}, author, "delete");
    await logAdminActivity("metric_delete", "content", "success", author, { label: snap.data()?.label });
    return true;
  }, "Failed to delete metric");
}

// ---------------------------------------------------------------------------
// 10. Contact Settings Domain
// ---------------------------------------------------------------------------

export async function getAdminContactSettings(): Promise<ContactSettingsDocument> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("contactSettings").doc("contact_settings_root").get();
    if (snap.exists) {
      return mapContactSettingsFromDb(snap.data(), snap.id);
    }
    return mapContactSettingsFromDb({}, "contact_settings_root");
  }, "Failed to retrieve contact settings");
}

export async function updateAdminContactSettings(
  data: Partial<ContactSettingsDocument>,
  author: string = "admin"
): Promise<ContactSettingsDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("contactSettings").doc("contact_settings_root");
    const prevSnap = await ref.get();
    const prevData = prevSnap.exists ? prevSnap.data() : null;

    const payload = mapContactSettingsToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapContactSettingsFromDb(updatedSnap.data(), updatedSnap.id);

    await recordRevision("contactSettings", "contact_settings_root", prevData, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("contact_settings_update", "content", "success", author, { updatedFields: Object.keys(data) });

    return updated;
  }, "Failed to update contact settings");
}

// ---------------------------------------------------------------------------
// 11. Resumes Domain
// ---------------------------------------------------------------------------

export async function getAdminResumes(): Promise<ResumeMetadataDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("resumes").orderBy("createdAt", "desc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapResumeFromDb(doc.data(), doc.id));
  }, "Failed to retrieve resumes");
}

export async function createAdminResume(
  data: {
    filename: string;
    storageUrl: string;
    version: string;
    active?: boolean;
    archived?: boolean;
    downloadEnabled?: boolean;
    fileSizeBytes?: number;
    storagePath?: string;
  },
  author: string = "admin"
): Promise<ResumeMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `resume_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      filename: data.filename,
      storageUrl: data.storageUrl,
      storagePath: data.storagePath,
      version: data.version,
      active: data.active !== undefined ? Boolean(data.active) : true,
      archived: Boolean(data.archived),
      downloadEnabled: data.downloadEnabled !== undefined ? Boolean(data.downloadEnabled) : true,
      fileSizeBytes: data.fileSizeBytes,
      id,
      _id: id,
      uploadTimestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("resumes").doc(id).set(payload);
    const created = mapResumeFromDb(payload, id);

    await recordRevision("resume", id, null, payload, author, "create");
    await logAdminActivity("resume_create", "media", "success", author, { filename: data.filename, version: data.version });

    return created;
  }, "Failed to create resume metadata");
}

export async function updateAdminResume(
  id: string,
  data: Partial<ResumeMetadataDocument>,
  author: string = "admin"
): Promise<ResumeMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("resumes").doc(id);
    const prevSnap = await ref.get();
    if (!prevSnap.exists) throw new Error(`Resume with ID ${id} not found.`);

    if (data.active === true) {
      const allActive = await adminDb.collection("resumes").where("active", "==", true).get();
      const batch = adminDb.batch();
      for (const doc of allActive.docs) {
        if (doc.id !== id) {
          batch.update(doc.ref, { active: false, updatedAt: new Date() });
        }
      }
      await batch.commit();
    }

    const payload = mapResumeToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapResumeFromDb(updatedSnap.data(), id);

    await recordRevision("resume", id, prevSnap.data() || null, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("resume_update", "media", "success", author, { filename: updated.filename, active: updated.active });

    return updated;
  }, "Failed to update resume metadata");
}

export async function deleteAdminResume(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("resumes").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    const resumeData = snap.data();
    if (resumeData?.storagePath || resumeData?.storageUrl) {
      await deleteFileFromStorage(resumeData.storagePath || resumeData.storageUrl);
    }

    await ref.delete();
    await recordRevision("resume", id, resumeData || null, {}, author, "delete");
    await logAdminActivity("resume_delete", "media", "success", author, { filename: resumeData?.filename });
    return true;
  }, "Failed to delete resume");
}

// ---------------------------------------------------------------------------
// 12. Media Domain
// ---------------------------------------------------------------------------

export async function getAdminMedia(): Promise<MediaMetadataDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("media").orderBy("createdAt", "desc").get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => mapMediaFromDb(doc.data(), doc.id));
  }, "Failed to retrieve media records");
}

export async function createAdminMedia(
  data: Omit<MediaMetadataDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<MediaMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const id = `media_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payload = {
      ...mapMediaToDb(data),
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("media").doc(id).set(payload);
    const created = mapMediaFromDb(payload, id);

    await recordRevision("media", id, null, payload, author, "create");
    await logAdminActivity("media_create", "media", "success", author, { filename: data.filename, category: data.category });

    return created;
  }, "Failed to create media record");
}

export async function createAdminMediaWithAssociation(
  data: Omit<MediaMetadataDocument, "id" | "_id" | "createdAt" | "updatedAt">,
  author: string = "admin"
): Promise<MediaMetadataDocument> {
  return createAdminMedia(data, author);
}

export async function deleteAdminMedia(id: string, author: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("media").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    const mediaData = snap.data();
    if (mediaData?.storagePath || mediaData?.storageUrl) {
      await deleteFileFromStorage(mediaData.storagePath || mediaData.storageUrl);
    }

    await ref.delete();
    await recordRevision("media", id, mediaData || null, {}, author, "delete");
    await logAdminActivity("media_delete", "media", "success", author, { filename: mediaData?.filename });
    return true;
  }, "Failed to delete media record");
}

// ---------------------------------------------------------------------------
// 13. SEO Domain
// ---------------------------------------------------------------------------

export async function getAdminSeo(): Promise<SeoMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("seo").doc("seo_root").get();
    if (snap.exists) {
      return mapSeoFromDb(snap.data(), snap.id);
    }
    return mapSeoFromDb({}, "seo_root");
  }, "Failed to retrieve SEO metadata");
}

export async function updateAdminSeo(
  data: Partial<SeoMetadataDocument>,
  author: string = "admin"
): Promise<SeoMetadataDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("seo").doc("seo_root");
    const prevSnap = await ref.get();
    const prevData = prevSnap.exists ? prevSnap.data() : null;

    const payload = mapSeoToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapSeoFromDb(updatedSnap.data(), updatedSnap.id);

    await recordRevision("seo", "seo_root", prevData, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("seo_update", "content", "success", author, { title: updated.title });

    return updated;
  }, "Failed to update SEO metadata");
}

// ---------------------------------------------------------------------------
// 14. Site Content Domain
// ---------------------------------------------------------------------------

export async function getAdminSiteContent(): Promise<SiteContentDocument> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("siteContent").doc("site_content_root").get();
    if (snap.exists) {
      return mapSiteContentFromDb(snap.data(), snap.id);
    }
    return mapSiteContentFromDb({}, "site_content_root");
  }, "Failed to retrieve site content");
}

export async function updateAdminSiteContent(
  data: Partial<SiteContentDocument>,
  author: string = "admin"
): Promise<SiteContentDocument> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("siteContent").doc("site_content_root");
    const prevSnap = await ref.get();
    const prevData = prevSnap.exists ? prevSnap.data() : null;

    const payload = mapSiteContentToDb(data);
    await ref.set(payload, { merge: true });

    const updatedSnap = await ref.get();
    const updated = mapSiteContentFromDb(updatedSnap.data(), updatedSnap.id);

    await recordRevision("siteContent", "site_content_root", prevData, updatedSnap.data() || {}, author, "update");
    await logAdminActivity("site_content_update", "content", "success", author, { updatedFields: Object.keys(data) });

    return updated;
  }, "Failed to update site content");
}

// ---------------------------------------------------------------------------
// 15. Contact Messages Domain
// ---------------------------------------------------------------------------

export async function getAdminContactMessages(
  params?: PaginationParams & { status?: "unread" | "read" | "archived" }
): Promise<PaginatedResult<ContactMessageDocument>> {
  return withDatabaseErrorHandling(async () => {
    const { page, limit, offset } = sanitizePagination(params);

    let query: Query = adminDb.collection("contactMessages");
    if (params?.status) {
      query = query.where("status", "==", params.status);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query.orderBy("createdAt", "desc").offset(offset).limit(limit).get();
    const items = snap.docs.map((doc: QueryDocumentSnapshot) => mapContactMessageFromDb(doc.data(), doc.id));
    const totalPages = Math.ceil(total / limit) || 1;

    return { items, total, page, limit, totalPages };
  }, "Failed to retrieve contact messages");
}

export async function updateContactMessageStatus(
  id: string,
  actionOrStatus: "unread" | "read" | "archived" | "archive" | "mark-read" | "mark-unread",
  actor: string = "admin"
): Promise<ContactMessageDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("contactMessages").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;

    let status: "unread" | "read" | "archived" = "unread";
    if (actionOrStatus === "archive" || actionOrStatus === "archived") status = "archived";
    else if (actionOrStatus === "mark-read" || actionOrStatus === "read") status = "read";
    else if (actionOrStatus === "mark-unread" || actionOrStatus === "unread") status = "unread";

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };
    if (status === "read") updateData.readAt = new Date();
    if (status === "archived") updateData.archivedAt = new Date();

    await ref.update(updateData);
    const updatedSnap = await ref.get();
    const updated = mapContactMessageFromDb(updatedSnap.data(), id);

    await logAdminActivity("message_status_update", "content", "success", actor, { messageId: id, status });
    return updated;
  }, "Failed to update contact message status");
}

export async function deleteContactMessage(id: string, actor: string = "admin"): Promise<boolean> {
  return withDatabaseErrorHandling(async () => {
    const ref = adminDb.collection("contactMessages").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;

    await ref.delete();
    await logAdminActivity("message_delete", "content", "success", actor, { messageId: id });
    return true;
  }, "Failed to delete contact message");
}

// ---------------------------------------------------------------------------
// 16. Revisions Domain
// ---------------------------------------------------------------------------

export async function getAdminRevisions(
  contentId?: string,
  params?: PaginationParams
): Promise<PaginatedResult<RevisionDocument>> {
  return withDatabaseErrorHandling(async () => {
    const { page, limit, offset } = sanitizePagination(params);

    let query: Query = adminDb.collection("revisions");
    if (contentId) {
      query = query.where("contentId", "==", contentId);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query.orderBy("timestamp", "desc").offset(offset).limit(limit).get();
    const items = snap.docs.map((doc: QueryDocumentSnapshot) => mapRevisionFromDb(doc.data(), doc.id));
    const totalPages = Math.ceil(total / limit) || 1;

    return { items, total, page, limit, totalPages };
  }, "Failed to retrieve revisions");
}

export async function restoreRevision(
  revisionId: string,
  author: string = "admin"
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const revRef = adminDb.collection("revisions").doc(revisionId);
    const revSnap = await revRef.get();
    if (!revSnap.exists) throw new Error("Revision not found");

    const rev = revSnap.data() as RevisionDocument;
    if (!rev.previousState) {
      throw new Error("Cannot restore revision: previous state is empty");
    }

    const collectionMap: Record<string, string> = {
      profile: "profiles",
      hero: "hero",
      about: "about",
      skill: "skills",
      experience: "experience",
      project: "projects",
      achievement: "achievements",
      certification: "certifications",
      metric: "metrics",
      contactSettings: "contactSettings",
      seo: "seo",
      siteContent: "siteContent",
    };

    const collectionName = collectionMap[rev.contentType];
    if (!collectionName) {
      throw new Error(`Unsupported entity for revision restoration: ${rev.contentType}`);
    }

    const targetRef = adminDb.collection(collectionName).doc(rev.contentId);
    const currentSnap = await targetRef.get();
    const currentState = currentSnap.exists ? currentSnap.data() : null;

    // Restore previous state
    await targetRef.set(rev.previousState, { merge: false });

    // Record revision for the restore action
    await recordRevision(
      rev.contentType,
      rev.contentId,
      currentState,
      rev.previousState,
      author,
      "update"
    );

    await logAdminActivity(
      "revision_restore",
      "content",
      "success",
      author,
      { restoredFromRevisionId: revisionId, contentType: rev.contentType, contentId: rev.contentId }
    );
  }, `Failed to restore revision ${revisionId}`);
}

// ---------------------------------------------------------------------------
// 17. Activity Logs Domain
// ---------------------------------------------------------------------------

export async function getAdminActivityLogs(
  params?: PaginationParams & { category?: string }
): Promise<PaginatedResult<ActivityLogDocument>> {
  return withDatabaseErrorHandling(async () => {
    const { page, limit, offset } = sanitizePagination(params);

    let query: Query = adminDb.collection("activityLogs");
    if (params?.category) {
      query = query.where("category", "==", params.category);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query.orderBy("timestamp", "desc").offset(offset).limit(limit).get();
    const items = snap.docs.map((doc: QueryDocumentSnapshot) => mapActivityLogFromDb(doc.data(), doc.id));
    const totalPages = Math.ceil(total / limit) || 1;

    return { items, total, page, limit, totalPages };
  }, "Failed to retrieve activity logs");
}
