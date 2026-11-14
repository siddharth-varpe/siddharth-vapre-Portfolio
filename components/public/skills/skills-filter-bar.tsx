"use client";

import * as React from "react";
import type { SkillCategoryDocument } from "@/types/models";
import { Search, X } from "lucide-react";

interface SkillsFilterBarProps {
  categories: SkillCategoryDocument[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SkillsFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: SkillsFilterBarProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2">
      {/* Category Pills (horizontally scrollable on mobile without page overflow) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
        {/* "All" Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory("All")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeCategory === "All"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-surface hover:bg-surface-muted text-foreground-muted hover:text-foreground border border-border/80"
          }`}
        >
          All
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.id || cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-surface hover:bg-surface-muted text-foreground-muted hover:text-foreground border border-border/80"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative min-w-[220px] sm:min-w-[260px] md:max-w-xs w-full md:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search a skill..."
          className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-full bg-surface border border-border/90 text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground-muted hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
