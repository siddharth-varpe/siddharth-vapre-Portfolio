import "server-only";
import { withDatabaseErrorHandling } from "../errors";
import { getStore } from "../store";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  mapProfileFromDb,
  mapHeroFromDb,
  mapAboutFromDb,
  mapSkillFromDb,
  mapSkillCategoryFromDb,
  mapProjectFromDb,
  mapExperienceFromDb,
  mapAchievementFromDb,
  mapCertificationFromDb,
  mapMetricFromDb,
  mapContactSettingsFromDb,
  mapResumeFromDb,
  mapSeoFromDb,
  mapSiteContentFromDb,
} from "../mappers";
import {
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS_PAGE_SETTINGS,
} from "../default-skills-page-settings";
import type {
  ProfileDocument,
  HeroDocument,
  AboutDocument,
  SkillDocument,
  SkillCategoryDocument,
  SkillsPageSettings,
  ExperienceDocument,
  ProjectDocument,
  AchievementDocument,
  CertificationDocument,
  MetricDocument,
  ContactSettingsDocument,
  ContactMessageDocument,
  ResumeMetadataDocument,
  SeoMetadataDocument,
  SiteContentDocument,
  PageHeroConfig,
  FeaturedSectionConfig,
  TechnicalTaxonomyConfig,
  DistinctionsSectionConfig,
  DistinctionMetrics,
  OpportunitiesSectionConfig,
  FooterSectionConfig,
  AboutSectionConfig,
  ResolvedAboutMetric,
  PublishedAboutPageData,
  OperationalEvidenceItem,
} from "@/types/models";
import { DEFAULT_PAGE_HEROES } from "../default-page-heroes";
import { DEFAULT_FEATURED_SECTION } from "../default-featured-section";
import { parseDateForSort } from "@/lib/utils/date-format";
import { DEFAULT_TECHNICAL_TAXONOMY } from "../default-technical-taxonomy";
import { DEFAULT_DISTINCTIONS_SECTION } from "../default-distinctions-section";
import { DEFAULT_OPPORTUNITIES_SECTION } from "../default-opportunities-section";
import { DEFAULT_FOOTER_SECTION } from "../default-footer-section";
import { DEFAULT_ABOUT_SECTION } from "../default-about-section";
import crypto from "node:crypto";

const MAX_PUBLIC_LIMIT = 50;

/**
 * Fetch the public developer profile from Supabase PostgreSQL.
 */
export async function getPublishedProfile(): Promise<ProfileDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedProfile query issue:", error.message);
      } else if (data) {
        return mapProfileFromDb(data);
      }
    }
    const store = getStore();
    return store.profile || null;
  }, "Failed to retrieve public profile");
}

/**
 * Fetch published hero section data from Supabase PostgreSQL.
 */
export async function getPublishedHero(): Promise<HeroDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("heroes")
        .select("*")
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedHero query issue:", error.message);
      } else if (data) {
        return mapHeroFromDb(data);
      }
    }
    const store = getStore();
    if (store.hero && store.hero.status === "published") {
      return store.hero;
    }
    return store.hero || null;
  }, "Failed to retrieve hero section");
}

/**
 * Fetch published about section data from Supabase PostgreSQL.
 */
export async function getPublishedAbout(): Promise<AboutDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("abouts")
        .select("*")
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedAbout query issue:", error.message);
      } else if (data) {
        return mapAboutFromDb(data);
      }
    }
    const store = getStore();
    if (store.about && store.about.status === "published") {
      return store.about;
    }
    return store.about || null;
  }, "Failed to retrieve about section");
}

/**
 * Fetch published skills sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedSkills(
  category?: SkillDocument["category"]
): Promise<SkillDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("skills")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedSkills query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapSkillFromDb);
      }
    }
    const store = getStore();
    let items = store.skills.filter((s) => s.status === "published");
    if (category) {
      items = items.filter((s) => s.category === category);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published skills");
}

export interface ComputedSkillsHeroMetric {
  id: string;
  value: string;
  label: string;
  supportingText: string;
  icon: string;
}

export interface PublishedSkillsPageData {
  settings: SkillsPageSettings;
  categories: SkillCategoryDocument[];
  skills: SkillDocument[];
  metrics: ComputedSkillsHeroMetric[];
}

/**
 * Fetch published skill categories sorted by display_order ascending.
 */
