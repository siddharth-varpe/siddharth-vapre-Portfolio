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
export interface HeroImageOverlay {
  enabled: boolean;
  text: string;
  textAlign: "left" | "center" | "right";
  horizontalPosition: "left" | "center" | "right";
  verticalPosition: "top" | "center" | "bottom";
  style: "plain" | "badge" | "technical";
  textColor?: "light" | "dark" | "accent";
}

export interface HeroDocument extends MongoBaseDocument {
  eyebrow: string;
  name: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  supportingText?: string;
  imageOverlay?: HeroImageOverlay;
  status: ContentStatus;
}

export type HeroVariant =
  | "home"
  | "editorial"
  | "split"
  | "evidence"
  | "showcase"
  | "technical"
  | "credentials"
  | "conversion"
  | "project_detail";

export interface HeroCtaConfig {
  label: string;
  url: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  external?: boolean;
  download?: boolean;
  icon?: "arrow" | "download" | "mail" | "external" | "github";
}

export interface HeroStatConfig {
  label: string;
  value: string;
  description?: string;
}

export interface PageHeroConfig {
  pageKey: string;
  enabled: boolean;
  variant: HeroVariant;
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  primaryCta?: HeroCtaConfig;
  secondaryCta?: HeroCtaConfig;
  image?: string;
  imagePosition?: "left" | "right" | "background" | "overlay";
  alignment?: "left" | "center";
  accent?: "default" | "blue" | "emerald" | "amber" | "purple";
  stats?: HeroStatConfig[];
}

