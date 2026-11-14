"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  ArrowRight,
  FileDown,
  ChevronRight,
  Code2,
  Trophy,
  BookOpen,
  Zap,
  Box,
  Brain,
  Layers,
  ArrowUpRight,
  Quote as QuoteIcon,
  Server,
  Shield,
} from "lucide-react";
import type {
  AboutSectionConfig,
  ResolvedAboutMetric,
  ProfileDocument,
} from "@/types";

interface AboutContentProps {
  config: AboutSectionConfig;
  metrics: ResolvedAboutMetric[];
  profile: ProfileDocument | null;
}

export function AboutContent({ config, metrics, profile }: AboutContentProps) {
  if (!config.enabled) return null;

  // Icon mapping helper for metrics
  const renderMetricIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "trophy":
      case "award":
        return <Trophy className={`${className} text-amber-500`} />;
      case "book":
        return <BookOpen className={`${className} text-purple-500`} />;
      case "lightning":
      case "zap":
        return <Zap className={`${className} text-emerald-500`} />;
      case "code":
      default:
        return <Code2 className={`${className} text-blue-500`} />;
    }
  };

  // Icon mapping helper for pillars
  const renderPillarIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "brain":
        return <Brain className={`${className} text-purple-600 dark:text-purple-400`} />;
      case "layers":
        return <Layers className={`${className} text-emerald-600 dark:text-emerald-400`} />;
      case "server":
        return <Server className={`${className} text-blue-600 dark:text-blue-400`} />;
      case "shield":
        return <Shield className={`${className} text-indigo-600 dark:text-indigo-400`} />;
      case "cube":
      default:
        return <Box className={`${className} text-blue-600 dark:text-blue-400`} />;
    }
  };

  // Helper for pillar icon background tint
  const getPillarIconBg = (iconName: string) => {
    switch (iconName) {
      case "brain":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40";
      case "layers":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40";
      default:
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40";
    }
  };

  // Category badge styling helper for timeline
  const getCategoryBadgeClass = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === "work") {
      return "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40";
    }
    if (cat === "education") {
      return "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40";
    }
    if (cat === "growth") {
      return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40";
    }
    return "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40";
  };

  // Desktop first 3 metrics for overlapping card
  const desktopFloatingMetrics = metrics.slice(0, 3);
  // Mobile 4 metrics
  const mobileMetrics = metrics.slice(0, 4);

  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (REFERENCE RECONSTRUCTION)                                */}
      {/* ========================================================================= */}
      <section
        aria-label="About Hero"
        className="relative pt-6 pb-14 sm:pt-10 sm:pb-18 lg:pt-14 lg:pb-22 w-full px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-zinc-200/80 dark:border-zinc-800/80"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Eyebrow, Editorial Title, Bio, Personal Info, CTAs */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-7 z-10">
            {/* Eyebrow with Education Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
                <span>{config.eyebrow}</span>
                <span className="text-zinc-300 dark:text-zinc-700 select-none">———</span>
              </div>
              {config.educationBadge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{config.educationBadge}</span>
                </div>
              )}
            </div>

            {/* Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.12]">
              <span>{config.titlePrimary} </span>
              <span className="text-blue-600 dark:text-blue-500">{config.titleAccent}</span>
            </h1>

            {/* Introductory Bio Paragraph */}
            {config.description && (
              <p className="text-base sm:text-[1.05rem] text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl font-normal">
                {config.description}
              </p>
            )}

            {/* Mobile-Only Portrait Placement (Rendered cleanly after description on smaller viewports) */}
            <div className="block lg:hidden my-6">
              <div className="relative mx-auto max-w-sm">
                {/* Atmospheric Soft Gradient Blob */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100/70 to-indigo-100/40 dark:from-blue-950/40 dark:to-indigo-950/20 rounded-[36px] blur-xl pointer-events-none" />

                {/* Portrait Card Container */}
                <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl aspect-[4/5]">
                  <Image
                    src={config.portraitAsset || "/images/about/siddharth-about-hero.jpg"}
                    alt="Siddharth Varpe portrait"
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    priority
                    className="object-cover object-top"
                  />

                  {/* Handwritten Signature Overlay */}
                  <div className="absolute top-4 right-4 w-32 h-14 pointer-events-none select-none drop-shadow-sm opacity-90 dark:brightness-150">
                    <Image
                      src="/images/about/siddharth-signature.svg"
                      alt="Siddharth Varpe signature"
                      width={130}
                      height={60}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Blue Brush Accent at bottom-right */}
                  <div className="absolute bottom-2 -right-2 w-28 h-20 pointer-events-none select-none opacity-85">
                    <Image
                      src="/images/about/blue-brush-accent.svg"
                      alt=""
                      aria-hidden="true"
                      width={120}
                      height={90}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Bottom Context Badge */}
                  {config.contextBadge?.enabled && (
                    <div className="absolute bottom-3 left-3 right-3 p-2.5 px-3 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-md flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                        <div className="truncate text-xs">
                          <p className="font-semibold text-zinc-900 dark:text-white truncate">
                            {config.contextBadge.label}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            {config.contextBadge.subtext}
                          </p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile-Only 4-Metric Grid (2x2) */}
            <div className="grid grid-cols-2 gap-3 lg:hidden pt-1">
              {mobileMetrics.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-zinc-50/90 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 shadow-xs flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-700/60">
                    {renderMetricIcon(m.icon, "w-4 h-4")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-medium">
                      {m.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Details Row (Flexible layout with safe spacing) */}
            <div className="py-3 border-y border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 text-xs">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {config.personalDetails.location || profile?.location || "Pune, Maharashtra, India"}
                  </span>
                </div>

                {/* Education */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {config.personalDetails.education || "Undergraduate Engineer (2024 – 2028)"}
                  </span>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {config.personalDetails.availability || profile?.availability || "Open to Opportunities"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href={config.actions.primaryUrl || "#experience"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>{config.actions.primaryLabel || "View My Journey"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={config.actions.secondaryUrl || "/api/resume/download"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <FileDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{config.actions.secondaryLabel || "Resume PDF"}</span>
              </Link>
            </div>
          </div>

          {/* Right Column (Desktop Hero Composition: Portrait + Overlay Signature + Floating Metrics + Context Badge) */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg">
              {/* Soft Atmospheric Background Shape */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-blue-100/70 via-indigo-50/50 to-blue-50/20 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-transparent rounded-[44px] blur-2xl pointer-events-none" />

              {/* Main Portrait Card */}
              <div className="relative rounded-[32px] overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl aspect-[4/5] z-10">
                <Image
                  src={config.portraitAsset || "/images/about/siddharth-about-hero.jpg"}
                  alt="Siddharth Varpe portrait"
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  priority
                  className="object-cover object-top"
                />

                {/* Vector Signature Overlay (Top-Left of Portrait) */}
                <div className="absolute -top-3 left-4 w-44 h-24 pointer-events-none select-none drop-shadow-sm opacity-95 dark:brightness-150">
                  <Image
                    src="/images/about/siddharth-signature.svg"
                    alt="Siddharth Varpe signature"
                    width={180}
                    height={95}
                    className="w-full h-auto"
                  />
                </div>

                {/* Blue Brush Stroke Accent (Bottom-Right) */}
                <div className="absolute -bottom-2 -right-2 w-36 h-28 pointer-events-none select-none opacity-90">
                  <Image
                    src="/images/about/blue-brush-accent.svg"
                    alt=""
                    aria-hidden="true"
                    width={150}
                    height={110}
                    className="w-full h-auto"
                  />
                </div>

                {/* Floating Context Badge at Bottom */}
                {config.contextBadge?.enabled && (
                  <div className="absolute bottom-5 left-5 right-5 p-3.5 px-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-xl flex items-center justify-between gap-3 z-30 transition-transform hover:scale-[1.01]">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                          {config.contextBadge.label}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {config.contextBadge.subtext}
                        </p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Overlapping Floating Metric Card (Left side of portrait) */}
              <div className="absolute -left-14 top-32 z-20 w-44 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800 shadow-xl p-3.5 space-y-3">
                {desktopFloatingMetrics.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-700/60 shadow-xs">
                      {renderMetricIcon(m.icon, "w-4 h-4")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight leading-none">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-medium">
                        {m.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vertical Calligraphy Accent (Far Right) */}
              <div className="absolute -right-14 top-16 hidden xl:block w-10 pointer-events-none select-none opacity-70 dark:brightness-150">
                <Image
                  src="/images/about/code-create-solve-grow.svg"
                  alt="Code Create Solve Grow"
                  width={38}
                  height={220}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. EXPERIENCE & BACKGROUND SECTION                                        */}
      {/* ========================================================================= */}
      <section
        id="experience"
        aria-label="Experience & Background"
        className="py-16 sm:py-20 lg:py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
          <span>{config.backgroundSection.eyebrow}</span>
          <span className="text-zinc-300 dark:text-zinc-700 select-none">———</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Narrative, Philosophy Quote Block */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              {config.backgroundSection.heading}
            </h2>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              {config.backgroundSection.description}
            </p>

            {/* Philosophy / Quote Callout */}
            {config.backgroundSection.quote && (
              <div className="relative rounded-2xl p-6 sm:p-7 bg-blue-50/60 dark:bg-blue-950/20 border-l-4 border-blue-600 dark:border-blue-500 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1">
                    <QuoteIcon className="w-6 h-6 fill-current opacity-80" />
                  </div>
                  <blockquote className="text-base sm:text-lg font-medium text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
                    &ldquo;{config.backgroundSection.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Structured Vertical Timeline */}
          <div className="lg:col-span-6 pt-2">
            <div className="relative pl-6 space-y-10 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              {config.timeline
                .filter((item) => item.enabled)
                .map((item, idx) => (
                  <article key={item.id} className="relative group">
                    {/* Node Dot on Timeline */}
                    <div
                      className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ${
                        idx === 0
                          ? "bg-blue-600 ring-blue-100 dark:ring-blue-950"
                          : "bg-zinc-400 dark:bg-zinc-600 ring-zinc-100 dark:ring-zinc-900"
                      }`}
                    />

                    <div className="space-y-2">
                      {/* Header Row: Date & Category Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono tracking-tight">
                          {item.period}
                        </span>
                        {item.category && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide capitalize ${getCategoryBadgeClass(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Title & Organization */}
                      <div>
                        <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
                          {item.title}
                        </h3>
                        {(() => {
                          const affiliateMatch = item.organization.match(
                            /^(.*?)\s+((?:[Aa]ffili?ated\s+to\s+.*))$/i
                          );
                          if (affiliateMatch) {
                            const [, mainOrg, affiliatePart] = affiliateMatch;
                            return (
                              <div className="mt-0.5 space-y-0.5">
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                  {mainOrg}
                                </p>
                                <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                                  {affiliatePart}
                                </p>
                              </div>
                            );
                          }
                          return (
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">
                              {item.organization}
                            </p>
                          );
                        })()}
                        {item.subtitle && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Bullet Points */}
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {item.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <span className="text-zinc-400 dark:text-zinc-600 select-none">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ARCHITECTURAL PILLARS SECTION                                          */}
      {/* ========================================================================= */}
      <section
        aria-label="Architectural Pillars"
        className="py-16 sm:py-20 lg:py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
          <span>ARCHITECTURAL PILLARS</span>
          <span className="text-zinc-300 dark:text-zinc-700 select-none">———</span>
        </div>

        {/* 3-Column Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.pillars
            .filter((p) => p.enabled)
            .map((pillar) => (
              <div
                key={pillar.id}
                className="relative rounded-2xl p-6 sm:p-7 bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Number + Action Arrow */}
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${getPillarIconBg(
                          pillar.icon
                        )}`}
                      >
                        {renderPillarIcon(pillar.icon)}
                      </div>
                      <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                        {pillar.number}
                      </span>
                    </div>

                    {pillar.destinationUrl && (
                      <Link
                        href={pillar.destinationUrl}
                        aria-label={`Learn more about ${pillar.title}`}
                        className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-400 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight mt-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2 font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BOTTOM VISUAL / CLOSING STATEMENT CARD                                 */}
      {/* ========================================================================= */}
      {config.closingVisual?.enabled && (
        <section
          aria-label="Closing Statement"
          className="pb-20 sm:pb-24 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-xl h-64 sm:h-80 md:h-96">
            {/* Scenic Cinematic Landscape Photograph */}
            <Image
              src={
                config.closingVisual.imageUrl ||
                "/images/about/about-closing-landscape.jpg"
              }
              alt="Developer looking at sunset over mountain horizon"
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-bottom sm:object-center"
            />

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent dark:from-black/80 dark:via-black/40" />

            {/* Top-Left Handwritten Script Quote */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 max-w-md pointer-events-none select-none">
              <div className="w-64 sm:w-80 h-auto drop-shadow-md">
                <Image
                  src="/images/about/a-better-tomorrow-learn.svg"
                  alt={config.closingVisual.quote || "A better tomorrow is built today with what you learn now."}
                  width={340}
                  height={140}
                  className="w-full h-auto filter brightness-110"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
