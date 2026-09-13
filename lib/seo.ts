import type { Metadata } from "next";
import type { ProjectDocument, ProfileDocument, ContactSettingsDocument } from "@/types/models";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://siddharthvarpe.com";

export const SITE_CONFIG = {
  name: "Siddharth Varpe",
  title: "Siddharth Varpe | Software Engineer | AI & Full-Stack",
  headline: "Software Engineer | AI & Full-Stack",
  description:
    "Personal portfolio and proof-of-work platform for Siddharth Varpe — Full-Stack Software Engineer specializing in production-grade CRM and inventory systems, distributed architectures, and AI-assisted engineering.",
  url: SITE_URL,
  email: "siddharth.varpe0@gmail.com",
  defaultImage: "/images/siddharth-hero.png",
  social: {
    github: "https://github.com/siddharthvarpe0",
    linkedin: "https://www.linkedin.com/in/siddharthvarpe",
  },
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "Cloud Firestore",
    "Node.js",
    "Distributed Systems",
    "AI-Assisted Engineering",
    "Database Architecture",
    "REST & Cloud Infrastructure",
  ],
};

interface BuildMetadataOptions {
  title: string;
  description: string;
  pathname?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

/**
 * Standardized metadata builder ensuring canonical URLs, Open Graph,
 * and Twitter Card metadata follow production standards.
 */
export function buildMetadata({
  title,
  description,
  pathname = "",
  image = SITE_CONFIG.defaultImage,
  type = "website",
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const canonical = pathname ? (pathname.startsWith("/") ? pathname : `/${pathname}`) : "/";
  const absoluteUrl = `${SITE_URL}${canonical === "/" ? "" : canonical}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_CONFIG.name,
      locale: "en_US",
      type,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
      creator: "@siddharthvarpe",
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * Generates schema.org Person structured data representing Siddharth Varpe.
 */
export function generatePersonJsonLd(
  profile?: ProfileDocument | null,
  contactSettings?: ContactSettingsDocument | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile?.name || SITE_CONFIG.name,
    jobTitle: profile?.title || SITE_CONFIG.headline,
    url: SITE_URL,
    email: `mailto:${profile?.email || SITE_CONFIG.email}`,
    description: profile?.summary || profile?.tagline || SITE_CONFIG.description,
    image: profile?.photoUrl
      ? (profile.photoUrl.startsWith("http") ? profile.photoUrl : `${SITE_URL}${profile.photoUrl}`)
      : `${SITE_URL}${SITE_CONFIG.defaultImage}`,
    sameAs: Array.from(
      new Set(
        [
          SITE_CONFIG.social.github,
          SITE_CONFIG.social.linkedin,
          contactSettings?.githubUrl,
          contactSettings?.linkedinUrl,
        ].filter((url): url is string => Boolean(url) && typeof url === "string")
      )
    ),
    knowsAbout: SITE_CONFIG.skills,
  };
}

/**
 * Generates schema.org WebSite structured data.
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    inLanguage: "en-US",
  };
}

/**
 * Generates schema.org BreadcrumbList structured data.
 */
export function generateBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
      })),
    ],
  };
}

/**
 * Generates schema.org SoftwareApplication / TechArticle structured data for project case studies.
 */
export function generateProjectJsonLd(project: ProjectDocument) {
  const projectUrl = `${SITE_URL}/projects/${project.slug}`;
  const coverImageUrl = project.coverImage
    ? (project.coverImage.startsWith("http") ? project.coverImage : `${SITE_URL}${project.coverImage}`)
    : `${SITE_URL}${SITE_CONFIG.defaultImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${projectUrl}#software`,
    name: project.title,
    description: project.shortDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: projectUrl,
    image: coverImageUrl,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.name,
      url: SITE_URL,
    },
    datePublished: project.year,
    keywords: project.technologies?.join(", ") || "",
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
  };
}
