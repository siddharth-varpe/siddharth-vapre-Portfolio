"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProjectsClosingBannerProps {
  className?: string;
  globalCta?: {
    headline?: string;
    subheadline?: string;
    buttonLabel?: string;
    buttonDestination?: string;
  } | null;
}

export function ProjectsClosingBanner({ className = "", globalCta }: ProjectsClosingBannerProps) {
  const headline = globalCta?.headline || "Always building, always learning.";
  const subheadline =
    globalCta?.subheadline ||
    "These projects are a part of my journey to create practical, scalable and meaningful solutions. More exciting ideas are in the pipeline.";
  const buttonLabel = globalCta?.buttonLabel || "Let's Build Something Amazing";
  const buttonDestination = globalCta?.buttonDestination || "/contact";
  return (
    <section
      aria-label="Closing Projects Perspective"
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] flex items-center p-6 sm:p-10 lg:p-12 ${className}`}
    >
      {/* Background Cinematic Photograph */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/projects/projects-bottom-landscape.jpg"
          alt="Software engineer gazing at mountain vista at sunset"
          fill
          quality={90}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-right sm:object-center"
        />
        {/* Soft horizontal gradient overlay ensuring 100% text contrast on the left */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20 dark:from-[#08101a]/95 dark:via-[#08101a]/85 dark:to-[#08101a]/30 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Decorative Calligraphy Overlay in Top-Right */}
      <div
        className="absolute top-2 right-3 sm:top-3 sm:right-6 w-28 sm:w-36 md:w-44 h-20 sm:h-28 pointer-events-none select-none z-10 opacity-80"
        aria-hidden="true"
      >
        <Image
          src="/images/footer/code-create-solve-grow.svg"
          alt="Code Create Solve Grow"
          fill
          className="object-contain object-right-top"
        />
      </div>

      {/* Foreground Narrative & Action */}
      <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {headline === "Always building, always learning." ? (
            <>
              Always building,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent block sm:inline">
                always learning.
              </span>
            </>
          ) : (
            headline
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-md font-normal">
          {subheadline}
        </p>

        <div className="pt-1">
          <Link
            href={buttonDestination}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap"
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
