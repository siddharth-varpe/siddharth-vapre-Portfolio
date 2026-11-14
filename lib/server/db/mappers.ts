import type {
  ProfileDocument,
  HeroDocument,
  AboutDocument,
  SkillDocument,
  ExperienceDocument,
  SemanticWorkType,
  ProjectDocument,
  AchievementDocument,
  CertificationDocument,
  MetricDocument,
  ContactSettingsDocument,
  ResumeMetadataDocument,
  SeoMetadataDocument,
  SiteContentDocument,
  PageHeroConfig,
  FeaturedSectionConfig,
  TechnicalTaxonomyConfig,
  DistinctionsSectionConfig,
  OpportunitiesSectionConfig,
  FooterSectionConfig,
  AboutSectionConfig,
  ContactMessageDocument,
  RevisionDocument,
  ActivityLogDocument,
  MediaMetadataDocument,
  SkillCategoryDocument,
  SkillsPageSettings,
} from "@/types/models";
import type {
  ProfileRow,
  HeroRow,
  AboutRow,
  SkillRow,
  SkillCategoryRow,
  ExperienceRow,
  ProjectRow,
  AchievementRow,
  CertificationRow,
  MetricRow,
  ContactSettingsRow,
  ResumeRow,
  MediaRow,
  SeoRow,
  SiteContentRow,
  ContactMessageRow,
  RevisionRow,
  ActivityLogRow,
} from "@/lib/supabase/types";

/**
 * =============================================================================
 * Supabase PostgreSQL to Domain Model Mappers
 * =============================================================================
 * Translates snake_case PostgreSQL records to application camelCase domain models
 * and vice-versa with strong types.
 * =============================================================================
 */

// 1. Profile
export function mapProfileFromDb(row: ProfileRow): ProfileDocument {
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    title: row.title,
    summary: row.summary,
    location: row.location,
    email: row.email,
    phone: row.phone || undefined,
    photoUrl: row.photo_url || undefined,
    avatarUrl: row.avatar_url || undefined,
    availability: (row.availability as "available" | "limited" | "unavailable") || "available",
    tagline: row.tagline || "",
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapProfileToDb(doc: Partial<ProfileDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.name !== undefined) result.name = doc.name;
  if (doc.title !== undefined) result.title = doc.title;
  if (doc.summary !== undefined) result.summary = doc.summary;
  if (doc.location !== undefined) result.location = doc.location;
  if (doc.email !== undefined) result.email = doc.email;
  if (doc.phone !== undefined) result.phone = doc.phone;
  if (doc.photoUrl !== undefined) result.photo_url = doc.photoUrl;
  if (doc.avatarUrl !== undefined) result.avatar_url = doc.avatarUrl;
  if (doc.availability !== undefined) result.availability = doc.availability;
  if (doc.tagline !== undefined) result.tagline = doc.tagline;
  result.updated_at = new Date().toISOString();
  return result;
}

