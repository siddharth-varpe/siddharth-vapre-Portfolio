import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Briefcase,
  Trophy,
  Award,
  FileText,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FeaturedSectionConfig,
  FeaturedItem,
  FeaturedAccent,
  FeaturedItemType,
} from "@/types/models";
import { TechIcon } from "./tech-icons";

interface FeaturedHighlightsSectionProps {
  config?: FeaturedSectionConfig | null;
  className?: string;
}

/**
 * Returns type-specific icon component
 */
function getBadgeIcon(iconName?: string, type?: FeaturedItemType) {
  const icon = (iconName || "").toLowerCase();
  if (icon === "code" || (!iconName && type === "project")) return Code2;
  if (icon === "briefcase" || (!iconName && type === "experience")) return Briefcase;
  if (icon === "trophy" || (!iconName && type === "achievement")) return Trophy;
  if (icon === "award" || icon === "certificate" || (!iconName && type === "certification")) return Award;
  if (icon === "file" || icon === "document") return FileText;
  return Sparkles;
}

/**
 * Google Logo for Certification card
 */
function GoogleLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/**
 * Accent variant design token definitions for both Light & Dark themes
 * Strictly reproducing the reference colors: Blue, Green, Orange, Purple.
 */
interface AccentStyle {
  cardBorder: string;
  cardBg: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  primaryButton: string;
  secondaryButton?: string;
  highlightGlow: string;
}

const ACCENT_STYLES: Record<FeaturedAccent, AccentStyle> = {
  blue: {
    cardBorder:
      "border-[#bfdbfe]/80 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-700/60",
    cardBg:
      "bg-[#f8faff] dark:bg-[#0a1322]",
    badgeBorder: "border-[#bfdbfe] dark:border-blue-800/60",
    badgeBg: "bg-[#dbeafe] dark:bg-blue-950/80",
    badgeText: "text-[#1d4ed8] dark:text-blue-300",
    primaryButton:
      "bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-xs shadow-blue-600/30",
    secondaryButton:
      "text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400",
    highlightGlow: "from-blue-500/10 to-transparent",
  },
  green: {
    cardBorder:
      "border-[#a7f3d0]/80 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-700/60",
    cardBg:
      "bg-[#f7faf8] dark:bg-[#071714]",
    badgeBorder: "border-[#a7f3d0] dark:border-emerald-800/60",
    badgeBg: "bg-[#d1fae5] dark:bg-emerald-950/80",
    badgeText: "text-[#065f46] dark:text-emerald-300",
    primaryButton:
      "bg-[#e6f4ea] hover:bg-[#d4edd9] dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-[#137333] dark:text-emerald-300 border border-[#ceead6] dark:border-emerald-800/50",
    highlightGlow: "from-emerald-500/10 to-transparent",
  },
  orange: {
    cardBorder:
      "border-[#fde68a]/80 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-700/60",
    cardBg:
      "bg-[#fdfbf7] dark:bg-[#191106]",
    badgeBorder: "border-[#fde68a] dark:border-amber-800/60",
    badgeBg: "bg-[#fef3c7] dark:bg-amber-950/80",
    badgeText: "text-[#92400e] dark:text-amber-300",
    primaryButton:
      "bg-[#fef7e0] hover:bg-[#feefc3] dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-[#b06000] dark:text-amber-300 border border-[#fce8b2] dark:border-amber-800/50",
    highlightGlow: "from-amber-500/10 to-transparent",
  },
  purple: {
    cardBorder:
      "border-[#ddd6fe]/80 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-700/60",
    cardBg:
      "bg-[#faf8fc] dark:bg-[#130a21]",
    badgeBorder: "border-[#ddd6fe] dark:border-purple-800/60",
    badgeBg: "bg-[#ede9fe] dark:bg-purple-950/80",
    badgeText: "text-[#5b21b6] dark:text-purple-300",
    primaryButton:
      "bg-[#f3e8fd] hover:bg-[#ebd4fc] dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-[#7627bb] dark:text-purple-300 border border-[#e1beef] dark:border-purple-800/50",
    highlightGlow: "from-purple-500/10 to-transparent",
  },
};

/**
 * Public Featured Highlights Section
 * Renders strict 2x2 desktop grid and 2-column mobile grid matching visual references.
 */
