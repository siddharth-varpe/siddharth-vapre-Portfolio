"use client";

import * as React from "react";
import { ArrowRight, Play, ArrowDown } from "lucide-react";
import type { PageHeroConfig, ProjectDocument } from "@/types/models";
import { ProjectShowcase } from "./project-showcase";

interface ProjectsHeroProps {
  config?: PageHeroConfig | null;
  projects: ProjectDocument[];
  totalDomains: number;
  className?: string;
}

export function ProjectsHero({
  config,
  projects,
  totalDomains,
  className = "",
}: ProjectsHeroProps) {
  const eyebrow = config?.eyebrow
    ? config.eyebrow.replace(/\/\/.*$/, "").replace(/•/g, "").trim()
    : "PROJECTS";

  const description =
    config?.description && !config.description.startsWith("Production software")
      ? config.description
      : "A collection of projects where I combine engineering, design, and modern technologies to solve real-world problems. Each project reflects a focus on usability, scalability, and impact.";

  const projectCount = Math.max(projects.length, 5);

  return (
    <header
      aria-label="Engineering Projects Portfolio & Showcase"
      className={`relative w-full pt-3 sm:pt-6 lg:pt-8 pb-4 sm:pb-8 lg:pb-10 overflow-hidden isolate ${className}`}
    >
      {/* ========================================================================= */}
      {/* DESKTOP HERO BACKGROUND: ULTRA CRISP HIGH-RESOLUTION CONSTELLATION GRAPHIC */}
      {/* ========================================================================= */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Ambient Radial Illumination Pools */}
        <div className="absolute -top-24 right-0 lg:right-12 w-[650px] lg:w-[850px] h-[550px] lg:h-[700px] bg-radial from-blue-600/15 via-sky-500/10 to-transparent dark:from-blue-500/20 dark:via-cyan-500/15 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] lg:w-[500px] h-[400px] bg-radial from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-600/15 dark:via-purple-600/10 dark:to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Razor-Sharp Vector Constellation Graphic (Zero Blur, Infinite Precision) */}
        <svg
          viewBox="0 0 1920 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full opacity-90 dark:opacity-85"
        >
          <defs>
            {/* Dark Mode Gradients */}
            <linearGradient id="orbitGradDark1" x1="800" y1="150" x2="1650" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.65" />
            </linearGradient>

            <linearGradient id="orbitGradDark2" x1="750" y1="600" x2="1600" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.45" />
            </linearGradient>

            {/* Light Mode Gradients */}
            <linearGradient id="orbitGradLight1" x1="800" y1="150" x2="1650" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.55" />
            </linearGradient>

            <linearGradient id="orbitGradLight2" x1="750" y1="600" x2="1600" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#2563eb" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
            </linearGradient>

            {/* Node Radial Glows */}
            <radialGradient id="nodeGlowDark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="nodeGlowLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
              <stop offset="45%" stopColor="#2563eb" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ==================== DARK MODE ORBITS & NODES ==================== */}
          <g className="hidden dark:inline">
            {/* Primary Crisp Orbital Ellipse 1 (Rotated) */}
            <g transform="translate(1330, 400) rotate(-16)">
              <ellipse cx="0" cy="0" rx="420" ry="180" stroke="url(#orbitGradDark1)" strokeWidth="1.75" fill="none" opacity="0.85" />
              <ellipse cx="0" cy="0" rx="385" ry="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 7" fill="none" opacity="0.45" />
            </g>

            {/* Secondary Opposing Orbital Ellipse 2 (Rotated) */}
            <g transform="translate(1310, 410) rotate(22)">
              <ellipse cx="0" cy="0" rx="400" ry="165" stroke="url(#orbitGradDark2)" strokeWidth="1.5" fill="none" opacity="0.75" />
              <ellipse cx="0" cy="0" rx="365" ry="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.4" />
            </g>

            {/* Sweeping Connecting Wave Path */}
            <path d="M 720,470 C 940,290 1190,260 1410,340 C 1630,420 1800,330 1900,240" stroke="url(#orbitGradDark1)" strokeWidth="1.5" fill="none" opacity="0.65" />

            {/* Constellation Connecting Segments */}
            <line x1="970" y1="330" x2="1120" y2="280" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
            <line x1="1120" y1="280" x2="1440" y2="240" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.65" />
            <line x1="1440" y1="240" x2="1710" y2="310" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
            <line x1="1710" y1="310" x2="1670" y2="500" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            <line x1="1670" y1="500" x2="1400" y2="560" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
            <line x1="1400" y1="560" x2="1070" y2="520" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
            <line x1="1070" y1="520" x2="840" y2="440" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />

            {/* Constellation Anchor Nodes */}
            <g transform="translate(970, 330)">
              <circle cx="0" cy="0" r="14" fill="url(#nodeGlowDark)" opacity="0.85" />
              <circle cx="0" cy="0" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(1120, 280)">
              <circle cx="0" cy="0" r="11" fill="url(#nodeGlowDark)" opacity="0.7" />
              <circle cx="0" cy="0" r="3.5" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.2" />
            </g>
            <g transform="translate(1440, 240)">
              <circle cx="0" cy="0" r="18" fill="url(#nodeGlowDark)" opacity="0.9" />
              <circle cx="0" cy="0" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="10" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.7" />
            </g>
            <g transform="translate(1710, 310)">
              <circle cx="0" cy="0" r="14" fill="url(#nodeGlowDark)" opacity="0.85" />
              <circle cx="0" cy="0" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(1670, 500)">
              <circle cx="0" cy="0" r="12" fill="url(#nodeGlowDark)" opacity="0.75" />
              <circle cx="0" cy="0" r="4" fill="#818cf8" stroke="#ffffff" strokeWidth="1.2" />
            </g>
            <g transform="translate(1400, 560)">
              <circle cx="0" cy="0" r="16" fill="url(#nodeGlowDark)" opacity="0.85" />
              <circle cx="0" cy="0" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="9" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.65" />
            </g>
            <g transform="translate(1070, 520)">
              <circle cx="0" cy="0" r="12" fill="url(#nodeGlowDark)" opacity="0.7" />
              <circle cx="0" cy="0" r="3.5" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.2" />
            </g>
            <g transform="translate(840, 440)">
              <circle cx="0" cy="0" r="10" fill="url(#nodeGlowDark)" opacity="0.6" />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            </g>
          </g>

          {/* ==================== LIGHT MODE ORBITS & NODES ==================== */}
          <g className="dark:hidden">
            {/* Primary Crisp Orbital Ellipse 1 (Rotated) */}
            <g transform="translate(1330, 400) rotate(-16)">
              <ellipse cx="0" cy="0" rx="420" ry="180" stroke="url(#orbitGradLight1)" strokeWidth="1.75" fill="none" opacity="0.85" />
              <ellipse cx="0" cy="0" rx="385" ry="160" stroke="#0284c7" strokeWidth="1" strokeDasharray="5 7" fill="none" opacity="0.5" />
            </g>

            {/* Secondary Opposing Orbital Ellipse 2 (Rotated) */}
            <g transform="translate(1310, 410) rotate(22)">
              <ellipse cx="0" cy="0" rx="400" ry="165" stroke="url(#orbitGradLight2)" strokeWidth="1.5" fill="none" opacity="0.75" />
              <ellipse cx="0" cy="0" rx="365" ry="145" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.4" />
            </g>

            {/* Sweeping Connecting Wave Path */}
            <path d="M 720,470 C 940,290 1190,260 1410,340 C 1630,420 1800,330 1900,240" stroke="url(#orbitGradLight1)" strokeWidth="1.5" fill="none" opacity="0.65" />

            {/* Constellation Connecting Segments */}
            <line x1="970" y1="330" x2="1120" y2="280" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
            <line x1="1120" y1="280" x2="1440" y2="240" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
            <line x1="1440" y1="240" x2="1710" y2="310" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
            <line x1="1710" y1="310" x2="1670" y2="500" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
            <line x1="1670" y1="500" x2="1400" y2="560" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.55" />
            <line x1="1400" y1="560" x2="1070" y2="520" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
            <line x1="1070" y1="520" x2="840" y2="440" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Constellation Anchor Nodes */}
            <g transform="translate(970, 330)">
              <circle cx="0" cy="0" r="14" fill="url(#nodeGlowLight)" opacity="0.8" />
              <circle cx="0" cy="0" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(1120, 280)">
              <circle cx="0" cy="0" r="11" fill="url(#nodeGlowLight)" opacity="0.65" />
              <circle cx="0" cy="0" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
            </g>
            <g transform="translate(1440, 240)">
              <circle cx="0" cy="0" r="18" fill="url(#nodeGlowLight)" opacity="0.85" />
              <circle cx="0" cy="0" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="10" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.6" />
            </g>
            <g transform="translate(1710, 310)">
              <circle cx="0" cy="0" r="14" fill="url(#nodeGlowLight)" opacity="0.8" />
              <circle cx="0" cy="0" r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(1670, 500)">
              <circle cx="0" cy="0" r="12" fill="url(#nodeGlowLight)" opacity="0.7" />
              <circle cx="0" cy="0" r="4" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.2" />
            </g>
            <g transform="translate(1400, 560)">
              <circle cx="0" cy="0" r="16" fill="url(#nodeGlowLight)" opacity="0.8" />
              <circle cx="0" cy="0" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="9" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.55" />
            </g>
            <g transform="translate(1070, 520)">
              <circle cx="0" cy="0" r="12" fill="url(#nodeGlowLight)" opacity="0.65" />
              <circle cx="0" cy="0" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
            </g>
            <g transform="translate(840, 440)">
              <circle cx="0" cy="0" r="10" fill="url(#nodeGlowLight)" opacity="0.55" />
              <circle cx="0" cy="0" r="3" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />
            </g>
          </g>
        </svg>

        {/* Soft edge blends to ensure seamless transition into page body */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40 dark:from-[#091019]/40 dark:via-transparent dark:to-[#091019]/80 pointer-events-none" />
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: EDITORIAL NARRATIVE, METRICS & CTAS (Desktop lg:col-span-5) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 z-10 text-left">
            {/* Upper Narrative Block */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#2563EB] dark:bg-blue-500 shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-[#2563EB] dark:text-blue-400 uppercase">
                  PROJECTS
                </span>
                <div
                  className="h-[1px] w-8 sm:w-12 bg-blue-200 dark:bg-blue-900/60"
                  aria-hidden="true"
                />
              </div>

              {/* Exact 2-Line Headline matching Reference */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                <span className="block">Ideas Built into</span>
                <span className="text-[#2563EB] dark:text-blue-500 block">
                  Real Solutions.
                </span>
              </h1>

              {/* Description: Concise narrative matching Reference */}
              <p className="text-xs sm:text-sm lg:text-[15px] xl:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                A collection of projects where I combine engineering, design, and modern technologies to solve real-world problems.
              </p>

              {/* 3 Metrics Strip in Horizontal Row with Vertical Dividers */}
              <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800/80 py-1 sm:py-1.5 max-w-md">
                <div className="pr-3 sm:pr-4 space-y-0.5">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {projectCount}+
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                    Major Projects
                  </div>
                </div>

                <div className="px-3 sm:px-4 space-y-0.5">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {totalDomains}+
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                    Tech Domains
                  </div>
                </div>

                <div className="pl-3 sm:pl-4 space-y-0.5">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                    100%
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                    Real Use-Cases
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Artistic Cursive Mark (Code Create Solve Grow) */}
            <div className="hidden lg:block pt-4 select-none pointer-events-none">
              <span className="font-[family-name:var(--font-caveat)] text-2xl xl:text-3xl text-slate-400 dark:text-slate-500 font-bold -rotate-6 inline-block leading-snug">
                Code<br />
                &nbsp;&nbsp;Create<br />
                &nbsp;&nbsp;&nbsp;&nbsp;Solve<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Grow
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 3D DYNAMIC PROJECT CARD SHOWCASE (Desktop lg:col-span-7)   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center">
            {/* ========================================================================= */}
            {/* MOBILE ONLY: CARDS BACKGROUND DESIGN (CONSTELLATION & ORBIT GLOW)         */}
            {/* ========================================================================= */}
            <div
              className="block lg:hidden absolute -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:-inset-y-8 pointer-events-none overflow-hidden z-0 select-none"
              aria-hidden="true"
            >
              {/* Centered Ambient Radial Illumination Pools */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] xs:w-[390px] sm:w-[480px] h-[340px] xs:h-[390px] sm:h-[480px] bg-radial from-blue-600/20 via-sky-500/10 to-transparent dark:from-blue-500/25 dark:via-cyan-500/15 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Ultra-Crisp Centered Vector Constellation Graphic */}
              <svg
                viewBox="0 0 600 520"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full opacity-90 dark:opacity-85"
              >
                <defs>
                  {/* Dark Mode Gradients */}
                  <linearGradient id="mobOrbitGradDark1" x1="100" y1="100" x2="500" y2="420" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.65" />
                  </linearGradient>
                  <linearGradient id="mobOrbitGradDark2" x1="500" y1="120" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.45" />
                  </linearGradient>

                  {/* Light Mode Gradients */}
                  <linearGradient id="mobOrbitGradLight1" x1="100" y1="100" x2="500" y2="420" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="mobOrbitGradLight2" x1="500" y1="120" x2="100" y2="400" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
                    <stop offset="55%" stopColor="#2563eb" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Node Radial Glows */}
                  <radialGradient id="mobNodeGlowDark" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                    <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="mobNodeGlowLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
                    <stop offset="45%" stopColor="#2563eb" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Dark Mode Orbits & Constellations */}
                <g className="hidden dark:inline">
                  <g transform="translate(300, 255) rotate(-14)">
                    <ellipse cx="0" cy="0" rx="255" ry="120" stroke="url(#mobOrbitGradDark1)" strokeWidth="1.75" fill="none" opacity="0.85" />
                    <ellipse cx="0" cy="0" rx="230" ry="105" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 7" fill="none" opacity="0.45" />
                  </g>
                  <g transform="translate(300, 260) rotate(20)">
                    <ellipse cx="0" cy="0" rx="240" ry="110" stroke="url(#mobOrbitGradDark2)" strokeWidth="1.5" fill="none" opacity="0.75" />
                    <ellipse cx="0" cy="0" rx="215" ry="95" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.4" />
                  </g>

                  {/* Sweeping curve path */}
                  <path d="M 40,330 C 140,165 300,145 450,235 C 525,280 575,260 595,225" stroke="url(#mobOrbitGradDark1)" strokeWidth="1.5" fill="none" opacity="0.65" />

                  {/* Constellation line segments */}
                  <line x1="85" y1="260" x2="185" y2="165" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
                  <line x1="185" y1="165" x2="365" y2="135" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.65" />
                  <line x1="365" y1="135" x2="515" y2="195" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
                  <line x1="515" y1="195" x2="485" y2="345" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
                  <line x1="485" y1="345" x2="315" y2="385" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
                  <line x1="315" y1="385" x2="135" y2="335" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />

                  {/* Anchor Nodes */}
                  <g transform="translate(85, 260)">
                    <circle cx="0" cy="0" r="12" fill="url(#mobNodeGlowDark)" opacity="0.8" />
                    <circle cx="0" cy="0" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  <g transform="translate(185, 165)">
                    <circle cx="0" cy="0" r="14" fill="url(#mobNodeGlowDark)" opacity="0.85" />
                    <circle cx="0" cy="0" r="4" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  <g transform="translate(365, 135)">
                    <circle cx="0" cy="0" r="16" fill="url(#mobNodeGlowDark)" opacity="0.9" />
                    <circle cx="0" cy="0" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="9" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.7" />
                  </g>
                  <g transform="translate(515, 195)">
                    <circle cx="0" cy="0" r="14" fill="url(#mobNodeGlowDark)" opacity="0.85" />
                    <circle cx="0" cy="0" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  <g transform="translate(485, 345)">
                    <circle cx="0" cy="0" r="12" fill="url(#mobNodeGlowDark)" opacity="0.75" />
                    <circle cx="0" cy="0" r="3.5" fill="#818cf8" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  <g transform="translate(315, 385)">
                    <circle cx="0" cy="0" r="14" fill="url(#mobNodeGlowDark)" opacity="0.85" />
                    <circle cx="0" cy="0" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                </g>

                {/* Light Mode Orbits & Constellations */}
                <g className="dark:hidden">
                  <g transform="translate(300, 255) rotate(-14)">
                    <ellipse cx="0" cy="0" rx="255" ry="120" stroke="url(#mobOrbitGradLight1)" strokeWidth="1.75" fill="none" opacity="0.85" />
                    <ellipse cx="0" cy="0" rx="230" ry="105" stroke="#0284c7" strokeWidth="1" strokeDasharray="5 7" fill="none" opacity="0.5" />
                  </g>
                  <g transform="translate(300, 260) rotate(20)">
                    <ellipse cx="0" cy="0" rx="240" ry="110" stroke="url(#mobOrbitGradLight2)" strokeWidth="1.5" fill="none" opacity="0.75" />
                    <ellipse cx="0" cy="0" rx="215" ry="95" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.4" />
                  </g>

                  {/* Sweeping curve path */}
                  <path d="M 40,330 C 140,165 300,145 450,235 C 525,280 575,260 595,225" stroke="url(#mobOrbitGradLight1)" strokeWidth="1.5" fill="none" opacity="0.65" />

                  {/* Constellation line segments */}
                  <line x1="85" y1="260" x2="185" y2="165" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
                  <line x1="185" y1="165" x2="365" y2="135" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
                  <line x1="365" y1="135" x2="515" y2="195" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
                  <line x1="515" y1="195" x2="485" y2="345" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
                  <line x1="485" y1="345" x2="315" y2="385" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.55" />
                  <line x1="315" y1="385" x2="135" y2="335" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />

                  {/* Anchor Nodes */}
                  <g transform="translate(85, 260)">
                    <circle cx="0" cy="0" r="12" fill="url(#mobNodeGlowLight)" opacity="0.8" />
                    <circle cx="0" cy="0" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(185, 165)">
                    <circle cx="0" cy="0" r="14" fill="url(#mobNodeGlowLight)" opacity="0.85" />
                    <circle cx="0" cy="0" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  <g transform="translate(365, 135)">
                    <circle cx="0" cy="0" r="16" fill="url(#mobNodeGlowLight)" opacity="0.85" />
                    <circle cx="0" cy="0" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="9" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.6" />
                  </g>
                  <g transform="translate(515, 195)">
                    <circle cx="0" cy="0" r="14" fill="url(#mobNodeGlowLight)" opacity="0.8" />
                    <circle cx="0" cy="0" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(485, 345)">
                    <circle cx="0" cy="0" r="12" fill="url(#mobNodeGlowLight)" opacity="0.7" />
                    <circle cx="0" cy="0" r="3.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  <g transform="translate(315, 385)">
                    <circle cx="0" cy="0" r="14" fill="url(#mobNodeGlowLight)" opacity="0.8" />
                    <circle cx="0" cy="0" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Hand-Drawn Cursive Annotation & Vector Arrow in Upper Right */}
            <div className="absolute -top-7 right-2 xs:right-4 sm:-top-5 sm:right-6 lg:top-2 lg:right-6 pointer-events-none select-none z-30 flex flex-col items-center">
              <div className="font-[family-name:var(--font-caveat)] text-xl sm:text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 rotate-[8deg] tracking-wide font-bold leading-[1.05] text-center">
                <span>Real</span><br />
                <span>World</span><br />
                <span>Solutions</span>
              </div>
              {/* Hand-drawn curving arrow SVG pointing down toward the cards */}
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 -rotate-12 -mt-0.5"
                viewBox="0 0 50 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M 12,8 Q 32,12 28,32 Q 26,42 16,42" />
                <polyline points="12,36 16,42 24,42" />
              </svg>
            </div>

            {/* The Dynamic 3D Project Card Showcase */}
            <div className="w-full">
              <ProjectShowcase projects={projects} autoPlayInterval={2000} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
