import "server-only";
import { withDatabaseErrorHandling } from "../errors";
import { adminDb } from "@/lib/firebase/admin";
import type { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import {
  mapProfileFromDb,
  mapHeroFromDb,
  mapAboutFromDb,
  mapSkillFromDb,
  mapExperienceFromDb,
  mapProjectFromDb,
  mapAchievementFromDb,
  mapCertificationFromDb,
  mapMetricFromDb,
  mapContactSettingsFromDb,
  mapResumeFromDb,
  mapSeoFromDb,
  mapSiteContentFromDb,
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
  ContactMessageDocument,
} from "@/types";
import crypto from "node:crypto";

/**
 * Fetch published author profile from Cloud Firestore.
 */
export async function getPublishedProfile(): Promise<ProfileDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("profiles").doc("profile_root").get();
    if (snap.exists) {
      return mapProfileFromDb(snap.data(), snap.id);
    }
    return null;
  }, "Failed to retrieve author profile from Cloud Firestore");
}

/**
 * Fetch published hero section content from Cloud Firestore.
 */
export async function getPublishedHero(): Promise<HeroDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("hero").doc("hero_root").get();
    if (snap.exists) {
      const data = snap.data();
      if (data?.status === "published" || !data?.status) {
        return mapHeroFromDb(data, snap.id);
      }
    }
    return null;
  }, "Failed to retrieve hero section from Cloud Firestore");
}

/**
 * Fetch published about section content from Cloud Firestore.
 */
export async function getPublishedAbout(): Promise<AboutDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("about").doc("about_root").get();
    if (snap.exists) {
      const data = snap.data();
      if (data?.status === "published" || !data?.status) {
        return mapAboutFromDb(data, snap.id);
      }
    }
    return null;
  }, "Failed to retrieve about content from Cloud Firestore");
}

/**
 * Fetch published skills sorted by order ascending from Cloud Firestore.
 */
export async function getPublishedSkills(options?: {
  category?: SkillDocument["category"];
  featuredOnly?: boolean;
}): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    let query: Query = adminDb.collection("skills").where("status", "==", "published");

    if (options?.category) {
      query = query.where("category", "==", options.category);
    }
    if (options?.featuredOnly) {
      query = query.where("featured", "==", true);
    }

    try {
      const snap = await query.orderBy("order", "asc").get();
      return snap.docs.map((doc: QueryDocumentSnapshot) => mapSkillFromDb(doc.data(), doc.id));
    } catch {
      const snap = await query.get();
      const items: SkillDocument[] = snap.docs.map((doc: QueryDocumentSnapshot) => mapSkillFromDb(doc.data(), doc.id));
      return items.sort((a: SkillDocument, b: SkillDocument) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, "Failed to retrieve published skills from Cloud Firestore");
}

/**
 * Fetch published projects sorted by order ascending from Cloud Firestore.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProjectDocument[]> {
  return withDatabaseErrorHandling(async () => {
    let query: Query = adminDb.collection("projects").where("status", "==", "published");

    if (options?.featuredOnly) {
      query = query.where("featured", "==", true);
    }

    try {
      query = query.orderBy("order", "asc");
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      const snap = await query.get();
      return snap.docs.map((doc: QueryDocumentSnapshot) => mapProjectFromDb(doc.data(), doc.id));
    } catch {
      const snap = await query.get();
      let items: ProjectDocument[] = snap.docs.map((doc: QueryDocumentSnapshot) => mapProjectFromDb(doc.data(), doc.id));
      items.sort((a: ProjectDocument, b: ProjectDocument) => (a.order ?? 0) - (b.order ?? 0));
      if (options?.limit) {
        items = items.slice(0, options.limit);
      }
      return items;
    }
  }, "Failed to retrieve published projects from Cloud Firestore");
}

/**
 * Fetch a single published project by its unique URL slug from Cloud Firestore.
 */
export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    if (!slug) return null;
    const snap = await adminDb
      .collection("projects")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snap.empty) {
      return null;
    }
    const doc = snap.docs[0];
    return mapProjectFromDb(doc.data(), doc.id);
  }, `Failed to retrieve project by slug: ${slug} from Cloud Firestore`);
}

/**
 * Fetch published experience records sorted by order ascending from Cloud Firestore.
 */
export async function getPublishedExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    try {
      const snap = await adminDb
        .collection("experience")
        .where("status", "==", "published")
        .orderBy("order", "asc")
        .get();
      return snap.docs.map((doc: QueryDocumentSnapshot) => mapExperienceFromDb(doc.data(), doc.id));
    } catch {
      const snap = await adminDb
        .collection("experience")
        .where("status", "==", "published")
        .get();
      const items: ExperienceDocument[] = snap.docs.map((doc: QueryDocumentSnapshot) => mapExperienceFromDb(doc.data(), doc.id));
      return items.sort((a: ExperienceDocument, b: ExperienceDocument) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, "Failed to retrieve published experience from Cloud Firestore");
}

/**
 * Fetch published achievements sorted by order ascending from Cloud Firestore.
 */
export async function getPublishedAchievements(options?: {
  featuredOnly?: boolean;
}): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    let query: Query = adminDb.collection("achievements").where("status", "==", "published");

    if (options?.featuredOnly) {
      query = query.where("featured", "==", true);
    }

    try {
      const snap = await query.orderBy("order", "asc").get();
      return snap.docs.map((doc: QueryDocumentSnapshot) => mapAchievementFromDb(doc.data(), doc.id));
    } catch {
      const snap = await query.get();
      const items: AchievementDocument[] = snap.docs.map((doc: QueryDocumentSnapshot) => mapAchievementFromDb(doc.data(), doc.id));
      return items.sort((a: AchievementDocument, b: AchievementDocument) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, "Failed to retrieve published achievements from Cloud Firestore");
}