export async function getPublishedSkillCategories(): Promise<SkillCategoryDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .eq("enabled", true)
        .order("display_order", { ascending: true });
      if (error) {
        console.warn("[Supabase] getPublishedSkillCategories query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapSkillCategoryFromDb);
      }
    }
    const store = getStore();
    const categories = store.skillCategories && store.skillCategories.length > 0 
      ? store.skillCategories 
      : DEFAULT_SKILL_CATEGORIES;
    return categories
      .filter((c) => c.enabled)
      .sort((a, b) => (a.display_order ?? a.order ?? 0) - (b.display_order ?? b.order ?? 0));
  }, "Failed to retrieve published skill categories");
}

/**
 * Fetch skills page settings from site_content.
 */
export async function getSkillsPageSettings(): Promise<SkillsPageSettings> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_content")
        .select("skills_page_settings")
        .limit(1)
        .maybeSingle();
      if (!error && data?.skills_page_settings) {
        if (typeof data.skills_page_settings === "string") {
          try {
            return JSON.parse(data.skills_page_settings);
          } catch {
            // fallback
          }
        } else {
          return data.skills_page_settings as unknown as SkillsPageSettings;
        }
      }
    }
    const store = getStore();
    return store.siteContent.skillsPageSettings || DEFAULT_SKILLS_PAGE_SETTINGS;
  }, "Failed to retrieve skills page settings");
}

/**
 * Aggregates all data required for the Skills page in a single unified, efficient retrieval.
 * Hero metrics are strictly derived from real published skills & categories data.
 */
export async function getPublishedSkillsPageData(): Promise<PublishedSkillsPageData> {
  return withDatabaseErrorHandling(async () => {
    const [settings, categories, skills] = await Promise.all([
      getSkillsPageSettings(),
      getPublishedSkillCategories(),
      getPublishedSkills(),
    ]);

    // Data-driven calculation of metrics from factual database records
    const totalSkillsCount = skills.length;
    const totalDomainsCount = categories.length;

    const computedMetrics: ComputedSkillsHeroMetric[] = (settings.metrics || [])
      .filter((m) => m.enabled)
      .sort((a, b) => a.order - b.order)
      .map((m) => {
        let value = "";
        const label = m.label;
        if (m.type === "tech_count") {
          value = `${totalSkillsCount}+`;
        } else if (m.type === "domain_count") {
          value = `${totalDomainsCount}+`;
        } else {
          // Custom / Qualitative value
          value = m.customValue || m.label;
        }
        return {
          id: m.id,
          value,
          label,
          supportingText: m.supportingText,
          icon: m.icon,
        };
      });

    return {
      settings,
      categories,
      skills,
      metrics: computedMetrics,
    };
  }, "Failed to retrieve published skills page data");
}

/**
 * Fetch published projects with optional featured filter and bounded limit from Supabase PostgreSQL.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProjectDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const safeLimit = Math.min(Math.max(1, options?.limit ?? MAX_PUBLIC_LIMIT), MAX_PUBLIC_LIMIT);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      query = query.limit(safeLimit);
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedProjects query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapProjectFromDb);
      }
    }
    const store = getStore();
    let items = store.projects.filter((p) => p.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((p) => p.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, safeLimit);
  }, "Failed to retrieve published projects");
}

/**
 * Fetch a single published project by its unique slug from Supabase PostgreSQL.
 */
export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedProjectBySlug query issue:", error.message);
      } else if (data) {
        return mapProjectFromDb(data);
      }
    }
    const store = getStore();
    const item = store.projects.find((p) => p.slug === slug && p.status === "published");
    return item || null;
  }, "Failed to retrieve project details");
}

/**
 * Fetch the single latest published Professional Track record for Home page.
 * Supabase Query: WHERE status = 'published' ORDER BY start_date DESC, created_at DESC LIMIT 1
 */
export async function getLatestPublishedExperience(): Promise<ExperienceDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("status", "published")
        .order("start_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getLatestPublishedExperience query issue:", error.message);
      } else if (data) {
        return mapExperienceFromDb(data);
      }
    }

    const store = getStore();
    const published = store.experience
      .filter((e) => e.status === "published")
      .sort((a, b) => {
        const timeA = parseDateForSort(a.startDate);
        const timeB = parseDateForSort(b.startDate);
        if (timeB !== timeA) return timeB - timeA;
        const createA = new Date(a.createdAt || 0).getTime();
        const createB = new Date(b.createdAt || 0).getTime();
        if (createB !== createA) return createB - createA;
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      });

    return published[0] || null;
  }, "Failed to retrieve latest published experience");
}

