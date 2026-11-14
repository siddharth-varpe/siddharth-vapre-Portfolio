"use client";

import * as React from "react";
import type { SkillDocument, SkillsPageSettings } from "@/types/models";
import type { ComputedSkillsHeroMetric } from "@/lib/server/db/repositories/content";
import { DynamicOrbit } from "./dynamic-orbit";
import { Code2, Layers, BookOpen, Compass, Sparkles, LucideIcon } from "lucide-react";

interface SkillsHeroProps {
  skills: SkillDocument[];
  settings: SkillsPageSettings;
  metrics: ComputedSkillsHeroMetric[];
}

const METRIC_ICON_MAP: Record<string, LucideIcon> = {
  code: Code2,
  layers: Layers,
  "book-open": BookOpen,
  compass: Compass,
  sparkles: Sparkles,
};

export function SkillsHero({ skills, settings, metrics }: SkillsHeroProps) {
  return (
    <section className="relative w-full pt-4 pb-8 sm:py-10 lg:py-14 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#091019]">
      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Content & Metrics */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 z-10 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase">
                {settings.eyebrow || "SKILLS"}
              </span>
            </div>

            {/* Main Heading with Accent Token */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-foreground tracking-tight leading-[1.12]">
              {settings.titlePrimary}{" "}
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                {settings.titleAccent}
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted leading-relaxed max-w-xl">
              {settings.description}
            </p>

            {/* Data-Driven Metrics Grid (Factual database-derived numbers) */}
            {metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-2">
                {metrics.map((metric, idx) => {
                  const Icon = METRIC_ICON_MAP[metric.icon] || Sparkles;
                  // Dynamic subtle badge colors matching reference
                  const badgeStyles = [
                    "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/40",
                    "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/40",
                    "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/40",
                    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/40",
                  ];
                  const currentStyle = badgeStyles[idx % badgeStyles.length];

                  return (
                    <div
                      key={metric.id || idx}
                      className="p-3 sm:p-4 rounded-2xl bg-surface/90 dark:bg-surface/50 border border-blue-100/80 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700/60 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${currentStyle}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none mb-0.5">
                          {metric.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-foreground-muted font-medium leading-tight">
                          {metric.label === metric.value ? metric.supportingText : metric.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Orbit & Calligraphic Script Accent */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[460px] lg:min-h-[500px]">
            {/* Handwritten script annotation in upper right corner matching reference */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-6 z-20 pointer-events-none transform rotate-[-8deg]">
              <div className="text-right leading-tight select-none">
                <span className="block font-serif italic text-blue-600 dark:text-blue-400 text-sm sm:text-base lg:text-lg font-semibold drop-shadow-sm">
                  Better Tools
                </span>
                <span className="block font-serif italic text-blue-500/80 dark:text-blue-300/80 text-xs sm:text-sm lg:text-base font-semibold">
                  Bigger Ideas
                </span>
              </div>
            </div>

            {/* Orbit System */}
            <DynamicOrbit skills={skills} settings={settings} />
          </div>
        </div>
      </div>
    </section>
  );
}
