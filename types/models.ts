import type { ContentStatus, BaseEntity } from "./common";

// Deprecated alias for transition compatibility
export type MongoBaseDocument = BaseEntity;

// 1. Profile Domain
export interface ProfileDocument extends MongoBaseDocument {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  avatarUrl?: string;
  availability: string;
  tagline: string;
}

// 2. Hero Domain
export interface HeroDocument extends MongoBaseDocument {
  eyebrow: string;
  name: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  supportingText?: string;
  status: ContentStatus;
}

// 3. About Domain
export interface AboutDocument extends MongoBaseDocument {
  primaryDescription: string;
  supportingDescription?: string;
  philosophy?: string;
  interests?: string[];
  cards?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  order: number;
  status: ContentStatus;
}

// 4. Skills Domain
export interface SkillDocument extends MongoBaseDocument {
  name: string;
  category: "Frontend" | "Backend" | "AI & ML" | "DevOps & Cloud" | "Tools & Systems";
  description?: string;
  icon?: string;
  level?: "Proficient" | "Advanced" | "Familiar";
  years?: number;
  featured: boolean;
  order: number;
  status: ContentStatus;
}

// 5. Experience Domain
export interface ExperienceDocument extends MongoBaseDocument {
  company: string;
  role: string;
  employmentType: "Full-time" | "Contract" | "Freelance" | "Internship";
  location: string;
  startDate: string; // ISO format or MM/YYYY
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements?: string[];
  technologies: string[];
  metrics?: string[];
  order: number;
  status: ContentStatus;
}

// 6. Projects Domain
export interface ProjectDocument extends MongoBaseDocument {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  year: string;
  role: string;
  problem: string;
  objective: string;
  solution: string;
  architectureSummary: string;
  implementation: string[];
  decisions: string[];
  challenges: string[];
  impact: string[];
  metrics: string[];
  technologies: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  media?: {
    url: string;
    caption?: string;
    type: "image" | "video";
  }[];
  coverImage?: string;
  featured: boolean;
  status: ContentStatus;
  order: number;
}

// 7. Achievements Domain
export interface AchievementDocument extends MongoBaseDocument {
  title: string;
  organization: string;
  rank?: string;
  date: string;
  description: string;
  certificateUrl?: string;
  verificationUrl?: string;
  featured: boolean;
  order: number;
  status: ContentStatus;
}

// 8. Certifications Domain
export interface CertificationDocument extends MongoBaseDocument {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateUrl?: string;
  description?: string;
  featured: boolean;
  order: number;
  status: ContentStatus;
}

// 9. Metrics Domain
export interface MetricDocument extends MongoBaseDocument {
  value: string;
  label: string;
  supportingText?: string;
  context?: string;
  icon?: string;
  featured: boolean;
  order: number;
  status: ContentStatus;
  evidenceNote?: string;
}

// 10. Contact / Social Settings Domain
export interface ContactSettingsDocument extends MongoBaseDocument {
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  location: string;
  ctaDestination: string;
  availabilityNotice?: string;
}

// 11. Resume Metadata Domain
export interface ResumeMetadataDocument extends MongoBaseDocument {
  filename: string;
  storageUrl: string;
  version: string;
  uploadTimestamp: Date;
  active: boolean;
  archived: boolean;
  downloadEnabled: boolean;
  fileSizeBytes?: number;
}

// 12. SEO Domain
export interface SeoMetadataDocument extends MongoBaseDocument {
  title: string;
  description: string;
  author: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl?: string;
  canonicalUrl: string;
  noIndex: boolean;
}

// 13. Site Content Domain
export interface SiteContentDocument extends MongoBaseDocument {
  footerText: string;
  copyright: string;
  globalCta: {
    headline: string;
    subheadline: string;
    buttonLabel: string;
    buttonDestination: string;
  };
  loadingMessage?: string;
  emptyStateMessage?: string;
  notFoundMessage?: string;
}

// 14. Revisions Domain
export interface RevisionDocument {
  id?: string;
  _id?: string;
  contentType: string;
  contentId: string;
  action: "create" | "update" | "delete" | "publish" | "archive";
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  actor: string;
  timestamp: Date;
}

// 15. Activity Log Domain
export interface ActivityLogDocument {
  id?: string;
  _id?: string;
  event: string;
  category: "auth" | "content" | "media" | "security" | "system";
  status: "success" | "failure" | "warning";
  actor: string;
  ipAddressMasked?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// 16. Contact Messages Domain
export interface ContactMessageDocument {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "archived";
  emailDeliveryStatus: "pending" | "sent" | "failed" | "skipped";
  emailMessageId?: string;
  turnstileVerified: boolean;
  ipHash?: string;
  userAgent?: string;
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
}

// 17. Media Metadata Domain
export interface MediaMetadataDocument extends MongoBaseDocument {
  filename: string;
  storageUrl: string;
  storageKey?: string;
  mimeType: string;
  sizeBytes: number;
  dimensions?: {
    width: number;
    height: number;
  };
  category: "project" | "profile" | "certificate" | "achievement" | "resume" | "general";
  visibility: "public" | "private";
  associatedContentType?: "profile" | "project" | "achievement" | "certification";
  associatedContentId?: string;
}