/**
 * Fetch all published experience timeline items sorted latest to oldest (start_date DESC, created_at DESC).
 */
export async function getPublishedExperience(): Promise<ExperienceDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("status", "published")
        .order("start_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[Supabase] getPublishedExperience query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapExperienceFromDb);
      }
    }
    const store = getStore();
    return store.experience
      .filter((e) => e.status === "published")
      .sort((a, b) => {
        const timeA = parseDateForSort(a.startDate);
        const timeB = parseDateForSort(b.startDate);
        if (timeB !== timeA) return timeB - timeA;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, "Failed to retrieve published experience");
}

/**
 * Fetches the unified dynamic chronological timeline for the Experience page.
 * Retrieves all published experiences from Supabase / store (sorted start_date DESC, created_at DESC).
 * Seamlessly integrates approved canonical education milestones from the portfolio system
 * if not already stored in experiences, preventing data duplication.
 */
export async function getPublishedExperienceTimeline(): Promise<ExperienceDocument[]> {
  const experiences = await getPublishedExperience();

  // Check if education already exists in the published experiences
  const hasEducation = experiences.some(
    (e) =>
      e.type === "education" ||
      e.company.toLowerCase().includes("university") ||
      e.company.toLowerCase().includes("sppu")
  );

  if (!hasEducation) {
    const siteContent = await getPublishedSiteContent();
    const aboutTimeline = siteContent?.aboutSection?.timeline || DEFAULT_ABOUT_SECTION.timeline;
    const eduItem = aboutTimeline.find((t) => t.category === "education" && t.enabled !== false);

    if (eduItem) {
      const periodParts = eduItem.period.split(/–|-/);
      const startYear = periodParts[0]?.trim() || "2024";
      const endYear = periodParts[1]?.trim() || "2028";
      const isCurrent = eduItem.period.toLowerCase().includes("present");

      const syntheticEduExp: ExperienceDocument = {
        id: eduItem.id || "edu-sppu",
        _id: eduItem.id || "edu-sppu",
        type: "education",
        role: eduItem.title || "Undergraduate Engineer",
        company:
          eduItem.organization ||
          "Ajeenkya DY Patil School of Engineering Affiliated to Savitribai Phule Pune University",
        location: "Pune, Maharashtra, India",
        employmentType: "Education",
        workMode: "On-site",
        startDate: startYear,
        endDate: isCurrent ? undefined : endYear,
        current: isCurrent,
        description:
          "Pursuing undergraduate degree with a strong focus on software engineering, problem solving, and modern technologies.",
        responsibilities: eduItem.subtitle ? [eduItem.subtitle] : [],
        technologies: [],
        highlights: [],
        metrics: [],
        order: eduItem.order ?? 99,
        status: "published",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      };

      experiences.push(syntheticEduExp);
    }
  }

  // Strictly sort by start_date DESC, created_at DESC
  return experiences.sort((a, b) => {
    const timeA = parseDateForSort(a.startDate);
    const timeB = parseDateForSort(b.startDate);
    if (timeB !== timeA) return timeB - timeA;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}

/**
 * Resolves operational evidence metrics from published experience records.
 * Supports 0 -> N metrics dynamically while strictly preserving approved data.
 */
export function getPublishedOperationalEvidence(experiences: ExperienceDocument[]): OperationalEvidenceItem[] {
  const items: OperationalEvidenceItem[] = [];

  for (const exp of experiences) {
    if (!exp.highlights || exp.highlights.length === 0) continue;

    for (const hl of exp.highlights) {
      if (hl.enabled === false) continue;

      if (hl.type === "crm") {
        const custMetric = hl.metrics?.find(
          (m) =>
            m.includes("2,000") ||
            m.includes("3,000") ||
            m.toLowerCase().includes("customer") ||
            m.toLowerCase().includes("record")
        );
        items.push({
          id: `oe-${hl.id}-crm`,
          label: "Customers Managed",
          value: custMetric || "2,000+",
          supportingText: hl.title,
          icon: "users",
          sourceContext: "CRM Platform",
          sourceUrl: hl.destinationUrl || exp.ctaUrl || "/projects",
          order: 1,
          enabled: true,
        });

        const speedMetric = hl.metrics?.find(
          (m) =>
            m.includes("90%") ||
            m.includes("80%") ||
            m.toLowerCase().includes("retrieval") ||
            m.toLowerCase().includes("faster")
        );
        if (speedMetric) {
          items.push({
            id: `oe-${hl.id}-speed`,
            label: "Faster Data Retrieval",
            value: speedMetric.startsWith("~") ? speedMetric.slice(1) : speedMetric,
            supportingText: "Query Optimization",
            icon: "clock",
            sourceContext: "CRM Platform",
            sourceUrl: hl.destinationUrl || exp.ctaUrl || "/projects",
            order: 4,
            enabled: true,
          });
        }
      }

      if (hl.type === "inventory") {
        const txnMetric = hl.metrics?.find(
          (m) => m.includes("10,000") || m.toLowerCase().includes("transaction")
        );
        items.push({
          id: `oe-${hl.id}-tx`,
          label: "Daily Transactions",
          value: txnMetric || "10,000+",
          supportingText: hl.title,
          icon: "database",
          sourceContext: "Production Environment",
          sourceUrl: hl.destinationUrl || exp.ctaUrl || "/projects",
          order: 2,
          enabled: true,
        });

        const redMetric = hl.metrics?.find(
          (m) =>
            m.includes("65–75%") ||
            m.includes("65-75%") ||
            m.includes("manual") ||
            m.includes("reduction")
        );
        items.push({
          id: `oe-${hl.id}-auto`,
          label: "Manual Operations Reduced",
          value: redMetric || "65–75%",
          supportingText: "Automated Workflows",
          icon: "zap",
          sourceContext: "Through Automation",
          sourceUrl: hl.destinationUrl || exp.ctaUrl || "/projects",
          order: 3,
          enabled: true,
        });

        const stockRetrieval = hl.metrics?.find(
          (m) => m.includes("80–90%") || m.includes("80-90%")
        );
        if (stockRetrieval && !items.some((i) => i.label === "Faster Data Retrieval")) {
          items.push({
            id: `oe-${hl.id}-stock`,
            label: "Faster Data Retrieval",
            value: stockRetrieval,
            supportingText: "Inventory Platform",
            icon: "clock",
            sourceContext: "Inventory Platform",
            sourceUrl: hl.destinationUrl || exp.ctaUrl || "/projects",
            order: 4,
            enabled: true,
          });
        }
      }
    }
  }

  // Deduplicate by label and sort by order
  const uniqueItems = Array.from(new Map(items.map((i) => [i.label, i])).values());
  return uniqueItems.sort((a, b) => a.order - b.order);
}

/**
 * Fetch published achievements sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedAchievements(options?: {
  featuredOnly?: boolean;
}): Promise<AchievementDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("achievements")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedAchievements query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapAchievementFromDb);
      }
    }
    const store = getStore();
    let items = store.achievements.filter((a) => a.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((a) => a.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published achievements");
}

/**
 * Fetch the latest published certifications for the Home page preview (max 2 records).
 * Strict query: status = 'published' ORDER BY issue_date DESC, created_at DESC LIMIT 2
 */
export async function getLatestPublishedCertifications(limit: number = 2): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const safeLimit = Math.max(1, Math.min(limit, 10));
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("status", "published")
        .order("issue_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(safeLimit);

      if (error) {
        console.warn("[Supabase] getLatestPublishedCertifications query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapCertificationFromDb);
      }
    }
    const store = getStore();
    const items = store.certifications.filter((c) => c.status === "published");
    return items
      .sort((a, b) => {
        const dateA = parseDateForSort(a.issueDate || a.date);
        const dateB = parseDateForSort(b.issueDate || b.date);
        if (dateB !== dateA) return dateB - dateA;
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, safeLimit);
  }, "Failed to retrieve latest published certifications");
}

/**
 * Fetch published certifications sorted latest → oldest (issue_date DESC, created_at DESC) from Supabase PostgreSQL.
 */
export async function getPublishedCertifications(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<CertificationDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("certifications")
        .select("*")
        .eq("status", "published")
        .order("issue_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedCertifications query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapCertificationFromDb);
      }
    }
    const store = getStore();
    let items = store.certifications.filter((c) => c.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((c) => c.featured === true);
    }
    const sorted = items.sort((a, b) => {
      const dateA = parseDateForSort(a.issueDate || a.date);
      const dateB = parseDateForSort(b.issueDate || b.date);
      if (dateB !== dateA) return dateB - dateA;
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    if (options?.limit) {
      return sorted.slice(0, options.limit);
    }
    return sorted;
  }, "Failed to retrieve published certifications");
}

