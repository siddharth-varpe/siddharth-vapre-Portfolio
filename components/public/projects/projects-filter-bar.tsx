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

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const hasMoreRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 6;
    setCanScrollRight(hasMoreRight);
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div
      aria-label="Filter and Search Projects"
      className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 ${className}`}
    >
      {/* Category Pills: horizontally scrollable with right fade on mobile, flex-wrapped on desktop */}
      <div className="relative w-full min-w-0 overflow-hidden md:overflow-visible">
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Project categories"
          className="flex items-center gap-2 overflow-x-auto scroll-smooth md:flex-wrap md:overflow-visible py-1 px-1 sm:px-0 max-w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-14 md:pr-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "All"}
            onClick={() => onSelectCategory("All")}
            className={`shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
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
                className={`shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
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

        {/* Right-side gradient fade for horizontal scroll affordance on mobile */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-14 sm:w-20 bg-gradient-to-l from-white dark:from-[#08101a] to-transparent md:hidden z-10 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
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
