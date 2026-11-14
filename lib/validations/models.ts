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
  category: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).optional(),
  icon: z.string().trim().max(60).optional(),
  level: z.enum(["Proficient", "Advanced", "Familiar"]).optional(),
  years: z.number().int().min(0).max(50).optional(),
  featured: z.boolean().default(false),
  orbit_enabled: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("draft"),
});

export const skillCategoryMutationSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).optional(),
  icon: z.string().trim().max(60).optional(),
  accent: z.string().trim().max(40).default("blue"),
  display_order: z.number().int().min(0).default(0),
  enabled: z.boolean().default(true),
});

export const skillsPageMetricSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1).max(80),
  supportingText: z.string().trim().max(120).default(""),
  icon: z.string().trim().default("code"),
  order: z.number().int().min(0).default(0),
  enabled: z.boolean().default(true),
  type: z.enum(["tech_count", "domain_count", "custom"]).default("custom"),
  customValue: z.string().trim().max(40).optional(),
});

export const skillsPageSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().trim().max(80).default("SKILLS"),
  titlePrimary: z.string().trim().max(120).default("Tools, Technologies and Skills"),
  titleAccent: z.string().trim().max(120).default("I Work With."),
  description: z.string().trim().max(500).default("A curated set of tools and technologies I use to design, develop, and deploy real-world solutions."),
  orbitEnabled: z.boolean().default(true),
  orbitSpeed: z.enum(["slow", "very-slow", "ultra-slow"]).default("slow"),
  orbitDirection: z.enum(["clockwise", "counterclockwise"]).default("clockwise"),
  maxOrbitNodes: z.number().int().min(3).max(20).default(8),
  centerVisualEnabled: z.boolean().default(true),
  centerVisualText: z.string().trim().max(200).default("Build\nCreate\nSolve\nGrow"),
  centerVisualAccent: z.string().trim().max(40).default("Grow"),
  backgroundArtEnabled: z.boolean().default(true),
  backgroundArtOpacity: z.enum(["faint", "subtle", "medium"]).default("subtle"),
  metrics: z.array(skillsPageMetricSchema).default([]),
  approachBanner: z.object({
    enabled: z.boolean().default(true),
    eyebrow: z.string().trim().max(80).default("MY APPROACH"),
    titlePrimary: z.string().trim().max(120).default("The right tools turn ideas into"),
    titleAccent: z.string().trim().max(80).default("real impact."),
    description: z.string().trim().max(500).default("I'm always exploring new technologies and expanding my skillset to build better, faster and more meaningful solutions."),
    ctaText: z.string().trim().max(80).default("Let's Build Something Amazing"),
    ctaDestination: z.string().trim().max(200).default("/contact"),
  }).default({
    enabled: true,
    eyebrow: "MY APPROACH",
    titlePrimary: "The right tools turn ideas into",
    titleAccent: "real impact.",
    description: "I'm always exploring new technologies and expanding my skillset to build better, faster and more meaningful solutions.",
    ctaText: "Let's Build Something Amazing",
    ctaDestination: "/contact",
  }),
});

// 3. Experience / Professional Track Mutation Schema
export const semanticWorkTypeSchema = z.enum([
  "crm",
  "inventory",
  "api",
  "ai",
  "automation",
  "database",
  "frontend",
  "backend",
  "fullstack",
  "infrastructure",
  "other",
]);

export const experienceHighlightSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(3000),
  type: semanticWorkTypeSchema.default("other"),
  metrics: z.array(z.string().trim().max(100)).optional().default([]),
  technologies: z.array(z.string().trim().max(60)).optional().default([]),
  order: z.number().int().min(0).default(0),
  enabled: z.boolean().default(true),
  destinationUrl: safeUrlSchema.optional().or(z.literal("")),
});

export const experienceTypeSchema = z.enum([
  "work",
  "education",
  "achievement",
  "project",
  "other",
]);

