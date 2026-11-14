import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Send,
  Download,
  Users,
  Database,
  Zap,
  Sparkles,
  Code2,
  ArrowRight,
} from "lucide-react";
import type {
  OpportunitiesSectionConfig,
  OpportunityBadge,
} from "@/types/models";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

interface OpenForOpportunitiesSectionProps {
  config?: OpportunitiesSectionConfig;
}

/**
 * Icon dispatcher for floating opportunity pills.
 */
function BadgeIcon({ icon }: { icon: OpportunityBadge["icon"] }) {
  switch (icon) {
    case "database":
    case "server":
      return <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "lightning":
      return <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "sparkles":
      return <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "code":
      return <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "users":
    default:
      return <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  }
}

/**
 * Open For Opportunities Section (Strict Reference Implementation).
 *
 * Reproduces the visual language, typography, button hierarchy, and
 * original 3D origami paper-airplane vector art + floating pill badges.
 */
export function OpenForOpportunitiesSection({
  config,
}: OpenForOpportunitiesSectionProps) {
  if (config && config.enabled === false) return null;

  const eyebrow = config?.eyebrow || "OPEN FOR OPPORTUNITIES";
  const titlePrimary =
    config?.titlePrimary || "Ready to engineer high-impact systems";
  const titleAccent = config?.titleAccent || "together.";
  const description =
    config?.description ||
    "Whether you are hiring for full-stack software engineering roles, distributed systems, or AI application development, let's connect.";
  const primaryCtaText = config?.primaryCtaText || "Get in Touch";
  const primaryCtaLink = config?.primaryCtaLink || "/contact";
  const secondaryCtaText =
    config?.secondaryCtaText || "Download Resume PDF";
  const secondaryCtaLink =
    config?.secondaryCtaLink || "/api/resume/download";
  const badges: OpportunityBadge[] =
    config?.badges && config.badges.length > 0
      ? config.badges
      : [
          {
            id: "b-1",
            label: "Full-Stack Development",
            icon: "users",
          },
          {
            id: "b-2",
            label: "Distributed Systems",
            icon: "database",
          },
          {
            id: "b-3",
            label: "AI Applications",
            icon: "lightning",
          },
        ];

  return (
    <section
      aria-label="Open for Opportunities"
      className="space-y-5 sm:space-y-8"
    >
      <Container size="public">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-5 sm:p-7 lg:p-9 shadow-xs backdrop-blur-sm">
            {/* Subtle light/dark background ambient accents */}
            <div
              className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-sky-400/5 dark:bg-sky-400/3 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Asymmetric 2-Column Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* ============================================================= */}
              {/* LEFT COLUMN: Eyebrow, Main Headline, Subtext, and CTA buttons */}
              {/* ============================================================= */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 z-10">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#2563EB] dark:text-[#60A5FA] uppercase">
                    {eyebrow}
                  </span>
                </div>

                {/* Editorial Headline with Blue Accent */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  <span>{titlePrimary}</span>{" "}
                  <span className="text-[#1D4ED8] dark:text-[#3B82F6]">
                    {titleAccent}
                  </span>
                </h2>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {description}
                </p>

                {/* Dual Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                  {/* Primary CTA: Get in Touch */}
                  <Link
                    href={primaryCtaLink}
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#1D4ED8] hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all group"
                  >
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    <span>{primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4 opacity-80" />
                  </Link>

                  {/* Secondary CTA: Download Resume PDF */}
                  <a
                    href={secondaryCtaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download verified resume PDF"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all"
                  >
                    <Download className="w-4 h-4 text-[#1D4ED8] dark:text-[#3B82F6]" />
                    <span>{secondaryCtaText}</span>
                  </a>
                </div>
              </div>

              {/* ============================================================= */}
              {/* RIGHT COLUMN: Paper Airplane Vector Artwork + Floating Pills  */}
              {/* ============================================================= */}
              <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end min-h-[220px] sm:min-h-[260px] pt-4 lg:pt-0">
                {/* Background Vector Art (Plane, Trajectory & Dot Matrix) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center lg:justify-end select-none">
                  <Image
                    src="/images/opportunities/paper-plane-origami-art.svg"
                    alt=""
                    width={480}
                    height={320}
                    className="w-full max-w-[420px] h-auto object-contain opacity-95 dark:opacity-90 drop-shadow-xs"
                    priority
                  />
                </div>

                {/* Floating Stacked Capsule Badges */}
                <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3 w-full max-w-[240px] sm:max-w-[260px] ml-auto">
                  {badges.map((badge, idx) => {
                    // Stagger translation for organic visual flow matching the reference
                    const offsetClass =
                      idx === 0
                        ? "self-end translate-x-1"
                        : idx === 1
                        ? "self-end -translate-x-1"
                        : "self-end translate-x-2";

                    return (
                      <div
                        key={badge.id || badge.label}
                        className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/95 dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 shadow-md dark:shadow-slate-950/40 backdrop-blur-xs transition-transform hover:-translate-y-0.5 ${offsetClass}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <BadgeIcon icon={badge.icon} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
