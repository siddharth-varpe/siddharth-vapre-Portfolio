import "server-only";
import {
  getProjectsCollection,
  getSkillsCollection,
  getExperienceCollection,
  getAchievementsCollection,
  getCertificationsCollection,
  getMetricsCollection,
  getContactMessagesCollection,
  getActivityLogsCollection,
  getRevisionsCollection,
} from "./collections";

/**
 * Initialize indexes across MongoDB Atlas collections.
 *
 * Index Rationales:
 * - projects.slug: unique index for fast O(1) slug lookups in public route /projects/[slug]
 * - projects/skills/experience.status + order: compound index for high-speed published list retrieval
 * - contact_messages.createdAt: descending index for chronological inbox triage
 * - contact_messages.status: index for unread vs read message filtering
 * - activity_logs.timestamp: descending index for chronological audit timeline
 * - revisions.contentId + timestamp: compound index for fetching revision history of a specific document
 */
export async function initializeDatabaseIndexes(): Promise<void> {
  const [
    projects,
    skills,
    experience,
    achievements,
    certifications,
    metrics,
    contactMessages,
    activityLogs,
    revisions,
  ] = await Promise.all([
    getProjectsCollection(),
    getSkillsCollection(),
    getExperienceCollection(),
    getAchievementsCollection(),
    getCertificationsCollection(),
    getMetricsCollection(),
    getContactMessagesCollection(),
    getActivityLogsCollection(),
    getRevisionsCollection(),
  ]);

  await Promise.all([
    // Projects: unique slug, compound status + order, featured filter
    projects.createIndex({ slug: 1 }, { unique: true, name: "idx_projects_slug_unique" }),
    projects.createIndex({ status: 1, order: 1 }, { name: "idx_projects_status_order" }),
    projects.createIndex({ featured: 1, status: 1 }, { name: "idx_projects_featured_status" }),

    // Skills: category + order, status
    skills.createIndex({ category: 1, order: 1 }, { name: "idx_skills_category_order" }),
    skills.createIndex({ status: 1 }, { name: "idx_skills_status" }),

    // Experience: status + order
    experience.createIndex({ status: 1, order: 1 }, { name: "idx_experience_status_order" }),

    // Achievements & Certifications: status + order
    achievements.createIndex({ status: 1, order: 1 }, { name: "idx_achievements_status_order" }),
    certifications.createIndex({ status: 1, order: 1 }, { name: "idx_certifications_status_order" }),

    // Metrics: featured, status + order
    metrics.createIndex({ status: 1, order: 1 }, { name: "idx_metrics_status_order" }),

    // Contact Messages: chronological sort, status filter
    contactMessages.createIndex({ createdAt: -1 }, { name: "idx_contact_messages_created_desc" }),
    contactMessages.createIndex({ status: 1, createdAt: -1 }, { name: "idx_contact_messages_status_created" }),

    // Activity Logs: chronological sort, category filter
    activityLogs.createIndex({ timestamp: -1 }, { name: "idx_activity_logs_timestamp_desc" }),
    activityLogs.createIndex({ category: 1, timestamp: -1 }, { name: "idx_activity_logs_category_timestamp" }),

    // Revisions: contentId lookup with chronological order
    revisions.createIndex({ contentId: 1, timestamp: -1 }, { name: "idx_revisions_content_timestamp" }),
  ]);
}
