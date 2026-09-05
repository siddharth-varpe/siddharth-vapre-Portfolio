import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetadataListProps extends React.HTMLAttributes<HTMLDListElement> {
  direction?: "horizontal" | "vertical";
}

/**
 * Technical Metadata List component for organizing project and system properties.
 */
export function MetadataList({
  direction = "horizontal",
  className,
  children,
  ...props
}: MetadataListProps) {
  return (
    <dl
      className={cn(
        "flex flex-wrap gap-4 sm:gap-6",
        direction === "vertical" && "flex-col gap-3",
        className
      )}
      {...props}
    >
      {children}
    </dl>
  );
}

export interface MetadataItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
}

/**
 * Individual Metadata Item with technical monospace label and readable value.
 */
export function MetadataItem({
  label,
  value,
  className,
  ...props
}: MetadataItemProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)} {...props}>
      <dt className="font-mono text-xs text-foreground-subtle uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground-secondary">
        {value}
      </dd>
    </div>
  );
}