export const experienceMutationSchema = z.object({
  type: experienceTypeSchema.optional().default("work"),
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  companyLogoUrl: safeUrlSchema.optional().or(z.literal("")),
  companyLogoPath: z.string().trim().optional().or(z.literal("")),
  companyWebsite: safeUrlSchema.optional().or(z.literal("")),
  employmentType: z.enum(["Full-time", "Contract", "Freelance", "Internship", "Education", "Other"]).default("Full-time"),
  workMode: z.enum(["On-site", "Hybrid", "Remote"]).default("Hybrid"),
  location: z.string().trim().min(1).max(100),
  startDate: z.string().trim().min(2).max(30),
  endDate: z.string().trim().max(30).optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z.string().trim().min(5).max(3000),
  responsibilities: z.array(z.string().trim().min(1).max(500)).default([]),
  achievements: z.array(z.string().trim().min(1).max(500)).optional(),
  technologies: z.array(z.string().trim().min(1).max(60)).default([]),
  metrics: z.array(z.string().trim().min(1).max(200)).optional(),
  highlights: z.array(experienceHighlightSchema).optional().default([]),
  ctaLabel: z.string().trim().max(50).optional().default("Full Timeline"),
  ctaUrl: z.string().trim().max(200).optional().default("/experience"),
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
export const heroImageOverlaySchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string().trim().max(300).default(""),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
  horizontalPosition: z.enum(["left", "center", "right"]).default("center"),
  verticalPosition: z.enum(["top", "center", "bottom"]).default("bottom"),
  style: z.enum(["plain", "badge", "technical"]).default("badge"),
  textColor: z.enum(["light", "dark", "accent"]).default("light").optional(),
});

export const heroMutationSchema = z.object({
  eyebrow: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  headline: z.string().trim().min(1).max(250),
  description: z.string().trim().min(10).max(1000),
  ctaLabel: z.string().trim().min(1).max(50),
  ctaUrl: z.string().trim().min(1).max(200),
  supportingText: z.string().trim().max(250).optional(),
  imageOverlay: heroImageOverlaySchema.optional(),
  status: contentStatusSchema.default("published"),
});

