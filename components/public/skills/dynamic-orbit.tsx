"use client";

import * as React from "react";
import type { SkillDocument, SkillsPageSettings } from "@/types/models";
import { TechIcon } from "@/components/public/tech-icons";
import { Code2, Database, Cloud } from "lucide-react";

interface DynamicOrbitProps {
  skills: SkillDocument[];
  settings: SkillsPageSettings;
  className?: string;
}

export function DynamicOrbit({ skills, settings, className = "" }: DynamicOrbitProps) {
  // Filter eligible skills for orbit: enabled, orbit_enabled (or featured fallback), not archived
  const eligibleSkills = React.useMemo(() => {
    const list = skills.filter(
      (s) => s.status === "published" && s.orbit_enabled !== false
    );
    // Sort deterministically by order ascending
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const maxNodes = Math.max(3, Math.min(settings.maxOrbitNodes || 8, 12));
    return list.slice(0, maxNodes);
  }, [skills, settings.maxOrbitNodes]);

  // Orbit speed duration
  const durationSeconds = React.useMemo(() => {
    switch (settings.orbitSpeed) {
      case "ultra-slow":
        return 60;
      case "very-slow":
        return 45;
      case "slow":
      default:
        return 32;
    }
  }, [settings.orbitSpeed]);

  const isReverse = settings.orbitDirection === "counterclockwise";
  const count = Math.max(eligibleSkills.length, 1);

  // Center visual text lines
  const centerLines = React.useMemo(() => {
    const text = settings.centerVisualText || "Build\nCreate\nSolve\nGrow";
    return text.split("\n").map((line) => line.trim()).filter(Boolean);
  }, [settings.centerVisualText]);

  const accentWord = settings.centerVisualAccent || "Grow";

  return (
    <div
      className={`relative flex items-center justify-center select-none orbit-container ${className}`}
      aria-label="Interactive rotating technologies orbit"
      role="region"
    >
      <style jsx>{`
        .orbit-container {
          --orbit-radius: 120px;
        }
        @media (min-width: 640px) {
          .orbit-container {
            --orbit-radius: 162px;
          }
        }
        @media (min-width: 1024px) {
          .orbit-container {
            --orbit-radius: 188px;
          }
        }

        @keyframes orbit-cw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbit-ccw {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes counter-orbit-cw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes counter-orbit-ccw {
          from {
            transform: rotate(-360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes skill-card-rise {
          0% {
            transform: translateY(0px) scale(0.25);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(-1 * var(--orbit-radius, 120px))) scale(1);
            opacity: 1;
          }
        }

        .orbit-rise-wrapper {
          animation: skill-card-rise 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) both;
          will-change: transform, opacity;
        }

        .orbit-track {
          animation-name: ${isReverse ? "orbit-ccw" : "orbit-cw"};
          animation-duration: ${durationSeconds}s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .orbit-node-counter {
          animation-name: ${isReverse ? "counter-orbit-ccw" : "counter-orbit-cw"};
          animation-duration: ${durationSeconds}s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .orbit-container:hover .orbit-track,
        .orbit-container:hover .orbit-node-counter,
        .orbit-container:focus-within .orbit-track,
        .orbit-container:focus-within .orbit-node-counter {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-track,
          .orbit-node-counter,
          .orbit-rise-wrapper {
            animation: none !important;
          }
          .orbit-rise-wrapper {
            transform: translateY(calc(-1 * var(--orbit-radius, 120px))) scale(1) !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Orbit Canvas Background Glow & Radial Guides */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft Radial Ambient Gradient */}
        <div className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[520px] lg:h-[520px] rounded-full bg-gradient-to-tr from-blue-500/10 via-sky-400/5 to-transparent blur-3xl pointer-events-none" />

        {/* Outer Decorative Track Ring */}
        <div className="w-[310px] h-[310px] sm:w-[420px] sm:h-[420px] lg:w-[470px] lg:h-[470px] rounded-full border border-blue-500/15 dark:border-blue-400/10 absolute pointer-events-none" />

        {/* Primary Orbit Ring (dashed/dotted fine line matching reference) */}
        <div className="w-[240px] h-[240px] sm:w-[330px] sm:h-[330px] lg:w-[370px] lg:h-[370px] rounded-full border border-dashed border-blue-400/25 dark:border-blue-400/20 absolute pointer-events-none" />

        {/* Inner Subtle Ring */}
        <div className="w-[170px] h-[170px] sm:w-[230px] sm:h-[230px] lg:w-[260px] lg:h-[260px] rounded-full border border-blue-500/10 dark:border-blue-400/10 absolute pointer-events-none" />
      </div>

      {/* Static Satellite Decorative Floating Dots & Mini Badges */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Top-right small badge: </> */}
        <div className="absolute top-[8%] right-[22%] sm:top-[12%] sm:right-[18%] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-surface border border-blue-200 dark:border-blue-800/40 shadow-sm flex items-center justify-center text-blue-500 text-[10px]">
          <Code2 className="w-3.5 h-3.5" />
        </div>
        {/* Left small badge: Database */}
        <div className="absolute top-[28%] left-[6%] sm:top-[28%] sm:left-[10%] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-surface border border-blue-200 dark:border-blue-800/40 shadow-sm flex items-center justify-center text-blue-500 text-[10px]">
          <Database className="w-3.5 h-3.5" />
        </div>
        {/* Bottom-right small badge: Cloud */}
        <div className="absolute bottom-[20%] right-[8%] sm:bottom-[22%] sm:right-[12%] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-surface border border-blue-200 dark:border-blue-800/40 shadow-sm flex items-center justify-center text-blue-500 text-[10px]">
          <Cloud className="w-3.5 h-3.5" />
        </div>
        {/* Subtle decorative dot */}
        <div className="absolute bottom-[16%] left-[24%] w-2 h-2 rounded-full bg-blue-500/40" />
      </div>

      {/* Rotating Orbit System Track */}
      {settings.orbitEnabled && eligibleSkills.length > 0 && (
        <div className="relative z-[2] w-[320px] h-[320px] sm:w-[430px] sm:h-[430px] lg:w-[480px] lg:h-[480px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center orbit-track">
            {eligibleSkills.map((skill, index) => {
              const angleDeg = (index * 360) / count;
              // Responsive radius calculations:
              // mobile: ~120px, tablet: ~165px, desktop: ~185px
              return (
                <div
                  key={skill.id || skill.name}
                  className="absolute flex items-center justify-center"
                  style={{
                    transform: `rotate(${angleDeg}deg)`,
                  }}
                >
                  {/* Smooth rise out from center behind central square */}
                  <div className="orbit-rise-wrapper">
                    {/* Static Base Angle Counter-Rotation */}
                    <div
                      style={{
                        transform: `rotate(-${angleDeg}deg)`,
                      }}
                    >
                      {/* Continuous Dynamic Counter-Rotation */}
                      <div className="orbit-node-counter">
                        <div
                          tabIndex={0}
                          role="article"
                          aria-label={`${skill.name} - ${skill.category}`}
                          className="group relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-surface/95 dark:bg-zinc-900/90 border border-blue-100 dark:border-zinc-800 shadow-[0_4px_20px_rgba(30,58,138,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md hover:scale-110 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-transform duration-300 cursor-pointer min-w-[68px] sm:min-w-[82px] min-h-[64px] sm:min-h-[76px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {/* Tech Icon Container */}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-blue-50/80 dark:bg-zinc-800/80 group-hover:scale-105 transition-transform">
                            <TechIcon name={skill.name} className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                          </div>

                          {/* Skill Name */}
                          <span className="mt-1 text-[10px] sm:text-[11px] font-semibold text-foreground tracking-tight text-center truncate max-w-[70px] sm:max-w-[80px]">
                            {skill.name}
                          </span>

                          {/* Skill Category / Tag */}
                          <span className="text-[8px] sm:text-[9px] text-foreground-muted font-medium tracking-tight">
                            {skill.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Central Visual Disc (Build, Create, Solve, Grow) */}
      {settings.centerVisualEnabled && (
        <div className="absolute z-10 flex items-center justify-center">
          <div className="w-[124px] h-[124px] sm:w-[150px] sm:h-[150px] lg:w-[164px] lg:h-[164px] rounded-3xl sm:rounded-[32px] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white p-4 sm:p-5 flex flex-col items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-zinc-700/50 relative overflow-hidden group">
            {/* Subtle Top-Light Sheen */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-3xl" />

            {/* Small Top Eyebrow */}
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-semibold mb-1">
              SKILLS
            </span>

            {/* Center Core Typography */}
            <div className="flex flex-col items-center leading-tight sm:leading-snug text-center">
              {centerLines.map((line, idx) => {
                const isAccent = line.toLowerCase() === accentWord.toLowerCase();
                if (isAccent) {
                  return (
                    <span
                      key={idx}
                      className="text-sm sm:text-base font-serif italic text-blue-400 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(96,165,250,0.5)]"
                    >
                      {line}
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    className="text-xs sm:text-sm font-bold tracking-tight text-zinc-100"
                  >
                    {line}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
