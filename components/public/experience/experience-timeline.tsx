"use client";

import * as React from "react";
import { Briefcase } from "lucide-react";
import type { ExperienceDocument } from "@/types/models";
import { formatDateRange } from "@/lib/utils/date-format";
import { ExperienceCard } from "./experience-card";

interface ExperienceTimelineProps {
  experiences: ExperienceDocument[];
  className?: string;
}

export function ExperienceTimeline({
  experiences,
  className = "",
}: ExperienceTimelineProps) {
  const [viewMode, setViewMode] = React.useState<"timeline" | "roles" | "impact">("timeline");

  // Empty state handling
  if (!experiences || experiences.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          TIMELINE NOTICE
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Experience Catalog Synchronizing
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Published engineering roles and milestones will appear automatically once published in the verified CMS.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Professional Journey Timeline" className={`space-y-6 ${className}`}>
      {/* 1. Header with View Controls: [Timeline] [Roles] [Impact] */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            PROFESSIONAL JOURNEY
          </span>
          <div className="h-[1px] w-8 sm:w-16 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
        </div>

        {/* View Mode Segmented Controls */}
        <div
          role="tablist"
          aria-label="Timeline display view"
          className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold self-start sm:self-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "timeline"}
            onClick={() => setViewMode("timeline")}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              viewMode === "timeline"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Timeline
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "roles"}
            onClick={() => setViewMode("roles")}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              viewMode === "roles"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Roles
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "impact"}
            onClick={() => setViewMode("impact")}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              viewMode === "impact"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Impact
          </button>
        </div>
      </div>

      {/* 2. Chronological Timeline List */}
      <div className="relative pt-2">
        <ol className="relative space-y-8 sm:space-y-10">
          {experiences.map((track, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === experiences.length - 1;
            const { rangeText, durationText } = formatDateRange(
              track.startDate,
              track.endDate,
              track.current,
              { verboseDuration: true }
            );

            return (
              <li
                key={track.id || idx}
                className="relative grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start"
              >
                {/* Desktop: Left Date Column (3 cols) */}
                <div className="sm:col-span-3 pt-1 text-left sm:text-right pr-0 sm:pr-2">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      isFirst
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {rangeText}
                  </div>
                  {durationText && (
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {durationText}
                    </div>
                  )}
                </div>

                {/* Timeline Axis Center Node & Connector (1 col on desktop, absolute line on mobile) */}
                <div className="relative sm:col-span-1 hidden sm:flex flex-col items-center h-full pt-1.5">
                  {/* Circular Node Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full z-10 shrink-0 ring-4 ring-white dark:ring-[#070C18] ${
                      isFirst
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Vertical connector line terminating cleanly after the last item */}
                  {!isLast && (
                    <div
                      className="w-[2px] bg-slate-200 dark:bg-slate-800 absolute top-4 bottom-[-40px]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Mobile-only subtle line indicator */}
                <div className="sm:hidden flex items-center gap-2 pb-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white dark:ring-[#070C18] ${
                      isFirst ? "bg-blue-600" : "bg-slate-400"
                    }`}
                  />
                  <span className="text-[11px] font-mono text-slate-500">
                    {track.employmentType || "Milestone"}
                  </span>
                </div>

                {/* Main Experience Card (8 cols on desktop, full width on mobile) */}
                <div className="sm:col-span-8 w-full">
                  <ExperienceCard
                    track={track}
                    viewMode={viewMode}
                    isExpandedDefault={true}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
