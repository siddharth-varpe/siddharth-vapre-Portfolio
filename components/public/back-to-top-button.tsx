"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopButtonProps {
  className?: string;
}

export function BackToTopButton({ className }: BackToTopButtonProps) {
  const handleClick = () => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to top of page"
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 rounded-full",
        "bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/80 hover:text-white",
        "border border-white/15 hover:border-white/30 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1322]",
        className
      )}
    >
      <ChevronUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
