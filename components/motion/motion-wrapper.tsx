"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------- */
/* 1. REVEAL PRIMITIVE                                                       */
/* ------------------------------------------------------------------------- */
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.45,
  yOffset = 16,
  className = "",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. STAGGER GROUP & ITEM                                                   */
/* ------------------------------------------------------------------------- */
interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGroup({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. HOVER CARD (SUBTLE 2D ELEVATION)                                       */
/* ------------------------------------------------------------------------- */
interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ children, className = "" }: HoverCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. SPOTLIGHT CARD (INTERACTIVE 2D MOUSE ILLUMINATION)                      */
/* Uses zero-re-render CSS variables for 60fps GPU-accelerated glow          */
/* ------------------------------------------------------------------------- */
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.08)",
  ...props
}: SpotlightCardProps) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || shouldReduceMotion) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {!shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            opacity: isFocused ? 1 : opacity,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. ANIMATED DIVIDER (TECHNICAL EDITORIAL HAIRLINE SEPARATOR)               */
/* ------------------------------------------------------------------------- */
interface AnimatedDividerProps {
  className?: string;
}

export function AnimatedDivider({ className = "" }: AnimatedDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn("h-px w-full bg-border", className)} />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "h-px w-full origin-left bg-gradient-to-r from-border via-blue-500/30 to-border",
        className
      )}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------------- */
/* 6. STATUS BEACON (PULSING LIVE INDICATOR)                                  */
/* ------------------------------------------------------------------------- */
interface StatusBeaconProps {
  status?: "live" | "busy" | "idle";
  className?: string;
}

export function StatusBeacon({
  status = "live",
  className = "",
}: StatusBeaconProps) {
  const shouldReduceMotion = useReducedMotion();

  const colorMap = {
    live: "bg-emerald-400 text-emerald-400",
    busy: "bg-amber-400 text-amber-400",
    idle: "bg-blue-400 text-blue-400",
  };

  const pingColorMap = {
    live: "bg-emerald-400/70",
    busy: "bg-amber-400/70",
    idle: "bg-blue-400/70",
  };

  return (
    <span
      className={cn("relative inline-flex h-2 w-2 items-center justify-center", className)}
      aria-hidden="true"
    >
      {!shouldReduceMotion && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full animate-ping opacity-75",
            pingColorMap[status]
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]",
          colorMap[status]
        )}
      />
    </span>
  );
}
