import "server-only";
import type { Collection } from "mongodb";
import { getDatabase } from "../db";
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

export const COLLECTIONS = {
  PROFILE: "profiles",
  HERO: "hero",
  ABOUT: "about",
  SKILLS: "skills",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  ACHIEVEMENTS: "achievements",
  CERTIFICATIONS: "certifications",
  METRICS: "metrics",
  CONTACT_SETTINGS: "contact_settings",
  RESUMES: "resumes",
  SEO: "seo",
  SITE_CONTENT: "site_content",
  REVISIONS: "revisions",
  ACTIVITY_LOGS: "activity_logs",
  CONTACT_MESSAGES: "contact_messages",
  MEDIA: "media",
} as const;

export async function getProfileCollection(): Promise<Collection<ProfileDocument>> {
  const db = await getDatabase();
  return db.collection<ProfileDocument>(COLLECTIONS.PROFILE);
}

export async function getHeroCollection(): Promise<Collection<HeroDocument>> {
  const db = await getDatabase();
  return db.collection<HeroDocument>(COLLECTIONS.HERO);
}

export async function getAboutCollection(): Promise<Collection<AboutDocument>> {
  const db = await getDatabase();
  return db.collection<AboutDocument>(COLLECTIONS.ABOUT);
}

export async function getSkillsCollection(): Promise<Collection<SkillDocument>> {
  const db = await getDatabase();
  return db.collection<SkillDocument>(COLLECTIONS.SKILLS);
}

export async function getExperienceCollection(): Promise<Collection<ExperienceDocument>> {
  const db = await getDatabase();
  return db.collection<ExperienceDocument>(COLLECTIONS.EXPERIENCE);
}

export async function getProjectsCollection(): Promise<Collection<ProjectDocument>> {
  const db = await getDatabase();
  return db.collection<ProjectDocument>(COLLECTIONS.PROJECTS);
}

export async function getAchievementsCollection(): Promise<Collection<AchievementDocument>> {
  const db = await getDatabase();
  return db.collection<AchievementDocument>(COLLECTIONS.ACHIEVEMENTS);
}

export async function getCertificationsCollection(): Promise<Collection<CertificationDocument>> {
  const db = await getDatabase();
  return db.collection<CertificationDocument>(COLLECTIONS.CERTIFICATIONS);
}

export async function getMetricsCollection(): Promise<Collection<MetricDocument>> {
  const db = await getDatabase();
  return db.collection<MetricDocument>(COLLECTIONS.METRICS);
}

export async function getContactSettingsCollection(): Promise<Collection<ContactSettingsDocument>> {
  const db = await getDatabase();
  return db.collection<ContactSettingsDocument>(COLLECTIONS.CONTACT_SETTINGS);
}

export async function getResumesCollection(): Promise<Collection<ResumeMetadataDocument>> {
  const db = await getDatabase();
  return db.collection<ResumeMetadataDocument>(COLLECTIONS.RESUMES);
}

export async function getSeoCollection(): Promise<Collection<SeoMetadataDocument>> {
  const db = await getDatabase();
  return db.collection<SeoMetadataDocument>(COLLECTIONS.SEO);
}

export async function getSiteContentCollection(): Promise<Collection<SiteContentDocument>> {
  const db = await getDatabase();
  return db.collection<SiteContentDocument>(COLLECTIONS.SITE_CONTENT);
}

export async function getRevisionsCollection(): Promise<Collection<RevisionDocument>> {
  const db = await getDatabase();
  return db.collection<RevisionDocument>(COLLECTIONS.REVISIONS);
}

export async function getActivityLogsCollection(): Promise<Collection<ActivityLogDocument>> {
  const db = await getDatabase();
  return db.collection<ActivityLogDocument>(COLLECTIONS.ACTIVITY_LOGS);
}

export async function getContactMessagesCollection(): Promise<Collection<ContactMessageDocument>> {
  const db = await getDatabase();
  return db.collection<ContactMessageDocument>(COLLECTIONS.CONTACT_MESSAGES);
}

export async function getMediaCollection(): Promise<Collection<MediaMetadataDocument>> {
  const db = await getDatabase();
  return db.collection<MediaMetadataDocument>(COLLECTIONS.MEDIA);
}