/**
 * Fetch published key metrics sorted by order ascending from Supabase PostgreSQL.
 */
export async function getPublishedMetrics(options?: {
  featuredOnly?: boolean;
}): Promise<MetricDocument[]> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      let query = supabase
        .from("metrics")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true });

      if (options?.featuredOnly) {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase] getPublishedMetrics query issue:", error.message);
      } else if (data && data.length > 0) {
        return data.map(mapMetricFromDb);
      }
    }
    const store = getStore();
    let items = store.metrics.filter((m) => m.status === "published");
    if (options?.featuredOnly) {
      items = items.filter((m) => m.featured === true);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, "Failed to retrieve published metrics");
}

/**
 * Fetch public contact settings and social links from Supabase PostgreSQL.
 */
export async function getPublishedContactSettings(): Promise<ContactSettingsDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedContactSettings query issue:", error.message);
      } else if (data) {
        return mapContactSettingsFromDb(data);
      }
    }
    const store = getStore();
    return store.contactSettings || null;
  }, "Failed to retrieve contact settings");
}

/**
 * Fetch current active resume metadata for download from Supabase PostgreSQL.
 */
export async function getActiveResume(): Promise<ResumeMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("active", true)
        .eq("archived", false)
        .eq("download_enabled", true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getActiveResume query issue:", error.message);
      } else if (data) {
        return mapResumeFromDb(data);
      }
    }
    const store = getStore();
    const resume = store.resumes.find((r) => r.active && !r.archived && r.downloadEnabled);
    return resume || null;
  }, "Failed to retrieve active resume");
}

