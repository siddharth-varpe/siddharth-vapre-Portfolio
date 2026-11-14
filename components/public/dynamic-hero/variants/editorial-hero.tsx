import * as React from "react";
import { Container, TechnicalLabel, Badge } from "@/components/ui";
import { HeroCtaButton } from "../hero-cta";
import type { PageHeroConfig } from "@/types/models";
import { cn } from "@/lib/utils";

interface EditorialHeroProps {
  config: PageHeroConfig;
  className?: string;
  children?: React.ReactNode;
}

export function EditorialHeroVariant({ config, className, children }: EditorialHeroProps) {
  return (
    <section className={cn("w-full border-b border-border/70 py-12 sm:py-16 lg:py-20", className)}>
      <Container size="full" className="space-y-6 sm:space-y-8">
        {/* Eyebrow & Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          {config.eyebrow && (
            <TechnicalLabel className="text-accent text-[11px] sm:text-xs tracking-wider">
              {config.eyebrow}
            </TechnicalLabel>
          )}
          {config.badge && (
            <Badge variant="outline" className="font-mono text-[10px]">
              {config.badge}
            </Badge>
          )}
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15] max-w-3xl">
          {config.title}
        </h1>

        {/* Description */}
        {config.description && (
          <p
            data-testid="about-intro-description"
            className="text-base sm:text-lg lg:text-xl text-foreground-secondary leading-relaxed max-w-2xl"
          >
            {config.description}
          </p>
        )}

        {/* CTAs */}
        {(config.primaryCta || config.secondaryCta) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <HeroCtaButton cta={config.primaryCta} defaultVariant="primary" />
            <HeroCtaButton cta={config.secondaryCta} defaultVariant="outline" />
          </div>
        )}

        {children}
      </Container>
    </section>
  );
}
