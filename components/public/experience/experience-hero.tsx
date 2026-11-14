"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import type { PageHeroConfig } from "@/types/models";

interface ExperienceHeroProps {
  config?: PageHeroConfig | null;
  className?: string;
}

export function ExperienceHero({ config, className = "" }: ExperienceHeroProps) {
  const eyebrow = config?.eyebrow || "EXPERIENCE";
  const title = config?.title || "Engineering Experience";
  const description =
    config?.description ||
    "A chronological record of my software engineering roles, enterprise platforms delivered, and measurable outcomes in real-world production environments.";

  // Primary & Secondary CTAs
  const resumeUrl = config?.primaryCta?.url || "/api/resume/download";
  const resumeLabel = config?.primaryCta?.label || "Download Official Resume";
  const projectsUrl = config?.secondaryCta?.url || "/projects";
  const projectsLabel = config?.secondaryCta?.label || "Explore Case Studies";

  // Split title if it contains "Experience" to apply the gradient accent
  const hasExperienceInTitle = title.toLowerCase().includes("experience");
  const titleParts = hasExperienceInTitle
    ? [title.replace(/experience/i, "").trim(), "Experience"]
    : [title, ""];

  return (
    <header
      aria-label="Engineering Experience Overview"
      className={`relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#08101a] pt-4 sm:pt-8 lg:pt-10 pb-6 sm:pb-10 lg:pb-12 min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] flex items-center ${className}`}
    >
      {/* ========================================================================= */}
      {/* HERO SECTION BACKGROUND IMAGE (Mobile & Desktop)                         */}
      {/* Restored Software Engineer Workspace: 60% right, gentle left edge fade    */}
      {/* ========================================================================= */}
      <div className="absolute right-0 top-0 bottom-0 h-full w-[60%] sm:w-[60%] md:w-[60%] lg:w-[58%] xl:w-[56%] pointer-events-none select-none z-0">
        <div className="relative w-full h-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_100%)]">
          <Image
            src="/images/experience/software-engineer-workspace.jpg"
            alt="Full-Stack software engineering workstation with code editor on laptop screen"
            fill
            priority
            quality={95}
            sizes="(max-width: 768px) 60vw, 55vw"
            className="object-cover object-center"
          />

          {/* Left edge gradient fade: bridges the solid background with the clear image */}
          <div
            className="absolute inset-y-0 left-0 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#08101a] dark:via-[#08101a]/80 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Calligraphic Script Overlay in Upper Right */}
        <div
          className="absolute top-1 right-2 sm:top-2 sm:right-6 w-28 sm:w-36 md:w-44 h-24 sm:h-32 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          <Image
            src="/images/footer/code-create-solve-grow.svg"
            alt="Code Create Solve Grow"
            fill
            className="object-contain object-right-top"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOREGROUND NARRATIVE & CTAS (Fills width with edge padding)              */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center">
        <div className="w-full max-w-[46%] xs:max-w-[45%] sm:max-w-[44%] md:max-w-[44%] lg:max-w-[42%] xl:max-w-[42%] space-y-2.5 sm:space-y-5 lg:space-y-6">
          {/* Eyebrow with blue indicator dot and rule line */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0"
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase truncate">
              <span className="hidden sm:inline">
                {eyebrow.replace(/\/\/.*$/, "").replace(/•/g, "").trim()}
              </span>
              <span className="sm:hidden">CAREER TIMELINE</span>
            </span>
            <div
              className="h-[1px] w-6 sm:w-12 bg-slate-300 dark:bg-slate-700/80"
              aria-hidden="true"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            {titleParts[0]}{" "}
            {titleParts[1] ? (
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent block sm:inline">
                {titleParts[1]}
              </span>
            ) : null}
          </h1>

          {/* Hero Narrative Description */}
          <p className="text-[11px] sm:text-xs md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-0.5 sm:pt-2 w-full max-w-[210px] sm:max-w-none">
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-[11px] sm:text-sm md:text-base transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white dark:text-slate-900" />
              <span className="hidden sm:inline">{resumeLabel}</span>
              <span className="sm:hidden">Download Resume</span>
            </a>

            <Link
              href={projectsUrl}
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 font-semibold text-[11px] sm:text-sm md:text-base transition-all active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">{projectsLabel}</span>
              <span className="sm:hidden">Explore Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