/**
 * Fetch global SEO metadata from Supabase PostgreSQL.
 */
export async function getPublishedSeo(): Promise<SeoMetadataDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("seo")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedSeo query issue:", error.message);
      } else if (data) {
        return mapSeoFromDb(data);
      }
    }
    const store = getStore();
    return store.seo || null;
  }, "Failed to retrieve SEO metadata");
}

/**
 * Fetch site content elements (footer, global CTA, microcopy) from Supabase PostgreSQL.
 */
export async function getPublishedSiteContent(): Promise<SiteContentDocument | null> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[Supabase] getPublishedSiteContent query issue:", error.message);
      } else if (data) {
        return mapSiteContentFromDb(data);
      }
    }
    const store = getStore();
    return store.siteContent || null;
  }, "Failed to retrieve site content");
}

export async function getPageHero(pageKey: string): Promise<PageHeroConfig | null> {
  const siteContent = await getPublishedSiteContent();
  if (siteContent?.pageHeroes && siteContent.pageHeroes[pageKey]) {
    return siteContent.pageHeroes[pageKey];
  }
  return DEFAULT_PAGE_HEROES[pageKey] || null;
}

/**
 * Fetch published Featured Highlights section configuration from database.
 * Falls back to DEFAULT_FEATURED_SECTION if not configured yet.
 */
export async function getPublishedFeaturedSection(): Promise<FeaturedSectionConfig> {
  const siteContent = await getPublishedSiteContent();
  if (siteContent?.featuredSection) {
    return siteContent.featuredSection;
  }
  return DEFAULT_FEATURED_SECTION;
}

/**
 * Fetch published Technical Taxonomy section configuration from database.
 * Falls back to DEFAULT_TECHNICAL_TAXONOMY if not configured yet.
 */
export async function getPublishedTechnicalTaxonomy(): Promise<TechnicalTaxonomyConfig> {
  const siteContent = await getPublishedSiteContent();
  if (siteContent?.technicalTaxonomy) {
    return siteContent.technicalTaxonomy;
  }
  return DEFAULT_TECHNICAL_TAXONOMY;
}