// 7. About Mutation Schema
export const aboutMutationSchema = z.object({
  aboutDescription: z.string().trim().max(1000).optional(),
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
export const credentialTypeSchema = z.enum(["certification", "award", "honor", "license"]).default("certification");

export const certificationMutationSchema = z.object({
  name: z.string().trim().min(1).max(150),
  title: z.string().trim().max(150).optional(),
  issuer: z.string().trim().min(1).max(150),
  credentialType: credentialTypeSchema.default("certification"),
  date: z.string().trim().min(4).max(30),
  issueDate: z.string().trim().max(30).optional(),
  expirationDate: z.string().trim().max(30).optional(),
  credentialId: z.string().trim().max(100).optional(),
  credentialUrl: safeUrlSchema.optional(),
  verificationUrl: safeUrlSchema.optional(),
  certificateUrl: safeUrlSchema.optional(),
  imagePath: z.string().trim().max(250).optional(),
  tags: z.array(z.string().trim().max(50)).default([]),
  rank: z.string().trim().max(50).optional(),
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
export const safeCtaDestinationSchema = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine(
    (url) =>
      url.startsWith("/") ||
      url.startsWith("#") ||
      url.startsWith("https://") ||
      url.startsWith("http://") ||
      url.startsWith("mailto:"),
    "Destination must be a valid relative path, anchor, https://, or mailto: URL"
  )
  .refine(
    (url) => !url.toLowerCase().startsWith("javascript:") && !url.toLowerCase().startsWith("data:"),
    "Script or data URLs are strictly disallowed"
  );

export const heroVariantSchema = z.enum([
  "home",
  "editorial",
  "split",
  "evidence",
  "showcase",
  "technical",
  "credentials",
  "conversion",
  "project_detail",
]);

export const heroCtaSchema = z.object({
  label: z.string().trim().min(1).max(60),
  url: safeCtaDestinationSchema,
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).optional(),
  external: z.boolean().optional(),
  download: z.boolean().optional(),
  icon: z.enum(["arrow", "download", "mail", "external", "github"]).optional(),
});

export const heroStatSchema = z.object({
  label: z.string().trim().min(1).max(50),
  value: z.string().trim().min(1).max(30),
  description: z.string().trim().max(120).optional(),
});

export const pageHeroConfigSchema = z.object({
  pageKey: z.string().trim().min(1).max(50),
  enabled: z.boolean().default(true),
  variant: heroVariantSchema,
  eyebrow: z.string().trim().max(100).optional(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(600).optional(),
  badge: z.string().trim().max(80).optional(),
  primaryCta: heroCtaSchema.optional(),
  secondaryCta: heroCtaSchema.optional(),
  image: z.string().trim().max(300).optional(),
  imagePosition: z.enum(["left", "right", "background", "overlay"]).optional(),
  alignment: z.enum(["left", "center"]).optional(),
  accent: z.enum(["default", "blue", "emerald", "amber", "purple"]).optional(),
  stats: z.array(heroStatSchema).max(6).optional(),
});

export const featuredAccentSchema = z.enum(["blue", "green", "orange", "purple"]);
export const featuredItemTypeSchema = z.enum(["project", "experience", "achievement", "certification"]);

export const featuredItemBadgeSchema = z.object({
  text: z.string().trim().min(1).max(50),
  icon: z.string().trim().max(30).optional(),
  visible: z.boolean().default(true),
});

export const featuredItemMetadataSchema = z.object({
  location: z.string().trim().max(100).optional(),
  duration: z.string().trim().max(100).optional(),
  organization: z.string().trim().max(100).optional(),
  rank: z.string().trim().max(50).optional(),
  issuer: z.string().trim().max(100).optional(),
  date: z.string().trim().max(50).optional(),
});

export const featuredItemImageSchema = z.object({
  url: z.string().trim().min(1).max(500),
  alt: z.string().trim().max(150).optional(),
  visible: z.boolean().default(true),
  position: z.enum(["right", "bottom", "cover", "contain"]).default("right"),
});

export const featuredItemCtaSchema = z.object({
  text: z.string().trim().min(1).max(50),
  link: safeCtaDestinationSchema,
});

export const featuredItemSchema = z.object({
  id: z.string().trim().min(1).max(50),
  type: featuredItemTypeSchema,
  enabled: z.boolean().default(true),
  order: z.number().int().min(1).max(4),
  badge: featuredItemBadgeSchema,
  title: z.string().trim().min(1).max(100),
  subtitle: z.string().trim().max(100).optional(),
  description: z.string().trim().min(1).max(300),
  metadata: featuredItemMetadataSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  image: featuredItemImageSchema.optional(),
  accent: featuredAccentSchema,
  primaryCta: featuredItemCtaSchema,
  secondaryCta: featuredItemCtaSchema.optional(),
  annotation: z.string().trim().max(60).optional(),
});

export const featuredSectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().trim().min(1).max(50).default("FEATURED"),
  title: z.string().trim().min(1).max(100).default("Featured Highlights"),
  description: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .default(
      "A quick look at the work, experience and achievements I'm most proud of. More projects, certifications and contributions on the dedicated page."
    ),
  ctaText: z.string().trim().min(1).max(50).default("View All Featured"),
  ctaLink: safeCtaDestinationSchema.default("/projects"),
  items: z.array(featuredItemSchema).max(4),
});

export const taxonomySkillItemSchema = z.object({
  id: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(60),
  category: z.string().trim().min(1).max(60),
  icon: z.string().trim().min(1).max(50),
  order: z.number().int().min(0).max(999),
  enabled: z.boolean().default(true),
  link: safeCtaDestinationSchema.optional(),
  ariaLabel: z.string().trim().max(100).optional(),
});

export const technicalTaxonomyConfigSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().trim().min(1).max(60).default("TECHNICAL TAXONOMY"),
  titlePrimary: z.string().trim().min(1).max(60).default("Technical"),
  titleAccent: z.string().trim().min(1).max(60).default("Taxonomy"),
  description: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .default(
      "Categorized skills across React.js, Next.js, Node.js, Python, PostgreSQL, and REST/WebSocket architectures."
    ),
  sectionIcon: z.string().trim().min(1).max(50).default("code"),
  decorativeVisual: z.object({
    enabled: z.boolean().default(true),
    assetUrl: z.string().trim().min(1).max(255).default("/images/taxonomy-window-illustration.png"),
    position: z.enum(["top-right", "center-right", "bottom-right"]).default("top-right"),
    mobileVisibility: z.enum(["show", "hide"]).default("show"),
    opacityPreset: z.enum(["subtle", "medium"]).default("medium"),
    accentVariant: z.enum(["blue", "neutral"]).default("blue"),
  }),
  cta: z.object({
    enabled: z.boolean().default(true),
    text: z.string().trim().min(1).max(60).default("Explore Full Skill Catalog"),
    destination: safeCtaDestinationSchema.default("/skills"),
  }),
  skills: z.array(taxonomySkillItemSchema).max(50),
});

