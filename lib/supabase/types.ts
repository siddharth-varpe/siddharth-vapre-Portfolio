/**
 * Supabase PostgreSQL Database Schema Types
 * =============================================================================
 * Strongly-typed database record interfaces matching the PostgreSQL tables in
 * supabase/migrations/.
 * =============================================================================
 */

export interface ProfileRow {
  id: string;
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  avatar_url: string | null;
  availability: string | null;
  tagline: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroRow {
  id: string;
  eyebrow: string;
  name: string;
  headline: string;
  description: string;
  cta_label: string;
  cta_url: string;
  supporting_text: string | null;
  image_overlay?: Record<string, unknown> | string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface AboutRow {
  id: string;
  about_description?: string | null;
  primary_description?: string | null;
  supporting_description?: string | null;
  philosophy?: string | null;
  interests?: string[] | null;
  cards?: Array<{ title: string; description: string; icon?: string }> | null;
  order?: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface SkillCategoryRow {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  accent?: string | null;
  display_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillRow {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "AI & ML" | "DevOps & Cloud" | "Tools & Systems" | string;
  description?: string | null;
  icon?: string | null;
  level?: "Proficient" | "Advanced" | "Familiar" | null;
  years?: number | null;
  featured: boolean;
  orbit_enabled?: boolean;
  order: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  type?: string | null;
  company: string;
  role: string;
  company_logo_url?: string | null;
  company_logo_path?: string | null;
  company_website?: string | null;
  employment_type: "Full-time" | "Contract" | "Freelance" | "Internship" | "Education" | "Other" | string;
  work_mode?: string | null;
  location: string;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  description: string;
  responsibilities?: string[] | null;
  achievements?: string[] | null;
  technologies?: string[] | null;
  metrics?: string[] | null;
  highlights?: Array<Record<string, unknown>> | null;
  cta_label?: string | null;
  cta_url?: string | null;
  order?: number;
  display_order?: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  summary: string | null;
  category: string | null;
  year: string | null;
  role: string | null;
  problem: string | null;
  objective: string | null;
  solution: string | null;
  architecture_summary: string | null;
  architecture_overview: string | null;
  implementation: string[] | null;
  decisions: string[] | null;
  challenges: string[] | null;
  impact: string[] | null;
  metrics: string[] | null;
  technologies: string[] | null;
  tech_stack: string[] | null;
  roles: string[] | null;
  outcomes: string[] | null;
  github_url: string | null;
  live_demo_url: string | null;
  live_url: string | null;
  demo_url: string | null;
  cover_image: string | null;
  cover_image_url: string | null;
  media: Array<{ url: string; caption?: string; type: "image" | "video" }> | null;
  screenshots: string[] | null;
  diagram_urls: string[] | null;
  featured: boolean;
  order: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface AchievementRow {
  id: string;
  title: string;
  organization: string;
  rank: string | null;
  date: string | null;
  year: string | null;
  description: string;
  certificate_url: string | null;
  verification_url: string | null;
  award_url: string | null;
  impact: string | null;
  featured: boolean;
  order: number;
  display_order?: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface CertificationRow {
  id: string;
  name: string;
  title?: string | null;
  issuer: string;
  credential_type?: string | null;
  date: string | null;
  issue_date: string | null;
  expiry_date?: string | null;
  expiration_date?: string | null;
  credential_id: string | null;
  credential_url: string | null;
  verification_url?: string | null;
  certificate_url: string | null;
  image_path?: string | null;
  description: string | null;
  skills: string[] | null;
  tags?: string[] | null;
  rank?: string | null;
  featured: boolean;
  order: number;
  display_order?: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface MetricRow {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  prefix: string | null;
  description: string | null;
  supporting_text: string | null;
  context: string | null;
  icon: string | null;
  evidence_note: string | null;
  featured: boolean;
  order: number;
  display_order?: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface ContactSettingsRow {
  id: string;
  recipient_email: string | null;
  email: string | null;
  availability_status: string | null;
  availability_notice: string | null;
  preferred_contact_method: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  location: string | null;
  cta_destination: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeRow {
  id: string;
  filename: string;
  storage_url: string;
  storage_key: string | null;
  size_bytes: number | null;
  file_size_bytes?: number | null;
  mime_type: string | null;
  version: string;
  active: boolean;
  download_enabled: boolean;
  archived: boolean;
  upload_timestamp: string | null;
  uploaded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  filename: string;
  storage_url: string;
  storage_key: string | null;
  mime_type: string;
  size_bytes: number;
  dimensions: { width: number; height: number } | null;
  category: "project" | "profile" | "certificate" | "achievement" | "resume" | "general";
  visibility: "public" | "private";
  associated_content_type: "profile" | "project" | "achievement" | "certification" | null;
  associated_content_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeoRow {
  id: string;
  title: string;
  description: string;
  author: string;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string;
  no_index: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteContentRow {
  id: string;
  footer_text: string;
  copyright: string;
  global_cta: {
    headline: string;
    subheadline: string;
    buttonLabel: string;
    buttonDestination: string;
  } | null;
  loading_message: string | null;
  empty_state_message: string | null;
  not_found_message: string | null;
  page_heroes?: Record<string, unknown> | null;
  featured_section?: Record<string, unknown> | null;
  technical_taxonomy?: Record<string, unknown> | null;
  distinctions_section?: Record<string, unknown> | null;
  opportunities_section?: Record<string, unknown> | null;
  footer_section?: Record<string, unknown> | null;
  about_section?: Record<string, unknown> | null;
  skills_page_settings?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "unread" | "read" | "archived";
  email_delivery_status: "pending" | "sent" | "failed" | "skipped";
  email_message_id: string | null;
  turnstile_verified: boolean;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  read_at: string | null;
  archived_at: string | null;
}

export interface RevisionRow {
  id: string;
  content_type: string;
  content_id: string;
  action: "create" | "update" | "delete" | "publish" | "archive";
  previous_state: Record<string, unknown> | null;
  new_state: Record<string, unknown> | null;
  actor: string;
  timestamp: string;
}

export interface ActivityLogRow {
  id: string;
  event: string;
  category: "auth" | "content" | "media" | "security" | "system";
  status: "success" | "failure" | "warning";
  actor: string;
  ip_address_masked: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  timestamp: string;
}
