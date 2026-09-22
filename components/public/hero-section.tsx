"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Mail } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon } from "@/components/public/icons";
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
  socialLinks?: {
    linkedin?: string;
    github?: string;
    email?: string;
    instagram?: string;
    twitter?: string;
  };
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
  socialLinks = {
    linkedin: "https://www.linkedin.com/in/siddharth-varpe",
    github: "https://github.com/siddharth-varpe",
    email: "siddharth.varpe0@gmail.com",
    instagram: "https://instagram.com",
    twitter: "https://x.com/siddharth_varpe",
  },
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

      {/* ========================================================================= */}
      {/* LAYER 2 & 3: SUPPLIED HERO IMAGE & ATMOSPHERIC BLENDING (TABLET & DESKTOP) */}
      {/* Strict: authentic image preserved without filter, face alteration or swap  */}
      {/* ========================================================================= */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[48%] lg:w-[58%] xl:w-[56%] 2xl:w-[54%] z-10"
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
            sizes="(min-width: 1536px) 54vw, (min-width: 1280px) 56vw, (min-width: 768px) 48vw, 58vw"
          />

          {/* Left-edge smooth dissolution gradient */}
          <div className="absolute inset-y-0 left-0 w-36 md:w-44 xl:w-56 bg-gradient-to-r from-background via-background/90 to-transparent" />

          {/* Bottom smooth dissolution into technical strip */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/80 to-transparent" />

          {/* Top subtle fade under navbar */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/80 to-transparent" />

          {/* Subtle blue rim lighting reinforcement on the portrait */}
          <div className="absolute top-10 left-16 h-72 w-72 rounded-full bg-sky-500/[0.08] blur-3xl pointer-events-none" />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* LAYER 4: CONTENT LAYER                                                    */}
      {/* ========================================================================= */}
      <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Main Hero Container: 2-Column on Tablet & Desktop (md:), 1-Column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left / Primary Column: Textual Hierarchy, CTAs & Socials */}
          <div className="md:col-span-8 lg:col-span-8 xl:col-span-7 space-y-4 sm:space-y-6">
            {/* Eyebrow strip */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-wrap items-center gap-2.5 sm:gap-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {eyebrow}
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {subEyebrow}
                </span>
              </div>
              {availability && (
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-emerald-500 dark:text-emerald-400">
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
              className="space-y-2 sm:space-y-3"
            >
              <div className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground">
                {name}
              </div>
              <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-extrabold tracking-tight text-foreground leading-[1.15] sm:leading-[1.1] max-w-2xl">
                {headline.includes("Impact.") ? (
                  <>
                    Building Real Solutions <br className="hidden sm:inline" />
                    with Code, AI and <span className="text-accent">Impact.</span>
                  </>
                ) : (
                  headline
                )}
              </h1>
            </motion.div>

            {/* ========================================================================= */}
            {/* MOBILE INTEGRATED HERO PORTRAIT (< md:)                                   */}
            {/* Seamless, borderless edge treatment - visual continuation of the headline  */}
            {/* ========================================================================= */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="block md:hidden relative w-full my-1 sm:my-2"
            >
              <div className="relative w-full overflow-hidden">
                {/* Soft ambient depth lighting connecting with hero lighting */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-blue-600/[0.12] blur-3xl"
                />

                {/* The approved portrait image with multi-directional seamless dissolution */}
                <div className="relative aspect-[16/9] sm:aspect-[16/10] max-h-[220px] sm:max-h-[260px] w-full overflow-hidden">
                  <Image
                    src="/images/siddharth-hero.png"
                    alt="Siddharth Varpe — Software Engineer"
                    fill
                    priority
                    quality={92}
                    className="object-cover object-[62%_24%]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Top soft fade connecting into hero headline */}
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background via-background/40 to-transparent pointer-events-none" />
                  {/* Bottom smooth dissolution into description */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
                  {/* Left & right edge dissolves into background */}
                  <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background via-background/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background via-background/40 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Professional Description */}
            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-foreground-secondary font-normal"
            >
              {description}
            </motion.p>

            {/* Action Buttons & Social Links in cohesive group */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3.5 sm:gap-4 pt-1"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <Link href={primaryCtaLink}>
                  <button
                    type="button"
                    className="group inline-flex h-9 sm:h-11 items-center gap-2 rounded-md bg-foreground px-4 sm:px-6 text-xs sm:text-sm font-semibold text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
                  >
                    <span>{primaryCtaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
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
                    className="inline-flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-md border border-border bg-surface px-3 sm:px-5 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 hover:border-accent/60 hover:bg-surface-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                    <span>{secondaryCtaText}</span>
                  </button>
                </a>
              </div>

              {/* Social Links Row (Admin CMS Controlled, Supports Twitter, Hides Empty) */}
              <div className="flex items-center gap-3.5 sm:gap-4 text-muted-foreground pt-1 sm:pt-0 sm:pl-2 shrink-0">
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="transition-all duration-150 hover:text-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm p-1"
                  >
                    <LinkedinIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </a>
                )}

                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="transition-all duration-150 hover:text-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm p-1"
                  >
                    <GithubIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </a>
                )}

                {socialLinks?.email && (
                  <a
                    href={socialLinks.email.startsWith("mailto:") ? socialLinks.email : `mailto:${socialLinks.email}`}
                    aria-label="Send Email"
                    className="transition-all duration-150 hover:text-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm p-1"
                  >
                    <Mail className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </a>
                )}

                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Profile"
                    className="transition-all duration-150 hover:text-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm p-1"
                  >
                    <InstagramIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </a>
                )}

                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter Profile"
                    className="transition-all duration-150 hover:text-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm p-1"
                  >
                    <TwitterIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP TECHNICAL INFORMATION STRIP (VISIBLE ONLY ON lg:)                */}
        {/* ========================================================================= */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="hidden lg:block mt-12 sm:mt-16 w-full border-t border-border/80 pt-6"
        >
          <div className="flex items-center gap-8">
            {/* Monogram Badge */}
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs font-bold text-foreground-secondary shadow-inner"
            >
              SV
            </div>

            {/* 3 Columns of Highlights */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl w-full font-mono">
              <div className="space-y-1 border-l border-border pl-6">
                <div className="font-sans text-sm font-semibold text-foreground tracking-wide">
                  Full-Stack Systems
                </div>
                <div className="text-[11px] text-muted-foreground">
                  React · Node.js · Next.js
                </div>
              </div>

              <div className="space-y-1 border-l border-border pl-6">
                <div className="font-sans text-sm font-semibold text-foreground tracking-wide">
                  Data &amp; Architecture
                </div>
                <div className="text-[11px] text-muted-foreground">
                  PostgreSQL · Python · APIs
                </div>
              </div>

              <div className="space-y-1 border-l border-border pl-6">
                <div className="font-sans text-sm font-semibold text-foreground tracking-wide">
                  AI Optimization
                </div>
                <div className="text-[11px] text-muted-foreground">
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