// 2. Hero
export function mapHeroFromDb(row: HeroRow): HeroDocument {
  let imageOverlay: HeroDocument["imageOverlay"] = undefined;
  if (row.image_overlay) {
    if (typeof row.image_overlay === "string") {
      try {
        imageOverlay = JSON.parse(row.image_overlay) as HeroDocument["imageOverlay"];
      } catch {
        imageOverlay = undefined;
      }
    } else if (typeof row.image_overlay === "object") {
      imageOverlay = row.image_overlay as unknown as HeroDocument["imageOverlay"];
    }
  }

  return {
    id: row.id,
    _id: row.id,
    eyebrow: row.eyebrow,
    name: row.name,
    headline: row.headline,
    description: row.description,
    ctaLabel: row.cta_label,
    ctaUrl: row.cta_url,
    supportingText: row.supporting_text || undefined,
    imageOverlay,
    status: row.status,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapHeroToDb(doc: Partial<HeroDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.eyebrow !== undefined) result.eyebrow = doc.eyebrow;
  if (doc.name !== undefined) result.name = doc.name;
  if (doc.headline !== undefined) result.headline = doc.headline;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.ctaLabel !== undefined) result.cta_label = doc.ctaLabel;
  if (doc.ctaUrl !== undefined) result.cta_url = doc.ctaUrl;
  if (doc.supportingText !== undefined) result.supporting_text = doc.supportingText;
  if (doc.imageOverlay !== undefined) result.image_overlay = doc.imageOverlay;
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 3. About
export function mapAboutFromDb(row: AboutRow): AboutDocument {
  return {
    id: row.id,
    _id: row.id,
    aboutDescription: row.about_description || undefined,
    primaryDescription: row.primary_description || "",
    supportingDescription: row.supporting_description || undefined,
    philosophy: row.philosophy || undefined,
    interests: row.interests || undefined,
    cards: row.cards || undefined,
    order: row.order ?? 0,
    status: row.status,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapAboutToDb(doc: Partial<AboutDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.aboutDescription !== undefined) result.about_description = doc.aboutDescription;
  if (doc.primaryDescription !== undefined) result.primary_description = doc.primaryDescription;
  if (doc.supportingDescription !== undefined) result.supporting_description = doc.supportingDescription;
  if (doc.philosophy !== undefined) result.philosophy = doc.philosophy;
  if (doc.interests !== undefined) result.interests = doc.interests;
  if (doc.cards !== undefined) result.cards = doc.cards;
  if (doc.order !== undefined) result.order = doc.order;
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 4. Skill
export function mapSkillFromDb(row: SkillRow): SkillDocument {
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    category: row.category,
    description: row.description || undefined,
    icon: row.icon || undefined,
    level: row.level || undefined,
    years: row.years || undefined,
    featured: Boolean(row.featured),
    orbit_enabled: Boolean(row.orbit_enabled),
    order: row.order ?? 0,
    status: row.status,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapSkillToDb(doc: Partial<SkillDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.name !== undefined) result.name = doc.name;
  if (doc.category !== undefined) result.category = doc.category;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.icon !== undefined) result.icon = doc.icon;
  if (doc.level !== undefined) result.level = doc.level;
  if (doc.years !== undefined) result.years = doc.years;
  if (doc.featured !== undefined) result.featured = doc.featured;
  if (doc.orbit_enabled !== undefined) result.orbit_enabled = doc.orbit_enabled;
  if (doc.order !== undefined) result.order = doc.order;
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 4B. Skill Category
export function mapSkillCategoryFromDb(row: SkillCategoryRow): SkillCategoryDocument {
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    description: row.description || undefined,
    icon: row.icon || undefined,
    accent: row.accent || "blue",
    display_order: row.display_order ?? 0,
    order: row.display_order ?? 0,
    enabled: Boolean(row.enabled),
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapSkillCategoryToDb(doc: Partial<SkillCategoryDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.name !== undefined) result.name = doc.name;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.icon !== undefined) result.icon = doc.icon;
  if (doc.accent !== undefined) result.accent = doc.accent;
  if (doc.display_order !== undefined) result.display_order = doc.display_order;
  else if (doc.order !== undefined) result.display_order = doc.order;
  if (doc.enabled !== undefined) result.enabled = doc.enabled;
  result.updated_at = new Date().toISOString();
  return result;
}

// 5. Experience / Professional Track
export function mapExperienceFromDb(row: ExperienceRow): ExperienceDocument {
  // Map highlights if present, or synthesize from responsibilities
  let highlights: ExperienceDocument["highlights"] = undefined;
  if (Array.isArray(row.highlights) && row.highlights.length > 0) {
    highlights = row.highlights.map((h: Record<string, unknown>, idx: number) => ({
      id: (h.id as string) || `hl-${idx + 1}`,
      title: (h.title as string) || "",
      description: (h.description as string) || "",
      type: ((h.type as SemanticWorkType) || "other"),
      metrics: Array.isArray(h.metrics) ? (h.metrics as string[]) : [],
      technologies: Array.isArray(h.technologies) ? (h.technologies as string[]) : [],
      order: typeof h.order === "number" ? h.order : idx,
      enabled: h.enabled !== false,
      destinationUrl: (h.destinationUrl as string) || undefined,
    }));
  } else if (Array.isArray(row.responsibilities) && row.responsibilities.length > 0) {
    highlights = row.responsibilities.map((resp, idx) => {
      const lower = resp.toLowerCase();
      let type: SemanticWorkType = "other";
      if (lower.includes("crm")) type = "crm";
      else if (lower.includes("inventory")) type = "inventory";
      else if (lower.includes("api") || lower.includes("endpoint")) type = "api";
      else if (lower.includes("ai") || lower.includes("llm")) type = "ai";
      else if (lower.includes("automation") || lower.includes("workflow")) type = "automation";
      else if (lower.includes("database") || lower.includes("sql") || lower.includes("postgres")) type = "database";
      else if (lower.includes("frontend") || lower.includes("react")) type = "frontend";
      else if (lower.includes("backend") || lower.includes("node")) type = "backend";

      // Extract title from first sentence or phrase
      const parts = resp.split(/—|-|managing|supporting|across/i);
      const title = parts[0]?.trim() || `Work Highlight ${idx + 1}`;

      return {
        id: `hl-synth-${idx + 1}`,
        title,
        description: resp,
        type,
        metrics: [],
        technologies: [],
        order: idx,
        enabled: true,
      };
    });
  }

  return {
    id: row.id,
    _id: row.id,
    type: ((row.type as ExperienceDocument["type"]) || "work"),
    role: row.role,
    company: row.company,
    companyLogoUrl: row.company_logo_url || undefined,
    companyLogoPath: row.company_logo_path || undefined,
    companyWebsite: row.company_website || undefined,
    employmentType: (row.employment_type as ExperienceDocument["employmentType"]) || "Full-time",
    workMode: (row.work_mode as "On-site" | "Hybrid" | "Remote") || "Hybrid",
    location: row.location || "",
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    current: Boolean(row.current),
    description: row.description || "",
    responsibilities: row.responsibilities || [],
    achievements: row.achievements || undefined,
    technologies: row.technologies || [],
    metrics: row.metrics || undefined,
    highlights,
    ctaLabel: row.cta_label || "Full Timeline",
    ctaUrl: row.cta_url || "/experience",
    order: row.order ?? row.display_order ?? 0,
    status: row.status,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapExperienceToDb(doc: Partial<ExperienceDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.type !== undefined) result.type = doc.type;
  if (doc.role !== undefined) result.role = doc.role;
  if (doc.company !== undefined) result.company = doc.company;
  if (doc.companyLogoUrl !== undefined) result.company_logo_url = doc.companyLogoUrl || null;
  if (doc.companyLogoPath !== undefined) result.company_logo_path = doc.companyLogoPath || null;
  if (doc.companyWebsite !== undefined) result.company_website = doc.companyWebsite || null;
  if (doc.employmentType !== undefined) result.employment_type = doc.employmentType;
  if (doc.workMode !== undefined) result.work_mode = doc.workMode;
  if (doc.location !== undefined) result.location = doc.location;
  if (doc.startDate !== undefined) result.start_date = doc.startDate;
  if (doc.endDate !== undefined) result.end_date = doc.endDate || null;
  if (doc.current !== undefined) result.current = doc.current;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.responsibilities !== undefined) result.responsibilities = doc.responsibilities;
  if (doc.achievements !== undefined) result.achievements = doc.achievements;
  if (doc.technologies !== undefined) result.technologies = doc.technologies;
  if (doc.metrics !== undefined) result.metrics = doc.metrics;
  if (doc.highlights !== undefined) result.highlights = doc.highlights;
  if (doc.ctaLabel !== undefined) result.cta_label = doc.ctaLabel;
  if (doc.ctaUrl !== undefined) result.cta_url = doc.ctaUrl;
  if (doc.order !== undefined) {
    result.order = doc.order;
    result.display_order = doc.order;
  }
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 6. Project
export function mapProjectFromDb(row: ProjectRow): ProjectDocument {
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description || row.summary || "",
    fullDescription: row.full_description || "",
    category: row.category || "Full Stack",
    year: row.year || new Date().getFullYear().toString(),
    role: row.role || "Lead Engineer",
    problem: row.problem || "",
    objective: row.objective || "",
    solution: row.solution || "",
    architectureSummary: row.architecture_summary || row.architecture_overview || "",
    implementation: row.implementation || [],
    decisions: row.decisions || [],
    challenges: row.challenges || [],
    impact: row.impact || row.outcomes || [],
    metrics: row.metrics || [],
    technologies: row.technologies || row.tech_stack || [],
    githubUrl: row.github_url || undefined,
    liveDemoUrl: row.live_demo_url || row.live_url || row.demo_url || undefined,
    media: row.media || undefined,
    coverImage: row.cover_image || row.cover_image_url || undefined,
    featured: Boolean(row.featured),
    status: row.status,
    order: row.order ?? 0,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapProjectToDb(doc: Partial<ProjectDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.title !== undefined) result.title = doc.title;
  if (doc.slug !== undefined) result.slug = doc.slug;
  if (doc.shortDescription !== undefined) {
    result.short_description = doc.shortDescription;
    result.summary = doc.shortDescription;
  }
  if (doc.fullDescription !== undefined) result.full_description = doc.fullDescription;
  if (doc.category !== undefined) result.category = doc.category;
  if (doc.year !== undefined) result.year = doc.year;
  if (doc.role !== undefined) result.role = doc.role;
  if (doc.problem !== undefined) result.problem = doc.problem;
  if (doc.objective !== undefined) result.objective = doc.objective;
  if (doc.solution !== undefined) result.solution = doc.solution;
  if (doc.architectureSummary !== undefined) {
    result.architecture_summary = doc.architectureSummary;
    result.architecture_overview = doc.architectureSummary;
  }
  if (doc.implementation !== undefined) result.implementation = doc.implementation;
  if (doc.decisions !== undefined) result.decisions = doc.decisions;
  if (doc.challenges !== undefined) result.challenges = doc.challenges;
  if (doc.impact !== undefined) {
    result.impact = doc.impact;
    result.outcomes = doc.impact;
  }
  if (doc.metrics !== undefined) result.metrics = doc.metrics;
  if (doc.technologies !== undefined) {
    result.technologies = doc.technologies;
    result.tech_stack = doc.technologies;
  }
  if (doc.githubUrl !== undefined) result.github_url = doc.githubUrl;
  if (doc.liveDemoUrl !== undefined) {
    result.live_demo_url = doc.liveDemoUrl;
    result.live_url = doc.liveDemoUrl;
  }
  if (doc.media !== undefined) result.media = doc.media;
  if (doc.coverImage !== undefined) {
    result.cover_image = doc.coverImage;
    result.cover_image_url = doc.coverImage;
  }
  if (doc.featured !== undefined) result.featured = doc.featured;
  if (doc.status !== undefined) result.status = doc.status;
  if (doc.order !== undefined) result.order = doc.order;
  result.updated_at = new Date().toISOString();
  return result;
}

// 7. Achievement
export function mapAchievementFromDb(row: AchievementRow): AchievementDocument {
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    organization: row.organization,
    rank: row.rank || undefined,
    date: row.date || row.year || "",
    description: row.description || "",
    certificateUrl: row.certificate_url || undefined,
    verificationUrl: row.verification_url || undefined,
    featured: Boolean(row.featured),
    order: row.order ?? row.display_order ?? 0,
    status: row.status || "published",
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapAchievementToDb(doc: Partial<AchievementDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.title !== undefined) result.title = doc.title;
  if (doc.organization !== undefined) result.organization = doc.organization;
  if (doc.rank !== undefined) result.rank = doc.rank;
  if (doc.date !== undefined) result.date = doc.date;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.certificateUrl !== undefined) result.certificate_url = doc.certificateUrl;
  if (doc.verificationUrl !== undefined) result.verification_url = doc.verificationUrl;
  if (doc.featured !== undefined) result.featured = doc.featured;
  if (doc.order !== undefined) result.order = doc.order;
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 8. Certification & Distinctions
export function mapCertificationFromDb(row: CertificationRow): CertificationDocument {
  const rawTags = Array.isArray(row.tags) ? row.tags : (Array.isArray(row.skills) ? row.skills : []);
  return {
    id: row.id,
    _id: row.id,
    name: row.name || row.title || "",
    title: row.title || row.name,
    issuer: row.issuer,
    credentialType: (row.credential_type as CertificationDocument["credentialType"]) || "certification",
    date: row.date || row.issue_date || "",
    issueDate: row.issue_date || row.date || "",
    expirationDate: row.expiration_date || row.expiry_date || undefined,
    credentialId: row.credential_id || undefined,
    credentialUrl: row.credential_url || undefined,
    verificationUrl: row.verification_url || row.credential_url || undefined,
    certificateUrl: row.certificate_url || undefined,
    imagePath: row.image_path || undefined,
    tags: rawTags,
    rank: row.rank || undefined,
    description: row.description || undefined,
    featured: Boolean(row.featured),
    order: row.order ?? row.display_order ?? 0,
    status: row.status || "published",
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapCertificationToDb(doc: Partial<CertificationDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.name !== undefined) result.name = doc.name;
  if (doc.title !== undefined && doc.name === undefined) result.name = doc.title;
  if (doc.issuer !== undefined) result.issuer = doc.issuer;
  if (doc.credentialType !== undefined) result.credential_type = doc.credentialType;
  if (doc.date !== undefined) {
    result.date = doc.date;
    result.issue_date = doc.date;
  }
  if (doc.issueDate !== undefined) {
    result.issue_date = doc.issueDate;
    if (doc.date === undefined) result.date = doc.issueDate;
  }
  if (doc.expirationDate !== undefined) {
    result.expiration_date = doc.expirationDate;
    result.expiry_date = doc.expirationDate;
  }
  if (doc.credentialId !== undefined) result.credential_id = doc.credentialId;
  if (doc.credentialUrl !== undefined) result.credential_url = doc.credentialUrl;
  if (doc.verificationUrl !== undefined) result.verification_url = doc.verificationUrl;
  if (doc.certificateUrl !== undefined) result.certificate_url = doc.certificateUrl;
  if (doc.imagePath !== undefined) result.image_path = doc.imagePath;
  if (doc.tags !== undefined) {
    result.tags = doc.tags;
    result.skills = doc.tags;
  }
  if (doc.rank !== undefined) result.rank = doc.rank;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.featured !== undefined) result.featured = doc.featured;
  if (doc.order !== undefined) {
    result.order = doc.order;
    result.display_order = doc.order;
  }
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 9. Metric
export function mapMetricFromDb(row: MetricRow): MetricDocument {
  return {
    id: row.id,
    _id: row.id,
    label: row.label,
    value: row.value,
    supportingText: row.supporting_text || undefined,
    context: row.context || undefined,
    icon: row.icon || undefined,
    evidenceNote: row.evidence_note || undefined,
    featured: Boolean(row.featured),
    order: row.order ?? row.display_order ?? 0,
    status: row.status,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapMetricToDb(doc: Partial<MetricDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.label !== undefined) result.label = doc.label;
  if (doc.value !== undefined) result.value = doc.value;
  if (doc.supportingText !== undefined) result.supporting_text = doc.supportingText;
  if (doc.context !== undefined) result.context = doc.context;
  if (doc.icon !== undefined) result.icon = doc.icon;
  if (doc.evidenceNote !== undefined) result.evidence_note = doc.evidenceNote;
  if (doc.featured !== undefined) result.featured = doc.featured;
  if (doc.order !== undefined) result.order = doc.order;
  if (doc.status !== undefined) result.status = doc.status;
  result.updated_at = new Date().toISOString();
  return result;
}

// 10. Contact Settings
export function mapContactSettingsFromDb(row: ContactSettingsRow): ContactSettingsDocument {
  return {
    id: row.id,
    _id: row.id,
    email: row.email || row.recipient_email || "",
    linkedinUrl: row.linkedin_url || "",
    githubUrl: row.github_url || "",
    location: row.location || "",
    ctaDestination: row.cta_destination || "",
    availabilityNotice: row.availability_notice || undefined,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapContactSettingsToDb(doc: Partial<ContactSettingsDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.email !== undefined) {
    result.email = doc.email;
    result.recipient_email = doc.email;
  }
  if (doc.linkedinUrl !== undefined) result.linkedin_url = doc.linkedinUrl;
  if (doc.githubUrl !== undefined) result.github_url = doc.githubUrl;
  if (doc.location !== undefined) result.location = doc.location;
  if (doc.ctaDestination !== undefined) result.cta_destination = doc.ctaDestination;
  if (doc.availabilityNotice !== undefined) result.availability_notice = doc.availabilityNotice;
  result.updated_at = new Date().toISOString();
  return result;
}

// 11. Resume
export function mapResumeFromDb(row: ResumeRow): ResumeMetadataDocument {
  return {
    id: row.id,
    _id: row.id,
    filename: row.filename,
    storageUrl: row.storage_url,
    version: row.version,
    uploadTimestamp: new Date(row.upload_timestamp || row.uploaded_at || row.created_at || Date.now()),
    active: Boolean(row.active),
    archived: Boolean(row.archived),
    downloadEnabled: Boolean(row.download_enabled),
    fileSizeBytes: row.size_bytes || row.file_size_bytes || undefined,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapResumeToDb(doc: Partial<ResumeMetadataDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.filename !== undefined) result.filename = doc.filename;
  if (doc.storageUrl !== undefined) result.storage_url = doc.storageUrl;
  if (doc.version !== undefined) result.version = doc.version;
  if (doc.uploadTimestamp !== undefined) {
    result.upload_timestamp = doc.uploadTimestamp.toISOString();
    result.uploaded_at = doc.uploadTimestamp.toISOString();
  }
  if (doc.active !== undefined) result.active = doc.active;
  if (doc.archived !== undefined) result.archived = doc.archived;
  if (doc.downloadEnabled !== undefined) result.download_enabled = doc.downloadEnabled;
  if (doc.fileSizeBytes !== undefined) result.size_bytes = doc.fileSizeBytes;
  result.updated_at = new Date().toISOString();
  return result;
}

// 12. SEO
export function mapSeoFromDb(row: SeoRow): SeoMetadataDocument {
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    description: row.description,
    author: row.author,
    ogTitle: row.og_title || row.title,
    ogDescription: row.og_description || row.description,
    ogImageUrl: row.og_image_url || undefined,
    canonicalUrl: row.canonical_url,
    noIndex: Boolean(row.no_index),
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapSeoToDb(doc: Partial<SeoMetadataDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.title !== undefined) result.title = doc.title;
  if (doc.description !== undefined) result.description = doc.description;
  if (doc.author !== undefined) result.author = doc.author;
  if (doc.ogTitle !== undefined) result.og_title = doc.ogTitle;
  if (doc.ogDescription !== undefined) result.og_description = doc.ogDescription;
  if (doc.ogImageUrl !== undefined) result.og_image_url = doc.ogImageUrl;
  if (doc.canonicalUrl !== undefined) result.canonical_url = doc.canonicalUrl;
  if (doc.noIndex !== undefined) result.no_index = doc.noIndex;
  result.updated_at = new Date().toISOString();
  return result;
}

// 13. Site Content
export function mapSiteContentFromDb(row: SiteContentRow): SiteContentDocument {
  let pageHeroes: Record<string, PageHeroConfig> | undefined;
  if (row.page_heroes) {
    if (typeof row.page_heroes === "string") {
      try {
        pageHeroes = JSON.parse(row.page_heroes);
      } catch {
        pageHeroes = undefined;
      }
    } else {
      pageHeroes = row.page_heroes as unknown as Record<string, PageHeroConfig>;
    }
  }

  let featuredSection: FeaturedSectionConfig | undefined;
  if (row.featured_section) {
    if (typeof row.featured_section === "string") {
      try {
        featuredSection = JSON.parse(row.featured_section);
      } catch {
        featuredSection = undefined;
      }
    } else {
      featuredSection = row.featured_section as unknown as FeaturedSectionConfig;
    }
  }

  let technicalTaxonomy: TechnicalTaxonomyConfig | undefined;
  if (row.technical_taxonomy) {
    if (typeof row.technical_taxonomy === "string") {
      try {
        technicalTaxonomy = JSON.parse(row.technical_taxonomy);
      } catch {
        technicalTaxonomy = undefined;
      }
    } else {
      technicalTaxonomy = row.technical_taxonomy as unknown as TechnicalTaxonomyConfig;
    }
  }

  let distinctionsSection: DistinctionsSectionConfig | undefined;
  if (row.distinctions_section) {
    if (typeof row.distinctions_section === "string") {
      try {
        distinctionsSection = JSON.parse(row.distinctions_section);
      } catch {
        distinctionsSection = undefined;
      }
    } else {
      distinctionsSection = row.distinctions_section as unknown as DistinctionsSectionConfig;
    }
  }

  let opportunitiesSection: OpportunitiesSectionConfig | undefined;
  if (row.opportunities_section) {
    if (typeof row.opportunities_section === "string") {
      try {
        opportunitiesSection = JSON.parse(row.opportunities_section);
      } catch {
        opportunitiesSection = undefined;
      }
    } else {
      opportunitiesSection = row.opportunities_section as unknown as OpportunitiesSectionConfig;
    }
  }

  let footerSection: FooterSectionConfig | undefined;
  if (row.footer_section) {
    if (typeof row.footer_section === "string") {
      try {
        footerSection = JSON.parse(row.footer_section);
      } catch {
        footerSection = undefined;
      }
    } else {
      footerSection = row.footer_section as unknown as FooterSectionConfig;
    }
  }

  let aboutSection: AboutSectionConfig | undefined;
  if (row.about_section) {
    if (typeof row.about_section === "string") {
      try {
        aboutSection = JSON.parse(row.about_section);
      } catch {
        aboutSection = undefined;
      }
    } else {
      aboutSection = row.about_section as unknown as AboutSectionConfig;
    }
  }

  let skillsPageSettings: SkillsPageSettings | undefined;
  if (row.skills_page_settings) {
    if (typeof row.skills_page_settings === "string") {
      try {
        skillsPageSettings = JSON.parse(row.skills_page_settings);
      } catch {
        skillsPageSettings = undefined;
      }
    } else {
      skillsPageSettings = row.skills_page_settings as unknown as SkillsPageSettings;
    }
  }

  return {
    id: row.id,
    _id: row.id,
    footerText: row.footer_text,
    copyright: row.copyright,
    globalCta: row.global_cta || {
      headline: "",
      subheadline: "",
      buttonLabel: "",
      buttonDestination: "",
    },
    loadingMessage: row.loading_message || undefined,
    emptyStateMessage: row.empty_state_message || undefined,
    notFoundMessage: row.not_found_message || undefined,
    pageHeroes,
    featuredSection,
    technicalTaxonomy,
    distinctionsSection,
    opportunitiesSection,
    footerSection,
    aboutSection,
    skillsPageSettings,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapSiteContentToDb(doc: Partial<SiteContentDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.footerText !== undefined) result.footer_text = doc.footerText;
  if (doc.copyright !== undefined) result.copyright = doc.copyright;
  if (doc.globalCta !== undefined) result.global_cta = doc.globalCta;
  if (doc.loadingMessage !== undefined) result.loading_message = doc.loadingMessage;
  if (doc.emptyStateMessage !== undefined) result.empty_state_message = doc.emptyStateMessage;
  if (doc.notFoundMessage !== undefined) result.not_found_message = doc.notFoundMessage;
  if (doc.pageHeroes !== undefined) result.page_heroes = doc.pageHeroes;
  if (doc.featuredSection !== undefined) result.featured_section = doc.featuredSection;
  if (doc.technicalTaxonomy !== undefined) result.technical_taxonomy = doc.technicalTaxonomy;
  if (doc.distinctionsSection !== undefined) result.distinctions_section = doc.distinctionsSection;
  if (doc.opportunitiesSection !== undefined) result.opportunities_section = doc.opportunitiesSection;
  if (doc.footerSection !== undefined) result.footer_section = doc.footerSection;
  if (doc.aboutSection !== undefined) result.about_section = doc.aboutSection;
  if (doc.skillsPageSettings !== undefined) result.skills_page_settings = doc.skillsPageSettings;
  result.updated_at = new Date().toISOString();
  return result;
}

// 14. Contact Message
export function mapContactMessageFromDb(row: ContactMessageRow): ContactMessageDocument {
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject || undefined,
    message: row.message,
    status: row.status,
    emailDeliveryStatus: row.email_delivery_status,
    emailMessageId: row.email_message_id || undefined,
    turnstileVerified: Boolean(row.turnstile_verified),
    ipHash: row.ip_hash || undefined,
    userAgent: row.user_agent || undefined,
    createdAt: new Date(row.created_at || Date.now()),
    readAt: row.read_at ? new Date(row.read_at) : undefined,
    archivedAt: row.archived_at ? new Date(row.archived_at) : undefined,
  };
}

export function mapContactMessageToDb(doc: Partial<ContactMessageDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.name !== undefined) result.name = doc.name;
  if (doc.email !== undefined) result.email = doc.email;
  if (doc.subject !== undefined) result.subject = doc.subject;
  if (doc.message !== undefined) result.message = doc.message;
  if (doc.status !== undefined) result.status = doc.status;
  if (doc.emailDeliveryStatus !== undefined) result.email_delivery_status = doc.emailDeliveryStatus;
  if (doc.emailMessageId !== undefined) result.email_message_id = doc.emailMessageId;
  if (doc.turnstileVerified !== undefined) result.turnstile_verified = doc.turnstileVerified;
  if (doc.ipHash !== undefined) result.ip_hash = doc.ipHash;
  if (doc.userAgent !== undefined) result.user_agent = doc.userAgent;
  if (doc.readAt !== undefined) result.read_at = doc.readAt ? doc.readAt.toISOString() : null;
  if (doc.archivedAt !== undefined) result.archived_at = doc.archivedAt ? doc.archivedAt.toISOString() : null;
  return result;
}

// 15. Revision
export function mapRevisionFromDb(row: RevisionRow): RevisionDocument {
  return {
    id: row.id,
    _id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    action: row.action,
    previousState: row.previous_state || undefined,
    newState: row.new_state || undefined,
    actor: row.actor,
    timestamp: new Date(row.timestamp || Date.now()),
  };
}

// 16. Activity Log
export function mapActivityLogFromDb(row: ActivityLogRow): ActivityLogDocument {
  return {
    id: row.id,
    _id: row.id,
    event: row.event,
    category: row.category,
    status: row.status,
    actor: row.actor,
    ipAddressMasked: row.ip_address_masked || undefined,
    userAgent: row.user_agent || undefined,
    details: row.details || undefined,
    timestamp: new Date(row.timestamp || Date.now()),
  };
}

// 17. Media
export function mapMediaFromDb(row: MediaRow): MediaMetadataDocument {
  return {
    id: row.id,
    _id: row.id,
    filename: row.filename,
    storageUrl: row.storage_url,
    storageKey: row.storage_key || undefined,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    dimensions: row.dimensions || undefined,
    category: row.category,
    visibility: row.visibility,
    associatedContentType: row.associated_content_type || undefined,
    associatedContentId: row.associated_content_id || undefined,
    createdAt: new Date(row.created_at || Date.now()),
    updatedAt: new Date(row.updated_at || Date.now()),
  };
}

export function mapMediaToDb(doc: Partial<MediaMetadataDocument>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (doc.id) result.id = doc.id;
  if (doc.filename !== undefined) result.filename = doc.filename;
  if (doc.storageUrl !== undefined) result.storage_url = doc.storageUrl;
  if (doc.storageKey !== undefined) result.storage_key = doc.storageKey;
  if (doc.mimeType !== undefined) result.mime_type = doc.mimeType;
  if (doc.sizeBytes !== undefined) result.size_bytes = doc.sizeBytes;
  if (doc.dimensions !== undefined) result.dimensions = doc.dimensions;
  if (doc.category !== undefined) result.category = doc.category;
  if (doc.visibility !== undefined) result.visibility = doc.visibility;
  if (doc.associatedContentType !== undefined) result.associated_content_type = doc.associatedContentType;
  if (doc.associatedContentId !== undefined) result.associated_content_id = doc.associatedContentId;
  result.updated_at = new Date().toISOString();
  return result;
}
