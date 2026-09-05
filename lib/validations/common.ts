import { z } from "zod";

/**
 * Validates a URL-safe slug (lowercase alphanumeric and hyphens only).
 */
export const slugSchema = z
  .string()
  .min(1, "Slug cannot be empty")
  .max(100, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and single hyphens");

/**
 * Validates MongoDB 24-character hex ObjectId string.
 */
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

/**
 * Standard pagination query parameters.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/**
 * Generic search and filter query parameters.
 */
export const searchFilterSchema = paginationSchema.extend({
  query: z.string().max(100).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});
