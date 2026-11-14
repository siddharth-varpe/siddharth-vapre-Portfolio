"use client";

import * as React from "react";

interface ProjectsMetricsProps {
  totalProjects: number;
  totalDomains: number;
  className?: string;
  variant?: "card" | "flat" | "responsive";
}

export function ProjectsMetrics({
  totalProjects,
  totalDomains,
  className = "",
  variant = "responsive",
}: ProjectsMetricsProps) {
  const containerClasses =
    variant === "card"
      ? "rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5"
      : variant === "flat"
      ? "bg-transparent border-0 p-0"
      : "rounded-2xl lg:rounded-none bg-white lg:bg-transparent dark:bg-[#0D1527] lg:dark:bg-transparent border border-slate-200/90 lg:border-none dark:border-slate-800 p-4 lg:p-0";

  return (
    <div
      aria-label="Key Project Statistics"
      className={`flex items-center justify-between gap-3 sm:gap-4 lg:gap-8 ${containerClasses} ${className}`}
    >
      {/* Metric 1: Major Projects */}
      <div className="flex-1 text-center sm:text-left">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          {totalProjects > 0 ? `${totalProjects}+` : "0"}
        </div>
        <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
          Major Projects
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-8 sm:h-9 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"
        aria-hidden="true"
      />

      {/* Metric 2: Tech Domains */}
      <div className="flex-1 text-center sm:text-left">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          {totalDomains > 0 ? `${totalDomains}+` : "1+"}
        </div>
        <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
          Tech Domains
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-8 sm:h-9 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0"
        aria-hidden="true"
      />

      {/* Metric 3: Real World Use-Cases */}
      <div className="flex-1 text-center sm:text-left">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          Real
        </div>
        <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
          World Use-Cases
        </div>
      </div>
    </div>
  );
}