// 13B. Distinctions Section Mutation Schema
export const distinctionsSectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().trim().min(1).max(80).default("VERIFIED DISTINCTIONS"),
  titlePrimary: z.string().trim().min(1).max(80).default("Verified"),
  titleAccent: z.string().trim().min(1).max(80).default("Distinctions"),
  description: z.string().trim().min(1).max(500),
  sectionIcon: z.enum(["award", "medal", "trophy", "badge", "star"]).default("award"),
  decorativeVisual: z
    .object({
      enabled: z.boolean().default(true),
      trophyAssetUrl: z.string().trim().optional(),
      certificateAssetUrl: z.string().trim().optional(),
      position: z.enum(["top-right", "bottom-right"]).default("top-right"),
      mobileVisibility: z.enum(["show", "hide"]).default("show"),
      opacityPreset: z.enum(["subtle", "medium", "full"]).default("medium"),
      accentVariant: z.enum(["gold", "blue", "neutral"]).default("gold"),
    })
    .default({
      enabled: true,
      position: "top-right",
      mobileVisibility: "show",
      opacityPreset: "medium",
      accentVariant: "gold",
    }),
  metrics: z
    .object({
      ranksLabel: z.string().trim().min(1).max(60).default("University Ranks"),
      ranksSubtext: z.string().trim().min(1).max(80).default("Prompt Engineering"),
      certificationsLabel: z.string().trim().min(1).max(60).default("Certifications"),
      certificationsSubtext: z.string().trim().min(1).max(80).default("NxtWave & More"),
      verifiedLabel: z.string().trim().min(1).max(60).default("Verified"),
      verifiedSubtext: z.string().trim().min(1).max(80).default("Authentic Credentials"),
    })
    .default({
      ranksLabel: "University Ranks",
      ranksSubtext: "Prompt Engineering",
      certificationsLabel: "Certifications",
      certificationsSubtext: "NxtWave & More",
      verifiedLabel: "Verified",
      verifiedSubtext: "Authentic Credentials",
    }),
  cta: z
    .object({
      enabled: z.boolean().default(true),
      text: z.string().trim().min(1).max(80).default("View Honors & Certifications"),
      destination: safeCtaDestinationSchema.default("/certifications"),
    })
    .default({
      enabled: true,
      text: "View Honors & Certifications",
      destination: "/certifications",
    }),
});

// 13C. Open For Opportunities Mutation Schema
export const opportunityBadgeSchema = z.object({
  id: z.string().trim().min(1).max(50),
  label: z.string().trim().min(1).max(80),
  icon: z.enum(["users", "database", "lightning", "sparkles", "code", "server"]).default("users"),
});

export const opportunitiesSectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().trim().min(1).max(80).default("OPEN FOR OPPORTUNITIES"),
  titlePrimary: z.string().trim().min(1).max(120).default("Ready to engineer high-impact systems"),
  titleAccent: z.string().trim().min(1).max(60).default("together."),
  description: z.string().trim().min(1).max(500),
  primaryCtaText: z.string().trim().min(1).max(80).default("Get in Touch"),
  primaryCtaLink: safeCtaDestinationSchema.default("/contact"),
  secondaryCtaText: z.string().trim().min(1).max(80).default("Download Resume PDF"),
  secondaryCtaLink: safeCtaDestinationSchema.default("/api/resume/download"),
  badges: z.array(opportunityBadgeSchema).max(10).default([
    { id: "badge-1", label: "Full-Stack Development", icon: "users" },
    { id: "badge-2", label: "Distributed Systems", icon: "database" },
    { id: "badge-3", label: "AI Applications", icon: "lightning" },
  ]),
});

export const footerMetricsConfigSchema = z.object({
  projectsLabel: z.string().trim().min(1).max(50).default("Projects"),
  projectsValue: z.string().trim().max(50).optional(),
  showProjects: z.boolean().default(true),
  awardsLabel: z.string().trim().min(1).max(50).default("Awards"),
  awardsValue: z.string().trim().max(50).optional(),
  showAwards: z.boolean().default(true),
  opportunitiesLabel: z.string().trim().min(1).max(50).default("Open to"),
  opportunitiesValue: z.string().trim().min(1).max(50).default("Opportunities"),
  showOpportunities: z.boolean().default(true),
});

