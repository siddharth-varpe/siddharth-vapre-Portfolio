"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { ProjectDocument } from "@/types/models";
import { Badge, TechnicalLabel } from "@/components/ui";
import { SpotlightCard } from "@/components/motion";

interface FeaturedProjectsSliderProps {
  projects: ProjectDocument[];
}

const SLIDE_INTERVAL_MS = 5000; // Calm 5-second interval for autoscroll

export function FeaturedProjectsSlider({ projects }: FeaturedProjectsSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [isInViewport, setIsInViewport] = React.useState(true);
  const [isTabVisible, setIsTabVisible] = React.useState(true);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const pointerStartXRef = React.useRef<number | null>(null);
  const pointerStartYRef = React.useRef<number | null>(null);
  const pointerDiffXRef = React.useRef<number>(0);
  const pointerDiffYRef = React.useRef<number>(0);
  const isDraggingRef = React.useRef(false);
  const interactionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const shouldReduceMotion = Boolean(useReducedMotion());
  const count = projects.length;

  // Safe navigation helpers (wrapping around)
  const nextSlide = React.useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = React.useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Mark user interaction and temporarily pause auto-slide briefly during active touch/drag
  const registerInteraction = React.useCallback(() => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2500);
  }, []);

  // Track browser tab visibility
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Track viewport visibility with IntersectionObserver
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Clean up interaction timer on unmount
  React.useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Continuous Auto-advance interval
  React.useEffect(() => {
    if (
      shouldReduceMotion ||
      isInteracting ||
      !isInViewport ||
      !isTabVisible ||
      count <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [shouldReduceMotion, isInteracting, isInViewport, isTabVisible, count]);

  // Pointer gesture handling (pan-y preserved for native vertical scrolling)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    registerInteraction();
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    pointerDiffXRef.current = 0;
    pointerDiffYRef.current = 0;
    isDraggingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || pointerStartXRef.current === null || pointerStartYRef.current === null) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    pointerDiffXRef.current = currentX - pointerStartXRef.current;
    pointerDiffYRef.current = currentY - pointerStartYRef.current;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current || pointerStartXRef.current === null) return;
    isDraggingRef.current = false;
    const diffX = pointerDiffXRef.current;
    const diffY = pointerDiffYRef.current;

    // Detect if primary gesture was horizontal and passed threshold (40px)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
    pointerDiffXRef.current = 0;
    pointerDiffYRef.current = 0;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      registerInteraction();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      registerInteraction();
      nextSlide();
    }
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  const activeProject = projects[currentIndex];
  const coverImage =
    activeProject?.media?.find((m) => m.type === "image" || !m.type)?.url ||
    activeProject?.coverImage;

  return (
    <div
      ref={containerRef}
      className="w-full relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Projects Showcase"
    >
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (lg: and above): Approved side-by-side editorial showcase    */}
      {/* Strictly preserves the approved desktop identity & aesthetics              */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid grid-cols-2 gap-8 pt-4">
        {projects.slice(0, 2).map((project) => {
          const img =
            project.media?.find((m) => m.type === "image" || !m.type)?.url ||
            project.coverImage;

          return (
            <SpotlightCard key={project.slug} className="rounded-lg h-full">
              <article className="group flex flex-col justify-between border border-border/80 bg-surface/40 hover:border-border-hover transition-all duration-300 overflow-hidden h-full rounded-lg">
                {img && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-border/80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${project.title} — Software Architecture & Case Study Overview`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-mono bg-background/90 text-foreground border border-border/80 backdrop-blur-md">
                        {project.year || "2026"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-foreground-muted">
                      <TechnicalLabel>{project.category || "Full-Stack System"}</TechnicalLabel>
                      <span className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                        {project.role}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-foreground-secondary leading-relaxed line-clamp-3 font-normal">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <Badge
                            key={tech}
                            variant="neutral"
                            className="text-[11px] font-mono py-0.5 px-2"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <span className="text-[10px] font-mono text-foreground-muted self-center">
                            +{project.technologies.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                        aria-label={`View ${project.title} case study`}
                      >
                        <span>View Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      {project.metrics && project.metrics.length > 0 && (
                        <span className="text-xs font-mono text-emerald-400 font-medium">
                          {project.metrics[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET AUTO-SLIDER (< lg): Touch-Optimized Handheld Showcase      */}
      {/* Smooth slide transitions, touch swipe, accessible controls, stable height */}
      {/* ========================================================================= */}
      <div className="block lg:hidden pt-2">
        {/* Slider Card Container with Pan-Y to allow fluid vertical scrolling */}
        <div
          className="relative overflow-hidden rounded-xl border border-border/80 bg-surface/60 shadow-lg touch-pan-y select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Active Project Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.slug}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: 24 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -24 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                ease: "easeOut",
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Project ${currentIndex + 1} of ${count}: ${activeProject.title}`}
              className="flex flex-col min-w-0"
            >
              {/* Cover Image Plane */}
              {coverImage && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-border/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={`${activeProject.title} screenshot`}
                    className="w-full h-full object-cover object-top"
                    loading={currentIndex === 0 ? "eager" : "lazy"}
                  />
                  {/* Subtle gradient dissolution */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-background/90 text-accent border border-border/80 backdrop-blur-md font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span>FEATURED</span>
                    </span>

                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-background/90 text-foreground border border-border/80 backdrop-blur-md">
                      {activeProject.year || "2026"}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted">
                    <TechnicalLabel>{activeProject.category || "Full-Stack"}</TechnicalLabel>
                    <span className="text-[10px] text-foreground-subtle uppercase tracking-wider truncate max-w-[130px]">
                      {activeProject.role}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug line-clamp-1">
                    {activeProject.title}
                  </h3>

                  <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-2 font-normal">
                    {activeProject.shortDescription}
                  </p>
                </div>

                {/* Tech Pills & Verified Outcome */}
                <div className="space-y-3 pt-1">
                  {activeProject.technologies && activeProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {activeProject.technologies.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          variant="neutral"
                          className="text-[10px] font-mono py-0.5 px-2"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {activeProject.technologies.length > 4 && (
                        <span className="text-[9px] font-mono text-foreground-muted self-center px-1">
                          +{activeProject.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Primary CTA + Impact Metric */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <Link
                      href={`/projects/${activeProject.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover min-h-[44px] px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                      aria-label={`Read case study for ${activeProject.title}`}
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {activeProject.metrics && activeProject.metrics.length > 0 && (
                      <span className="text-xs font-mono text-emerald-400 font-medium truncate max-w-[140px] text-right">
                        {activeProject.metrics[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Screen Reader Live Region Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing project {currentIndex + 1} of {count}: {activeProject.title}
        </div>
      </div>
    </div>
  );
}