/**
 * Fetch published certifications sorted by order ascending from Cloud Firestore.
 */
export async function getPublishedCertifications(options?: {
  featuredOnly?: boolean;
}): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    let query: Query = adminDb.collection("certifications").where("status", "==", "published");

    if (options?.featuredOnly) {
      query = query.where("featured", "==", true);
    }

    try {
      const snap = await query.orderBy("order", "asc").get();
      return snap.docs.map((doc: QueryDocumentSnapshot) => mapCertificationFromDb(doc.data(), doc.id));
    } catch {
      const snap = await query.get();
      const items: CertificationDocument[] = snap.docs.map((doc: QueryDocumentSnapshot) => mapCertificationFromDb(doc.data(), doc.id));
      return items.sort((a: CertificationDocument, b: CertificationDocument) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, "Failed to retrieve published certifications from Cloud Firestore");
}

/**
 * Fetch published key metrics sorted by order ascending from Cloud Firestore.
 */
export async function getPublishedMetrics(options?: {
  featuredOnly?: boolean;
}): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    let query: Query = adminDb.collection("metrics").where("status", "==", "published");

    if (options?.featuredOnly) {
      query = query.where("featured", "==", true);
    }

    try {
      const snap = await query.orderBy("order", "asc").get();
      return snap.docs.map((doc: QueryDocumentSnapshot) => mapMetricFromDb(doc.data(), doc.id));
    } catch {
      const snap = await query.get();
      const items: MetricDocument[] = snap.docs.map((doc: QueryDocumentSnapshot) => mapMetricFromDb(doc.data(), doc.id));
      return items.sort((a: MetricDocument, b: MetricDocument) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, "Failed to retrieve published metrics from Cloud Firestore");
}

/**
 * Fetch public contact settings and social links from Cloud Firestore.
 */
export async function getPublishedContactSettings(): Promise<ContactSettingsDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("contactSettings").doc("contact_settings_root").get();
    if (snap.exists) {
      return mapContactSettingsFromDb(snap.data(), snap.id);
    }
    return null;
  }, "Failed to retrieve contact settings from Cloud Firestore");
}

/**
 * Fetch current active resume metadata for download from Cloud Firestore.
 */
export async function getActiveResume(): Promise<ResumeMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb
      .collection("resumes")
      .where("active", "==", true)
      .where("archived", "==", false)
      .where("downloadEnabled", "==", true)
      .limit(1)
      .get();

    if (snap.empty) {
      return null;
    }
    const doc = snap.docs[0];
    return mapResumeFromDb(doc.data(), doc.id);
  }, "Failed to retrieve active resume from Cloud Firestore");
}

/**
 * Fetch global SEO metadata from Cloud Firestore.
 */
export async function getPublishedSeo(): Promise<SeoMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("seo").doc("seo_root").get();
    if (snap.exists) {
      return mapSeoFromDb(snap.data(), snap.id);
    }
    return null;
  }, "Failed to retrieve SEO metadata from Cloud Firestore");
}

/**
 * Fetch site content elements (footer, global CTA, microcopy) from Cloud Firestore.
 */
export async function getPublishedSiteContent(): Promise<SiteContentDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const snap = await adminDb.collection("siteContent").doc("site_content_root").get();
    if (snap.exists) {
      return mapSiteContentFromDb(snap.data(), snap.id);
    }
    return null;
  }, "Failed to retrieve site content from Cloud Firestore");
}

/**
 * Persist incoming contact message into Cloud Firestore.
 * CRITICAL RELIABILITY RULE: Firestore persistence happens BEFORE any email notification attempts.
 */
export async function saveContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  turnstileVerified: boolean;
  ipHash?: string;
  userAgent?: string;
}): Promise<ContactMessageDocument> {
  return withDatabaseErrorHandling(async () => {
    const now = new Date();
    const id = `msg_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const newDoc: ContactMessageDocument = {
      id,
      _id: id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject ? data.subject.trim() : undefined,
      message: data.message.trim(),
      status: "unread",
      emailDeliveryStatus: "pending",
      turnstileVerified: Boolean(data.turnstileVerified),
      createdAt: now,
    };

    if (data.ipHash) {
      newDoc.ipHash = data.ipHash;
    }
    if (data.userAgent) {
      newDoc.userAgent = data.userAgent.slice(0, 300);
    }

    await adminDb.collection("contactMessages").doc(id).set(newDoc);

    return newDoc;
  }, "Failed to save contact message to Cloud Firestore");
}

/**
 * Record email delivery notification status for a stored contact message in Cloud Firestore.
 * Never throws away or removes the stored message on delivery failure.
 */
export async function updateContactMessageDelivery(
  id: string,
  delivery: {
    status: "sent" | "failed" | "skipped";
    messageId?: string;
  }
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    await adminDb
      .collection("contactMessages")
      .doc(id)
      .update({
        emailDeliveryStatus: delivery.status,
        emailMessageId: delivery.messageId || null,
        updatedAt: new Date(),
      });
  }, "Failed to update contact message delivery status in Cloud Firestore");
}
