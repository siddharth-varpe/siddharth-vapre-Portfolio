import type { ContentStatus } from "@/types/common";
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
  RevisionDocument,
  ActivityLogDocument,
  MediaMetadataDocument,
} from "@/types/models";

function toDate(val: unknown, fallback?: Date): Date {
  if (!val) return fallback || new Date();
  if (
    typeof val === "object" &&
    val !== null &&
    "toDate" in val &&
    typeof (val as { toDate: () => unknown }).toDate === "function"
  ) {
    const res = (val as { toDate: () => unknown }).toDate();
    if (res instanceof Date) return res;
  }
  if (val instanceof Date) return val;
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return fallback || new Date();
}

export function normalizeFirestoreDates<T>(obj: unknown): T {
  if (!obj || typeof obj !== "object") return obj as T;
  if (
    "toDate" in obj &&
    typeof (obj as { toDate: () => unknown }).toDate === "function"
  ) {
    return (obj as { toDate: () => unknown }).toDate() as T;
  }
  if (obj instanceof Date) return obj as unknown as T;

  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeFirestoreDates(item)) as unknown as T;
  }

  const record = obj as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(record)) {
    result[key] = normalizeFirestoreDates(record[key]);
  }
  return result as T;
}

function parseNorm(data: unknown): Record<string, unknown> {
  return (normalizeFirestoreDates<Record<string, unknown>>(data || {}) || {}) as Record<string, unknown>;
}

