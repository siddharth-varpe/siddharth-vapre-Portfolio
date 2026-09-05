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
