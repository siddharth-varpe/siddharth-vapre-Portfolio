"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Technical Editorial Reading Scroll Progress Bar.
 * Fixed at the very top edge of the viewport (z-[60]).
 * Uses GPU transform `scaleX` for 60fps performance without triggering browser reflow.
 */
export function ScrollProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-sky-400 to-accent origin-left z-[60] pointer-events-none opacity-80"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
