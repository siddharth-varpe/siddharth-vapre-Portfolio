"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import type { ProjectDocument } from "@/types/models";
import { AnimatedProjectCard, type CardPositionState } from "./animated-project-card";

interface ProjectShowcaseProps {
  projects: ProjectDocument[];
  className?: string;
  autoPlayInterval?: number; // defaults to 2000ms
}

export function ProjectShowcase({
  projects,
  className = "",
  autoPlayInterval = 2000,
}: ProjectShowcaseProps) {
  // Deterministically find the initial index (prioritize featured project if present, e.g. campus-buddy)
  const initialIndex = React.useMemo(() => {
    if (!projects || projects.length === 0) return 0;
    const campusIdx = projects.findIndex(
      (p) => (p.slug === "campus-buddy" || p.title.toLowerCase().includes("campus")) && p.featured
    );
    if (campusIdx !== -1) return campusIdx;
    const featIdx = projects.findIndex((p) => p.featured);
    return featIdx !== -1 ? featIdx : 0;
  }, [projects]);

  const [activeIndex, setActiveIndex] = React.useState<number>(initialIndex);
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = React.useState<boolean>(false);
  const [isInView, setIsInView] = React.useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean>(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const touchStartCoords = React.useRef<{ x: number; y: number } | null>(null);
  const mouseStartX = React.useRef<number | null>(null);
  const lastWheelTime = React.useRef<number>(0);

  const total = projects.length;

  // Clamp activeIndex whenever projects list length changes
  React.useEffect(() => {
    if (total === 0) return;
    if (activeIndex >= total) {
      setActiveIndex(0);
    }
  }, [total, activeIndex]);

  // Reduced motion preference check
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Page visibility listener
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // IntersectionObserver to pause auto-play when scrolled out of view
  React.useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Navigation handlers with seamless wrapping
  const handlePrev = React.useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = React.useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handleGoToIndex = (index: number) => {
    if (index >= 0 && index < total) {
      setActiveIndex(index);
    }
  };

  // Continuous smooth auto-play: cycles rapidly every autoPlayInterval (pausing only during active drag or tab hide)
  React.useEffect(() => {
    if (
      total <= 1 ||
      isDragging ||
      isTabHidden ||
      !isInView ||
      prefersReducedMotion
    ) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [
    total,
    isDragging,
    isTabHidden,
    isInView,
    prefersReducedMotion,
    autoPlayInterval,
    handleNext,
  ]);

  // Touch & Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartCoords.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartCoords.current || e.touches.length !== 1) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartCoords.current) {
      setIsDragging(false);
      return;
    }
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartCoords.current.x;
    const deltaY = endY - touchStartCoords.current.y;

    // Require minimum 40px horizontal swipe
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartCoords.current = null;
    setIsDragging(false);
  };

  // Desktop Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    mouseStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Active dragging tracking
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const deltaX = e.clientX - mouseStartX.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    mouseStartX.current = null;
    setIsDragging(false);
  };

  // Smooth mouse wheel & horizontal trackpad gesture scrolling
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 20) {
      lastWheelTime.current = now;
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Empty state handling
  if (total === 0) {
    return (
      <div className="w-full py-12 px-4 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
        <Layers className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          No projects available in this view.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
        mouseStartX.current = null;
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full flex flex-col items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-3xl cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* ========================================================================= */}
      {/* 3D PERSPECTIVE SHOWCASE STACK                                             */}
      {/* ========================================================================= */}
      <div
        style={{ perspective: "1400px" }}
        className="relative w-full h-[400px] xs:h-[430px] sm:h-[460px] md:h-[480px] lg:h-[560px] xl:h-[610px] flex items-center justify-center overflow-visible"
      >
        {projects.map((project, index) => {
          // Circular diff relative to activeIndex
          let diff = index - activeIndex;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          // Categorize state
          let state: CardPositionState = "hidden";
          if (diff === 0) state = "active";
          else if (diff === -1) state = "prev";
          else if (diff === 1) state = "next";
          else if (diff < -1) state = "farPrev";
          else if (diff > 1) state = "farNext";

          // Calculate deterministic 3D transform and styling
          const isCurrent = diff === 0;
          const isPrev = diff === -1;
          const isNext = diff === 1;
          const isFarPrev = diff < -1;
          const isFarNext = diff > 1;

          // Responsive transform values matching the exact reference tilt (+6.5deg) and diagonal trajectory
          let transformStyle = "";
          let opacity = 0;
          let zIndex = 0;

          if (isCurrent) {
            transformStyle = "translate3d(0, 0, 35px) scale(1) rotateZ(-3deg)";
            opacity = 1;
            zIndex = 30;
          } else if (isPrev) {
            transformStyle =
              "translate3d(calc(-1 * min(175px, 44%)), 10px, -35px) scale(0.86) rotateZ(-6deg)";
            opacity = 0.85;
            zIndex = 20;
          } else if (isNext) {
            transformStyle =
              "translate3d(min(175px, 44%), 10px, -35px) scale(0.86) rotateZ(-1deg)";
            opacity = 0.85;
            zIndex = 20;
          } else if (isFarPrev) {
            transformStyle =
              "translate3d(calc(-1 * min(330px, 76%)), 20px, -80px) scale(0.72) rotateZ(-7deg)";
            opacity = 0.4;
            zIndex = 10;
          } else if (isFarNext) {
            transformStyle =
              "translate3d(min(330px, 76%), 20px, -80px) scale(0.72) rotateZ(1deg)";
            opacity = 0.4;
            zIndex = 10;
          } else {
            transformStyle = "translate3d(0, 0, -200px) scale(0.5)";
            opacity = 0;
            zIndex = 0;
          }

          // Do not render cards that are too far in larger datasets
          if (Math.abs(diff) > 2) {
            return null;
          }

          return (
            <div
              key={project.id}
              style={{
                transform: transformStyle,
                opacity,
                zIndex,
                transition: prefersReducedMotion
                  ? "none"
                  : "transform 750ms cubic-bezier(0.25, 1, 0.5, 1), opacity 750ms cubic-bezier(0.25, 1, 0.5, 1), z-index 750ms ease",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <AnimatedProjectCard
                project={project}
                state={state}
                onClick={() => handleGoToIndex(index)}
                priority={isCurrent}
              />
            </div>
          );
        })}

        {/* Circular Left Chevron Navigation Button (Dark circle matching reference) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project in showcase"
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D1527] hover:bg-[#1E293B] text-white shadow-lg flex items-center justify-center transition-all active:scale-95 z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        )}

        {/* Circular Right Chevron Navigation Button (Dark circle matching reference) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project in showcase"
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D1527] hover:bg-[#1E293B] text-white shadow-lg flex items-center justify-center transition-all active:scale-95 z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PAGINATION PILL INDICATORS (Exact match to reference [ — ] [ • ] [ • ])  */}
      {/* ========================================================================= */}
      {total > 1 && (
        <div
          role="tablist"
          aria-label="Project showcase slides"
          className="flex items-center justify-center gap-1.5 pt-3 pb-1"
        >
          {projects.map((p, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Jump to project ${idx + 1} of ${total}: ${p.title}`}
                onClick={() => handleGoToIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected
                    ? "w-6 sm:w-7 h-1 bg-blue-600 dark:bg-blue-500"
                    : "w-1.5 h-1.5 bg-blue-200/80 dark:bg-slate-700 hover:bg-blue-300"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
