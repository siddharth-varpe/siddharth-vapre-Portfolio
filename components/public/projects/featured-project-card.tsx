"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/public/icons";
import { TechIcon } from "@/components/public/tech-icons";
import type { ProjectDocument } from "@/types/models";

interface FeaturedProjectCardProps {
  project: ProjectDocument;
  className?: string;
}

interface TechStyle {
  lightBg: string;
  darkBg: string;
  border: string;
  darkBorder: string;
  textColor: string;
  darkTextColor: string;
}

const TECH_STYLES: Record<string, TechStyle> = {
  react: {
    lightBg: "bg-[#F0F9FF]",
    darkBg: "dark:bg-sky-950/40",
    border: "border-[#BAE6FD]",
    darkBorder: "dark:border-sky-800/40",
    textColor: "text-[#0284C7]",
    darkTextColor: "dark:text-sky-300",
  },
  typescript: {
    lightBg: "bg-[#EFF6FF]",
    darkBg: "dark:bg-blue-950/40",
    border: "border-[#BFDBFE]",
    darkBorder: "dark:border-blue-800/40",
    textColor: "text-[#2563EB]",
    darkTextColor: "dark:text-blue-300",
  },
  supabase: {
    lightBg: "bg-[#F0FDF4]",
    darkBg: "dark:bg-emerald-950/40",
    border: "border-[#BBF7D0]",
    darkBorder: "dark:border-emerald-800/40",
    textColor: "text-[#16A34A]",
    darkTextColor: "dark:text-emerald-300",
  },
  "gemini api": {
    lightBg: "bg-[#FAF5FF]",
    darkBg: "dark:bg-purple-950/40",
    border: "border-[#E9D5FF]",
    darkBorder: "dark:border-purple-800/40",
    textColor: "text-[#9333EA]",
    darkTextColor: "dark:text-purple-300",
  },
  gemini: {
    lightBg: "bg-[#FAF5FF]",
    darkBg: "dark:bg-purple-950/40",
    border: "border-[#E9D5FF]",
    darkBorder: "dark:border-purple-800/40",
    textColor: "text-[#9333EA]",
    darkTextColor: "dark:text-purple-300",
  },
  "mistral ocr": {
    lightBg: "bg-[#FFF7ED]",
    darkBg: "dark:bg-amber-950/40",
    border: "border-[#FED7AA]",
    darkBorder: "dark:border-amber-800/40",
    textColor: "text-[#EA580C]",
    darkTextColor: "dark:text-amber-300",
  },
  mistral: {
    lightBg: "bg-[#FFF7ED]",
    darkBg: "dark:bg-amber-950/40",
    border: "border-[#FED7AA]",
    darkBorder: "dark:border-amber-800/40",
    textColor: "text-[#EA580C]",
    darkTextColor: "dark:text-amber-300",
  },
};

function getTechBadgeClass(tech: string): string {
  const key = tech.toLowerCase().trim();
  const style = TECH_STYLES[key];
  if (style) {
    return `${style.lightBg} ${style.darkBg} ${style.border} ${style.darkBorder} ${style.textColor} ${style.darkTextColor}`;
  }
  return "bg-slate-50 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200";
}

export function FeaturedProjectCard({ project, className = "" }: FeaturedProjectCardProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const [dims, setDims] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    updateDims();
    const ro = new ResizeObserver(updateDims);
    ro.observe(containerRef.current);
    window.addEventListener("resize", updateDims);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateDims);
    };
  }, []);

  const technologies = project.technologies || [];
  const visibleTech = technologies.slice(0, 5);
  const remainingCount = technologies.length - visibleTech.length;

  const imageSrc =
    project.coverImage ||
    project.media?.[0]?.url ||
    "/images/projects/campus-buddy-featured-laptop.png";

  const r = 24; // main outer corner radius
  const notchH = 14; // drop height for the tab notch
  const notchW = dims.w > 640 ? 190 : 170; // tab shelf width
  const stepW = 16; // diagonal transition ramp width
  const effectiveNotchW = Math.min(notchW, Math.max(120, dims.w - 100));

  const svgPath =
    dims.w > 0
      ? `M 14 ${notchH} ` +
        `L ${effectiveNotchW} ${notchH} ` +
        `C ${effectiveNotchW + 8} ${notchH}, ${effectiveNotchW + stepW - 8} 0, ${effectiveNotchW + stepW} 0 ` +
        `L ${dims.w - r} 0 ` +
        `A ${r} ${r} 0 0 1 ${dims.w} ${r} ` +
        `L ${dims.w} ${dims.h - r} ` +
        `A ${r} ${r} 0 0 1 ${dims.w - r} ${dims.h} ` +
        `L ${r} ${dims.h} ` +
        `A ${r} ${r} 0 0 1 0 ${dims.h - r} ` +
        `L 0 ${notchH + 14} ` +
        `A 14 14 0 0 1 14 ${notchH} Z`
      : "";

  return (
    <section id="featured-project" aria-label="Featured Project" className={`w-full ${className}`}>
      {/* Main Featured Card Container */}
      <article
        ref={containerRef}
        className="relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 pt-8 sm:pt-9 transition-all shadow-[0_4px_24px_-4px_rgba(59,130,246,0.08)] dark:shadow-[0_4px_24px_-4px_rgba(59,130,246,0.15)]"
      >
        {/* SVG Stepped Notched Border & Fill */}
        {dims.w > 0 ? (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            width={dims.w}
            height={dims.h}
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            fill="none"
            aria-hidden="true"
          >
            <path
              d={svgPath}
              className="fill-white dark:fill-[#0D1527] stroke-blue-200/90 dark:stroke-blue-900/60"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          <div className="absolute inset-0 rounded-3xl bg-white dark:bg-[#0D1527] border border-blue-200/90 dark:border-blue-900/60 -z-10" />
        )}

        {/* Tab Eyebrow: Sitting in the top-left notch */}
        <div className="absolute top-[3px] left-5 sm:left-7 z-20 flex items-center gap-2 pointer-events-none select-none">
          <Star className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400 shrink-0" />
          <span className="font-mono text-xs sm:text-[13px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            FEATURED PROJECT
          </span>
        </div>

        {/* Top-Right "Featured" Tag */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-sm">
            Featured
          </span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 pt-2 sm:pt-1">
          {/* Left Column: Details & Actions (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                {project.category}
              </span>
              <div className="h-[1.5px] w-6 sm:w-10 bg-blue-200 dark:bg-blue-900/60" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              <Link
                href={`/projects/${project.slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {project.title}
              </Link>
            </h2>

            {/* Subtitle / Short Description */}
            {project.shortDescription && (
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                {project.shortDescription}
              </p>
            )}

            {/* Full Summary Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {project.fullDescription || project.problem || project.solution}
            </p>

            {/* Technology Chips Row */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {visibleTech.map((tech) => (
                  <div
                    key={tech}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${getTechBadgeClass(
                      tech
                    )}`}
                  >
                    <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    +{remainingCount}
                  </span>
                )}
              </div>
            )}

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View Code</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: High-Res Laptop Preview Frame (lg:col-span-5) */}
          <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <Link
              href={`/projects/${project.slug}`}
              className="block relative w-full h-full group"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={imageSrc}
                alt={`${project.title} interface preview`}
                fill
                quality={95}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
