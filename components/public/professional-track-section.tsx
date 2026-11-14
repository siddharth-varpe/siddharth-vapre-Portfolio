import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { ExperienceDocument, ExperienceHighlight } from "@/types/models";
import { SemanticWorkIcon } from "./semantic-work-icon";
import { TechIcon } from "./tech-icons";
import { formatDateRange } from "@/lib/utils/date-format";
import {
  Briefcase,
  Calendar,
  Clock,
  ArrowRight,
  MoreVertical,
  Code2,
  MapPin,
} from "lucide-react";

interface ProfessionalTrackSectionProps {
  track?: ExperienceDocument | null;
  className?: string;
  isEmbedPreview?: boolean;
}

/**
 * Highlights metrics (e.g. 2,000–3,000+, ~90%, 10,000+, 65–75%) in royal blue bold text
 * exactly as styled in the visual source of truth.
 */
function renderHighlightedText(text: string) {
  if (!text) return null;

  // Strict regex targeting numerical outcomes, ranges, tildes, percentages, and pluses
  const pattern = /(?:~?\d{1,3}(?:,\d{3})*(?:–\d{1,3}(?:,\d{3})*)?\+?%?|\d+–\d+%(?:–\d+%)?|\d+–\d+\+?%?|~\d+%(?:–\d+%)?)/g;

  const tokens: Array<{ text: string; isMetric: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.substring(lastIndex, match.index), isMetric: false });
    }
    // Only highlight if contains digits
    const hasDigits = /\d/.test(match[0]);
    tokens.push({ text: match[0], isMetric: hasDigits });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ text: text.substring(lastIndex), isMetric: false });
  }

  return (
    <span>
      {tokens.map((token, i) =>
        token.isMetric ? (
          <strong key={i} className="text-[#1D4ED8] dark:text-[#3B82F6] font-bold">
            {token.text}
          </strong>
        ) : (
          <span key={i}>{token.text}</span>
        )
      )}
    </span>
  );
}

export function ProfessionalTrackSection({
  track,
  className = "",
  isEmbedPreview = false,
}: ProfessionalTrackSectionProps) {
  if (!track) return null;

  const { rangeText } = formatDateRange(track.startDate, track.endDate, track.current);

  // Active highlights
  const highlights: ExperienceHighlight[] = (track.highlights && track.highlights.length > 0)
    ? track.highlights.filter((h) => h.enabled !== false).sort((a, b) => a.order - b.order)
    : (track.responsibilities || []).map((resp, idx) => ({
        id: `synth-${idx}`,
        title: idx === 0 ? "Built & Deployed Full-Stack CRM" : "Scalable Inventory Management Platform",
        description: resp,
        type: idx === 0 ? "crm" : "inventory",
        order: idx,
        enabled: true,
      }));

  const technologies = track.technologies || [];

  return (
    <section
      aria-label="Professional Track Record"
      className={`relative w-full max-w-4xl mx-auto ${className}`}
    >
      {/* Editorial Card Container */}
      <div className="relative rounded-3xl bg-white dark:bg-[#0D1527] border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm dark:shadow-2xl overflow-hidden p-6 sm:p-9 transition-colors">
        {/* Subtle decorative background gradient / wave */}
        <div
          className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* ========================================================================= */}
        {/* 1. HEADER ROW: Squircle Briefcase + Track Eyebrow + 3-Dots Menu           */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase font-mono">
              PROFESSIONAL TRACK RECORD
            </span>
          </div>

          <div className="text-blue-600/60 dark:text-blue-400/60">
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ROLE + COMPANY HEADING & UPPER-RIGHT COMPANY LOGO                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-5">
          <div className="space-y-1 pr-0 sm:pr-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.25]">
              {track.role} <span className="font-semibold text-slate-700 dark:text-slate-300">at</span>{" "}
              <span className="text-[#1D4ED8] dark:text-[#3B82F6] block sm:inline">
                {track.company}
              </span>
            </h2>
          </div>

          {/* Company Logo Card */}
          <div className="shrink-0 self-start sm:self-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm p-2 flex flex-col items-center justify-center">
              {track.companyLogoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={track.companyLogoUrl}
                    alt={`${track.company} logo`}
                    width={80}
                    height={80}
                    className="object-contain max-h-16 max-w-16"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-1">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                    {track.company}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. METADATA & ACTIONS: Date Range Pill + Full Timeline Link                */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          {/* Date Range Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <span>{rangeText}</span>
          </div>

          {/* Full Timeline Action */}
          {isEmbedPreview ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400" />
              <span>{track.ctaLabel || "Full Timeline"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </div>
          ) : (
            <Link
              href={track.ctaUrl || "/experience"}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400" />
              <span>{track.ctaLabel || "Full Timeline"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. SUMMARY NARRATIVE                                                      */}
        {/* ========================================================================= */}
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-normal">
          {track.description}
        </p>

        {/* ========================================================================= */}
        {/* 5. WORK HIGHLIGHTS VERTICAL TIMELINE                                      */}
        {/* ========================================================================= */}
        {highlights.length > 0 && (
          <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-7 mb-7 sm:mb-8">
            {/* Continuous vertical connecting line */}
            <div
              className="absolute left-[7px] sm:left-[11px] top-3 bottom-4 w-[2px] bg-blue-200 dark:bg-blue-900/60"
              aria-hidden="true"
            />

            {highlights.map((hl) => (
              <div key={hl.id} className="relative flex items-start gap-3 sm:gap-4">
                {/* Node dot on the vertical line */}
                <div
                  className="absolute -left-[21px] sm:-left-[25px] top-2.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#0D1527]"
                  aria-hidden="true"
                />

                {/* Automatic Semantic Icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0 mt-0.5">
                  <SemanticWorkIcon type={hl.type} className="w-5 h-5" />
                </div>

                {/* Highlight Content */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {hl.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {renderHighlightedText(hl.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. STACK APPLIED PANEL                                                    */}
        {/* ========================================================================= */}
        {technologies.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 sm:p-5 space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase font-mono">
                STACK APPLIED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
                >
                  <TechIcon name={tech} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. LOCATION & WORK MODE ROW                                               */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Location
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {track.location}
            </span>
            {track.workMode && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                {track.workMode}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
