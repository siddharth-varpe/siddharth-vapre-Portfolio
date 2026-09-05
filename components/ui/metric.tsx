import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  description?: string;
  indicator?: React.ReactNode;
}

/**
 * Proof-of-work Metric presentation primitive.
 * Formats impactful numerical evidence, performance numbers, or scale indicators
 * with high editorial contrast and restrained technical aesthetics.
 */
export function Metric({
  value,
  label,
  description,
  indicator,
  className,
  ...props
}: MetricProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-surface p-5 sm:p-6",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {value}
        </span>
        {indicator && <div className="text-accent">{indicator}</div>}
      </div>
      <span className="mt-2 text-sm font-medium text-foreground-secondary">
        {label}
      </span>
      {description && (
        <span className="mt-1 text-xs text-foreground-muted leading-relaxed">
          {description}
        </span>
      )}
    </div>
  );
}
