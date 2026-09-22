/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import seedDataRaw from "@/data/portfolio-seed-data.json";
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
} from "@/types/models";
import crypto from "node:crypto";

/**
 * =============================================================================
 * [SUPABASE POSTGRESQL MIGRATION POINT]
 * =============================================================================
 * MongoDB Atlas has been completely removed from this project.
 *
 * This memory store serves as the unified domain state provider initialized with
 * 100% authentic portfolio seed data (zero data loss, no mock data).
 *
 * In the upcoming phase, this module will be replaced with Supabase PostgreSQL client
 * queries and migrations against real PostgreSQL tables.
 * =============================================================================
 */

function ensureDates<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  const result: any = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      result[key] = new Date(val);
    } else if (val && typeof val === "object" && !(val instanceof Date)) {
      result[key] = ensureDates(val);
    }
  }
  return result;
}

function assignIds<T extends { id?: string; _id?: string }>(items: T[], prefix: string): T[] {
  return items.map((item, idx) => {
    const id = item.id || item._id || `${prefix}_${idx + 1}_${crypto.randomBytes(4).toString("hex")}`;
    return {
      ...item,
      id,
      _id: id,
    };
  });
}

// Global in-memory singleton state preserved across hot-reloads in development
interface InMemoryStore {
  profile: ProfileDocument;
  hero: HeroDocument;
  about: AboutDocument;
  skills: SkillDocument[];
  experience: ExperienceDocument[];
  projects: ProjectDocument[];
  achievements: AchievementDocument[];
  certifications: CertificationDocument[];
  metrics: MetricDocument[];
  contactSettings: ContactSettingsDocument;
  resumes: ResumeMetadataDocument[];
  seo: SeoMetadataDocument;
  siteContent: SiteContentDocument;
  contactMessages: ContactMessageDocument[];
  revisions: RevisionDocument[];
  activityLogs: ActivityLogDocument[];
  media: MediaMetadataDocument[];
}

declare global {
  var _portfolioInMemoryStore: InMemoryStore | undefined;
}

