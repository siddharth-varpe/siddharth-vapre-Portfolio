"use client";

import * as React from "react";
import type { SkillCategoryDocument, SkillDocument, SkillsPageSettings } from "@/types/models";
import type { ComputedSkillsHeroMetric } from "@/lib/server/db/repositories/content";
import { SkillsHero } from "./skills-hero";
import { SkillsFilterBar } from "./skills-filter-bar";
import { SkillsCategoryGrid } from "./skills-category-grid";
import { SkillsApproachBanner } from "./skills-approach-banner";

export interface SkillsPageViewProps {
  settings: SkillsPageSettings;
  categories: SkillCategoryDocument[];
  skills: SkillDocument[];
  metrics: ComputedSkillsHeroMetric[];
}

export function SkillsPageView({
  settings,
  categories,
  skills,
  metrics,
}: SkillsPageViewProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* 1. Hero Section with Orbit & Factual Metrics */}
      <SkillsHero skills={skills} settings={settings} metrics={metrics} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* 2. Filter Pills and Search Bar */}
        <SkillsFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 3. Category Grid / Cards (Desktop multi-col, Mobile stacked) */}
        <SkillsCategoryGrid
          categories={categories}
          skills={skills}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />

        {/* 4. Bottom Approach Banner */}
        {settings.approachBanner && (
          <SkillsApproachBanner banner={settings.approachBanner} />
        )}
      </div>
    </div>
  );
}
