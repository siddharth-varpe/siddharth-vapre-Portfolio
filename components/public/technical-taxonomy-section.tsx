import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, Terminal, Cpu, Layers, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TechnicalTaxonomyConfig } from "@/types/models";

interface TechnicalTaxonomySectionProps {
  config?: TechnicalTaxonomyConfig | null;
  className?: string;
}

/**
 * Returns pastel squircle styling for each skill icon container
 * strictly reproducing the visual reference's delicate brand-tinted surfaces.
 */
function getSkillSquircleStyle(iconName: string) {
  const norm = (iconName || "").toLowerCase();

  // React.js: Light Cyan / Sky
  if (norm.includes("react")) {
    return {
      bg: "bg-[#E6F7FF] dark:bg-cyan-950/40",
      border: "border-[#BAE7FF] dark:border-cyan-800/40",
    };
  }
  // Next.js: Light Zinc / Neutral
  if (norm.includes("next")) {
    return {
      bg: "bg-[#F4F4F5] dark:bg-zinc-800/60",
      border: "border-[#E4E4E7] dark:border-zinc-700/50",
    };
  }
  // Node.js: Light Emerald / Green
  if (norm.includes("node")) {
    return {
      bg: "bg-[#EDF9F0] dark:bg-emerald-950/40",
      border: "border-[#C6F0D1] dark:border-emerald-800/40",
    };
  }
  // Python: Soft Blue
  if (norm.includes("python")) {
    return {
      bg: "bg-[#EFF6FF] dark:bg-blue-950/40",
      border: "border-[#DBEAFE] dark:border-blue-800/40",
    };
  }
  // PostgreSQL: Soft Slate / Sky
  if (norm.includes("postgres")) {
    return {
      bg: "bg-[#EBF5FB] dark:bg-sky-950/40",
      border: "border-[#D4E6F1] dark:border-sky-800/40",
    };
  }
  // FastAPI: Soft Mint / Teal
  if (norm.includes("fastapi")) {
    return {
      bg: "bg-[#E6FFFA] dark:bg-teal-950/40",
      border: "border-[#B2F5EA] dark:border-teal-800/40",
    };
  }
  // WebSockets: Soft Violet / Lavender
  if (norm.includes("websocket") || norm.includes("socket")) {
    return {
      bg: "bg-[#F5F3FF] dark:bg-violet-950/40",
      border: "border-[#EDE9FE] dark:border-violet-800/40",
    };
  }
  // Git: Soft Peach / Orange
  if (norm.includes("git")) {
    return {
      bg: "bg-[#FFF1EC] dark:bg-orange-950/40",
      border: "border-[#FED7AA] dark:border-orange-800/40",
    };
  }
  // TypeScript
  if (norm.includes("typescript") || norm === "ts") {
    return {
      bg: "bg-[#EFF6FF] dark:bg-blue-950/40",
      border: "border-[#DBEAFE] dark:border-blue-800/40",
    };
  }
  // Docker
  if (norm.includes("docker")) {
    return {
      bg: "bg-[#EFF6FF] dark:bg-sky-950/40",
      border: "border-[#BAE7FF] dark:border-sky-800/40",
    };
  }
  // Redis
  if (norm.includes("redis")) {
    return {
      bg: "bg-[#FFF1F2] dark:bg-rose-950/40",
      border: "border-[#FECDD3] dark:border-rose-800/40",
    };
  }
  // GraphQL
  if (norm.includes("graphql")) {
    return {
      bg: "bg-[#FDF2F8] dark:bg-pink-950/40",
      border: "border-[#FBCFE8] dark:border-pink-800/40",
    };
  }

  return {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    border: "border-slate-200 dark:border-slate-700/50",
  };
}

/**
 * Authentic brand icon vector renderer matching the exact visual references.
 */
