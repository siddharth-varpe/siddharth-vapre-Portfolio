import * as React from "react";
import { Container, TechnicalLabel, Badge } from "@/components/ui";
import { HeroCtaButton } from "../hero-cta";
import type { PageHeroConfig } from "@/types/models";
import { cn } from "@/lib/utils";

interface CredentialsHeroProps {
  config: PageHeroConfig;
  className?: string;
  children?: React.ReactNode;
}

export function CredentialsHeroVariant({ config, className, children }: CredentialsHeroProps) {
  return (
    <section className={cn("w-full border-b border-border/70 py-10 sm:py-14 lg:py-16", className)}>
      <Container size="full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
          {/* Main Info */}
          <div className="space-y-4 sm:space-y-5 max-w-3xl">
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
              <p className="text-sm sm:text-base lg:text-lg text-foreground-secondary leading-relaxed">
                {config.description}
              </p>
            )}

            {(config.primaryCta || config.secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <HeroCtaButton cta={config.primaryCta} defaultVariant="outline" />
                <HeroCtaButton cta={config.secondaryCta} defaultVariant="ghost" />
              </div>
            )}
          </div>

          {/* Stats if available */}
          {config.stats && config.stats.length > 0 && (
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 pt-2 lg:pt-0">
              {config.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-lg bg-surface/40 border border-border/60 min-w-[130px] space-y-0.5"
                >
                  <div className="text-xs font-mono text-foreground-muted">{stat.label}</div>
                  <div className="text-lg font-bold font-mono text-foreground">{stat.value}</div>
                  {stat.description && (
                    <div className="text-[11px] text-foreground-muted">{stat.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {children}
      </Container>
    </section>
  );
}
