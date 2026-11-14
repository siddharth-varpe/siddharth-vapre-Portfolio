"use client";

import * as React from "react";
import { Code2 } from "lucide-react";
import { TechIcon } from "@/components/public/tech-icons";

interface StackAppliedCardProps {
  technologies: string[];
  className?: string;
}

export function StackAppliedCard({
  technologies,
  className = "",
}: StackAppliedCardProps) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <section
      aria-label="Core Technologies Applied"
      className={`rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
          <Code2 className="w-4 h-4" />
        </div>
        <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          STACK APPLIED
        </span>
        <div className="h-[1px] w-8 sm:w-12 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
      </div>

      {/* Grid of Technology Badges */}
      <div className="grid grid-cols-2 gap-2.5">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-colors"
          >
            <TechIcon name={tech} className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {tech}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
