"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

interface ProjectsFilterBarProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function ProjectsFilterBar({
  categories: _categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  className = "",
}: ProjectsFilterBarProps) {
  // Exactly 6 curated categories matching reference design
  const displayCategories = [
    "Web Apps",
    "AI & Automation",
    "Cybersecurity",
    "Hardware & IoT",
    "Research",
    "Design & Creative",
  ];

  return (
    <div
      aria-label="Filter and Search Projects"
      className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 ${className}`}
    >
      {/* Category Pills (Centered wrapped pills matching reference design) */}
      <div
        role="tablist"
        aria-label="Project categories"
        className="flex flex-wrap items-center justify-center md:justify-start gap-2 max-w-full"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "All"}
          onClick={() => onSelectCategory("All")}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
            activeCategory === "All"
              ? "bg-blue-600 text-white font-semibold shadow-xs"
              : "bg-white/80 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800"
          }`}
        >
          All
        </button>

        {displayCategories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-white/80 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Input Box (Hidden on mobile to match reference screenshot strictly) */}
      <div className="hidden md:block relative w-full md:w-64 lg:w-72 shrink-0">
        <label htmlFor="project-search" className="sr-only">
          Search projects
        </label>
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="project-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
