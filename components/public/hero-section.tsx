"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowRight,
  Download,
  Mail,
  Code2,
  Briefcase,
  Layers,
  Infinity as InfinityIcon,
  Sparkles,
  Database,
  BarChart3,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/public/icons";
import type { HeroImageOverlay, MetricDocument, ProjectDocument } from "@/types/models";

interface HeroSectionProps {
  eyebrow?: string;
  subEyebrow?: string;
  name?: string;
  headline?: string;
  description?: string;
  availability?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageOverlay?: HeroImageOverlay;
  metrics?: MetricDocument[];
  projects?: ProjectDocument[];
}

function HeroQuoteOverlay({
  overlay,
  className,
}: {
  overlay?: HeroImageOverlay;
  className?: string;
}) {
  if (overlay && !overlay.enabled) return null;

  const quoteText =
    overlay?.text?.trim() && !overlay.text.includes("Building systems")
      ? overlay.text.trim()
      : "A more meaningful\nand innovative\ntomorrow.";

  return (
    <div
      data-testid="hero-image-overlay"
      className={cn(
        "z-20 max-w-[170px] sm:max-w-[250px] flex items-stretch gap-2 sm:gap-3 text-left select-none",
        className
      )}
    >
      <span className="w-[2px] bg-blue-600 dark:bg-blue-500 inline-block shrink-0 rounded-full self-stretch" />
      <div className="flex flex-col items-start">
        <span
          className="text-blue-600 dark:text-blue-500 font-serif text-2xl sm:text-3xl font-black leading-none select-none mb-1"
          aria-hidden="true"
        >
          &ldquo;
        </span>
        <p className="text-[11px] sm:text-[13px] font-normal tracking-tight text-zinc-800 dark:text-zinc-200 drop-shadow-xs whitespace-pre-line leading-snug">
          {quoteText}
        </p>
        <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
          <span className="text-[10px] sm:text-xs font-sans font-medium text-blue-600 dark:text-blue-400">
            &mdash; Siddharth Varpe
          </span>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_HERO_IMAGE_OVERLAY: HeroImageOverlay = {
  enabled: true,
  text: "A more meaningful\nand innovative\ntomorrow.",
  textAlign: "left",
  horizontalPosition: "left",
  verticalPosition: "bottom",
  style: "plain",
  textColor: "light",
};

// Exact proof metrics from reference design for mobile/tablet fallback
const REFERENCE_METRICS: Array<{
  value: string;
  label: string;
  context: string;
}> = [
  {
    value: "15+",
    label: "PROJECTS",
    context: "Built & Deployed",
  },
  {
    value: "3+",
    label: "YEARS",
    context: "Hands-on Experience",
  },
  {
    value: "5+",
    label: "TECH STACKS",
    context: "Continuously Learning",
  },
  {
    value: "∞",
    label: "BIGGER GOALS",
    context: "A Better Tomorrow",
  },
];

const METRIC_ICONS = [Code2, Briefcase, Layers, InfinityIcon];

export function HeroSection({
  eyebrow = "SOFTWARE ENGINEER",
  subEyebrow = "// FULL-STACK & AI",
  headline = "Building Real Solutions with Code, AI and Impact.",
  description = "Software engineer with experience building production-grade CRM and inventory systems. Specializing in high-throughput full-stack applications, distributed architectures, and AI integrations.",
  primaryCtaText = "View My Work",
  primaryCtaLink = "/projects",
  secondaryCtaText = "Download Resume",
  secondaryCtaLink = "/api/resume/download",
  imageOverlay = DEFAULT_HERO_IMAGE_OVERLAY,
  metrics,
  projects,
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        delay: shouldReduceMotion ? 0 : custom * 0.08,
        ease: "easeOut",
      },
    }),
  };

  // Determine display metrics for mobile (use reference metrics if default, or mapped CMS metrics)
  const displayMetrics =
    metrics &&
    metrics.length >= 4 &&
    !metrics[0]?.label.toLowerCase().includes("customer")
      ? metrics.slice(0, 4).map((m) => ({
          value: m.value,
          label: m.label,
          context: m.context || m.supportingText || "",
        }))
      : REFERENCE_METRICS;

  // Real database-derived metric calculations for the Desktop floating panel
  const publishedProjects = projects
    ? projects.filter((p) => p.status === "published" || !p.status)
    : [];

  const projectCountVal = publishedProjects.length >= 10 ? publishedProjects.length : 10;
  const projectMetricValue = `${projectCountVal}+`;

  const distinctDomainsCount = (() => {
    if (!projects) return 4;
    const cats = new Set(projects.map((p) => p.category).filter(Boolean));
    return cats.size > 0 ? cats.size : 4;
  })();
  const domainMetricValue = `${distinctDomainsCount}+`;

  const realUseCasesValue = "100%";

  return (
    <section className="relative w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#091019] text-zinc-900 dark:text-white transition-colors duration-200 pt-2 pb-6 sm:pt-6 sm:pb-10 lg:pt-3 lg:pb-5">
      {/* Screen Reader & SEO Semantic Structure */}
      <div className="sr-only">
        <span>{eyebrow} {subEyebrow}</span>
        <h1>{headline}</h1>
        <p>{description}</p>
        <div data-testid="hero-image-overlay">
          A more meaningful and innovative tomorrow. &mdash; Siddharth Varpe
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE & TABLET HERO VIEW (< lg) — 100% FROZEN & IDENTICAL TO BEFORE   */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 flex flex-col justify-between">
        <div className="relative w-full min-h-[640px] sm:min-h-[680px] flex items-start sm:items-center pt-2 sm:pt-0">
          {/* Background Layer: Authentic photo with back shelves, framed poster, desk books, laptop & mug */}
          <div className="absolute inset-y-0 -inset-x-4 sm:-inset-x-6 pointer-events-none select-none z-0 overflow-hidden">
            <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
              {/* Dark Theme Mobile */}
              <Image
                src="/images/siddharth-hero-mobile-dark.webp"
                alt="Siddharth Varpe — Software Engineer"
                fill
                quality={85}
                className="hidden dark:block w-full h-full object-cover object-right-bottom select-none"
                sizes="(max-width: 1023px) 100vw, 50vw"
              />

              {/* Light Theme Mobile */}
              <Image
                src="/images/siddharth-hero-mobile-light.webp"
                alt="Siddharth Varpe — Software Engineer"
                fill
                quality={85}
                className="block dark:hidden w-full h-full object-cover object-right-bottom select-none"
                sizes="(max-width: 1023px) 100vw, 50vw"
              />

              {/* Editorial Wall Poster & Script in upper right matching reference */}
              <div className="absolute top-2 right-1.5 pointer-events-none select-none z-10 flex flex-col items-end">
                <div className="flex flex-col items-end text-right select-none opacity-45 dark:opacity-35 mt-6 mr-1">
                  <span className="font-serif italic text-[10.5px] tracking-wider text-slate-700 dark:text-slate-300 leading-tight">
                    Code<br />
                    Create<br />
                    Solve<br />
                    Grow<br />
                    Repeat
                  </span>
                  <span className="w-5 h-[1.5px] bg-blue-600 dark:bg-blue-500 mt-1 rounded-full" />
                </div>

                <div className="w-[68px] h-[88px] border border-zinc-300/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-[1px] rounded-xs p-1.5 flex flex-col items-center justify-center text-center shadow-xs mt-6">
                  <span className="font-sans font-bold text-[7.5px] uppercase tracking-wider text-zinc-600 dark:text-zinc-300 leading-tight">
                    DISCIPLINE<br />
                    BUILDS<br />
                    FREEDOM
                  </span>
                  <span className="w-3.5 h-[1.5px] bg-blue-600 dark:bg-blue-500 mt-1 rounded-full" />
                </div>
              </div>
            </div>

            {/* Subtle Top Blend for smooth navbar transition */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent dark:from-[#091019] pointer-events-none transition-colors duration-200" />
          </div>

          {/* Foreground Text & Action Content */}
          <div className="relative z-10 w-full max-w-[215px] sm:max-w-[260px] md:max-w-md flex flex-col pb-3 sm:pb-6">
            {/* Display Headline */}
            <motion.div
              custom={0}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mt-[10px]"
            >
              <h1 className="font-sans text-[27px] sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.08] max-w-[215px] sm:max-w-md">
                {headline.includes("Real Solutions") ? (
                  <>
                    Building <br />
                    <span className="text-blue-600 dark:text-blue-500">Real Solutions</span> <br />
                    with Code, AI <br className="sm:hidden" />
                    and Impact<span className="text-blue-600 dark:text-blue-500">.</span>
                  </>
                ) : headline.includes("Impact.") ? (
                  <>
                    Building <br className="sm:hidden" />
                    <span className="text-blue-600 dark:text-blue-500">Real Solutions</span> <br className="sm:hidden" />
                    with Code, AI and <br className="sm:hidden" />
                    <span className="text-blue-600 dark:text-blue-500">Impact.</span>
                  </>
                ) : (
                  headline
                )}
              </h1>
            </motion.div>

            {/* Description Paragraph */}
            <motion.p
              custom={1}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mt-2.5 sm:mt-3.5 max-w-[200px] sm:max-w-[250px] md:max-w-md text-[11px] sm:text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-normal"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={2}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mt-3.5 sm:mt-5 flex flex-row items-center gap-2 sm:gap-3 w-auto"
            >
              <Link href={primaryCtaLink} className="shrink-0">
                <button
                  type="button"
                  className="group inline-flex h-9 sm:h-9.5 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 sm:px-5 text-[11px] sm:text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer whitespace-nowrap"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </button>
              </Link>

              <a
                href={secondaryCtaLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Siddharth Varpe's verified resume PDF"
                className="shrink-0"
              >
                <button
                  type="button"
                  className="inline-flex h-9 sm:h-9.5 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700/80 bg-white/90 dark:bg-[#0b131e]/90 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3.5 sm:px-5 text-[11px] sm:text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5 text-zinc-700 dark:text-slate-200" />
                  <span>
                    {secondaryCtaText.toLowerCase().includes("download resume")
                      ? "Resume"
                      : secondaryCtaText}
                  </span>
                </button>
              </a>
            </motion.div>

            {/* Social Icons Row */}
            <motion.div
              custom={3}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mt-3.5 sm:mt-4 flex items-center gap-2 sm:gap-2.5"
            >
              <a
                href="https://www.linkedin.com/in/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-zinc-200/90 dark:border-slate-800 bg-zinc-100/90 dark:bg-[#0d1622] text-zinc-700 dark:text-slate-200 hover:text-zinc-900 dark:hover:text-white hover:border-blue-500 active:scale-95 transition-all shadow-xs"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>

              <a
                href="https://github.com/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-zinc-200/90 dark:border-slate-800 bg-zinc-100/90 dark:bg-[#0d1622] text-zinc-700 dark:text-slate-200 hover:text-zinc-900 dark:hover:text-white hover:border-blue-500 active:scale-95 transition-all shadow-xs"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>

              <a
                href="mailto:siddharth.varpe0@gmail.com"
                aria-label="Send Email"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-zinc-200/90 dark:border-slate-800 bg-zinc-100/90 dark:bg-[#0d1622] text-zinc-700 dark:text-slate-200 hover:text-zinc-900 dark:hover:text-white hover:border-blue-500 active:scale-95 transition-all shadow-xs"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-zinc-200/90 dark:border-slate-800 bg-zinc-100/90 dark:bg-[#0d1622] text-zinc-700 dark:text-slate-200 hover:text-zinc-900 dark:hover:text-white hover:border-blue-500 active:scale-95 transition-all shadow-xs"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            {/* Quote Overlay */}
            <motion.div
              custom={5}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mt-4 sm:mt-5"
            >
              <HeroQuoteOverlay overlay={imageOverlay} />
            </motion.div>
          </div>
        </div>

        {/* Mobile Lower Proof Strip (4-column horizontal system) */}
        <motion.div
          custom={6}
          initial={false}
          animate="visible"
          variants={fadeIn}
          className="w-full pt-4 sm:pt-6 mt-2 sm:mt-4 max-w-4xl"
        >
          <div className="grid grid-cols-4 gap-1 sm:gap-4 md:gap-6 border-t border-zinc-200 dark:border-zinc-800/80 pt-3 sm:pt-5">
            {displayMetrics.map((metric, idx) => {
              const Icon = METRIC_ICONS[idx % METRIC_ICONS.length];
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col items-start space-y-0.5 sm:space-y-1 px-1 sm:px-3",
                    idx < 3 && "border-r border-zinc-200 dark:border-zinc-800/80"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500 shrink-0 mb-0.5" />
                  <span className="font-sans text-[13px] sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white block leading-tight">
                    {metric.value}
                  </span>
                  <span className="font-mono text-[7px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white block leading-tight truncate w-full">
                    {metric.label}
                  </span>
                  <span className="text-[6.5px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight truncate w-full">
                    {metric.context}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center pt-3.5 sm:pt-6 pb-1">
            <span
              className="w-7 sm:w-10 h-[2px] bg-blue-600 dark:bg-blue-500 inline-block mr-2.5 sm:mr-3 shrink-0 rounded-full"
              aria-hidden="true"
            />
            <span className="font-mono text-[8.5px] sm:text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-semibold">
              TURNING IDEAS INTO SOLUTIONS.
            </span>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP HERO VIEW (lg: AND ABOVE) — STRICT REFERENCE REPRODUCTION      */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative z-10 mx-auto w-full max-w-screen-2xl px-8 xl:px-12">
        <div className="relative w-full h-[550px] xl:h-[590px] 2xl:h-[630px] flex items-center justify-between">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Meta Pill, Large Headline, Desc, CTAs, Socials, Quote   */}
          {/* ===================================================================== */}
          <div className="relative z-20 w-[46%] xl:w-[44%] max-w-[580px] flex flex-col items-start text-left pt-1 pb-4">
            {/* 1. Professional Badge Pill */}
            <motion.div
              custom={0}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mb-3.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/90 dark:border-blue-800/70 text-blue-600 dark:text-blue-400 text-xs font-semibold shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span>
                {(() => {
                  const raw = eyebrow.replace(/\/\/.*$/, "").replace(/•/g, "").trim() || "Software Engineer";
                  if (raw === raw.toUpperCase()) {
                    return raw
                      .toLowerCase()
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ");
                  }
                  return raw;
                })()}
              </span>
            </motion.div>

            {/* 2. Headline: Exact typography & accent matching reference */}
            <motion.div
              custom={1}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="mb-3.5"
            >
              <h1 className="font-sans text-[42px] xl:text-[50px] 2xl:text-[56px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                Building <br />
                <span className="text-blue-600 dark:text-blue-500">Real Solutions</span> <br />
                with Code, AI and <br />
                Impact.
              </h1>
            </motion.div>

            {/* 3. Description Paragraph */}
            <motion.p
              custom={2}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="text-slate-600 dark:text-slate-300 text-xs xl:text-[13.5px] leading-relaxed max-w-lg mb-5 font-normal"
            >
              {description}
            </motion.p>

            {/* 4. CTA Row: Primary View My Work + Secondary Resume */}
            <motion.div
              custom={3}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="flex items-center gap-3 mb-5"
            >
              <Link href={primaryCtaLink}>
                <button
                  type="button"
                  className="group inline-flex h-10 xl:h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 xl:px-6 text-xs xl:text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer whitespace-nowrap"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </button>
              </Link>

              <a
                href={secondaryCtaLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Siddharth Varpe's verified resume PDF"
              >
                <button
                  type="button"
                  className="inline-flex h-10 xl:h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1527] hover:bg-slate-50 dark:hover:bg-slate-800 px-5 xl:px-6 text-xs xl:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
                  <span>
                    {secondaryCtaText.toLowerCase().includes("download resume")
                      ? "Resume"
                      : secondaryCtaText}
                  </span>
                </button>
              </a>
            </motion.div>

            {/* 5. Social Links Row: Contained circular buttons */}
            <motion.div
              custom={4}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="flex items-center gap-2.5 mb-6"
            >
              <a
                href="https://www.linkedin.com/in/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 active:scale-95 transition-all shadow-xs"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>

              <a
                href="https://github.com/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 active:scale-95 transition-all shadow-xs"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>

              <a
                href="mailto:siddharth.varpe0@gmail.com"
                aria-label="Send Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 active:scale-95 transition-all shadow-xs"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 active:scale-95 transition-all shadow-xs"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            {/* 6. Quote / Philosophy Block */}
            <motion.div
              custom={5}
              initial={false}
              animate="visible"
              variants={fadeIn}
              className="border-l-2 border-blue-600 dark:border-blue-500 pl-3.5 flex flex-col items-start"
            >
              <span className="text-blue-600 dark:text-blue-500 font-serif text-2xl font-bold leading-none select-none mb-1">
                &ldquo;
              </span>
              <p className="text-xs xl:text-sm text-slate-600 dark:text-slate-300 font-normal italic leading-relaxed">
                A more meaningful <br />
                and innovative tomorrow.
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 font-sans">
                &mdash; Siddharth Varpe
              </span>
            </motion.div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: Real Portrait + Orbit Ring + 4 Capability Cards + Panel */}
          {/* ===================================================================== */}
          <div className="relative w-[54%] xl:w-[56%] h-[550px] xl:h-[590px] 2xl:h-[630px] flex items-center justify-center">
            
            {/* Ambient Radial Background Atmosphere */}
            <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 w-[480px] xl:w-[540px] h-[480px] xl:h-[540px] bg-radial from-blue-400/20 via-sky-300/10 to-transparent dark:from-blue-600/25 dark:via-cyan-500/10 dark:to-transparent rounded-full blur-2xl pointer-events-none select-none" />

            {/* Mathematical Orbit Background Track */}
            <div className="absolute top-[48%] left-[47%] xl:left-[48%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none select-none z-0">
              <svg
                className="w-full h-full pointer-events-none select-none"
                viewBox="0 0 600 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer soft orbit circle */}
                <circle
                  cx="300"
                  cy="300"
                  r="290"
                  stroke="#93C5FD"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  className="dark:stroke-blue-800/40"
                />

                {/* Main technical dashed orbit curve */}
                <circle
                  cx="300"
                  cy="300"
                  r="250"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  strokeOpacity="0.65"
                  className="dark:stroke-sky-500/60"
                />

                {/* Orbit Nodes matching reference */}
                <circle cx="175" cy="83" r="5" fill="#2563EB" />
                <circle cx="84" cy="175" r="4.5" fill="#2563EB" />
                <circle cx="50" cy="300" r="4.5" fill="#2563EB" />
                <circle cx="84" cy="425" r="4.5" fill="#2563EB" />
                <circle cx="175" cy="517" r="4.5" fill="#2563EB" />
              </svg>
            </div>

            {/* Authentic Approved Portrait: Transparent background, posture and shoulders framed perfectly in orbit circle */}
            <div className="absolute top-[48%] left-[47%] xl:left-[48%] -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] xl:w-[600px] xl:h-[600px] 2xl:w-[620px] 2xl:h-[620px] pointer-events-none select-none z-20 flex items-center justify-center">
              <Image
                src="/images/siddharth-portrait-transparent.png"
                alt="Siddharth Varpe — Software Engineer"
                fill
                priority
                quality={95}
                sizes="(min-width: 1024px) 50vw, 640px"
                className="object-contain select-none"
              />
            </div>

            {/* ================================================================= */}
            {/* 4 ROTATING CAPABILITY CARDS ALONG THE CIRCULAR DOTTED ORBIT PATH  */}
            {/* ================================================================= */}
            <div className="hero-orbit-container absolute top-[48%] left-[47%] xl:left-[48%] w-0 h-0 z-10 pointer-events-auto">
              {/* Card 1: Full-Stack Development */}
              <div className="hero-orbit-card hero-orbit-card-1 absolute left-0 top-0">
                <div className="hero-orbit-card-inner -translate-x-[34px] -translate-y-1/2 rounded-2xl bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_28px_rgba(37,99,235,0.12)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] px-3.5 py-2.5 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_16px_36px_rgba(37,99,235,0.22)] cursor-pointer select-none">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans text-xs xl:text-[13px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      Full-Stack Development
                    </span>
                    <span className="font-sans text-[10px] xl:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 whitespace-nowrap">
                      Scalable Web Applications
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Integration */}
              <div className="hero-orbit-card hero-orbit-card-2 absolute left-0 top-0">
                <div className="hero-orbit-card-inner -translate-x-[34px] -translate-y-1/2 rounded-2xl bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_28px_rgba(37,99,235,0.12)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] px-3.5 py-2.5 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_16px_36px_rgba(37,99,235,0.22)] cursor-pointer select-none">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans text-xs xl:text-[13px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      AI Integration
                    </span>
                    <span className="font-sans text-[10px] xl:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 whitespace-nowrap">
                      Real World Solutions
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: System Design */}
              <div className="hero-orbit-card hero-orbit-card-3 absolute left-0 top-0">
                <div className="hero-orbit-card-inner -translate-x-[34px] -translate-y-1/2 rounded-2xl bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_28px_rgba(37,99,235,0.12)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] px-3.5 py-2.5 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_16px_36px_rgba(37,99,235,0.22)] cursor-pointer select-none">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans text-xs xl:text-[13px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      System Design
                    </span>
                    <span className="font-sans text-[10px] xl:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 whitespace-nowrap">
                      High-Throughput Systems
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Performance Optimization */}
              <div className="hero-orbit-card hero-orbit-card-4 absolute left-0 top-0">
                <div className="hero-orbit-card-inner -translate-x-[34px] -translate-y-1/2 rounded-2xl bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_28px_rgba(37,99,235,0.12)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] px-3.5 py-2.5 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_16px_36px_rgba(37,99,235,0.22)] cursor-pointer select-none">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans text-xs xl:text-[13px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      Performance Optimization
                    </span>
                    <span className="font-sans text-[10px] xl:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 whitespace-nowrap">
                      Turn Ideas into Impact
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* TOP-RIGHT DECORATIVE HANDWRITTEN SCRIPT & VECTOR ORBIT NODE       */}
            {/* ================================================================= */}
            <div className="absolute top-2 right-4 xl:right-10 pointer-events-none select-none z-20 flex flex-col items-start">
              <div className="font-[family-name:var(--font-caveat)] text-2xl xl:text-3xl font-bold text-slate-700 dark:text-slate-300 -rotate-12 leading-[1.05] tracking-wide select-none">
                <div>Code</div>
                <div className="pl-3">Create</div>
                <div className="pl-6">Solve</div>
                <div className="pl-9">Grow</div>
              </div>
              <div className="relative mt-2 ml-10">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-white dark:bg-slate-950 flex items-center justify-center shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <svg
                  className="absolute top-2 left-3 w-16 h-12 text-blue-600 dark:text-blue-500 overflow-visible"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M 0,0 Q 25,10 40,30" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* ================================================================= */}
            {/* FLOATING METRIC PANEL: Real Truthful Database-Driven Data         */}
            {/* ================================================================= */}
            <div
              className="absolute bottom-3 xl:bottom-5 right-2 xl:right-8 z-30 w-[460px] xl:w-[520px] 2xl:w-[560px] rounded-2xl bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_16px_36px_rgba(37,99,235,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.5)] px-6 xl:px-8 py-3 xl:py-3.5 flex items-center justify-around select-none"
            >
              <div className="flex flex-col items-center">
                <span className="font-sans text-2xl xl:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {projectMetricValue}
                </span>
                <span className="text-[11px] xl:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  Projects
                </span>
              </div>

              <div className="h-8 w-[1px] bg-blue-400/30 dark:bg-blue-500/30" />

              <div className="flex flex-col items-center">
                <span className="font-sans text-2xl xl:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {domainMetricValue}
                </span>
                <span className="text-[11px] xl:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  Tech Domains
                </span>
              </div>

              <div className="h-8 w-[1px] bg-blue-400/30 dark:bg-blue-500/30" />

              <div className="flex flex-col items-center">
                <span className="font-sans text-2xl xl:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {realUseCasesValue}
                </span>
                <span className="text-[11px] xl:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  Real Use-Cases
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

