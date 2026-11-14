"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Maximize2, ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/public/icons";
import { TechIcon } from "@/components/public/tech-icons";
import type { ProjectDocument } from "@/types/models";
import { getProjectDisplayImage } from "./project-image-helper";

interface ProjectCardProps {
  project: ProjectDocument;
  className?: string;
}

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const technologies = project.technologies || [];
  const visibleTech = technologies.slice(0, 3);
  const remainingCount = Math.max(0, technologies.length - visibleTech.length);

  const imageSrc = getProjectDisplayImage(project);
  const primaryTargetUrl = `/projects/${project.slug}`;

  // Domain-specific badge accent color
  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("ai") || cat.includes("agri")) return "text-teal-600 dark:text-teal-400";
    if (cat.includes("enterprise")) return "text-indigo-600 dark:text-indigo-400";
    if (cat.includes("cyber") || cat.includes("security")) return "text-purple-600 dark:text-purple-400";
    if (cat.includes("web") || cat.includes("full-stack")) return "text-blue-600 dark:text-blue-400";
    return "text-blue-600 dark:text-blue-400";
  };

  return (
    <article
      aria-label={`${project.title} project card`}
      className={`group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Top Section: Split horizontal on mobile (thumbnail left, meta right) and stacked on sm+ */}
        <div className="flex flex-row sm:flex-col gap-3 sm:gap-4 items-start sm:items-stretch">
          {/* Project Thumbnail Image with Top-Right Circular Expand Icon */}
          <div className="relative w-[125px] xs:w-[135px] sm:w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 shrink-0">
            <Link href={primaryTargetUrl} className="block relative w-full h-full">
              <Image
                src={imageSrc}
                alt={`${project.title} preview`}
                fill
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 50vw, 450px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Circular Expand Action Button */}
            <Link
              href={project.liveDemoUrl || primaryTargetUrl}
              target={project.liveDemoUrl ? "_blank" : undefined}
              rel={project.liveDemoUrl ? "noopener noreferrer" : undefined}
              aria-label={`Open ${project.title}`}
              className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900/80 sm:bg-white/85 hover:bg-slate-900 dark:bg-slate-900/85 dark:hover:bg-slate-900 backdrop-blur-md border border-slate-700/50 sm:border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-white sm:text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Content Meta: Category, Title & Description */}
          <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 pt-0.5">
            {/* Category Eyebrow */}
            <div className="font-mono text-[9.5px] sm:text-xs font-bold uppercase tracking-wider truncate">
              <span className={getCategoryColor(project.category)}>{project.category}</span>
            </div>

            {/* Title */}
            <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-1">
              <Link
                href={primaryTargetUrl}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {project.title}
              </Link>
            </h3>

            {/* Short Description */}
            <p className="text-[11px] sm:text-xs lg:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
              {project.shortDescription || project.fullDescription || project.problem}
            </p>

            {/* Mobile-only Tech Badges (Inside meta column next to thumbnail) */}
            {technologies.length > 0 && (
              <div className="flex sm:hidden flex-wrap items-center gap-1 pt-1">
                {visibleTech.map((tech) => (
                  <div
                    key={tech}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-[9.5px] font-medium text-slate-700 dark:text-slate-300 truncate"
                  >
                    <TechIcon name={tech} className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{tech}</span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <span className="inline-flex items-center px-1 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                    +{remainingCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop-only Technology Badges (Full width under image) */}
        {technologies.length > 0 && (
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            {visibleTech.map((tech) => (
              <div
                key={tech}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 truncate"
              >
                <TechIcon name={tech} className="w-3 h-3 shrink-0" />
                <span className="truncate">{tech}</span>
              </div>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                +{remainingCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Row: Prominent on both Mobile and Desktop */}
      <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/70 mt-3 sm:mt-4">
        <a
          href={project.liveDemoUrl || primaryTargetUrl}
          target={project.liveDemoUrl ? "_blank" : undefined}
          rel={project.liveDemoUrl ? "noopener noreferrer" : undefined}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0D1527] hover:bg-[#1E293B] text-white font-semibold text-xs transition-all active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <span>Live Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} source code on GitHub`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>View Code</span>
          </a>
        ) : (
          <Link
            href={primaryTargetUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>View Details</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        )}
      </div>
    </article>
  );
}
