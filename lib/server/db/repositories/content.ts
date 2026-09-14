import "server-only";
import { withDatabaseErrorHandling } from "../errors";
import { getStore } from "../store";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  mapProfileFromDb,
  mapHeroFromDb,
  mapAboutFromDb,
  mapSkillFromDb,
  mapProjectFromDb,
  mapExperienceFromDb,
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
  ContactMessageDocument,
  ResumeMetadataDocument,
  SeoMetadataDocument,
  SiteContentDocument,
} from "@/types/models";
import crypto from "node:crypto";

const MAX_PUBLIC_LIMIT = 50;

/**
 * Fetch the public developer profile from Supabase PostgreSQL.
 */
export async function getPublishedProfile(): Promise<ProfileDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedProfile query issue:", error.message);
      } else if (data) {
        return mapProfileFromDb(data);
      }
    }
    const store = getStore();
    return store.profile || null;
  }, "Failed to retrieve public profile");
}

/**
 * Fetch published hero section data from Supabase PostgreSQL.
 */
export async function getPublishedHero(): Promise<HeroDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("heroes")
        .select("*")
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedHero query issue:", error.message);
      } else if (data) {
        return mapHeroFromDb(data);
      }
    }
    const store = getStore();
    if (store.hero && store.hero.status === "published") {
      return store.hero;
    }
    return store.hero || null;
  }, "Failed to retrieve hero section");
}

/**
 * Fetch published about section data from Supabase PostgreSQL.
 */
export async function getPublishedAbout(): Promise<AboutDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("abouts")
        .select("*")
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedAbout query issue:", error.message);
      } else if (data) {
        return mapAboutFromDb(data);
      }
    }
    const store = getStore();
    if (store.about && store.about.status === "published") {
      return store.about;
    }
    return store.about || null;
  }, "Failed to retrieve about section");
}

/**
 * Fetch published skills sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedSkills(
  category?: SkillDocument["category"]
): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("skills")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedSkills query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapSkillFromDb);
      }
    }
    const store = getStore();
    let items = store.skills.filter((s) => s.status === "published");
    if (category) {
      items = items.filter((s) => s.category === category);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published skills");
}

/**
 * Fetch published projects with optional featured filter and bounded limit from Supabase PostgreSQL.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProjectDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const safeLimit = Math.min(Math.max(1, options?.limit ?? MAX_PUBLIC_LIMIT), MAX_PUBLIC_LIMIT);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      query = query.limit(safeLimit);
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedProjects query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapProjectFromDb);
      }
    }
    const store = getStore();
    let items = store.projects.filter((p) => p.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((p) => p.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, safeLimit);
  }, "Failed to retrieve published projects");
}

/**
 * Fetch a single published project by its unique slug from Supabase PostgreSQL.
 */
export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedProjectBySlug query issue:", error.message);
      } else if (data) {
        return mapProjectFromDb(data);
      }
    }
    const store = getStore();
    const item = store.projects.find((p) => p.slug === slug && p.status === "published");
    return item || null;
  }, "Failed to retrieve project details");
}

/**
 * Fetch published experience timeline items sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (error) {
        console.warn("[Supabase] getPublishedExperience query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapExperienceFromDb);
      }
    }
    const store = getStore();
    return store.experience
      .filter((e) => e.status === "published")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published experience");
}

/**
 * Fetch published achievements sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedAchievements(options?: {
  featuredOnly?: boolean;
}): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("achievements")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedAchievements query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapAchievementFromDb);
      }
    }
    const store = getStore();
    let items = store.achievements.filter((a) => a.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((a) => a.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published achievements");
}

/**
 * Fetch published certifications sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedCertifications(options?: {
  featuredOnly?: boolean;
}): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("certifications")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedCertifications query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapCertificationFromDb);
      }
    }
    const store = getStore();
    let items = store.certifications.filter((c) => c.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((c) => c.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published certifications");
}

/**
 * Fetch published key metrics sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedMetrics(options?: {
  featuredOnly?: boolean;
}): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("metrics")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedMetrics query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapMetricFromDb);
      }
    }
    const store = getStore();
    let items = store.metrics.filter((m) => m.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((m) => m.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published metrics");
}

/**
 * Fetch public contact settings and social links from Supabase PostgreSQL.
 */
export async function getPublishedContactSettings(): Promise<ContactSettingsDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedContactSettings query issue:", error.message);
      } else if (data) {
        return mapContactSettingsFromDb(data);
      }
    }
    const store = getStore();
    return store.contactSettings || null;
  }, "Failed to retrieve contact settings");
}

/**
 * Fetch current active resume metadata for download from Supabase PostgreSQL.
 */
export async function getActiveResume(): Promise<ResumeMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("active", true)
        .eq("archived", false)
        .eq("download_enabled", true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getActiveResume query issue:", error.message);
      } else if (data) {
        return mapResumeFromDb(data);
      }
    }
    const store = getStore();
    const resume = store.resumes.find((r) => r.active && !r.archived && r.downloadEnabled);
    return resume || null;
  }, "Failed to retrieve active resume");
}

/**
 * Fetch global SEO metadata from Supabase PostgreSQL.
 */
export async function getPublishedSeo(): Promise<SeoMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("seo")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedSeo query issue:", error.message);
      } else if (data) {
        return mapSeoFromDb(data);
      }
    }
    const store = getStore();
    return store.seo || null;
  }, "Failed to retrieve SEO metadata");
}

/**
 * Fetch site content elements (footer, global CTA, microcopy) from Supabase PostgreSQL.
 */
export async function getPublishedSiteContent(): Promise<SiteContentDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedSiteContent query issue:", error.message);
      } else if (data) {
        return mapSiteContentFromDb(data);
      }
    }
    const store = getStore();
    return store.siteContent || null;
  }, "Failed to retrieve site content");
}

/**
 * Persist incoming contact message into Supabase PostgreSQL.
 * CRITICAL RELIABILITY RULE: Database persistence happens BEFORE any email notification attempts.
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

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = {
        id,
        name: newDoc.name,
        email: newDoc.email,
        subject: newDoc.subject || null,
        message: newDoc.message,
        status: newDoc.status,
        email_delivery_status: newDoc.emailDeliveryStatus,
        turnstile_verified: newDoc.turnstileVerified,
        ip_hash: newDoc.ipHash || null,
        user_agent: newDoc.userAgent || null,
        created_at: now.toISOString(),
      };
      const { error } = await supabase.from("contact_messages").insert(dbPayload);
      if (error) {
        console.error("[Supabase Error] Failed to insert contact message:", error.message);
      }
    }

    // Maintain in-memory sync
    const store = getStore();
    store.contactMessages.unshift(newDoc);
    return newDoc;
  }, "Failed to save contact message to database");
}

/**
 * Record email delivery notification status for a stored contact message.
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
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase
        .from("contact_messages")
        .update({
          email_delivery_status: delivery.status,
          email_message_id: delivery.messageId || null,
        })
        .eq("id", id);
    }

    const store = getStore();
    const msg = store.contactMessages.find((m) => m.id === id || m._id === id);
    if (msg) {
      msg.emailDeliveryStatus = delivery.status;
      if (delivery.messageId) {
        msg.emailMessageId = delivery.messageId;
      }
    }
  }, "Failed to update contact message delivery status");
}