export function FeaturedHighlightsSection({
  config,
  className,
}: FeaturedHighlightsSectionProps) {
  if (!config || config.enabled === false) {
    return null;
  }

  const items = (config.items || [])
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  if (items.length === 0) {
    return null;
  }

  // Split title to highlight second word in electric blue matching reference
  const titleParts = (config.title || "Featured Highlights").split(" ");
  const firstWord = titleParts[0];
  const remainingWords = titleParts.slice(1).join(" ");

  return (
    <section
      id="featured"
      aria-label="Featured Highlights"
      className={cn(
        "relative w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#080e18] text-zinc-900 dark:text-white transition-colors duration-200 py-8 sm:py-12 lg:py-14",
        className
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ========================================================================= */}
        {/* SECTION HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-8 lg:mb-10">
          <div>
            {/* Eyebrow Label with Blue Indicator Bar */}
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span
                className="w-5 sm:w-6 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full inline-block shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {config.eyebrow || "FEATURED"}
              </span>
            </div>

            {/* Section Heading */}
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.12]">
              {firstWord}{" "}
              {remainingWords && (
                <span className="text-blue-600 dark:text-blue-500">
                  {remainingWords}
                </span>
              )}
            </h2>

            {/* Supporting Description */}
            {config.description && (
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-[15px] text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                {config.description}
              </p>
            )}
          </div>

          {/* Desktop "View All Featured" Header CTA */}
          {config.ctaLink && (
            <div className="hidden md:block shrink-0 pb-1">
              <Link
                href={config.ctaLink}
                className="group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 dark:border-blue-900/50 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 shadow-xs transition-all duration-150 active:scale-[0.98]"
              >
                <span>{config.ctaText || "View All Featured"}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FEATURED GRID: 2x2 ON DESKTOP, 2-COLUMN ON MOBILE                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-4 lg:gap-6 items-stretch">
          {items.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>

        {/* ========================================================================= */}
        {/* MOBILE BOTTOM "VIEW ALL FEATURED" CTA                                     */}
        {/* ========================================================================= */}
        {config.ctaLink && (
          <div className="mt-4 sm:mt-6 block md:hidden w-full">
            <Link
              href={config.ctaLink}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200/90 bg-blue-50/80 hover:bg-blue-100/90 dark:border-blue-900/50 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 py-2.5 px-4 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-xs transition-all duration-150 active:scale-[0.98]"
            >
              <span>{config.ctaText || "View All Featured"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Individual Featured Card
 * Adapts seamlessly between desktop (spacious lateral arrangement)
 * and mobile (compact 2-column stacked arrangement).
 */
function FeaturedCard({ item }: { item: FeaturedItem }) {
  const accent = ACCENT_STYLES[item.accent] || ACCENT_STYLES.blue;
  const BadgeIcon = getBadgeIcon(item.badge?.icon, item.type);

  // Dynamic tags count calculations
  const tags = item.tags || [];
  const maxMobileTags = 3;
  const maxDesktopTags = 4;
  const mobileVisibleTags = tags.slice(0, maxMobileTags);
  const desktopVisibleTags = tags.slice(0, maxDesktopTags);
  const mobileHiddenCount = Math.max(0, tags.length - maxMobileTags);
  const desktopHiddenCount = Math.max(0, tags.length - maxDesktopTags);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md",
        "p-2.5 sm:p-4 md:p-5 lg:p-6",
        accent.cardBg,
        accent.cardBorder
      )}
    >
      {/* ======================================================================= */}
      {/* TOP ROW: BADGE & ANNOTATION                                             */}
      {/* ======================================================================= */}
      <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
        {item.badge?.visible !== false && (
          <div
            className={cn(
              "inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[11px] font-semibold tracking-wide shadow-2xs",
              accent.badgeBg,
              accent.badgeBorder,
              accent.badgeText
            )}
          >
            <BadgeIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
            <span>{item.badge.text}</span>
          </div>
        )}

        {/* Script / Annotation (e.g. "Built for Real Students") */}
        {item.annotation && (
          <span className="hidden sm:inline-block font-serif italic text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 select-none">
            {item.annotation}
          </span>
        )}
      </div>

      {/* ======================================================================= */}
      {/* MAIN BODY: SPLIT ON DESKTOP, COMPACT ON MOBILE                          */}
      {/* ======================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-2 sm:gap-3.5 lg:gap-4">
        {/* Text Area */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Title Row with Mobile Visual Icon (Medal for Achievement, G for Certification) */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-[13px] sm:text-base md:text-lg lg:text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight sm:leading-snug">
                  {item.title}
                </h3>

                {/* Subtitle / Company / Org */}
                {item.subtitle && (
                  <p className="font-sans font-medium text-[10px] sm:text-xs md:text-[13px] text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Mobile Achievement Medal */}
              {item.type === "achievement" && (
                <div className="relative shrink-0 w-9 h-11 sm:w-11 sm:h-13 lg:hidden flex items-center justify-center">
                  <Image
                    src="/images/featured/achievement-medal.png"
                    alt="Silver Medal 2nd Rank"
                    width={44}
                    height={52}
                    className="object-contain"
                  />
                </div>
              )}

              {/* Mobile Certification Google Logo */}
              {item.type === "certification" && (
                <div className="relative shrink-0 w-8 h-8 sm:w-9 sm:h-9 lg:hidden flex items-center justify-center">
                  <GoogleLogo className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              )}
            </div>

            {/* Type-Specific Metadata (Experience & Achievement) */}
            {item.metadata && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-2.5 gap-y-0.5 text-[9px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                {item.metadata.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{item.metadata.location}</span>
                  </span>
                )}
                {item.metadata.duration && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{item.metadata.duration}</span>
                  </span>
                )}
                {item.metadata.organization &&
                  !item.subtitle?.includes(item.metadata.organization) && (
                    <span className="truncate">{item.metadata.organization}</span>
                  )}
              </div>
            )}

            {/* Description */}
            <p className="text-[9.5px] sm:text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 sm:mt-2 leading-relaxed line-clamp-3 sm:line-clamp-4">
              {item.description}
            </p>
          </div>

          {/* =================================================================== */}
          {/* MOBILE EMBEDDED IMAGES (For Project and Certification)               */}
          {/* =================================================================== */}
          {(item.type === "project" || item.type === "certification") &&
            item.image?.visible !== false &&
            item.image?.url && (
              <div className="block lg:hidden my-2 w-full">
                <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/40 shadow-xs">
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    sizes="(max-width: 640px) 45vw, 25vw"
                    className={cn(
                      "transition-transform duration-300 group-hover:scale-[1.03]",
                      item.image.position === "contain"
                        ? "object-contain p-1"
                        : "object-cover object-center"
                    )}
                  />
                </div>
              </div>
            )}

          {/* =================================================================== */}
          {/* TECHNOLOGY CHIPS (Visible for items with tags)                       */}
          {/* =================================================================== */}
          {tags.length > 0 && (
            <div className="mt-2 sm:mt-3 pt-0.5 flex items-center gap-1 sm:gap-1.5 flex-wrap">
              {/* Mobile visible tags */}
              <div className="flex sm:hidden items-center gap-1 flex-wrap">
                {mobileVisibleTags.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-md bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 px-1.5 py-0.5 text-[8.5px] font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    <TechIcon name={tech} className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate max-w-[55px]">{tech}</span>
                  </span>
                ))}
                {mobileHiddenCount > 0 && (
                  <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800/90 px-1.5 py-0.5 text-[8.5px] font-mono font-semibold text-zinc-600 dark:text-zinc-400">
                    +{mobileHiddenCount}
                  </span>
                )}
              </div>

              {/* Desktop visible tags */}
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                {desktopVisibleTags.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs"
                  >
                    <TechIcon name={tech} className="h-3 w-3 shrink-0" />
                    <span>{tech}</span>
                  </span>
                ))}
                {desktopHiddenCount > 0 && (
                  <span className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                    +{desktopHiddenCount}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* DESKTOP VISUAL PREVIEW AREA (Right Column)                            */}
        {/* ===================================================================== */}
        {item.image?.visible !== false && item.image?.url && (
          <div className="hidden lg:flex shrink-0 w-[42%] max-w-full flex-col items-center justify-center my-auto">
            <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/40 shadow-xs">
              <Image
                src={item.image.url}
                alt={item.image.alt || item.title}
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                className={cn(
                  "transition-transform duration-300 group-hover:scale-[1.03]",
                  item.image.position === "contain"
                    ? "object-contain p-2"
                    : "object-cover object-center"
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* BOTTOM ACTION BUTTONS ROW                                               */}
      {/* ======================================================================= */}
      <div className="mt-3 sm:mt-4 pt-1 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
        {/* Primary CTA */}
        {item.primaryCta?.link && (
          <Link
            href={item.primaryCta.link}
            className={cn(
              "group/btn inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl py-1.5 sm:py-2 px-2.5 sm:px-4 text-[10px] sm:text-xs font-semibold transition-all duration-150 active:scale-[0.98] w-full sm:w-auto shrink-0",
              accent.primaryButton
            )}
          >
            <span>{item.primaryCta.text}</span>
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
          </Link>
        )}

        {/* Optional Secondary CTA (e.g. Live Demo for Project) */}
        {item.secondaryCta?.link && (
          <a
            href={item.secondaryCta.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden sm:inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl py-1.5 sm:py-2 px-2.5 sm:px-3 text-[10px] sm:text-xs font-medium transition-colors shrink-0",
              accent.secondaryButton
            )}
          >
            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{item.secondaryCta.text}</span>
          </a>
        )}
      </div>
    </div>
  );
}
