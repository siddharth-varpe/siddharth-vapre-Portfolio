"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronDown,
  Building2,
  ExternalLink,
} from "lucide-react";
import type { ExperienceDocument, ExperienceHighlight } from "@/types/models";
import { SemanticWorkIcon } from "@/components/public/semantic-work-icon";
import { TechIcon } from "@/components/public/tech-icons";

interface ExperienceCardProps {
  track: ExperienceDocument;
  isExpandedDefault?: boolean;
  viewMode?: "timeline" | "roles" | "impact";
  className?: string;
}

/**
 * Highlights metrics (e.g. 2,000–3,000+, ~90%, 10,000+, 65–75%) in royal blue bold text
 * exactly as styled in the visual source of truth.
 */
function renderHighlightedText(text: string) {
  if (!text) return null;

  const pattern =
    /(?:~?\d{1,3}(?:,\d{3})*(?:–\d{1,3}(?:,\d{3})*)?\+?%?|\d+–\d+%(?:–\d+%)?|\d+–\d+\+?%?|~\d+%(?:–\d+%)?)/g;

  const tokens: Array<{ text: string; isMetric: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.substring(lastIndex, match.index), isMetric: false });
    }
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

export function ExperienceCard({
  track,
  isExpandedDefault = true,
  viewMode = "timeline",
  className = "",
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(isExpandedDefault);

  const isEducation = track.type === "education" || track.employmentType === "Education";
  const highlights: ExperienceHighlight[] = (track.highlights || [])
    .filter((h) => h.enabled !== false)
    .sort((a, b) => a.order - b.order);

  const technologies = track.technologies || [];

  return (
    <article
      aria-label={`${track.role} at ${track.company}`}
      className={`relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 transition-colors ${className}`}
    >
      {/* 1. Header: Role, Company, Location, Work Mode & Logo Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {track.role}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {track.companyWebsite ? (
              <a
                href={track.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group"
              >
                <span>{track.company}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : (
              <span className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                {track.company}
              </span>
            )}
          </div>

          {/* Location & Work Mode / Degree */}
          <div className="flex items-center gap-4 flex-wrap text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">
            {track.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{track.location}</span>
              </div>
            )}

            {isEducation ? (
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{track.responsibilities?.[0] || "Undergraduate Degree"}</span>
              </div>
            ) : (
              track.workMode && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{track.workMode}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right side: Company Logo + Expand/Collapse Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Logo Badge Container */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-2 flex items-center justify-center">
            {track.companyLogoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={track.companyLogoUrl}
                  alt={`${track.company} logo`}
                  width={60}
                  height={60}
                  className="object-contain max-h-12 max-w-12"
                />
              </div>
            ) : isEducation ? (
              /* Controlled Neutral Fallback for Education (Academic Crest Emblem) */
              <div
                className="flex flex-col items-center justify-center text-center p-1 text-slate-700 dark:text-slate-200"
                title={track.company}
              >
                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-0.5" />
                <span className="font-mono text-[9px] font-bold tracking-wider leading-none">
                  {track.company.includes("SPPU") ? "SPPU" : "ACADEMIC"}
                </span>
              </div>
            ) : (
              /* Controlled Neutral Fallback for Corporate / Other */
              <div
                className="flex flex-col items-center justify-center text-center p-1 text-slate-700 dark:text-slate-200"
                title={track.company}
              >
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-0.5" />
                <span className="font-mono text-[9px] font-bold tracking-wider leading-none truncate max-w-[48px]">
                  {track.company.slice(0, 4).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Expand/Collapse Chevron Button */}
          {(highlights.length > 0 || technologies.length > 0) && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse highlights" : "Expand highlights"}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* 2. Summary Description */}
      {track.description && (
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mt-3.5 font-normal">
          {track.description}
        </p>
      )}

      {/* Collapsible Content: Highlights & Technologies */}
      {isExpanded && (
        <div className="space-y-4 pt-3 mt-1">
          {/* 3. Work Highlights (Only if present) */}
          {highlights.length > 0 && viewMode !== "roles" && (
            <div className="rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/70 dark:border-blue-900/40 p-4 sm:p-5 space-y-4">
              {highlights.map((hl) => (
                <div key={hl.id} className="flex items-start gap-3 sm:gap-4">
                  {/* Semantic Squircle Icon */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100/70 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0 mt-0.5">
                    <SemanticWorkIcon type={hl.type} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Highlight Text */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
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

          {/* 4. Technologies & Tools */}
          {technologies.length > 0 && viewMode !== "impact" && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                  TECHNOLOGIES &amp; TOOLS
                </span>
                <div className="h-[1px] flex-1 bg-slate-200/80 dark:bg-slate-800" />
              </div>

              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <div
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
