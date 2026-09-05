import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "draft"
  | "published"
  | "archived"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: string;
  showDot?: boolean;
}

/**
 * Semantic Status Indicator combining dot indicator and text label.
 * Ensures accessibility by never relying on color alone.
 */
export function StatusIndicator({
  status,
  label,
  showDot = true,
  className,
  ...props
}: StatusIndicatorProps) {
  const statusConfig: Record<
    StatusType,
    { dotColor: string; defaultLabel: string; badgeClasses: string }
  > = {
    published: {
      dotColor: "bg-success",
      defaultLabel: "Published",
      badgeClasses: "text-success border-success/30 bg-success/10",
    },
    draft: {
      dotColor: "bg-warning",
      defaultLabel: "Draft",
      badgeClasses: "text-warning border-warning/30 bg-warning/10",
    },
    archived: {
      dotColor: "bg-foreground-subtle",
      defaultLabel: "Archived",
      badgeClasses: "text-foreground-muted border-border bg-surface-muted",
    },
    success: {
      dotColor: "bg-success",
      defaultLabel: "Active / Success",
      badgeClasses: "text-success border-success/30 bg-success/10",
    },
    warning: {
      dotColor: "bg-warning",
      defaultLabel: "Warning",
      badgeClasses: "text-warning border-warning/30 bg-warning/10",
    },
    error: {
      dotColor: "bg-error",
      defaultLabel: "Error",
      badgeClasses: "text-error border-error/30 bg-error/10",
    },
    info: {
      dotColor: "bg-accent",
      defaultLabel: "Info",
      badgeClasses: "text-accent border-accent/30 bg-accent/10",
    },
  };

  const config = statusConfig[status];
  const displayText = label || config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium",
        config.badgeClasses,
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotColor)}
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
    </span>
  );
}
