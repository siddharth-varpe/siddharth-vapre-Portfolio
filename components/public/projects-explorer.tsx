"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Check, Layers } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { GithubIcon } from "@/components/public/icons";
import type { ProjectDocument } from "@/types/models";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  BodyText,
} from "@/components/ui";

interface ProjectsExplorerProps {
  projects: ProjectDocument[];
}

type CategoryFilter = "All" | "Enterprise" | "Full-Stack" | "AI & ML";

const CATEGORY_TABS: { label: CategoryFilter; match: (p: ProjectDocument) => boolean }[] = [
  {
    label: "All",
    match: () => true,
  },
  {
    label: "Enterprise",
    match: (p) => p.category.toLowerCase().includes("enterprise"),
  },
  {
    label: "Full-Stack",
    match: (p) =>
      p.category.toLowerCase().includes("full-stack") ||
      p.category.toLowerCase().includes("web platform"),
  },
  {
    label: "AI & ML",
    match: (p) => p.category.toLowerCase().includes("ai"),
  },
];

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [activeFilter, setActiveFilter] = React.useState<CategoryFilter>("All");
  const shouldReduceMotion = Boolean(useReducedMotion());

  const filteredProjects = React.useMemo(() => {
    const currentTab = CATEGORY_TABS.find((tab) => tab.label === activeFilter);
    if (!currentTab) return projects;
    return projects.filter(currentTab.match);
  }, [projects, activeFilter]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      All: projects.length,
      Enterprise: 0,
      "Full-Stack": 0,
      "AI & ML": 0,
    };
    for (const p of projects) {
      if (p.category.toLowerCase().includes("enterprise")) counts["Enterprise"]++;
      if (
        p.category.toLowerCase().includes("full-stack") ||
        p.category.toLowerCase().includes("web platform")
      ) {
        counts["Full-Stack"]++;
      }
      if (p.category.toLowerCase().includes("ai")) counts["AI & ML"]++;
    }
    return counts;
  }, [projects]);

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div
          role="tablist"
          aria-label="Filter engineering projects by domain"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeFilter === tab.label;
            const count = categoryCounts[tab.label] || 0;
            return (
              <button
                key={tab.label}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.label)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-200 border ${
                  isActive
                    ? "bg-accent/15 border-accent text-accent font-semibold shadow-sm"
                    : "bg-surface/50 border-border text-foreground-muted hover:border-border-hover hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? "bg-accent/20 text-accent font-bold"
                      : "bg-surface-muted text-foreground-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="font-mono text-xs text-foreground-muted flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-accent" />
          <span>
            SHOWING {filteredProjects.length} OF {projects.length} PRODUCTION REPOSITORIES
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center max-w-xl mx-auto space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            No projects match the &ldquo;{activeFilter}&rdquo; filter
          </h3>
          <BodyText className="text-sm text-muted-foreground">
            Try selecting a different domain category or reset to view all published engineering case studies.
          </BodyText>
          <button
            onClick={() => setActiveFilter("All")}
            className="mt-2 text-xs font-mono text-accent hover:underline inline-block"
          >
            ← Reset to All Projects
          </button>
        </div>
      ) : (
        <motion.div
          layout={!shouldReduceMotion}
          className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const coverImage =
                project.media?.find((m) => m.type === "image" || !m.type)?.url ||
                project.coverImage;

              return (
                <motion.div
                  key={project.slug}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.35,
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                  }}
                  className="h-full flex"
                >
                  <Card
                    className="w-full flex flex-col justify-between bg-surface/90 border-border hover:border-border-hover transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-md p-0"
                  >
                    <div>
                      {/* Visual Preview / Thumbnail */}
                      {coverImage && (
                        <div className="relative aspect-video w-full overflow-hidden bg-surface-muted border-b border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            loading={index < 4 ? "eager" : "lazy"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

                          <div className="absolute top-2.5 right-2.5">
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-background/90 backdrop-blur-md border border-border text-accent">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                              <span>{project.liveDemoUrl ? "LIVE" : "SYSTEM"}</span>
                            </span>
                          </div>
                        </div>
                      )}

                      <CardHeader className="space-y-2 pt-4 px-4 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                            {project.category || "Full-Stack"}
                          </span>
                          {project.year && (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {project.year}
                            </span>
                          )}
                        </div>

                        <CardTitle className="text-base font-bold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-1">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
                          >
                            {project.title}
                          </Link>
                        </CardTitle>

                        <CardDescription className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">
                          {project.shortDescription}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 px-4 pb-3">
                        {/* High-Impact Highlights if present */}
                        {project.metrics && project.metrics.length > 0 && (
                          <div className="rounded border border-border/70 bg-surface-muted/30 p-2 space-y-1">
                            {project.metrics.slice(0, 2).map((metric, mIdx) => (
                              <div
                                key={mIdx}
                                className="flex items-center gap-1.5 font-mono text-[11px] text-foreground"
                              >
                                <Check className="w-3 h-3 text-accent flex-shrink-0" />
                                <span className="truncate" title={metric}>
                                  {metric}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Technology Badges */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <Badge key={tech} variant="neutral" className="text-[10px] px-1.5 py-0">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 4 && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                +{project.technologies.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </div>

                    <CardFooter className="flex items-center justify-between pt-3 pb-3 px-4 border-t border-border/60">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-xs font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm transition-transform group-hover:translate-x-0.5"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* External links: ONLY rendered if verified */}
                      <div className="flex items-center gap-1.5">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-surface-muted border border-transparent hover:border-border"
                            aria-label={`View ${project.title} source code on GitHub`}
                            title="View GitHub Repository"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span className="sr-only">GitHub</span>
                          </a>
                        )}
                        {project.liveDemoUrl && (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-surface-muted border border-transparent hover:border-border"
                            aria-label={`View live demo of ${project.title}`}
                            title="View Live Platform"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="sr-only">Live Demo</span>
                          </a>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
