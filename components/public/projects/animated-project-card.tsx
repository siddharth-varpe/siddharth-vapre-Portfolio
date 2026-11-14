"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Leaf, Activity } from "lucide-react";
import { GithubIcon } from "@/components/public/icons";
import { TechIcon } from "@/components/public/tech-icons";
import type { ProjectDocument } from "@/types/models";
import { getProjectDisplayImage } from "./project-image-helper";

export type CardPositionState = "active" | "prev" | "next" | "farPrev" | "farNext" | "hidden";

interface AnimatedProjectCardProps {
  project: ProjectDocument;
  state: CardPositionState;
  onClick?: () => void;
  priority?: boolean;
}

export function AnimatedProjectCard({
  project,
  state,
  onClick,
  priority = false,
}: AnimatedProjectCardProps) {
  const isActive = state === "active";
  const imageSrc = getProjectDisplayImage(project);
  const technologies = project.technologies || [];

  // Display up to 4 technologies on the card (e.g. 2x2 grid matching reference)
  const visibleTech = technologies.slice(0, 4);

  const detailUrl = `/projects/${project.slug}`;
  const liveUrl = project.liveDemoUrl;
  const codeUrl = project.githubUrl;

  const isCampusBuddy = project.slug === "campus-buddy" || project.title.toLowerCase().includes("campus");
  const isByFarm = project.slug === "byfarm" || project.category.toLowerCase().includes("agri");
  const isSwasthya = project.slug === "swasthyaid" || project.category.toLowerCase().includes("cyber") || project.category.toLowerCase().includes("health");

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking a non-active card, bring it to the active position
    if (!isActive && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      aria-label={`${project.title} project showcase card`}
      aria-hidden={state === "hidden"}
      onClick={handleCardClick}
      className={`relative w-[240px] xs:w-[260px] sm:w-[285px] md:w-[295px] lg:w-[350px] xl:w-[380px] 2xl:w-[400px] rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800/90 shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isActive
          ? "ring-1 ring-blue-500/20 shadow-blue-500/15 dark:shadow-black/70 cursor-default"
          : "cursor-pointer hover:border-blue-400/60 select-none opacity-90"
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. REAL APP PREVIEW IMAGE / MOCKUP WITH FLOATING BADGES                   */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[140px] xs:h-[150px] sm:h-[160px] md:h-[170px] lg:h-[200px] xl:h-[220px] overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80">
        <Image
          src={imageSrc}
          alt={`${project.title} real production preview screenshot`}
          fill
          priority={priority || isActive}
          quality={95}
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 450px"
          className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
        />

        {/* Floating Featured Badge (on top-right for featured/CampusBuddy) */}
        {(project.featured || isCampusBuddy) && (
          <div className="absolute top-2.5 right-2.5 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#2563EB] text-white text-[10px] sm:text-xs font-bold shadow-md tracking-wide">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Floating Leaf Badge for Agriculture / ByFarm on top-left */}
        {isByFarm && (
          <div className="absolute top-2.5 left-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-green-200 dark:border-green-800/80 shadow-md backdrop-blur-md flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        )}

        {/* Floating Health/Pulse Badge for SwasthyaID on top-right */}
        {isSwasthya && (
          <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-800/80 shadow-md backdrop-blur-md flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        )}

        {/* Overlay gradient for non-active cards to provide depth and readability */}
        {!isActive && (
          <div
            className="absolute inset-0 bg-slate-900/15 dark:bg-slate-950/30 pointer-events-none transition-opacity"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD CONTENT & ACTIONS                                                */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-3.5 lg:p-4.5 flex flex-col justify-between flex-1 space-y-2 sm:space-y-2.5">
        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm xs:text-[15px] sm:text-base lg:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug truncate">
            {isActive ? (
              <Link
                href={detailUrl}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {project.title}
              </Link>
            ) : (
              <span>{project.title}</span>
            )}
          </h3>

          {/* Description: Authentic project summary */}
          <p className="text-[10.5px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-normal">
            {project.shortDescription || project.fullDescription}
          </p>
        </div>

        {/* Dynamic Technology Chips (2x2 grid matching reference card design) */}
        {visibleTech.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {visibleTech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-[9.5px] sm:text-[10.5px] font-medium truncate"
              >
                <TechIcon name={tech} className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">{tech}</span>
              </span>
            ))}
          </div>
        )}

        {/* Action CTAs: Live Demo + Code */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/70">
          <a
            href={liveUrl || detailUrl}
            target={liveUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            tabIndex={isActive ? 0 : -1}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#0D1527] hover:bg-[#1E293B] text-white font-semibold text-[11px] sm:text-xs transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <span>Live Demo</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>

          <a
            href={codeUrl || detailUrl}
            target={codeUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            tabIndex={isActive ? 0 : -1}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 font-medium text-[11px] sm:text-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <GithubIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Code</span>
          </a>
        </div>
      </div>
    </article>
  );
}