// 3. About Domain
export interface AboutDocument extends MongoBaseDocument {
  aboutDescription?: string;
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
export interface SkillCategoryDocument extends MongoBaseDocument {
  name: string;
  description?: string;
  icon?: string;
  accent?: string;
  display_order?: number;
  order?: number;
  enabled: boolean;
}

export interface SkillsPageMetricConfig {
  id: string;
  label: string;
  supportingText: string;
  icon: string;
  order: number;
  enabled: boolean;
  type: "tech_count" | "domain_count" | "custom";
  customValue?: string;
}

export interface SkillsPageApproachBannerConfig {
  enabled: boolean;
  eyebrow: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  ctaText: string;
  ctaDestination: string;
}

export interface SkillsPageSettings {
  enabled: boolean;
  eyebrow: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  orbitEnabled: boolean;
  orbitSpeed: "slow" | "very-slow" | "ultra-slow";
  orbitDirection: "clockwise" | "counterclockwise";
  maxOrbitNodes: number;
  centerVisualEnabled: boolean;
  centerVisualText: string;
  centerVisualAccent: string;
  backgroundArtEnabled: boolean;
  backgroundArtOpacity: "faint" | "subtle" | "medium";
  metrics: SkillsPageMetricConfig[];
  approachBanner: SkillsPageApproachBannerConfig;
}

export interface SkillDocument extends MongoBaseDocument {
  name: string;
  category: "Frontend" | "Backend" | "AI & ML" | "DevOps & Cloud" | "Tools & Systems" | string;
  description?: string;
  icon?: string;
  level?: "Proficient" | "Advanced" | "Familiar";
  years?: number;
  featured: boolean;
  orbit_enabled?: boolean;
  order: number;
  status: ContentStatus;
}

// 5. Experience / Professional Track Domain
export type SemanticWorkType =
  | "crm"
  | "inventory"
  | "api"
  | "ai"
  | "automation"
  | "database"
  | "frontend"
  | "backend"
  | "fullstack"
  | "infrastructure"
  | "other";

export interface ExperienceHighlight {
  id: string;
  title: string;
  description: string;
  type: SemanticWorkType;
  metrics?: string[];
  technologies?: string[];
  order: number;
  enabled: boolean;
  destinationUrl?: string;
}

export type ExperienceType = "work" | "education" | "achievement" | "project" | "other";

export interface ExperienceDocument extends MongoBaseDocument {
  company: string;
  role: string;
  type?: ExperienceType;
  companyLogoUrl?: string;
  companyLogoPath?: string;
  companyWebsite?: string;
  employmentType: "Full-time" | "Contract" | "Freelance" | "Internship" | "Education" | "Other";
  workMode?: "On-site" | "Hybrid" | "Remote";
  location: string;
  startDate: string; // ISO format or MM/YYYY or "Jun 2026"
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements?: string[];
  technologies: string[];
  metrics?: string[];
  highlights?: ExperienceHighlight[];
  ctaLabel?: string;
  ctaUrl?: string;
  order: number;
  status: ContentStatus;
}

export interface OperationalEvidenceItem {
  id: string;
  label: string;
  value: string;
  supportingText?: string;
  icon: "users" | "database" | "zap" | "clock" | "chart" | "activity" | "trending";
  sourceContext?: string;
  sourceUrl?: string;
  order: number;
  enabled: boolean;
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

// 8. Certifications & Distinctions Domain
export type CredentialType = "certification" | "award" | "honor" | "license";

export interface CertificationDocument extends MongoBaseDocument {
  name: string;
  title?: string;
  issuer: string;
  credentialType?: CredentialType;
  date: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  certificateUrl?: string;
  imagePath?: string;
  tags?: string[];
  rank?: string;
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

// 13. Featured Highlights Domain
export type FeaturedItemType = "project" | "experience" | "achievement" | "certification";
export type FeaturedAccent = "blue" | "green" | "orange" | "purple";

export interface FeaturedItemBadge {
  text: string;
  icon?: string;
  visible?: boolean;
}

export interface FeaturedItemMetadata {
  location?: string;
  duration?: string;
  organization?: string;
  rank?: string;
  issuer?: string;
  date?: string;
}

export interface FeaturedItemImage {
  url: string;
  alt?: string;
  visible?: boolean;
  position?: "right" | "bottom" | "cover" | "contain";
}

export interface FeaturedItemCta {
  text: string;
  link: string;
}

export interface FeaturedItem {
  id: string;
  type: FeaturedItemType;
  enabled: boolean;
  order: number;
  badge: FeaturedItemBadge;
  title: string;
  subtitle?: string;
  description: string;
  metadata?: FeaturedItemMetadata;
  tags?: string[];
  image?: FeaturedItemImage;
  accent: FeaturedAccent;
  primaryCta: FeaturedItemCta;
  secondaryCta?: FeaturedItemCta;
  annotation?: string;
}

export interface FeaturedSectionConfig {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  items: FeaturedItem[];
}

// 14. Technical Taxonomy Domain
export interface TaxonomySkillItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  enabled: boolean;
  link?: string;
  ariaLabel?: string;
}

export interface TechnicalTaxonomyConfig {
  enabled: boolean;
  eyebrow: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  sectionIcon: string;
  decorativeVisual: {
    enabled: boolean;
    assetUrl: string;
    position: "top-right" | "center-right" | "bottom-right";
    mobileVisibility: "show" | "hide";
    opacityPreset: "subtle" | "medium";
    accentVariant: "blue" | "neutral";
  };
  cta: {
    enabled: boolean;
    text: string;
    destination: string;
  };
  skills: TaxonomySkillItem[];
}

// 15. Site Content Domain
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
  pageHeroes?: Record<string, PageHeroConfig>;
  featuredSection?: FeaturedSectionConfig;
  technicalTaxonomy?: TechnicalTaxonomyConfig;
  distinctionsSection?: DistinctionsSectionConfig;
  opportunitiesSection?: OpportunitiesSectionConfig;
  footerSection?: FooterSectionConfig;
  aboutSection?: AboutSectionConfig;
  skillsPageSettings?: SkillsPageSettings;
}

// 15B. Open For Opportunities Domain
export interface OpportunityBadge {
  id: string;
  label: string;
  icon: "users" | "database" | "lightning" | "sparkles" | "code" | "server";
}

export interface OpportunitiesSectionConfig {
  enabled: boolean;
  eyebrow: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badges: OpportunityBadge[];
}

// 15C. Footer Domain
export interface FooterMetricsConfig {
  projectsLabel: string;
  projectsValue?: string;
  showProjects: boolean;
  awardsLabel: string;
  awardsValue?: string;
  showAwards: boolean;
  opportunitiesLabel: string;
  opportunitiesValue: string;
  showOpportunities: boolean;
}

export interface FooterConnectConfig {
  enabled: boolean;
  title: string;
  description: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export interface FooterArtworkConfig {
  enabled: boolean;
  desktopArtworkUrl: string;
  mobileArtworkUrl: string;
  desktopVisibility: "show" | "hide";
  mobileVisibility: "show" | "hide";
  positionPreset: "right" | "center" | "split";
  opacityPreset: "subtle" | "medium" | "full";
}

export interface FooterBottomBarConfig {
  tagline: string;
  adminLinkText: string;
  showPrivacy: boolean;
  privacyText: string;
  privacyUrl?: string;
  showTerms: boolean;
  termsText: string;
  termsUrl?: string;
}

export interface FooterSectionConfig {
  enabled: boolean;
  title: string;
  professionalTitle: string;
  description: string;
  metrics: FooterMetricsConfig;
  connect: FooterConnectConfig;
  artwork: FooterArtworkConfig;
  bottomBar: FooterBottomBarConfig;
}

// 15D. About Section Domain
export interface AboutMetricItem {
  id: string;
  enabled: boolean;
  sourceType: "projects" | "achievements" | "certifications" | "custom";
  customValue?: string;
  label: string;
  supportingText?: string;
  icon: "code" | "trophy" | "book" | "lightning" | "award" | "star";
  order: number;
}

export interface AboutTimelineItem {
  id: string;
  enabled: boolean;
  period: string;
  title: string;
  organization: string;
  subtitle?: string;
  bullets: string[];
  category: "work" | "education" | "growth" | "achievement" | "other";
  order: number;
}

export interface AboutPillarItem {
  id: string;
  enabled: boolean;
  number: string;
  icon: "cube" | "brain" | "layers" | "system" | "shield" | "code";
  title: string;
  description: string;
  destinationUrl?: string;
  order: number;
}

export interface AboutSectionConfig {
  enabled: boolean;
  eyebrow: string;
  educationBadge: string;
  titlePrimary: string;
  titleAccent: string;
  description?: string;
  portraitAsset: string;
  contextBadge: {
    enabled: boolean;
    label: string;
    subtext: string;
  };
  metrics: AboutMetricItem[];
  personalDetails: {
    location: string;
    education: string;
    availability: string;
  };
  actions: {
    primaryLabel: string;
    primaryUrl: string;
    secondaryLabel: string;
    secondaryUrl: string;
  };
  backgroundSection: {
    eyebrow: string;
    heading: string;
    description: string;
    quote: string;
  };
  timeline: AboutTimelineItem[];
  pillars: AboutPillarItem[];
  closingVisual: {
    enabled: boolean;
    imageUrl: string;
    quote: string;
  };
}

export interface ResolvedAboutMetric {
  id: string;
  enabled: boolean;
  label: string;
  value: string;
  supportingText?: string;
  icon: "code" | "trophy" | "book" | "lightning" | "award" | "star";
  order: number;
}

export interface PublishedAboutPageData {
  config: AboutSectionConfig;
  profile: ProfileDocument | null;
  about: AboutDocument | null;
  metrics: ResolvedAboutMetric[];
}


// 16. Verified Distinctions Domain
export interface DistinctionsDecorativeVisual {
  enabled: boolean;
  trophyAssetUrl?: string;
  certificateAssetUrl?: string;
  position: "top-right" | "bottom-right";
  mobileVisibility: "show" | "hide";
  opacityPreset: "subtle" | "medium" | "full";
  accentVariant: "gold" | "blue" | "neutral";
}

export interface DistinctionsMetricsConfig {
  ranksLabel: string;
  ranksSubtext: string;
  certificationsLabel: string;
  certificationsSubtext: string;
  verifiedLabel: string;
  verifiedSubtext: string;
}

export interface DistinctionsSectionConfig {
  enabled: boolean;
  eyebrow: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  sectionIcon: "award" | "medal" | "trophy" | "badge" | "star";
  decorativeVisual: DistinctionsDecorativeVisual;
  metrics: DistinctionsMetricsConfig;
  cta: {
    enabled: boolean;
    text: string;
    destination: string;
  };
}

export interface DistinctionMetrics {
  ranksCount: number;
  certificationsCount: number;
  verifiedPercentage: number;
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
  category: "project" | "profile" | "certificate" | "achievement" | "resume" | "general" | "company-logo";
  visibility: "public" | "private";
  associatedContentType?: "profile" | "project" | "achievement" | "certification" | "experience";
  associatedContentId?: string;
}
