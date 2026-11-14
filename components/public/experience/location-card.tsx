"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

interface LocationCardProps {
  location?: string | null;
  className?: string;
}

export function LocationCard({
  location = "Pune, Maharashtra, India",
  className = "",
}: LocationCardProps) {
  const displayLocation = location || "Pune, Maharashtra, India";
  const locationParts = displayLocation.split(",");
  const city = locationParts[0]?.trim() || "Pune";
  const region = locationParts.slice(1).join(",").trim() || "Maharashtra, India";

  return (
    <section
      aria-label="Engineering Base Location"
      className={`rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          LOCATION
        </span>
        <div className="h-[1px] w-8 sm:w-12 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
      </div>

      {/* Scenic Card Container with Mountain / City View */}
      <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 group">
        {/* Authentic Pune City Skyline Photograph */}
        <Image
          src="/images/experience/pune-maharashtra-city.jpg"
          alt={`${displayLocation} city skyline, Maharashtra`}
          fill
          sizes="(max-width: 1024px) 100vw, 420px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Location Text & Diagonal Arrow Action */}
        <div className="absolute inset-0 p-4 sm:p-5 flex items-end justify-between">
          <div className="space-y-0.5 text-white">
            <div className="text-base sm:text-lg font-extrabold tracking-tight">
              {city},
            </div>
            <div className="text-xs sm:text-sm text-slate-200 font-medium">
              {region}
            </div>
          </div>

          <Link
            href="/contact"
            aria-label={`Inquire about engineering roles in ${displayLocation}`}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 dark:bg-slate-900/60 dark:hover:bg-slate-900/80 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all duration-200 group-hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowUpRight className="w-5 h-5 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