function TaxonomySkillIcon({ icon }: { icon: string }) {
  const norm = (icon || "").toLowerCase();

  // 1. React.js
  if (norm.includes("react")) {
    return (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
        <g stroke="#00d8ff" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // 2. Next.js
  if (norm.includes("next")) {
    return (
      <svg viewBox="0 0 180 180" className="w-6 h-6" fill="none" aria-hidden="true">
        <circle cx="90" cy="90" r="90" fill="#000000" />
        <path
          d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
          fill="url(#tax_next_g1)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#tax_next_g2)" />
        <defs>
          <linearGradient id="tax_next_g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tax_next_g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 3. Node.js
  if (norm.includes("node")) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden="true">
        <path
          d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2Z"
          className="fill-emerald-600/20 stroke-emerald-600"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 6L7.5 8.6V13.8L12 16.4L16.5 13.8V8.6L12 6Z"
          className="stroke-emerald-600"
          strokeWidth="1.2"
        />
        <circle cx="12" cy="11.2" r="1.5" className="fill-emerald-600" />
      </svg>
    );
  }

  // 4. Python
  if (norm.includes("python")) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <path
          d="M11.922 2C6.945 2 7.247 4.156 7.247 4.156L7.253 6.39H12.03V7.125H5.163S2 6.766 2 11.916C2 17.066 4.757 16.828 4.757 16.828H6.4V14.536C6.4 11.936 8.528 11.986 8.528 11.986H13.25V11.238H7.228C7.228 11.238 7.228 8.653 9.775 8.653C12.321 8.653 14.569 8.653 14.569 8.653S16.719 8.795 16.719 6.425C16.719 4.055 16.899 2 11.922 2ZM9.434 3.518C9.972 3.518 10.41 3.956 10.41 4.494C10.41 5.032 9.972 5.47 9.434 5.47C8.896 5.47 8.458 5.032 8.458 4.494C8.458 3.956 8.896 3.518 9.434 3.518Z"
          fill="#387EB8"
        />
        <path
          d="M12.078 22C17.055 22 16.753 19.844 16.753 19.844L16.747 17.61H11.97V16.875H18.837S22 17.234 22 12.084C22 6.934 19.243 7.172 19.243 7.172H17.6V9.464C17.6 12.064 15.472 12.014 15.472 12.014H10.75V12.762H16.772C16.772 12.762 16.772 15.347 14.225 15.347C11.679 15.347 9.431 15.347 9.431 15.347S7.281 15.205 7.281 17.575C7.281 19.945 7.101 22 12.078 22ZM14.566 20.482C14.028 20.482 13.59 20.044 13.59 19.506C13.59 18.968 14.028 18.53 14.566 18.53C15.104 18.53 15.542 18.968 15.542 19.506C15.542 20.044 15.104 20.482 14.566 20.482Z"
          fill="#FFE052"
        />
      </svg>
    );
  }

  // 5. PostgreSQL: Official elephant silhouette
  if (norm.includes("postgres")) {
    return (
      <svg viewBox="2 2 20 20" className="w-6 h-6" fill="#336791" aria-hidden="true">
        <path d="M18.835 14.218c-.147-.07-.377-.147-.643-.223-.059-.728-.276-1.74-.82-2.732.964-.176 1.763-.646 1.944-1.503.228-1.077-.665-2.074-1.79-2.316a3.784 3.784 0 0 0-.82-.089c-.588 0-1.127.176-1.558.469-.472-.61-1.126-1.078-1.898-1.31-.059-.516-.27-1.144-.674-1.74C11.758 3.52 10.378 3 8.878 3 7.009 3 5.48 3.824 4.887 5.253c-.352.846-.358 1.967-.018 3.327-.899.418-1.488 1.258-1.488 2.302 0 1.487 1.18 2.701 2.65 2.707.123 1.345.59 2.502 1.332 3.35.986 1.127 2.348 1.737 3.939 1.761h.065c.57 0 1.139-.082 1.69-.247 1.545.968 3.42 1.549 5.378 1.549.336 0 .668-.018 1-.053 1.62-.176 2.87-1.192 3.197-2.61a2.822 2.822 0 0 0-.295-1.996c-.22-.387-.506-.723-.846-.994l.346-.131zm-6.732-8.32c.316.463.486.963.533 1.397-.57-.047-1.184.035-1.79.252-.152-.698-.316-1.25-.492-1.637.586-.024 1.23.018 1.749-.012zm-3.225.012c.164.364.316.892.457 1.543-.728.328-1.397.839-1.926 1.502a12.82 12.82 0 0 1-.035-2.22c.328-.487.892-.825 1.504-.825zm-2.822 2.793a5.535 5.535 0 0 1 1.725-.334c.053.487.147 1.01.294 1.55-.429.416-.763.927-.998 1.502-.457-.68-.82-1.602-1.021-2.718zm.13 4.249c.287-.557.697-1.033 1.196-1.41.246.687.587 1.344 1.021 1.937-.898.399-1.685.129-2.217-.527zm4.185 5.275c-1.297-.024-2.394-.522-3.175-1.444-.61-.722-.998-1.69-1.127-2.823.546.182 1.157.194 1.785.006.51-.153.974-.423 1.373-.787.423.44.922.78 1.485.992.346.757.787 1.403 1.309 1.908-.522.094-1.08.148-1.65.148zm5.578-.458c-1.62-.03-3.15-.558-4.384-1.45.675-.78 1.174-1.784 1.415-2.923.364.07.74.106 1.127.106 1.303 0 2.502-.423 3.475-1.139.053.763.293 1.837.915 2.87-1.121 1.584-1.872 2.536-2.548 2.536z" />
      </svg>
    );
  }

  // 6. FastAPI
  if (norm.includes("fastapi")) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#009688" />
        <path d="M12.8 4L6.5 13.5H12L11.2 20L17.5 10.5H12L12.8 4Z" fill="#ffffff" />
      </svg>
    );
  }

  // 7. WebSockets
  if (norm.includes("websocket") || norm.includes("socket")) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden="true">
        <path
          d="M12 4C7.58 4 4 7.58 4 12c0 2.21.9 4.21 2.34 5.66l1.42-1.42C6.67 15.15 6 13.66 6 12c0-3.31 2.69-6 6-6c1.66 0 3.15.67 4.24 1.76l1.42-1.42C16.21 4.9 14.21 4 12 4z"
          fill="#6366F1"
        />
        <path
          d="M12 20c4.42 0 8-3.58 8-8c0-2.21-.9-4.21-2.34-5.66l-1.42 1.42C17.33 8.85 18 10.34 18 12c0 3.31-2.69 6-6 6c-1.66 0-3.15-.67-4.24-1.76l-1.42 1.42C7.79 19.1 9.79 20 12 20z"
          fill="#6366F1"
        />
        <circle cx="12" cy="12" r="2.5" fill="#4F46E5" />
      </svg>
    );
  }

  // 8. Git
  if (norm.includes("git")) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" transform="rotate(45 12 12)" fill="#F05032" />
        <circle cx="12" cy="7.5" r="1.3" fill="white" />
        <circle cx="8" cy="12" r="1.3" fill="white" />
        <circle cx="12" cy="16.5" r="1.3" fill="white" />
        <line x1="8" y1="12" x2="12" y2="16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="7.5" x2="12" y2="16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  // TypeScript
  if (norm.includes("typescript") || norm === "ts") {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <path d="M12.5 10H7.5V12H9V18H11V12H12.5V10Z" fill="white" />
        <path d="M14 15.5C14.5 16.5 15.5 16.8 16.5 16.5C17.5 16.2 17.5 15.2 17.2 14.8C16.8 14.2 15.2 13.8 14.5 13.2C13.5 12.4 13.7 11 14.5 10.4C15.5 9.6 17 9.8 17.8 10.5L16.6 11.7C16.2 11.3 15.5 11.1 14.9 11.4C14.4 11.6 14.4 12.3 14.8 12.6C15.4 13.1 17 13.4 17.8 14.2C18.6 15 18.5 16.6 17.2 17.5C16 18.3 14.2 18 13 16.8L14 15.5Z" fill="white" />
      </svg>
    );
  }

  // Fallback icon
  return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
}

