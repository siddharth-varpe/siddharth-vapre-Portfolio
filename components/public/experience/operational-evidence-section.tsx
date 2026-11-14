"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Database,
  Zap,
  Clock,
  BarChart3,
  TrendingUp,
  Activity,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import type { OperationalEvidenceItem } from "@/types/models";

interface OperationalEvidenceSectionProps {
  metrics: OperationalEvidenceItem[];
  isSidebar?: boolean;
  className?: string;
}

function resolveEvidenceIcon(iconName: string, className = "w-5 h-5") {
  switch (iconName.toLowerCase()) {
    case "users":
      return <Users className={className} />;
    case "database":
      return <Database className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "clock":
      return <Clock className={className} />;
    case "activity":
      return <Activity className={className} />;
    case "trending":
      return <TrendingUp className={className} />;
    default:
      return <BarChart3 className={className} />;
  }
}

// Icon container styling colors for the four evidence pillars
const ICON_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  users: {
    bg: "bg-blue-50 dark:bg-blue-950/60",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/60",
  },
  database: {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/60",
  },
  zap: {
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/60",
  },
  clock: {
    bg: "bg-purple-50 dark:bg-purple-950/60",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-900/60",
  },
};

export function OperationalEvidenceSection({
  metrics,
  isSidebar = false,
  className = "",
}: OperationalEvidenceSectionProps) {
  // If no metrics available, gracefully render nothing
  if (!metrics || metrics.length === 0) {
    return null;
  }

  const enabledMetrics = metrics.filter((m) => m.enabled !== false);
  if (enabledMetrics.length === 0) return null;

  return (
    <section
      aria-label="Operational Evidence & Business Outcomes"
      className={`relative rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            OPERATIONAL EVIDENCE
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
        </div>

        <div className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Grid of Evidence Metrics */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          isSidebar
            ? "grid-cols-2"
            : enabledMetrics.length === 1
            ? "grid-cols-1"
            : enabledMetrics.length === 2
            ? "grid-cols-2"
            : enabledMetrics.length === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-4"
        }`}
      >
        {enabledMetrics.map((item, idx) => {
          const style = ICON_STYLES[item.icon] || ICON_STYLES.users;
          const cardClassName =
            "group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800/80 transition-all duration-200";

          const cardContent = (
            <>
              <div className="space-y-3">
                {/* Icon Squircle */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${style.bg} ${style.text} border ${style.border} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {resolveEvidenceIcon(item.icon, "w-4 h-4 sm:w-5 sm:h-5")}
                </div>

                {/* Metric Value & Label */}
                <div className="space-y-0.5">
                  <div className="text-lg sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    {item.label}
                  </div>
                </div>
              </div>

              {/* Source Context Tag / Link */}
              {item.sourceContext && (
                <div className="pt-3 mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <span className="truncate">{item.sourceContext}</span>
                  {item.sourceUrl && (
                    <ArrowRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              )}
            </>
          );

          if (item.sourceUrl) {
            return (
              <Link key={item.id || idx} href={item.sourceUrl} className={cardClassName}>
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={item.id || idx} className={cardClassName}>
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
