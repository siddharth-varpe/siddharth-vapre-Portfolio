"use client";

import * as React from "react";
import Link from "next/link";
import type { SkillsPageApproachBannerConfig } from "@/types/models";
import { ArrowRight, Heart } from "lucide-react";

interface SkillsApproachBannerProps {
  banner: SkillsPageApproachBannerConfig;
}

export function SkillsApproachBanner({ banner }: SkillsApproachBannerProps) {
  if (!banner.enabled) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-blue-200/70 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/95 via-sky-50/50 to-blue-50/90 dark:from-blue-950/40 dark:via-zinc-900/80 dark:to-blue-950/30 shadow-[0_8px_32px_rgba(30,58,138,0.06)] p-6 sm:p-8 lg:p-10 my-8">
      {/* Decorative Background ambient blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
        {/* Left Content */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            <span>{banner.eyebrow || "MY APPROACH"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-snug">
            {banner.titlePrimary}{" "}
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">
              {banner.titleAccent}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed max-w-xl">
            {banner.description}
          </p>
        </div>

        {/* Right CTA Button & Vector Graphic */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto">
          <Link
            href={banner.ctaDestination || "/contact"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-zinc-950/20 dark:shadow-blue-500/20 transition-all duration-200 group cursor-pointer"
          >
            <span>{banner.ctaText || "Let's Build Something Amazing"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