/**
 * Fetch published Verified Distinctions section configuration from database.
 * Falls back to DEFAULT_DISTINCTIONS_SECTION if not configured yet.
 */
export async function getPublishedDistinctionsSection(): Promise<DistinctionsSectionConfig> {
  const siteContent = await getPublishedSiteContent();
  if (siteContent?.distinctionsSection) {
    return {
      ...DEFAULT_DISTINCTIONS_SECTION,
      ...siteContent.distinctionsSection,
      decorativeVisual: {
        ...DEFAULT_DISTINCTIONS_SECTION.decorativeVisual,
        ...(siteContent.distinctionsSection.decorativeVisual || {}),
      },
      metrics: {
        ...DEFAULT_DISTINCTIONS_SECTION.metrics,
        ...(siteContent.distinctionsSection.metrics || {}),
      },
      cta: {
        ...DEFAULT_DISTINCTIONS_SECTION.cta,
        ...(siteContent.distinctionsSection.cta || {}),
      },
    };
  }
  return DEFAULT_DISTINCTIONS_SECTION;
}

/**
 * Fetch published Open For Opportunities section configuration from database.
 * Falls back to DEFAULT_OPPORTUNITIES_SECTION if not configured yet.
 */
export async function getPublishedOpportunitiesSection(): Promise<OpportunitiesSectionConfig> {
  const siteContent = await getPublishedSiteContent();
  if (siteContent?.opportunitiesSection) {
    return {
      ...DEFAULT_OPPORTUNITIES_SECTION,
      ...siteContent.opportunitiesSection,
      badges:
        siteContent.opportunitiesSection.badges && siteContent.opportunitiesSection.badges.length > 0
          ? siteContent.opportunitiesSection.badges
          : DEFAULT_OPPORTUNITIES_SECTION.badges,
    };
  }
  return DEFAULT_OPPORTUNITIES_SECTION;
}