// 1. Profile
export function mapProfileFromDb(data: unknown, docId: string = "profile_root"): ProfileDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    name: (norm.name as string) || "Siddharth Varpe",
    title: (norm.title as string) || "Founding Full Stack & AI Systems Engineer",
    summary: (norm.summary as string) || "",
    location: (norm.location as string) || "Pune, India",
    email: (norm.email as string) || "siddharth.varpe0@gmail.com",
    phone: norm.phone as string | undefined,
    photoUrl: norm.photoUrl as string | undefined,
    avatarUrl: norm.avatarUrl as string | undefined,
    availability: (norm.availability as string) || "available",
    tagline: (norm.tagline as string) || "",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapProfileToDb(doc: Partial<ProfileDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 2. Hero
export function mapHeroFromDb(data: unknown, docId: string = "hero_root"): HeroDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    eyebrow: (norm.eyebrow as string) || "",
    name: (norm.name as string) || "Siddharth Varpe",
    headline: (norm.headline as string) || "",
    description: (norm.description as string) || "",
    ctaLabel: (norm.ctaLabel as string) || "Explore Projects",
    ctaUrl: (norm.ctaUrl as string) || "#projects",
    supportingText: norm.supportingText as string | undefined,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapHeroToDb(doc: Partial<HeroDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 3. About
export function mapAboutFromDb(data: unknown, docId: string = "about_root"): AboutDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    primaryDescription: (norm.primaryDescription as string) || "",
    supportingDescription: norm.supportingDescription as string | undefined,
    philosophy: norm.philosophy as string | undefined,
    interests: Array.isArray(norm.interests) ? (norm.interests as string[]) : [],
    cards: Array.isArray(norm.cards) ? (norm.cards as AboutDocument["cards"]) : [],
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapAboutToDb(doc: Partial<AboutDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 4. Skills
export function mapSkillFromDb(data: unknown, docId: string): SkillDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    name: (norm.name as string) || "",
    category: (norm.category as SkillDocument["category"]) || "Backend",
    description: norm.description as string | undefined,
    icon: norm.icon as string | undefined,
    level: (norm.level as SkillDocument["level"]) || "Proficient",
    years: norm.years as number | undefined,
    featured: Boolean(norm.featured),
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapSkillToDb(doc: Partial<SkillDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 5. Experience
export function mapExperienceFromDb(data: unknown, docId: string): ExperienceDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    company: (norm.company as string) || "",
    role: (norm.role as string) || "",
    employmentType: (norm.employmentType as ExperienceDocument["employmentType"]) || "Full-time",
    location: (norm.location as string) || "",
    startDate: (norm.startDate as string) || "",
    endDate: norm.endDate as string | undefined,
    current: Boolean(norm.current),
    description: (norm.description as string) || "",
    responsibilities: Array.isArray(norm.responsibilities) ? (norm.responsibilities as string[]) : [],
    achievements: Array.isArray(norm.achievements) ? (norm.achievements as string[]) : [],
    technologies: Array.isArray(norm.technologies) ? (norm.technologies as string[]) : [],
    metrics: Array.isArray(norm.metrics) ? (norm.metrics as string[]) : [],
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapExperienceToDb(doc: Partial<ExperienceDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 6. Projects
export function mapProjectFromDb(data: unknown, docId: string): ProjectDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    title: (norm.title as string) || "",
    slug: (norm.slug as string) || "",
    shortDescription: (norm.shortDescription as string) || "",
    fullDescription: (norm.fullDescription as string) || "",
    category: (norm.category as string) || "Full-Stack System",
    year: (norm.year as string) || "2026",
    role: (norm.role as string) || "Lead Architect",
    problem: (norm.problem as string) || "",
    objective: (norm.objective as string) || "",
    solution: (norm.solution as string) || "",
    architectureSummary: (norm.architectureSummary as string) || "",
    implementation: Array.isArray(norm.implementation) ? (norm.implementation as string[]) : [],
    decisions: Array.isArray(norm.decisions) ? (norm.decisions as string[]) : [],
    challenges: Array.isArray(norm.challenges) ? (norm.challenges as string[]) : [],
    impact: Array.isArray(norm.impact) ? (norm.impact as string[]) : [],
    metrics: Array.isArray(norm.metrics) ? (norm.metrics as string[]) : [],
    technologies: Array.isArray(norm.technologies) ? (norm.technologies as string[]) : [],
    githubUrl: norm.githubUrl as string | undefined,
    liveDemoUrl: norm.liveDemoUrl as string | undefined,
    media: norm.media as ProjectDocument["media"],
    coverImage: norm.coverImage as string | undefined,
    featured: Boolean(norm.featured),
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapProjectToDb(doc: Partial<ProjectDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 7. Achievements
export function mapAchievementFromDb(data: unknown, docId: string): AchievementDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    title: (norm.title as string) || "",
    organization: (norm.organization as string) || (norm.issuer as string) || "",
    rank: norm.rank as string | undefined,
    date: (norm.date as string) || "",
    description: (norm.description as string) || "",
    certificateUrl: (norm.certificateUrl as string) || (norm.awardUrl as string) || undefined,
    verificationUrl: norm.verificationUrl as string | undefined,
    featured: Boolean(norm.featured),
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapAchievementToDb(doc: Partial<AchievementDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 8. Certifications
export function mapCertificationFromDb(data: unknown, docId: string): CertificationDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    name: (norm.name as string) || "",
    issuer: (norm.issuer as string) || "",
    date: (norm.date as string) || (norm.issueDate as string) || "",
    credentialId: norm.credentialId as string | undefined,
    credentialUrl: norm.credentialUrl as string | undefined,
    certificateUrl: norm.certificateUrl as string | undefined,
    description: norm.description as string | undefined,
    featured: Boolean(norm.featured),
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapCertificationToDb(doc: Partial<CertificationDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 9. Metrics
export function mapMetricFromDb(data: unknown, docId: string): MetricDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    label: (norm.label as string) || "",
    value: (norm.value as string) || "",
    supportingText: (norm.supportingText as string) || (norm.description as string) || undefined,
    context: norm.context as string | undefined,
    icon: norm.icon as string | undefined,
    evidenceNote: norm.evidenceNote as string | undefined,
    featured: Boolean(norm.featured),
    order: (norm.order as number) ?? 0,
    status: (norm.status as ContentStatus) || "published",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapMetricToDb(doc: Partial<MetricDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 10. Contact Settings
export function mapContactSettingsFromDb(
  data: unknown,
  docId: string = "contact_settings_root"
): ContactSettingsDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    email: (norm.email as string) || (norm.receiverEmail as string) || "siddharth.varpe0@gmail.com",
    linkedinUrl: (norm.linkedinUrl as string) || "https://linkedin.com/in/siddharth-varpe",
    githubUrl: (norm.githubUrl as string) || "https://github.com/Siddharth-Varpe",
    location: (norm.location as string) || "Pune, India",
    ctaDestination: (norm.ctaDestination as string) || "mailto:siddharth.varpe0@gmail.com",
    availabilityNotice: (norm.availabilityNotice as string) || "Available for high-impact founding & principal roles",
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapContactSettingsToDb(doc: Partial<ContactSettingsDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 11. Resumes
export function mapResumeFromDb(data: unknown, docId: string): ResumeMetadataDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    filename: (norm.filename as string) || "Siddharth_Varpe_Resume.pdf",
    storageUrl: (norm.storageUrl as string) || "/resume.pdf",
    version: (norm.version as string) || "1.0",
    uploadTimestamp: toDate(norm.uploadTimestamp || norm.uploadedAt),
    active: Boolean(norm.active),
    archived: Boolean(norm.archived),
    downloadEnabled: norm.downloadEnabled !== undefined ? Boolean(norm.downloadEnabled) : true,
    fileSizeBytes: (norm.fileSizeBytes as number) || (norm.sizeBytes as number) || undefined,
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapResumeToDb(doc: Partial<ResumeMetadataDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 12. Media
export function mapMediaFromDb(data: unknown, docId: string): MediaMetadataDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    filename: (norm.filename as string) || "asset.png",
    storageUrl: (norm.storageUrl as string) || "",
    storageKey: norm.storageKey as string | undefined,
    mimeType: (norm.mimeType as string) || "image/png",
    sizeBytes: (norm.sizeBytes as number) || 0,
    category: (norm.category as MediaMetadataDocument["category"]) || "general",
    visibility: (norm.visibility as MediaMetadataDocument["visibility"]) || "public",
    associatedContentType: norm.associatedContentType as MediaMetadataDocument["associatedContentType"],
    associatedContentId: norm.associatedContentId as string | undefined,
    dimensions: norm.dimensions as MediaMetadataDocument["dimensions"],
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapMediaToDb(doc: Partial<MediaMetadataDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 13. SEO
export function mapSeoFromDb(data: unknown, docId: string = "seo_root"): SeoMetadataDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    title: (norm.title as string) || "Siddharth Varpe | Founding Full Stack & AI Systems Engineer",
    description: (norm.description as string) || "Portfolio of Siddharth Varpe — Production Full Stack & AI Systems Engineer.",
    author: (norm.author as string) || "Siddharth Varpe",
    ogTitle: (norm.ogTitle as string) || (norm.title as string) || "",
    ogDescription: (norm.ogDescription as string) || (norm.description as string) || "",
    ogImageUrl: norm.ogImageUrl as string | undefined,
    canonicalUrl: (norm.canonicalUrl as string) || "https://siddharthvarpe.com",
    noIndex: Boolean(norm.noIndex),
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapSeoToDb(doc: Partial<SeoMetadataDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 14. Site Content
export function mapSiteContentFromDb(
  data: unknown,
  docId: string = "site_content_root"
): SiteContentDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    footerText: (norm.footerText as string) || "Designed & engineered with Next.js and Cloud Firestore.",
    copyright: (norm.copyright as string) || `© ${new Date().getFullYear()} Siddharth Varpe. All rights reserved.`,
    globalCta: (norm.globalCta as SiteContentDocument["globalCta"]) || {
      headline: "Have an architectural challenge or founding opportunity?",
      subheadline: "Let's connect and discuss building resilient systems together.",
      buttonLabel: "Initiate Conversation",
      buttonDestination: "#contact",
    },
    loadingMessage: norm.loadingMessage as string | undefined,
    emptyStateMessage: norm.emptyStateMessage as string | undefined,
    notFoundMessage: norm.notFoundMessage as string | undefined,
    createdAt: toDate(norm.createdAt),
    updatedAt: toDate(norm.updatedAt),
  };
}

export function mapSiteContentToDb(doc: Partial<SiteContentDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...doc };
  delete result.id;
  delete result._id;
  result.updatedAt = new Date();
  return result;
}

// 15. Contact Message
export function mapContactMessageFromDb(data: unknown, docId: string): ContactMessageDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    name: (norm.name as string) || "",
    email: (norm.email as string) || "",
    subject: norm.subject as string | undefined,
    message: (norm.message as string) || "",
    status: (norm.status as ContactMessageDocument["status"]) || "unread",
    emailDeliveryStatus: (norm.emailDeliveryStatus as ContactMessageDocument["emailDeliveryStatus"]) || "pending",
    emailMessageId: norm.emailMessageId as string | undefined,
    turnstileVerified: Boolean(norm.turnstileVerified),
    ipHash: norm.ipHash as string | undefined,
    userAgent: norm.userAgent as string | undefined,
    createdAt: toDate(norm.createdAt),
    readAt: norm.readAt ? toDate(norm.readAt) : undefined,
    archivedAt: norm.archivedAt ? toDate(norm.archivedAt) : undefined,
  };
}

// 16. Revision
export function mapRevisionFromDb(data: unknown, docId: string): RevisionDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    contentType: (norm.contentType as string) || (norm.entity as string) || "",
    contentId: (norm.contentId as string) || (norm.entityId as string) || "",
    action: (norm.action as RevisionDocument["action"]) || "update",
    previousState: norm.previousState as Record<string, unknown> | undefined,
    newState: norm.newState as Record<string, unknown> | undefined,
    actor: (norm.actor as string) || (norm.author as string) || "admin",
    timestamp: toDate(norm.timestamp),
  };
}

// 17. Activity Log
export function mapActivityLogFromDb(data: unknown, docId: string): ActivityLogDocument {
  const norm = parseNorm(data);
  return {
    id: docId,
    _id: docId,
    event: (norm.event as string) || (norm.action as string) || "",
    category: (norm.category as ActivityLogDocument["category"]) || "content",
    status: (norm.status as ActivityLogDocument["status"]) || "success",
    actor: (norm.actor as string) || (norm.adminUid as string) || (norm.adminEmail as string) || "admin",
    ipAddressMasked: (norm.ipAddressMasked as string) || (norm.ipHash as string) || undefined,
    userAgent: norm.userAgent as string | undefined,
    details: (norm.details as Record<string, unknown>) || {},
    timestamp: toDate(norm.timestamp),
  };
}