export const footerConnectConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().trim().min(1).max(100).default("Let's Build Something Amazing"),
  description: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .default("Open to full-time roles, collaborations and interesting projects."),
  primaryButtonLabel: z.string().trim().min(1).max(50).default("Get in Touch"),
  primaryButtonHref: z.string().trim().min(1).max(200).default("/contact"),
  githubUrl: z.string().trim().max(300).optional(),
  linkedinUrl: z.string().trim().max(300).optional(),
  email: z.string().trim().max(100).optional(),
});

export const footerArtworkConfigSchema = z.object({
  enabled: z.boolean().default(true),
  desktopArtworkUrl: z.string().trim().min(1).max(300).default("/images/footer/developer-desk-scene.webp"),
  mobileArtworkUrl: z.string().trim().min(1).max(300).default("/images/footer/mountain-connect-bg.jpg"),
  desktopVisibility: z.enum(["show", "hide"]).default("show"),
  mobileVisibility: z.enum(["show", "hide"]).default("show"),
  positionPreset: z.enum(["right", "center", "split"]).default("right"),
  opacityPreset: z.enum(["subtle", "medium", "full"]).default("full"),
});

export const footerBottomBarConfigSchema = z.object({
  tagline: z.string().trim().min(1).max(100).default("ENGINEER • BUILD • IMPACT"),
  adminLinkText: z.string().trim().min(1).max(50).default("Admin Gateway"),
  showPrivacy: z.boolean().default(false),
  privacyText: z.string().trim().min(1).max(50).default("Privacy"),
  privacyUrl: z.string().trim().max(200).optional(),
  showTerms: z.boolean().default(false),
  termsText: z.string().trim().min(1).max(50).default("Terms"),
  termsUrl: z.string().trim().max(200).optional(),
});

export const footerSectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().trim().min(1).max(100).default("Siddharth Varpe"),
  professionalTitle: z.string().trim().min(1).max(100).default("SOFTWARE ENGINEER | AI & FULL-STACK"),
  description: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .default(
      "Building real solutions with code, AI, and measurable impact. Dedicated to architecting scalable distributed systems, robust full-stack platforms, and verified engineering proofs."
    ),
  metrics: footerMetricsConfigSchema.default({
    projectsLabel: "Projects",
    showProjects: true,
    awardsLabel: "Awards",
    showAwards: true,
    opportunitiesLabel: "Open to",
    opportunitiesValue: "Opportunities",
    showOpportunities: true,
  }),
  connect: footerConnectConfigSchema.default({
    enabled: true,
    title: "Let's Build Something Amazing",
    description: "Open to full-time roles, collaborations and interesting projects.",
    primaryButtonLabel: "Get in Touch",
    primaryButtonHref: "/contact",
  }),
  artwork: footerArtworkConfigSchema.default({
    enabled: true,
    desktopArtworkUrl: "/images/footer/developer-desk-scene.webp",
    mobileArtworkUrl: "/images/footer/mountain-connect-bg.jpg",
    desktopVisibility: "show",
    mobileVisibility: "show",
    positionPreset: "right",
    opacityPreset: "full",
  }),
  bottomBar: footerBottomBarConfigSchema.default({
    tagline: "ENGINEER • BUILD • IMPACT",
    adminLinkText: "Admin Gateway",
    showPrivacy: false,
    privacyText: "Privacy",
    showTerms: false,
    termsText: "Terms",
  }),
});

export const aboutMetricItemSchema = z.object({
  id: z.string().trim().min(1),
  enabled: z.boolean().default(true),
  sourceType: z.enum(["projects", "achievements", "certifications", "custom"]).default("custom"),
  customValue: z.string().trim().max(50).optional(),
  label: z.string().trim().min(1).max(100),
  supportingText: z.string().trim().max(100).optional(),
  icon: z.enum(["code", "trophy", "book", "lightning", "award", "star"]).default("code"),
  order: z.number().int().min(0).default(0),
});

export const aboutTimelineItemSchema = z.object({
  id: z.string().trim().min(1),
  enabled: z.boolean().default(true),
  period: z.string().trim().min(1).max(50),
  title: z.string().trim().min(1).max(100),
  organization: z.string().trim().min(1).max(150),
  subtitle: z.string().trim().max(150).optional(),
  bullets: z.array(z.string().trim().min(1).max(300)).default([]),
  category: z.enum(["work", "education", "growth", "achievement", "other"]).default("work"),
  order: z.number().int().min(0).default(0),
});

