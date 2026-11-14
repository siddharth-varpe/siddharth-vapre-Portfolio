import * as React from "react";
import { Container, TechnicalLabel, Badge } from "@/components/ui";
import { HeroCtaButton } from "../hero-cta";
import type { PageHeroConfig } from "@/types/models";
import { cn } from "@/lib/utils";

interface TechnicalHeroProps {
  config: PageHeroConfig;
  className?: string;
  children?: React.ReactNode;
}

export function TechnicalHeroVariant({ config, className, children }: TechnicalHeroProps) {
  return (
    <section className={cn("w-full border-b border-border/70 py-10 sm:py-14 lg:py-16", className)}>
      <Container size="full">
        <div className="space-y-4 sm:space-y-6 max-w-4xl">
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

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            {config.title}
          </h1>

          {config.description && (
            <p className="text-sm sm:text-base lg:text-lg text-foreground-secondary leading-relaxed max-w-3xl">
              {config.description}
            </p>
          )}

          {/* Quick Domain Indicator Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-foreground-muted">
            <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
              Frontend Engineering
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Distributed Backend
            </span>
            <span className="px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent">
              Applied AI &amp; ML
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
              Systems &amp; DevOps
            </span>
          </div>

          {(config.primaryCta || config.secondaryCta) && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <HeroCtaButton cta={config.primaryCta} defaultVariant="outline" />
              <HeroCtaButton cta={config.secondaryCta} defaultVariant="ghost" />
            </div>
          )}

          {children}
        </div>
      </Container>
    </section>
  );
}
