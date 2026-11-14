"use client";

import * as React from "react";
import { Layers, ArrowRight } from "lucide-react";
import type { ProjectDocument, PageHeroConfig } from "@/types/models";
import { ProjectsHero } from "./projects-hero";
import { ProjectsFilterBar } from "./projects-filter-bar";
import { FeaturedProjectCard } from "./featured-project-card";
import { ProjectCard } from "./project-card";
import { ProjectsClosingBanner } from "./projects-closing-banner";

interface ProjectsPageViewProps {
  projects: ProjectDocument[];
  heroConfig?: PageHeroConfig | null;
}

export function ProjectsPageView({ projects, heroConfig }: ProjectsPageViewProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Dynamically derive distinct categories from actual project records
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) {
        set.add(p.category);
      }
    });
    return Array.from(set);
  }, [projects]);

  // Deterministically identify the Featured Project
  // Priority: 'campus-buddy' if present and featured, else lowest order featured project, else first project
  const featuredProject = React.useMemo(() => {
    if (!projects || projects.length === 0) return null;
    const campusBuddy = projects.find(
      (p) => (p.slug === "campus-buddy" || p.title.toLowerCase().includes("campus")) && p.featured
    );
    if (campusBuddy) return campusBuddy;
    const firstFeatured = projects.find((p) => p.featured);
    return firstFeatured || projects[0];
  }, [projects]);

  // "Other Projects" list: all published projects except the featured one
  const baseOtherProjects = React.useMemo(() => {
    if (!featuredProject) return projects;
    return projects.filter((p) => p.id !== featuredProject.id);
  }, [projects, featuredProject]);

  // Filter "Other Projects" by active category and search query
  const filteredOtherProjects = React.useMemo(() => {
    let list = baseOtherProjects;

    // Category filter with semantic keyword mapping
    if (activeCategory !== "All") {
      const active = activeCategory.toLowerCase();
      list = list.filter((p) => {
        const cat = p.category.toLowerCase();
        if (active === "web apps") return cat.includes("web") || cat.includes("app") || cat.includes("platform") || cat.includes("enterprise");
        if (active === "ai & automation") return cat.includes("ai") || cat.includes("automation") || cat.includes("agri");
        if (active === "cybersecurity") return cat.includes("cyber") || cat.includes("security") || cat.includes("health") || cat.includes("system");
        if (active === "hardware & iot") return cat.includes("hardware") || cat.includes("iot") || cat.includes("embedded");
        if (active === "research") return cat.includes("research") || cat.includes("paper");
        if (active === "design & creative") return cat.includes("design") || cat.includes("creative") || cat.includes("ui");
        return cat.includes(active);
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = (p.shortDescription || p.fullDescription || "").toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const techMatch = (p.technologies || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || techMatch;
      });
    }

    return list;
  }, [baseOtherProjects, activeCategory, searchQuery]);

  // Check if featured project matches the search query (so we don't hide it unnecessarily when searching)
  const isFeaturedProjectVisible = React.useMemo(() => {
    if (!featuredProject) return false;
    // When a specific category is selected, check if featured matches that category
    if (activeCategory !== "All") {
      const active = activeCategory.toLowerCase();
      const cat = featuredProject.category.toLowerCase();
      const match =
        (active === "web apps" && (cat.includes("web") || cat.includes("app") || cat.includes("platform"))) ||
        (active === "ai & automation" && (cat.includes("ai") || cat.includes("automation"))) ||
        (active === "cybersecurity" && (cat.includes("cyber") || cat.includes("security"))) ||
        cat.includes(active);
      if (!match) return false;
    }
    // When searching, check if featured matches search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = featuredProject.title.toLowerCase().includes(q);
      const descMatch = (featuredProject.shortDescription || featuredProject.fullDescription || "").toLowerCase().includes(q);
      const catMatch = featuredProject.category.toLowerCase().includes(q);
      const techMatch = (featuredProject.technologies || []).some((t) => t.toLowerCase().includes(q));
      return titleMatch || descMatch || catMatch || techMatch;
    }
    return true;
  }, [featuredProject, activeCategory, searchQuery]);

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
  };

  // Filter all projects by active category and search query for the Dynamic Showcase
  const filteredShowcaseProjects = React.useMemo(() => {
    let list = projects;

    if (activeCategory !== "All") {
      const active = activeCategory.toLowerCase();
      list = list.filter((p) => {
        const cat = p.category.toLowerCase();
        if (active === "web apps") return cat.includes("web") || cat.includes("app") || cat.includes("platform") || cat.includes("enterprise");
        if (active === "ai & automation") return cat.includes("ai") || cat.includes("automation") || cat.includes("agri");
        if (active === "cybersecurity") return cat.includes("cyber") || cat.includes("security") || cat.includes("health") || cat.includes("system");
        if (active === "hardware & iot") return cat.includes("hardware") || cat.includes("iot") || cat.includes("embedded");
        if (active === "research") return cat.includes("research") || cat.includes("paper");
        if (active === "design & creative") return cat.includes("design") || cat.includes("creative") || cat.includes("ui");
        return cat.includes(active);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = (p.shortDescription || p.fullDescription || "").toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const techMatch = (p.technologies || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || techMatch;
      });
    }

    return list;
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="w-full pb-16 sm:pb-24">
      {/* 1. HERO SECTION (Full-width, fills the width with no side gaps) */}
      <div className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#091019]">
        <ProjectsHero
          config={heroConfig}
          projects={filteredShowcaseProjects}
          totalDomains={categories.length}
        />
      </div>

      {/* 2. FILTER & SEARCH CONTROLS ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-6 sm:mb-10">
        <ProjectsFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 3. MAIN PROJECTS CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
        {/* Featured Project Presentation (Desktop Only: on mobile, CampusBuddy is already featured in the 3D Carousel above) */}
        {isFeaturedProjectVisible && featuredProject && (
          <div className="hidden md:block">
            <FeaturedProjectCard project={featuredProject} />
          </div>
        )}

        {/* Other Projects Collection */}
        <section id="other-projects" aria-label="Other Engineering Projects" className="space-y-4 sm:space-y-6">
          {/* Section Header (Hidden on mobile to match reference view where cards follow filters directly) */}
          <div className="hidden md:flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <h2 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                OTHER PROJECTS
              </h2>
              {activeCategory !== "All" && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({filteredOtherProjects.length})
                </span>
              )}
            </div>

            {/* View All / Reset Filter Action */}
            {activeCategory !== "All" ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Responsive Projects Grid: 1 column on mobile matching reference, 2 cols on md, 3 cols on lg */}
          {filteredOtherProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredOtherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            /* Graceful Empty State */
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  No projects found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `No projects matched "${searchQuery}". Try different keywords or reset your filters.`
                    : "No projects currently in this category."}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 4. CLOSING BANNER */}
        <ProjectsClosingBanner />
      </main>
    </div>
  );
}
