import { z } from "zod";
import { slugSchema } from "./common";

/**
 * Strict HTTP/HTTPS URL validator blocking script schemes, javascript:, and data: URIs.
 */
export const safeUrlSchema = z
  .string()
  .url("Must be a valid URL")
  .refine(
    (url) => url.startsWith("https://") || url.startsWith("http://"),
    "URL must start with http:// or https://"
  );

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);

// 1. Profile Mutation Schema (Mass assignment protected: excludes _id, createdAt, updatedAt)
export const profileMutationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(150),
  summary: z.string().trim().min(10).max(2000),
  location: z.string().trim().min(1).max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().trim().max(30).optional(),
  photoUrl: safeUrlSchema.optional(),
  availability: z.string().trim().min(1).max(100),
  tagline: z.string().trim().min(1).max(200),
});

// 2. Skill Mutation Schema
export const skillMutationSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.enum(["Frontend", "Backend", "AI & ML", "DevOps & Cloud", "Tools & Systems"]),
  description: z.string().trim().max(300).optional(),
  icon: z.string().trim().max(60).optional(),
  level: z.enum(["Proficient", "Advanced", "Familiar"]).optional(),
  years: z.number().int().min(0).max(50).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

// 3. Experience Mutation Schema
export const experienceMutationSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  employmentType: z.enum(["Full-time", "Contract", "Freelance", "Internship"]),
  location: z.string().trim().min(1).max(100),
  startDate: z.string().trim().min(4).max(30),
  endDate: z.string().trim().max(30).optional(),
  current: z.boolean().default(false),
  description: z.string().trim().min(10).max(3000),
  responsibilities: z.array(z.string().trim().min(1).max(500)),
  achievements: z.array(z.string().trim().min(1).max(500)).optional(),
  technologies: z.array(z.string().trim().min(1).max(60)),
  metrics: z.array(z.string().trim().min(1).max(200)).optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

// 4. Project Mutation Schema
export const projectMutationSchema = z.object({
  title: z.string().trim().min(1).max(150),
  slug: slugSchema,
  shortDescription: z.string().trim().min(10).max(300),
  fullDescription: z.string().trim().min(20).max(10000),
  category: z.string().trim().min(1).max(80),
  year: z.string().trim().min(4).max(10),
  role: z.string().trim().min(1).max(100),
  problem: z.string().trim().min(10).max(3000),
  objective: z.string().trim().min(10).max(3000),
  solution: z.string().trim().min(10).max(4000),
  architectureSummary: z.string().trim().min(10).max(4000),
  implementation: z.array(z.string().trim().min(1).max(500)),
  decisions: z.array(z.string().trim().min(1).max(500)),
  challenges: z.array(z.string().trim().min(1).max(500)),
  impact: z.array(z.string().trim().min(1).max(500)),
  metrics: z.array(z.string().trim().min(1).max(200)),
  technologies: z.array(z.string().trim().min(1).max(60)),
  githubUrl: safeUrlSchema.optional(),
  liveDemoUrl: safeUrlSchema.optional(),
  media: z
    .array(
      z.object({
        url: safeUrlSchema,
        caption: z.string().trim().max(200).optional(),
        type: z.enum(["image", "video"]),
      })
    )
    .optional(),
  featured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  order: z.number().int().min(0).default(0),
});

// 5. Contact Message Submission Schema (Public input boundary)
export const contactMessageSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(150),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
});

// 6. Hero Mutation Schema
export const heroMutationSchema = z.object({
  eyebrow: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  headline: z.string().trim().min(1).max(250),
  description: z.string().trim().min(10).max(1000),
  ctaLabel: z.string().trim().min(1).max(50),
  ctaUrl: z.string().trim().min(1).max(200),
  supportingText: z.string().trim().max(250).optional(),
  status: contentStatusSchema.default("published"),
});

// 7. About Mutation Schema
export const aboutMutationSchema = z.object({
  primaryDescription: z.string().trim().min(10).max(3000),
  supportingDescription: z.string().trim().max(3000).optional(),
  philosophy: z.string().trim().max(2000).optional(),
  interests: z.array(z.string().trim().min(1).max(100)).optional(),
  cards: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(100),
        description: z.string().trim().min(1).max(500),
        icon: z.string().trim().max(60).optional(),
      })
    )
    .optional(),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("published"),
});

