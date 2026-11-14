"use client";

import * as React from "react";
import type { SkillCategoryDocument, SkillDocument } from "@/types/models";
import { TechIcon } from "@/components/public/tech-icons";
import {
  Code2,
  Database,
  Sparkles,
  Wrench,
  ArrowUpRight,
  ChevronRight,
  FolderCode,
  LucideIcon,
} from "lucide-react";

interface SkillsCategoryGridProps {
  categories: SkillCategoryDocument[];
  skills: SkillDocument[];
  activeCategory: string;
  searchQuery: string;
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  code: Code2,
  database: Database,
  sparkles: Sparkles,
  wrench: Wrench,
  frontend: Code2,
  backend: Database,
  "ai & ml": Sparkles,
  tools: Wrench,
};

export function SkillsCategoryGrid({
  categories,
  skills,
  activeCategory,
  searchQuery,
}: SkillsCategoryGridProps) {
  // Filter categories by active category filter
  const filteredCategories = React.useMemo(() => {
    if (activeCategory === "All") return categories;
    return categories.filter(
      (c) => c.name.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [categories, activeCategory]);

  // Clean search filter
  const query = searchQuery.trim().toLowerCase();

  return (
    <div className="w-full space-y-6">
      {/* Desktop & Tablet Multi-Column Category Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-5 lg:gap-6">
        {filteredCategories.map((cat, catIdx) => {
          const catSkills = skills
            .filter((s) => s.category?.toLowerCase() === cat.name.toLowerCase())
            .filter((s) => !query || s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query)))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          // If searching and this category has no matching skills, hide it
          if (query && catSkills.length === 0) return null;

          const IconComponent =
            CATEGORY_ICON_MAP[cat.icon?.toLowerCase() || ""] ||
            CATEGORY_ICON_MAP[cat.name.toLowerCase()] ||
            FolderCode;

          // Category accent color scheme
          const accentColorSchemes = [
            {
              iconBox: "bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/40 text-blue-600 dark:text-blue-400",
              badge: "hover:border-blue-400 dark:hover:border-blue-500",
            },
            {
              iconBox: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400",
              badge: "hover:border-emerald-400 dark:hover:border-emerald-500",
            },
            {
              iconBox: "bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/40 text-purple-600 dark:text-purple-400",
              badge: "hover:border-purple-400 dark:hover:border-purple-500",
            },
            {
              iconBox: "bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/40 text-amber-600 dark:text-amber-400",
              badge: "hover:border-amber-400 dark:hover:border-amber-500",
            },
          ];
          const style = accentColorSchemes[catIdx % accentColorSchemes.length];

          return (
            <div
              key={cat.id || cat.name}
              className="p-5 lg:p-6 rounded-3xl bg-surface/90 dark:bg-surface/50 border border-blue-100/80 dark:border-zinc-800 shadow-[0_4px_24px_rgba(30,58,138,0.04)] dark:shadow-none flex flex-col justify-between group hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
            >
              {/* Category Card Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${style.iconBox}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-bold text-foreground tracking-tight">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-foreground-muted leading-relaxed line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-muted/60 flex items-center justify-center text-foreground-muted group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Skill Chips Grid */}
                <div className="pt-4 flex flex-wrap gap-2">
                  {catSkills.length === 0 ? (
                    <span className="text-xs text-foreground-muted italic py-2">
                      No skills found in this category.
                    </span>
                  ) : (
                    catSkills.map((skill) => (
                      <div
                        key={skill.id || skill.name}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface dark:bg-zinc-900 border border-border/80 shadow-xs hover:scale-105 transition-all duration-200 cursor-default ${style.badge}`}
                      >
                        <TechIcon name={skill.name} className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-semibold text-foreground tracking-tight">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded-md bg-surface-muted text-foreground-muted border border-border/50">
                            {skill.level}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Count Indicator */}
              <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-foreground-muted">
                <span>{catSkills.length} verified technologies</span>
                <span className="font-mono text-[10px] uppercase text-blue-500 dark:text-blue-400 font-medium">
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Stacked Category List View (matching Mobile Reference) */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {filteredCategories.map((cat, catIdx) => {
          const catSkills = skills
            .filter((s) => s.category?.toLowerCase() === cat.name.toLowerCase())
            .filter((s) => !query || s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query)))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          if (query && catSkills.length === 0) return null;

          const IconComponent =
            CATEGORY_ICON_MAP[cat.icon?.toLowerCase() || ""] ||
            CATEGORY_ICON_MAP[cat.name.toLowerCase()] ||
            FolderCode;

          const accentStyles = [
            "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/40",
            "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/40",
            "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/40",
            "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/40",
          ];
          const style = accentStyles[catIdx % accentStyles.length];

          // Comma-separated summary of top skills for mobile card
          const skillSummary = catSkills.map((s) => s.name).join(", ");

          return (
            <div
              key={cat.id || cat.name}
              className="p-4 rounded-2xl bg-surface border border-blue-100/70 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
            >
              {/* Left: Icon */}
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${style}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Middle: Title & Skill Summary */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] font-mono text-foreground-muted shrink-0 ml-2">
                    {catSkills.length} skills
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted truncate mt-0.5 leading-snug">
                  {skillSummary || cat.description || "Active competencies"}
                </p>
              </div>

              {/* Right: Chevron Arrow */}
              <div className="w-7 h-7 rounded-full bg-surface-muted/80 flex items-center justify-center text-foreground-muted shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
