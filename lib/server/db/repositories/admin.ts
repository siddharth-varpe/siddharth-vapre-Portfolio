import "server-only";
import type { Filter } from "mongodb";
import {
  getProjectsCollection,
  getContactMessagesCollection,
  getActivityLogsCollection,
  getRevisionsCollection,
} from "../collections";
import { withDatabaseErrorHandling } from "../errors";
import type {
  ProjectDocument,
  ContactMessageDocument,
  ActivityLogDocument,
  RevisionDocument,
  ContentStatus,
} from "@/types";

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

function sanitizePagination(params?: PaginationParams): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Math.floor(params?.page ?? DEFAULT_PAGE));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(params?.limit ?? DEFAULT_LIMIT)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Fetch paginated projects for administrative management.
 */
export async function getAdminProjects(options?: {
  page?: number;
  limit?: number;
  status?: ContentStatus;
}): Promise<PaginatedResult<ProjectDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getProjectsCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<ProjectDocument> = {};
    if (options?.status) {
      filter.status = options.status;
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve administrative projects");
}

/**
 * Fetch paginated contact messages with status filtering.
 */
export async function getAdminContactMessages(options?: {
  page?: number;
  limit?: number;
  status?: ContactMessageDocument["status"];
}): Promise<PaginatedResult<ContactMessageDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getContactMessagesCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<ContactMessageDocument> = {};
    if (options?.status) {
      filter.status = options.status;
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve contact messages");
}

/**
 * Fetch paginated activity audit logs.
 */
export async function getAdminActivityLogs(options?: {
  page?: number;
  limit?: number;
  category?: ActivityLogDocument["category"];
}): Promise<PaginatedResult<ActivityLogDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getActivityLogsCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<ActivityLogDocument> = {};
    if (options?.category) {
      filter.category = options.category;
    }

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve activity audit logs");
}

/**
 * Fetch paginated revisions for a given content document.
 */
export async function getAdminRevisions(
  contentId: string,
  options?: PaginationParams
): Promise<PaginatedResult<RevisionDocument>> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getRevisionsCollection();
    const { page, limit, skip } = sanitizePagination(options);

    const filter: Filter<RevisionDocument> = { contentId };

    const [items, total] = await Promise.all([
      collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }, "Failed to retrieve document revisions");
}

/**
 * Append an immutable audit activity log entry.
 */
export async function logAdminActivity(
  activity: Omit<ActivityLogDocument, "_id" | "timestamp">
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getActivityLogsCollection();
    await collection.insertOne({
      ...activity,
      timestamp: new Date(),
    });
  }, "Failed to record activity log");
}

/**
 * Record a content revision entry.
 */
export async function recordRevision(
  revision: Omit<RevisionDocument, "_id" | "timestamp">
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const collection = await getRevisionsCollection();
    await collection.insertOne({
      ...revision,
      timestamp: new Date(),
    });
  }, "Failed to record content revision");
}