/**
 * Section Top Icon renderer (Default is Code `< / >`)
 */
function SectionMark({ iconName }: { iconName?: string }) {
  const norm = (iconName || "code").toLowerCase();

  return (
    <div
      className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-base font-bold shadow-xs select-none"
      aria-hidden="true"
    >
      {norm === "code" || norm === "< / >" || norm === "</>" ? (
        <span>&lt;/&gt;</span>
      ) : norm === "terminal" ? (
        <Terminal className="w-5 h-5" />
      ) : norm === "cpu" ? (
        <Cpu className="w-5 h-5" />
      ) : norm === "database" ? (
        <Database className="w-5 h-5" />
      ) : (
        <Code className="w-5 h-5" />
      )}
    </div>
  );
}

/**
 * Technical Taxonomy Section
 * Strictly reproduces the Desktop (4-col) and Mobile (2-col) visual references.
 */
export function TechnicalTaxonomySection({
  config,
  className,
}: TechnicalTaxonomySectionProps) {
  if (!config || config.enabled === false) {
    return null;
  }

  const skills = (config.skills || [])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  if (skills.length === 0) {
    return null;
  }

  // Decorative Visual Settings
  const deco = config.decorativeVisual || {
    enabled: true,
    assetUrl: "/images/taxonomy-window-illustration.png",
    position: "top-right",
    mobileVisibility: "show",
    opacityPreset: "medium",
    accentVariant: "blue",
  };

  const decoPositionClass =
    deco.position === "center-right"
      ? "top-1/4 right-3 sm:right-6 lg:right-10"
      : deco.position === "bottom-right"
      ? "bottom-6 right-3 sm:right-6 lg:right-10"
      : "top-4 sm:top-6 lg:top-8 right-3 sm:right-6 lg:right-10";

  const decoOpacityClass =
    deco.opacityPreset === "subtle"
      ? "opacity-40 dark:opacity-20"
      : "opacity-95 dark:opacity-40";

  const decoVisibilityClass =
    deco.mobileVisibility === "hide" ? "hidden lg:block" : "block";

  return (
    <section
      id="taxonomy"
      aria-label="Technical Taxonomy"
      className={cn(
        "relative w-full py-8 sm:py-12 lg:py-14 transition-colors duration-200",
        className
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-8 xl:px-12">
        {/* ========================================================================= */}
        {/* MAIN SECTION CARD CONTAINER                                               */}
        {/* Matches reference's spacious, rounded container with subtle border & bg   */}
        {/* ========================================================================= */}
        <div className="relative rounded-[22px] sm:rounded-[34px] lg:rounded-[40px] border border-slate-100/90 dark:border-slate-800/80 bg-[#FAFCFF] dark:bg-[#070D18] p-3.5 sm:p-7 lg:p-12 xl:p-14 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {/* Subtle Decorative Background Geometry */}
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100/35 dark:bg-blue-900/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-100/30 dark:bg-sky-900/10 blur-3xl"
            aria-hidden="true"
          />

          {/* ======================================================================= */}
          {/* DECORATIVE RIGHT-SIDE TECHNICAL WINDOW ILLUSTRATION                     */}
          {/* Strictly reproducing the code window preview from the visual reference  */}
          {/* ======================================================================= */}
          {deco.enabled !== false && deco.assetUrl && (
            <div
              className={cn(
                "absolute pointer-events-none select-none z-0 transition-opacity duration-300",
                decoPositionClass,
                decoOpacityClass,
                decoVisibilityClass
              )}
              aria-hidden="true"
            >
              <div className="relative w-28 sm:w-48 md:w-64 lg:w-80 xl:w-[380px] aspect-[4/3] drop-shadow-sm">
                <Image
                  src={deco.assetUrl}
                  alt="Technical architecture illustration"
                  fill
                  sizes="(max-width: 640px) 120px, (max-width: 1024px) 250px, 380px"
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION HEADER                                                          */}
          {/* Hierarchy: Icon -> Eyebrow -> Main Title -> Description                 */}
          {/* ======================================================================= */}
          <div className="relative z-10 max-w-2xl mb-6 sm:mb-10 lg:mb-12">
            {/* A. Section Icon */}
            <div className="mb-3.5 sm:mb-5">
              <SectionMark iconName={config.sectionIcon} />
            </div>

            {/* B. Eyebrow */}
            <div className="text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400 mb-1.5 sm:mb-2.5">
              {config.eyebrow || "TECHNICAL TAXONOMY"}
            </div>

            {/* C. Main Title with Distinct Accent Word */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-2.5 sm:mb-4">
              <span>{config.titlePrimary || "Technical"}</span>
              <br />
              <span className="text-[#1D4ED8] dark:text-[#3B82F6]">
                {config.titleAccent || "Taxonomy"}
              </span>
            </h2>

            {/* D. Description */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-xl">
              {config.description}
            </p>
          </div>

          {/* ======================================================================= */}
          {/* SKILL GRID                                                              */}
          {/* Strict 4 columns on Desktop, strict 2 columns on Mobile                 */}
          {/* ======================================================================= */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 lg:gap-4.5 mb-6 sm:mb-10">
            {skills.map((skill) => {
              const squircleStyle = getSkillSquircleStyle(skill.icon || skill.name);

              const cardContent = (
                <div
                  className="group relative flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-200 h-full"
                >
                  {/* Left: Squircle Icon Container */}
                  <div
                    className={cn(
                      "shrink-0 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl border flex items-center justify-center p-1.5 sm:p-2 lg:p-2.5 transition-transform duration-200 group-hover:scale-105",
                      squircleStyle.bg,
                      squircleStyle.border
                    )}
                    aria-hidden="true"
                  >
                    <TaxonomySkillIcon icon={skill.icon || skill.name} />
                  </div>

                  {/* Right: Skill Name & Category Subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {skill.name}
                    </div>
                    <div className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5">
                      {skill.category}
                    </div>
                  </div>
                </div>
              );

              if (skill.link) {
                return (
                  <Link
                    key={skill.id}
                    href={skill.link}
                    aria-label={skill.ariaLabel || `${skill.name} - ${skill.category}`}
                    className="block focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl sm:rounded-2xl"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div key={skill.id} tabIndex={0} className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl sm:rounded-2xl">
                  {cardContent}
                </div>
              );
            })}
          </div>

          {/* ======================================================================= */}
          {/* PRIMARY CTA                                                             */}
          {/* Recreating the prominent blue pill button from the visual reference      */}
          {/* ======================================================================= */}
          {config.cta && config.cta.enabled !== false && (
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center">
              <Link
                href={config.cta.destination || "/skills"}
                className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] w-full sm:w-auto"
              >
                <span>{config.cta.text || "Explore Full Skill Catalog"}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