export const aboutPillarItemSchema = z.object({
  id: z.string().trim().min(1),
  enabled: z.boolean().default(true),
  number: z.string().trim().min(1).max(10),
  icon: z.enum(["cube", "brain", "layers", "system", "shield", "code"]).default("cube"),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(500),
  destinationUrl: z.string().trim().max(200).optional(),
  order: z.number().int().min(0).default(0),
});

export const aboutSectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().trim().min(1).max(100).default("ABOUT ME"),
  educationBadge: z.string().trim().min(1).max(100).default("Undergraduate Engineer • 2024 – 2028"),
  titlePrimary: z.string().trim().min(1).max(100).default("Turning Ideas into"),
  titleAccent: z.string().trim().min(1).max(100).default("Real Impact."),
  description: z.string().trim().max(1000).optional(),
  portraitAsset: z.string().trim().min(1).max(255).default("/images/siddharth-face-original.png"),
  contextBadge: z.object({
    enabled: z.boolean().default(true),
    label: z.string().trim().min(1).max(100).default("Currently Learning"),
    subtext: z.string().trim().min(1).max(150).default("Full-Stack Development & AI"),
  }).default({
    enabled: true,
    label: "Currently Learning",
    subtext: "Full-Stack Development & AI",
  }),
  metrics: z.array(aboutMetricItemSchema).default([]),
  personalDetails: z.object({
    location: z.string().trim().min(1).max(150).default("Pune, Maharashtra, India"),
    education: z.string().trim().min(1).max(150).default("Undergraduate Engineer (2024 – 2028)"),
    availability: z.string().trim().min(1).max(150).default("Open to Opportunities"),
  }).default({
    location: "Pune, Maharashtra, India",
    education: "Undergraduate Engineer (2024 – 2028)",
    availability: "Open to Opportunities",
  }),
  actions: z.object({
    primaryLabel: z.string().trim().min(1).max(50).default("View My Journey"),
    primaryUrl: z.string().trim().min(1).max(200).default("#experience"),
    secondaryLabel: z.string().trim().min(1).max(50).default("Resume PDF"),
    secondaryUrl: z.string().trim().min(1).max(200).default("/api/resume/download"),
  }).default({
    primaryLabel: "View My Journey",
    primaryUrl: "#experience",
    secondaryLabel: "Resume PDF",
    secondaryUrl: "/api/resume/download",
  }),
  backgroundSection: z.object({
    eyebrow: z.string().trim().min(1).max(100).default("EXPERIENCE & BACKGROUND"),
    heading: z.string().trim().min(1).max(200).default("Engineering with clarity, discipline, and measurable outcomes."),
    description: z.string().trim().max(1000).default("I work on full-stack web applications, AI integrations, and real-world problem solving. I enjoy collaborating in teams and delivering useful products through automated workflows, optimized operations, and clean, user-focused design."),
    quote: z.string().trim().max(500).default("Build software and systems that are useful, simple, and scalable — with a focus on real impact."),
  }).default({
    eyebrow: "EXPERIENCE & BACKGROUND",
    heading: "Engineering with clarity, discipline, and measurable outcomes.",
    description: "I work on full-stack web applications, AI integrations, and real-world problem solving. I enjoy collaborating in teams and delivering useful products through automated workflows, optimized operations, and clean, user-focused design.",
    quote: "Build software and systems that are useful, simple, and scalable — with a focus on real impact.",
  }),
  timeline: z.array(aboutTimelineItemSchema).default([]),
  pillars: z.array(aboutPillarItemSchema).default([]),
  closingVisual: z.object({
    enabled: z.boolean().default(true),
    imageUrl: z.string().trim().min(1).max(255).default("/images/about/about-closing-landscape.jpg"),
    quote: z.string().trim().max(200).default("A better tomorrow is built today with what you learn now."),
  }).default({
    enabled: true,
    imageUrl: "/images/about/about-closing-landscape.jpg",
    quote: "A better tomorrow is built today with what you learn now.",
  }),
});

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
  pageHeroes: z.record(z.string(), pageHeroConfigSchema).optional(),
  featuredSection: featuredSectionConfigSchema.optional(),
  technicalTaxonomy: technicalTaxonomyConfigSchema.optional(),
  distinctionsSection: distinctionsSectionConfigSchema.optional(),
  opportunitiesSection: opportunitiesSectionConfigSchema.optional(),
  footerSection: footerSectionConfigSchema.optional(),
  aboutSection: aboutSectionConfigSchema.optional(),
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
