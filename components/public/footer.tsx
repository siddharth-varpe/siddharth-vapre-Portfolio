import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  User,
  Briefcase,
  Code2,
  Layers,
  Trophy,
  Award,
  Mail,
  FileText,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Zap,
  Users,
  Send,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { BackToTopButton } from "./back-to-top-button";
import { getPublishedFooterData } from "@/lib/server/db/repositories/content";

export async function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const footerData = await getPublishedFooterData();
  const { config, derivedMetrics, brand, socialLinks } = footerData;

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: User },
    { label: "Experience", href: "/experience", icon: Briefcase },
    { label: "Projects", href: "/projects", icon: Code2 },
    { label: "Skills", href: "/skills", icon: Layers },
  ];

  const quickLinks = [
    { label: "Achievements", href: "/achievements", icon: Trophy, isExternal: false },
    { label: "Certifications", href: "/certifications", icon: Award, isExternal: false },
    { label: "Contact", href: "/contact", icon: Mail, isExternal: false },
    { label: "Active Resume", href: "/api/resume/download", icon: FileText, isExternal: true },
  ];

  return (
    <footer className="w-full py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-background selection:bg-blue-600/20">
      <div className="mx-auto max-w-7xl">
        {/* Outer Card Container */}
        <div className="rounded-xl sm:rounded-2xl border border-blue-100/80 dark:border-zinc-800 bg-white/95 dark:bg-[#0c121e] overflow-hidden transition-colors">
          {/* ========================================================= */}
          {/* LAYER 1: LIGHT EDITORIAL / INFORMATION AREA              */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-start">
              {/* ========================================================= */}
              {/* COLUMN 1: Brand Identity & Metrics & Connect Prompt       */}
              {/* ========================================================= */}
              <div className="lg:col-span-5 space-y-6">
                {/* Brand Identity */}
                <div className="relative">
                  {/* Floating Handwritten Script & Flying Paper Plane (Visible on Mobile only) */}
                  <div className="lg:hidden absolute top-0 right-0 w-32 h-36 opacity-85 select-none pointer-events-none -mr-2">
                    <Image
                      src="/images/footer/mobile-code-plane-art.svg"
                      alt="Code Create Solve Grow"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="space-y-3 relative z-10 pr-20 lg:pr-0">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                      aria-label="Siddharth Varpe Portfolio Home"
                    >
                      <span className="font-sans text-3xl font-black tracking-tight select-none">
                        <span className="text-slate-950 dark:text-white">S</span>
                        <span className="text-blue-600 dark:text-blue-500">V.</span>
                      </span>
                    </Link>

                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {brand.name}
                      </h2>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
                        {brand.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md pt-3 relative z-10">
                    {brand.description}
                  </p>
                </div>

                {/* Summary Metrics (Desktop & Tablet) */}
                <div className="hidden sm:flex items-center gap-3 sm:gap-4 pt-2">
                  {config.metrics.showProjects && (
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/90 dark:border-blue-900/50">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {config.metrics.projectsLabel}
                        </span>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {derivedMetrics.projectsCount}
                        </span>
                      </div>
                    </div>
                  )}

                  {config.metrics.showAwards && (
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100/90 dark:border-amber-900/50">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {config.metrics.awardsLabel}
                        </span>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {derivedMetrics.awardsCount}
                        </span>
                      </div>
                    </div>
                  )}

                  {config.metrics.showOpportunities && (
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/90 dark:border-blue-900/50">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {config.metrics.opportunitiesLabel}
                        </span>
                        <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {derivedMetrics.opportunitiesStatus}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connect CTA Prompt Card (Desktop only) */}
                {config.connect.enabled && (
                  <div className="hidden lg:flex p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 items-center justify-between gap-4 max-w-md shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-blue-100/80 dark:border-zinc-700/80 shadow-xs flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {config.connect.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1">
                          {config.connect.description}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={config.connect.primaryButtonHref}
                      className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Contact Siddharth Varpe"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* COLUMN 2: Unified Navigation & Quick Links (Center)       */}
              {/* Single set of links across viewports to preserve tests    */}
              {/* ========================================================= */}
              <div className="lg:col-span-4 lg:border-l lg:border-slate-200/80 dark:lg:border-zinc-800 lg:pl-8 xl:pl-10 space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
                  {/* NAVIGATION */}
                  <div className="space-y-3">
                    <div>
                      <div className="h-0.5 w-6 bg-blue-600 rounded-full mb-1.5" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Navigation
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs">
                      {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/60 text-slate-700 dark:text-slate-200 lg:p-0 lg:rounded-none lg:bg-transparent lg:border-0 lg:justify-start lg:gap-2.5 lg:py-1 lg:text-slate-600 dark:lg:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <div className="flex items-center gap-3 lg:gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 lg:w-auto lg:h-auto lg:bg-transparent lg:dark:bg-transparent flex items-center justify-center shrink-0 shadow-2xs lg:shadow-none">
                                  <Icon className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-slate-600 dark:text-slate-300 lg:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </div>
                                <span className="text-xs font-semibold lg:font-medium">{item.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 lg:hidden" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* QUICK LINKS */}
                  <div className="space-y-3">
                    <div>
                      <div className="h-0.5 w-6 bg-blue-600 rounded-full mb-1.5" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Quick Links
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs">
                      {quickLinks.map((item) => {
                        const Icon = item.icon;
                        if (item.isExternal) {
                          return (
                            <li key={item.href}>
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/60 text-slate-700 dark:text-slate-200 lg:p-0 lg:rounded-none lg:bg-transparent lg:border-0 lg:justify-start lg:gap-2 lg:py-1 lg:text-slate-600 dark:lg:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              >
                                <div className="flex items-center gap-3 lg:gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 lg:w-auto lg:h-auto lg:bg-transparent lg:dark:bg-transparent flex items-center justify-center shrink-0 shadow-2xs lg:shadow-none">
                                    <Icon className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-slate-600 dark:text-slate-300 lg:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                  </div>
                                  <span className="text-xs font-semibold lg:font-medium">{item.label}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 lg:w-3 lg:h-3 text-blue-600 dark:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </a>
                            </li>
                          );
                        }
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/60 text-slate-700 dark:text-slate-200 lg:p-0 lg:rounded-none lg:bg-transparent lg:border-0 lg:justify-start lg:gap-2.5 lg:py-1 lg:text-slate-600 dark:lg:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <div className="flex items-center gap-3 lg:gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 lg:w-auto lg:h-auto lg:bg-transparent lg:dark:bg-transparent flex items-center justify-center shrink-0 shadow-2xs lg:shadow-none">
                                  <Icon className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-slate-600 dark:text-slate-300 lg:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </div>
                                <span className="text-xs font-semibold lg:font-medium">{item.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 lg:hidden" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* CONNECT SECTION (DESKTOP) */}
                <div className="hidden lg:block space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div>
                    <div className="h-0.5 w-6 bg-blue-600 rounded-full mb-1.5" />
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Connect
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center w-20 h-16 rounded-xl border border-slate-200/90 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 hover:border-blue-400 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="GitHub Profile"
                    >
                      <GithubIcon className="w-4 h-4 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                        GitHub
                      </span>
                    </a>

                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center w-20 h-16 rounded-xl border border-slate-200/90 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 hover:border-blue-400 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                        LinkedIn
                      </span>
                    </a>

                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="group flex flex-col items-center justify-center w-20 h-16 rounded-xl border border-slate-200/90 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 hover:border-blue-400 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Email Siddharth Varpe"
                    >
                      <Mail className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                        Email
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* COLUMN 3: Right-Side Decorative Scene (Desktop only)       */}
              {/* ========================================================= */}
              {config.artwork.enabled && config.artwork.desktopVisibility === "show" && (
                <div className="hidden lg:flex lg:col-span-3 flex-col items-end space-y-4">
                  {/* Handwritten Calligraphy Graphic */}
                  <div className="relative w-44 h-36 select-none pointer-events-none">
                    <Image
                      src="/images/footer/code-create-solve-grow.svg"
                      alt="Code Create Solve Grow"
                      fill
                      className="object-contain"
                      priority={false}
                    />
                  </div>

                  {/* Cozy Developer Desk Scene Image */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-zinc-700/80 shadow-md">
                    <Image
                      src={config.artwork.desktopArtworkUrl}
                      alt="Developer workspace scene with laptop, coffee mug, and programming books"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 1280px) 25vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* MOBILE ONLY: "LET'S CONNECT" Card                         */}
            {/* ========================================================= */}
            {config.connect.enabled && (
              <div className="lg:hidden mt-8 relative rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5 overflow-hidden shadow-xs">
                {/* Mountain Peak Artwork with "A Better Tomorrow" Overlay in Background */}
                <div className="absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none select-none overflow-hidden opacity-90">
                  <Image
                    src={config.artwork.mobileArtworkUrl}
                    alt="Scenic mountain peak"
                    fill
                    className="object-cover object-right"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-blue-50/40 to-transparent dark:from-[#0c121e] dark:via-[#0c121e]/60 dark:to-transparent" />
                  <div className="absolute top-2 right-2 w-28 h-16 pointer-events-none">
                    <Image
                      src="/images/footer/a-better-tomorrow.svg"
                      alt="A Better Tomorrow"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="relative z-10 space-y-3 max-w-[65%]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                      Let&apos;s Connect
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    {config.connect.description}
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white/95 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-white shadow-2xs active:bg-slate-100"
                      aria-label="GitHub Profile"
                    >
                      <div className="flex items-center gap-2">
                        <GithubIcon className="w-4 h-4 text-slate-900 dark:text-white" />
                        <span>GitHub</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white/95 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-white shadow-2xs active:bg-slate-100"
                      aria-label="LinkedIn Profile"
                    >
                      <div className="flex items-center gap-2">
                        <LinkedinIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>LinkedIn</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white/95 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-white shadow-2xs active:bg-slate-100"
                      aria-label="Email Siddharth Varpe"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        <span>Email</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* LAYER 2: DARK BOTTOM BAR                                  */}
          {/* ========================================================= */}
          <div className="relative bg-[#0c1322] dark:bg-[#060a12] text-white px-6 sm:px-10 lg:px-14 py-6 border-t border-slate-800 overflow-hidden">
            {/* Technical Sine Waves Decoration */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-40">
              <Image
                src="/images/footer/technical-waves.svg"
                alt=""
                fill
                className="object-cover object-center"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left: Brand Monogram + Copyright + Tagline */}
              <div className="flex items-center gap-3 sm:gap-4 text-center md:text-left">
                <span className="font-sans text-xl sm:text-2xl font-black tracking-tight select-none">
                  <span className="text-white">S</span>
                  <span className="text-blue-500">V.</span>
                </span>

                <div className="h-6 w-px bg-white/20 hidden sm:block" />

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 text-xs text-slate-300">
                    <span>© {currentYear} Siddharth Varpe</span>
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    {config.bottomBar.tagline}
                  </div>
                  {/* Architecture Stamp (Strictly required for verification & test suite) */}
                  <div className="text-[9px] font-mono text-slate-500 tracking-wider">
                    ARCHITECTURE: NEXT.JS 15 • REACT 19 • POSTGRESQL • SUPABASE
                  </div>
                </div>
              </div>

              {/* Right: Utility Links & Back-To-Top Control */}
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/login"
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {config.bottomBar.adminLinkText}
                  </Link>

                  {config.bottomBar.showPrivacy && (
                    <>
                      <span className="text-slate-600">|</span>
                      {config.bottomBar.privacyUrl ? (
                        <Link href={config.bottomBar.privacyUrl} className="hover:text-white transition-colors">
                          {config.bottomBar.privacyText}
                        </Link>
                      ) : (
                        <span className="text-slate-500 cursor-default">{config.bottomBar.privacyText}</span>
                      )}
                    </>
                  )}

                  {config.bottomBar.showTerms && (
                    <>
                      <span className="text-slate-600">|</span>
                      {config.bottomBar.termsUrl ? (
                        <Link href={config.bottomBar.termsUrl} className="hover:text-white transition-colors">
                          {config.bottomBar.termsText}
                        </Link>
                      ) : (
                        <span className="text-slate-500 cursor-default">{config.bottomBar.termsText}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Back to Top Button (Desktop Anchor) */}
                <div className="hidden sm:block">
                  <BackToTopButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
