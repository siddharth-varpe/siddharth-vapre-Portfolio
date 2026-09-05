import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "outline" | "success" | "warning" | "error";
}

/**
 * Technical Badge/Tag primitive for technologies, categories, and state labels.
 * Retains a restrained monospace aesthetic without colorful visual clutter.
 */
export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    neutral:
      "bg-surface-muted text-foreground-secondary border-border hover:bg-surface-subtle",
    accent:
      "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
    outline:
      "bg-transparent text-foreground-muted border-border hover:text-foreground",
    success:
      "bg-success/10 text-success border-success/20",
    warning:
      "bg-warning/10 text-warning border-warning/20",
    error:
      "bg-error/10 text-error border-error/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-medium transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
