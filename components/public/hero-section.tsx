"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Mail } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/public/icons";
import { StatusBeacon } from "@/components/motion";

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
}

export function HeroSection({
  eyebrow = "SOFTWARE ENGINEER",
  subEyebrow = "// FULL-STACK & AI",
  name = "SIDDHARTH VARPE",
  headline = "Building Real Solutions with Code, AI and Impact.",
  description = "Software engineer with experience building production-grade CRM and inventory systems. Specializing in high-throughput full-stack applications, distributed architectures, and AI integrations.",
  availability,
  primaryCtaText = "View My Work",
  primaryCtaLink = "/projects",
  secondaryCtaText = "Download Resume",
  secondaryCtaLink = "/api/resume/download",
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

  return (
    <section className="relative w-full overflow-hidden border-b border-border/80 bg-background pt-4 pb-12 sm:pt-6 sm:pb-16 lg:py-16">
      {/* ========================================================================= */}
      {/* LAYER 1: TECHNICAL BACKGROUND & RESTRAINED GLOW (2D GPU ACCELERATED)      */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-technical opacity-40 z-0"
      />

      {/* Subtle blue & warm ambient depth glows with soft breathing opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[140px] z-0 animate-pulse [animation-duration:10s]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[120px] z-0"
      />

      {/* Engineering coordinate markers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/3 hidden font-mono text-[10px] text-blue-400/20 select-none md:block z-0"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 right-1/3 hidden font-mono text-[10px] text-blue-400/25 select-none lg:block z-0"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-1/4 hidden font-mono text-[10px] text-blue-400/20 select-none md:block z-0"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-36 right-1/4 hidden font-mono text-[10px] text-blue-400/25 select-none lg:block z-0"
      >
        +
      </div>

      {/* Small subtle glowing blue technical coordinate dot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-[42%] hidden h-1 w-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] lg:block z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-40 right-[46%] hidden h-1 w-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] lg:block z-0"
      />

      {/* ========================================================================= */}
      {/* LAYER 2 & 3: SUPPLIED HERO IMAGE & ATMOSPHERIC BLENDING (DESKTOP)         */}
      {/* Strict: authentic image preserved without filter, face alteration or swap  */}
      {/* ========================================================================= */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[58%] xl:w-[56%] 2xl:w-[54%] z-10"
      >
        {/* The approved portrait image */}
        <div className="relative h-full w-full">
          <Image
            src="/images/siddharth-hero.png"
            alt="Siddharth Varpe — Software Engineer"
            fill
            priority
            quality={95}
            className="object-cover object-[62%_28%]"
            sizes="(min-width: 1536px) 54vw, (min-width: 1280px) 56vw, 58vw"
          />

          {/* Left-edge smooth dissolution gradient */}
          <div className="absolute inset-y-0 left-0 w-44 xl:w-56 bg-gradient-to-r from-background via-background/90 to-transparent" />

          {/* Bottom smooth dissolution into technical strip */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/80 to-transparent" />

          {/* Top subtle fade under navbar */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/80 to-transparent" />

          {/* Subtle blue rim lighting reinforcement on the portrait */}
          <div className="absolute top-10 left-16 h-72 w-72 rounded-full bg-sky-500/[0.08] blur-3xl pointer-events-none" />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* LAYER 5: RIGHT-SIDE TECHNICAL EDITORIAL DECORATION (DESKTOP XL+)          */}
      {/* ========================================================================= */}
      <aside
        aria-hidden="true"
        className="pointer-events-none absolute right-4 xl:right-6 2xl:right-10 top-10 bottom-28 z-20 hidden xl:flex flex-col justify-between w-32 xl:w-36 select-none opacity-85"
      >
        {/* Block 1: IDEAS / EXECUTION / RESULTS */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
          className="rounded-sm border border-sky-500/30 bg-slate-950/70 backdrop-blur-sm p-3 space-y-1 shadow-lg"
        >
          <div className="font-mono text-[11px] font-semibold tracking-[0.2em] text-slate-300">
            <div>IDEAS</div>
            <div className="text-slate-400">EXECUTION</div>
            <div className="text-slate-400">RESULTS</div>
          </div>
          <div className="h-[2px] w-6 bg-sky-500/60 mt-2" />
        </motion.div>

        {/* Block 2: 01 Build() ... 05 Repeat() */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.35 }}
          className="space-y-1 font-mono text-[11px] bg-slate-950/50 backdrop-blur-sm p-2.5 rounded-sm border border-slate-800/40"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">01</span>
            <span className="text-slate-400">Build()</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">02</span>
            <span className="text-slate-400">Solve()</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">03</span>
            <span className="text-slate-400">Automate()</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">04</span>
            <span className="text-slate-400">Optimize()</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">05</span>
            <span className="text-sky-400 font-semibold">Repeat()</span>
          </div>
          <div className="h-[2px] w-6 bg-sky-500/50 mt-1.5" />
        </motion.div>

        {/* Block 3: BETTER CODE BRIGHTER TOMORROW */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.5 }}
          className="space-y-1 font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase bg-slate-950/50 backdrop-blur-sm p-2.5 rounded-sm border border-slate-800/40"
        >
          <div>BETTER</div>
          <div>CODE</div>
          <div>BRIGHTER</div>
          <div>TOMORROW</div>
          <div className="h-[2px] w-6 bg-slate-600 mt-1.5" />
        </motion.div>
      </aside>

      {/* ========================================================================= */}
      {/* LAYER 4: CONTENT LAYER                                                    */}
      {/* ========================================================================= */}
      <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Main 2-Column Hero Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Textual Hierarchy & CTAs */}
          <div className="lg:col-span-8 xl:col-span-7 space-y-6 sm:space-y-7">
            {/* Eyebrow strip */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-sm border border-sky-500/50 bg-sky-950/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                  {eyebrow}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  {subEyebrow}
                </span>
              </div>
              {availability && (
                <div className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                  <StatusBeacon status="live" />
                  <span>{availability}</span>
                </div>
              )}
            </motion.div>

            {/* Name & Display Headline */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-3"
            >
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {name}
              </div>
              <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-extrabold tracking-tight text-white leading-[1.1] max-w-2xl">
                {headline.includes("Impact.") ? (
                  <>
                    Building Real Solutions <br className="hidden sm:inline" />
                    with Code, AI and <span className="text-sky-400">Impact.</span>
                  </>
                ) : (
                  headline
                )}
              </h1>
            </motion.div>

            {/* Professional Description */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-300/80 font-normal"
            >
              {description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <Link href={primaryCtaLink}>
                <button
                  type="button"
                  className="group inline-flex h-11 items-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-slate-950 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
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
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-700/80 bg-slate-950/60 px-5 text-sm font-medium text-white transition-all duration-200 hover:border-sky-500/60 hover:bg-slate-900/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Download className="h-4 w-4 text-sky-400" />
                  <span>{secondaryCtaText}</span>
                </button>
              </a>
            </motion.div>

            {/* Social Links Row */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex items-center gap-5 pt-2 text-slate-400"
            >
              <a
                href="https://www.linkedin.com/in/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="transition-all duration-150 hover:text-white hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
              >
                <LinkedinIcon className="h-[18px] w-[18px]" />
              </a>

              <a
                href="https://github.com/Siddharth-Varpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="transition-all duration-150 hover:text-white hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
              >
                <GithubIcon className="h-[18px] w-[18px]" />
              </a>

              <a
                href="mailto:siddharth.varpe0@gmail.com"
                aria-label="Send Email"
                className="transition-all duration-150 hover:text-white hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="transition-all duration-150 hover:text-white hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
            </motion.div>
          </div>

          {/* Mobile/Tablet Portrait Fallback Block */}
          {/* On mobile screens (< lg), the portrait appears cleanly below social links */}
          <div className="block lg:hidden pt-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md overflow-hidden border border-border/60 bg-surface/40">
              <Image
                src="/images/siddharth-hero.png"
                alt="Siddharth Varpe — Software Engineer"
                fill
                priority
                quality={90}
                className="object-cover object-[62%_25%]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM TECHNICAL INFORMATION STRIP                                        */}
        {/* ========================================================================= */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-12 sm:mt-16 w-full border-t border-border/80 pt-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            {/* Monogram Badge */}
            <div
              aria-hidden="true"
              className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/90 font-mono text-xs font-bold text-slate-300 shadow-inner"
            >
              SV
            </div>

            {/* 3 Columns of Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl w-full font-mono">
              {/* Column 1 */}
              <div className="space-y-1 sm:border-l sm:border-slate-800/80 sm:pl-6">
                <div className="font-sans text-xs sm:text-sm font-semibold text-slate-200 tracking-wide">
                  Full-Stack Systems
                </div>
                <div className="text-[11px] text-slate-400">
                  React · Node.js · Next.js
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-1 sm:border-l sm:border-slate-800/80 sm:pl-6">
                <div className="font-sans text-xs sm:text-sm font-semibold text-slate-200 tracking-wide">
                  Data &amp; Architecture
                </div>
                <div className="text-[11px] text-slate-400">
                  PostgreSQL · Python · APIs
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-1 sm:border-l sm:border-slate-800/80 sm:pl-6">
                <div className="font-sans text-xs sm:text-sm font-semibold text-slate-200 tracking-wide">
                  AI Optimization
                </div>
                <div className="text-[11px] text-slate-400">
                  Prompt Eng. · LLMs · Automation
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
