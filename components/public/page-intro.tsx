import * as React from "react";
import { Container, DisplayHeadline, BodyText, TechnicalLabel } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  metadata?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable Page Introduction Primitive (Phase 7 Public Shell).
 * Establishes consistent visual hierarchy, editorial typography,
 * and optional action/metadata anchors across all public routes.
 */
export function PageIntro({
  eyebrow,
  title,
  description,
  action,
  metadata,
  className,
  children,
}: PageIntroProps) {
  return (
    <div className={cn("border-b border-border/80 pb-8 pt-6 sm:pb-12 sm:pt-10", className)}>
      <Container size="public" className="space-y-4">
        {eyebrow && (
          <div>
            <TechnicalLabel>{eyebrow}</TechnicalLabel>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 max-w-3xl">
            <DisplayHeadline className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {title}
            </DisplayHeadline>
            {description && (
              <BodyText className="text-base sm:text-lg text-foreground-secondary leading-relaxed">
                {description}
              </BodyText>
            )}
          </div>

          {action && <div className="flex-shrink-0 pt-2 sm:pt-0">{action}</div>}
        </div>

        {metadata && <div className="pt-2">{metadata}</div>}
        {children}
      </Container>
    </div>
  );
}
