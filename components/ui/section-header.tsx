import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionTitle, Subtext, TechnicalLabel } from "./typography";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Reusable Section Header primitive establishing visual hierarchy across public and admin pages.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="max-w-2xl space-y-2">
        {eyebrow && <TechnicalLabel>{eyebrow}</TechnicalLabel>}
        <SectionTitle>{title}</SectionTitle>
        {description && <Subtext className="text-base">{description}</Subtext>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