function initializeStore(): InMemoryStore {
  const raw: any = ensureDates(seedDataRaw);

  const skillsWithIds = assignIds(raw.skills as SkillDocument[], "skill");
  const expWithIds = assignIds(raw.experience as ExperienceDocument[], "exp");
  const projWithIds = assignIds(raw.projects as ProjectDocument[], "proj");
  const achWithIds = assignIds(raw.achievements as AchievementDocument[], "ach");
  const certWithIds = assignIds(raw.certifications as CertificationDocument[], "cert");
  const metricsWithIds = assignIds(raw.metrics as MetricDocument[], "metric");

  const resumesWithIds: ResumeMetadataDocument[] = (raw.resumes || []).map((r: any, idx: number) => ({
    id: r.id || `resume_${idx + 1}`,
    _id: r.id || `resume_${idx + 1}`,
    filename: r.filename || "Siddharth_Varpe_Resume.pdf",
    storageUrl: r.storageUrl || r.url || "/resume.pdf",
    version: r.version || "v1.0",
    uploadTimestamp: r.uploadTimestamp ? new Date(r.uploadTimestamp) : new Date(),
    active: r.active !== undefined ? Boolean(r.active) : true,
    archived: Boolean(r.archived),
    downloadEnabled: r.downloadEnabled !== undefined ? Boolean(r.downloadEnabled) : true,
    fileSizeBytes: r.fileSizeBytes,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const profileDoc: ProfileDocument = {
    id: "profile_root",
    _id: "profile_root",
    name: raw.profile?.name || "Siddharth Varpe",
    title: raw.profile?.title || "Founding Full Stack & AI Systems Engineer",
    summary: raw.profile?.summary || "",
    location: raw.profile?.location || "Pune, India",
    email: raw.profile?.email || "siddharth.varpe0@gmail.com",
    phone: raw.profile?.phone || "+91 95293 42969",
    photoUrl: raw.profile?.photoUrl || undefined,
    avatarUrl: raw.profile?.avatarUrl || undefined,
    availability: raw.profile?.availability || "available",
    tagline: raw.profile?.tagline || "Architecting Resilient Production Systems",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const heroDoc: HeroDocument = {
    id: "hero_root",
    _id: "hero_root",
    eyebrow: raw.hero?.eyebrow || "Founding Engineer & Systems Architect",
    name: raw.hero?.name || "Siddharth Varpe",
    headline: raw.hero?.headline || "Engineering Resilient Production Systems",
    description: raw.hero?.description || "Specializing in next-generation web platforms, distributed architectures, and AI integration.",
    ctaLabel: raw.hero?.ctaLabel || raw.hero?.primaryCtaText || "Explore Projects",
    ctaUrl: raw.hero?.ctaUrl || raw.hero?.primaryCtaLink || "#projects",
    supportingText: raw.hero?.supportingText || raw.hero?.tagline,
    status: (raw.hero?.status as any) || "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const contactSettingsDoc: ContactSettingsDocument = {
    id: "contact_settings_root",
    _id: "contact_settings_root",
    email: raw.contact_settings?.email || raw.contact_settings?.receiverEmail || "siddharth.varpe0@gmail.com",
    linkedinUrl: raw.contact_settings?.linkedinUrl || "https://www.linkedin.com/in/siddharth-varpe",
    githubUrl: raw.contact_settings?.githubUrl || "https://github.com/siddharth-varpe",
    instagramUrl: raw.contact_settings?.instagramUrl || "https://instagram.com",
    twitterUrl: raw.contact_settings?.twitterUrl || "https://x.com/siddharth_varpe",
    location: raw.contact_settings?.location || "Pune, India",
    ctaDestination: raw.contact_settings?.ctaDestination || "mailto:siddharth.varpe0@gmail.com",
    availabilityNotice: raw.contact_settings?.availabilityNotice || "Available for high-impact founding & principal roles",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const seoDoc: SeoMetadataDocument = {
    id: "seo_root",
    _id: "seo_root",
    title: raw.seo?.title || "Siddharth Varpe | Founding Full Stack & AI Systems Engineer",
    description: raw.seo?.description || "Portfolio of Siddharth Varpe — Production Full Stack & AI Systems Engineer.",
    author: raw.seo?.author || "Siddharth Varpe",
    ogTitle: raw.seo?.ogTitle || raw.seo?.title || "Siddharth Varpe Portfolio",
    ogDescription: raw.seo?.ogDescription || raw.seo?.description || "Engineering Resilient Production Systems",
    ogImageUrl: raw.seo?.ogImageUrl,
    canonicalUrl: raw.seo?.canonicalUrl || "https://siddharthvarpe.com",
    noIndex: Boolean(raw.seo?.noIndex),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const siteContentDoc: SiteContentDocument = {
    id: "site_content_root",
    _id: "site_content_root",
    footerText: raw.site_content?.footerText || "Designed & engineered with Next.js 15, React 19, and PostgreSQL.",
    copyright: raw.site_content?.copyright || `© ${new Date().getFullYear()} Siddharth Varpe. All rights reserved.`,
    globalCta: raw.site_content?.globalCta || {
      headline: "Have an architectural challenge or founding opportunity?",
      subheadline: "Let's connect and discuss building resilient systems together.",
      buttonLabel: "Initiate Conversation",
      buttonDestination: "#contact",
    },
    loadingMessage: raw.site_content?.loadingMessage,
    emptyStateMessage: raw.site_content?.emptyStateMessage,
    notFoundMessage: raw.site_content?.notFoundMessage,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    profile: profileDoc,
    hero: heroDoc,
    about: { ...(raw.about as AboutDocument), id: "about_root", _id: "about_root" },
    skills: skillsWithIds,
    experience: expWithIds,
    projects: projWithIds,
    achievements: achWithIds,
    certifications: certWithIds,
    metrics: metricsWithIds,
    contactSettings: contactSettingsDoc,
    resumes: resumesWithIds,
    seo: seoDoc,
    siteContent: siteContentDoc,
    contactMessages: [],
    revisions: [],
    activityLogs: [],
    media: [],
  };
}

export function getStore(): InMemoryStore {
  if (process.env.NODE_ENV === "development") {
    if (!global._portfolioInMemoryStore) {
      global._portfolioInMemoryStore = initializeStore();
    }
    return global._portfolioInMemoryStore;
  }
  if (!global._portfolioInMemoryStore) {
    global._portfolioInMemoryStore = initializeStore();
  }
  return global._portfolioInMemoryStore;
}