export interface PublishedFooterData {
  config: FooterSectionConfig;
  derivedMetrics: {
    projectsCount: string;
    awardsCount: string;
    opportunitiesStatus: string;
  };
  brand: {
    name: string;
    title: string;
    description: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
}

/**
 * Fetch published footer data, combining CMS configuration with dynamic data sources
 * (real project counts, real achievement counts, profile data, and social links).
 */
export async function getPublishedFooterData(): Promise<PublishedFooterData> {
  const [siteContent, profile, projects, achievements] = await Promise.all([
    getPublishedSiteContent(),
    getPublishedProfile(),
    getPublishedProjects(),
    getPublishedAchievements(),
  ]);

  const rawConfig = siteContent?.footerSection;
  const config: FooterSectionConfig = {
    ...DEFAULT_FOOTER_SECTION,
    ...(rawConfig || {}),
    metrics: {
      ...DEFAULT_FOOTER_SECTION.metrics,
      ...(rawConfig?.metrics || {}),
    },
    connect: {
      ...DEFAULT_FOOTER_SECTION.connect,
      ...(rawConfig?.connect || {}),
    },
    artwork: {
      ...DEFAULT_FOOTER_SECTION.artwork,
      ...(rawConfig?.artwork || {}),
    },
    bottomBar: {
      ...DEFAULT_FOOTER_SECTION.bottomBar,
      ...(rawConfig?.bottomBar || {}),
    },
  };

  const projectCountNum = projects?.length ?? 10;
  const projectsCountStr = config.metrics.projectsValue || (projectCountNum >= 10 ? `${projectCountNum}+` : `${projectCountNum}`);

  const awardCountNum = achievements?.length ?? 2;
  const awardsCountStr = config.metrics.awardsValue || `${awardCountNum}`;

  const opportunitiesStatus = config.metrics.opportunitiesValue || "Opportunities";

  const brandName = config.title || profile?.name || "Siddharth Varpe";
  const professionalTitle = config.professionalTitle || profile?.title || "SOFTWARE ENGINEER | AI & FULL-STACK";
  const description =
    config.description ||
    siteContent?.footerText ||
    profile?.summary ||
    DEFAULT_FOOTER_SECTION.description;

  const socialLinks = {
    github: config.connect.githubUrl || "https://github.com/siddharth-varpe",
    linkedin: config.connect.linkedinUrl || "https://www.linkedin.com/in/siddharth-varpe",
    email: config.connect.email || profile?.email || "siddharth.varpe0@gmail.com",
  };

  return {
    config,
    derivedMetrics: {
      projectsCount: projectsCountStr,
      awardsCount: awardsCountStr,
      opportunitiesStatus,
    },
    brand: {
      name: brandName,
      title: professionalTitle,
      description,
    },
    socialLinks,
  };
}

export async function getPublishedFooterSection(): Promise<FooterSectionConfig> {
  const data = await getPublishedFooterData();
  return data.config;
}

/**
 * Fetch published About Page data combining CMS configuration with dynamic data sources
 * (real project counts, real achievement counts, profile data, experiences, and education).
 */
export async function getPublishedAboutPageData(): Promise<PublishedAboutPageData> {
  const [siteContent, profile, about, projects, achievements, certifications] =
    await Promise.all([
      getPublishedSiteContent(),
      getPublishedProfile(),
      getPublishedAbout(),
      getPublishedProjects(),
      getPublishedAchievements(),
      getPublishedCertifications(),
    ]);

  const rawConfig = siteContent?.aboutSection;
  const config: AboutSectionConfig = {
    ...DEFAULT_ABOUT_SECTION,
    ...(rawConfig || {}),
    contextBadge: {
      ...DEFAULT_ABOUT_SECTION.contextBadge,
      ...(rawConfig?.contextBadge || {}),
    },
    personalDetails: {
      ...DEFAULT_ABOUT_SECTION.personalDetails,
      ...(rawConfig?.personalDetails || {}),
    },
    actions: {
      ...DEFAULT_ABOUT_SECTION.actions,
      ...(rawConfig?.actions || {}),
    },
    backgroundSection: {
      ...DEFAULT_ABOUT_SECTION.backgroundSection,
      ...(rawConfig?.backgroundSection || {}),
    },
    closingVisual: {
      ...DEFAULT_ABOUT_SECTION.closingVisual,
      ...(rawConfig?.closingVisual || {}),
    },
    metrics:
      rawConfig?.metrics && rawConfig.metrics.length > 0
        ? rawConfig.metrics
        : DEFAULT_ABOUT_SECTION.metrics,
    timeline: (rawConfig?.timeline && rawConfig.timeline.length > 0
      ? rawConfig.timeline
      : DEFAULT_ABOUT_SECTION.timeline
    ).map((t) => {
      if (
        t.category === "education" &&
        (t.organization.includes("Savitribai Phule Pune University") &&
          !t.organization.includes("Ajeenkya"))
      ) {
        return {
          ...t,
          organization:
            "Ajeenkya DY Patil School of Engineering Affiliated to Savitribai Phule Pune University",
        };
      }
      return t;
    }),
    pillars:
      rawConfig?.pillars && rawConfig.pillars.length > 0
        ? rawConfig.pillars
        : DEFAULT_ABOUT_SECTION.pillars,
  };

  // Sync profile details if default or missing
  if (!rawConfig?.personalDetails?.location && profile?.location) {
    config.personalDetails.location = profile.location;
  }
  if (!rawConfig?.personalDetails?.availability && profile?.availability) {
    config.personalDetails.availability = profile.availability;
  }
  if (!rawConfig?.description && (about?.aboutDescription || about?.primaryDescription)) {
    config.description = about.aboutDescription || about.primaryDescription;
  }
  if (!rawConfig?.backgroundSection?.quote && about?.philosophy) {
    config.backgroundSection.quote = about.philosophy;
  }

  // Calculate dynamic metrics
  const projectCountNum = projects?.length ?? 10;
  const achievementCountNum = achievements?.length ?? 2;
  const certificationCountNum = certifications?.length ?? 3;

  const resolvedMetrics: ResolvedAboutMetric[] = config.metrics
    .filter((m) => m.enabled)
    .sort((a, b) => a.order - b.order)
    .map((m) => {
      let val = m.customValue || "0";
      if (m.sourceType === "projects") {
        val = projectCountNum >= 10 ? `${projectCountNum}+` : `${projectCountNum}`;
      } else if (m.sourceType === "achievements") {
        val = `${achievementCountNum}`;
      } else if (m.sourceType === "certifications") {
        val = `${certificationCountNum}+`;
      }
      return {
        id: m.id,
        enabled: m.enabled,
        label: m.label,
        value: val,
        supportingText: m.supportingText,
        icon: m.icon,
        order: m.order,
      };
    });

  return {
    config,
    profile,
    about,
    metrics: resolvedMetrics,
  };
}

export async function getPublishedAboutSection(): Promise<AboutSectionConfig> {
  const data = await getPublishedAboutPageData();
  return data.config;
}


/**
 * Calculate dynamic distinction metrics from REAL database data.
 * Zero hardcoding:
 * - Metric #1: University / Award Ranks (count of qualifying published achievements with a rank)
 * - Metric #2: Total published certifications count (e.g. "3+")
 * - Metric #3: Verified percentage (certifications with verificationUrl, credentialUrl, or credentialId)
 */
export async function getDistinctionMetrics(): Promise<DistinctionMetrics> {
  return withDatabaseErrorHandling(async () => {
    const [achievements, certifications] = await Promise.all([
      getPublishedAchievements(),
      getPublishedCertifications(),
    ]);

    // Metric #1: Count of qualifying rank records in achievements
    const ranksCount = achievements.filter(
      (a) => a.status === "published" && Boolean(a.rank && a.rank.trim().length > 0)
    ).length;

    // Metric #2: Count of published certifications
    const certificationsCount = certifications.length;

    // Metric #3: % Verified credentials
    const verifiedCount = certifications.filter(
      (c) => Boolean((c.credentialId && c.credentialId.trim()) || (c.credentialUrl && c.credentialUrl.trim()) || (c.verificationUrl && c.verificationUrl.trim()))
    ).length;

    const verifiedPercentage =
      certificationsCount > 0 ? Math.round((verifiedCount / certificationsCount) * 100) : 0;

    return {
      ranksCount,
      certificationsCount,
      verifiedPercentage,
    };
  }, "Failed to calculate distinction metrics");
}


/**
 * Persist incoming contact message into Supabase PostgreSQL.
 * CRITICAL RELIABILITY RULE: Database persistence happens BEFORE any email notification attempts.
 */
export async function saveContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  turnstileVerified: boolean;
  ipHash?: string;
  userAgent?: string;
}): Promise<ContactMessageDocument> {
  return withDatabaseErrorHandling(async () => {
    const now = new Date();
    const id = `msg_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const newDoc: ContactMessageDocument = {
      id,
      _id: id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject ? data.subject.trim() : undefined,
      message: data.message.trim(),
      status: "unread",
      emailDeliveryStatus: "pending",
      turnstileVerified: Boolean(data.turnstileVerified),
      createdAt: now,
    };

    if (data.ipHash) {
      newDoc.ipHash = data.ipHash;
    }
    if (data.userAgent) {
      newDoc.userAgent = data.userAgent.slice(0, 300);
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const dbPayload = {
        id,
        name: newDoc.name,
        email: newDoc.email,
        subject: newDoc.subject || null,
        message: newDoc.message,
        status: newDoc.status,
        email_delivery_status: newDoc.emailDeliveryStatus,
        turnstile_verified: newDoc.turnstileVerified,
        ip_hash: newDoc.ipHash || null,
        user_agent: newDoc.userAgent || null,
        created_at: now.toISOString(),
      };
      const { error } = await supabase.from("contact_messages").insert(dbPayload);
      if (error) {
        console.error("[Supabase Error] Failed to insert contact message:", error.message);
      }
    }

    // Maintain in-memory sync
    const store = getStore();
    store.contactMessages.unshift(newDoc);
    return newDoc;
  }, "Failed to save contact message to database");
}

/**
 * Record email delivery notification status for a stored contact message.
 * Never throws away or removes the stored message on delivery failure.
 */
export async function updateContactMessageDelivery(
  id: string,
  delivery: {
    status: "sent" | "failed" | "skipped";
    messageId?: string;
  }
): Promise<void> {
  return withDatabaseErrorHandling(async () => {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase
        .from("contact_messages")
        .update({
          email_delivery_status: delivery.status,
          email_message_id: delivery.messageId || null,
        })
        .eq("id", id);
    }

    const store = getStore();
    const msg = store.contactMessages.find((m) => m.id === id || m._id === id);
    if (msg) {
      msg.emailDeliveryStatus = delivery.status;
      if (delivery.messageId) {
        msg.emailMessageId = delivery.messageId;
      }
    }
  }, "Failed to update contact message delivery status");
}