// 8. Achievement Mutation Schema
export const achievementMutationSchema = z.object({
  title: z.string().trim().min(1).max(150),
  organization: z.string().trim().min(1).max(150),
  rank: z.string().trim().max(80).optional(),
  date: z.string().trim().min(4).max(30),
  description: z.string().trim().min(10).max(2000),
  certificateUrl: safeUrlSchema.optional(),
  verificationUrl: safeUrlSchema.optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

// 9. Certification Mutation Schema
export const certificationMutationSchema = z.object({
  name: z.string().trim().min(1).max(150),
  issuer: z.string().trim().min(1).max(150),
  date: z.string().trim().min(4).max(30),
  credentialId: z.string().trim().max(100).optional(),
  credentialUrl: safeUrlSchema.optional(),
  certificateUrl: safeUrlSchema.optional(),
  description: z.string().trim().max(1000).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

// 10. Metric Mutation Schema
export const metricMutationSchema = z.object({
  value: z.string().trim().min(1).max(50),
  label: z.string().trim().min(1).max(100),
  supportingText: z.string().trim().max(200).optional(),
  context: z.string().trim().max(100).optional(),
  icon: z.string().trim().max(60).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
  evidenceNote: z.string().trim().max(500).optional(),
});

// 11. Contact Settings Mutation Schema
export const contactSettingsMutationSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(150),
  linkedinUrl: safeUrlSchema,
  githubUrl: safeUrlSchema,
  location: z.string().trim().min(1).max(100),
  ctaDestination: z.string().trim().min(1).max(200),
  availabilityNotice: z.string().trim().max(250).optional(),
});

// 12. SEO Metadata Mutation Schema
export const seoMetadataMutationSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(10).max(320),
  author: z.string().trim().min(1).max(100),
  ogTitle: z.string().trim().min(1).max(120),
  ogDescription: z.string().trim().min(10).max(320),
  ogImageUrl: safeUrlSchema.optional(),
  canonicalUrl: safeUrlSchema,
  noIndex: z.boolean().default(false),
});

// 13. Site Content Mutation Schema
export const siteContentMutationSchema = z.object({
  footerText: z.string().trim().min(1).max(500),
  copyright: z.string().trim().min(1).max(200),
  globalCta: z.object({
    headline: z.string().trim().min(1).max(200),
    subheadline: z.string().trim().min(1).max(300),
    buttonLabel: z.string().trim().min(1).max(60),
    buttonDestination: z.string().trim().min(1).max(200),
  }),
  loadingMessage: z.string().trim().max(100).optional(),
  emptyStateMessage: z.string().trim().max(200).optional(),
  notFoundMessage: z.string().trim().max(200).optional(),
});

// 14. Resume Metadata Mutation Schema (Phase 5 metadata management)
export const resumeMetadataMutationSchema = z.object({
  filename: z.string().trim().min(1).max(150),
  storageUrl: safeUrlSchema,
  version: z.string().trim().min(1).max(50),
  active: z.boolean().default(true),
  archived: z.boolean().default(false),
  downloadEnabled: z.boolean().default(true),
  fileSizeBytes: z.number().int().min(0).optional(),
});

// 15. Media Metadata Mutation Schema (Phase 6 Media Management)
export const mediaMetadataMutationSchema = z.object({
  filename: z.string().trim().min(1).max(150),
  storageUrl: z.string().trim().min(1),
  storageKey: z.string().trim().optional(),
  mimeType: z.string().trim().min(1).max(80),
  sizeBytes: z.number().int().min(0),
  dimensions: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  category: z.enum(["project", "profile", "certificate", "achievement", "resume", "general"]),
  visibility: z.enum(["public", "private"]).default("public"),
  associatedContentType: z.enum(["profile", "project", "achievement", "certification"]).optional(),
  associatedContentId: z.string().optional(),
});

// 16. Contact Message Admin Action Schema
export const contactMessageActionSchema = z.object({
  action: z.enum(["mark-read", "mark-unread", "archive", "delete"]),
});

// 17. Restore Revision Schema
export const restoreRevisionSchema = z.object({
  revisionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid revision ID format"),
});
