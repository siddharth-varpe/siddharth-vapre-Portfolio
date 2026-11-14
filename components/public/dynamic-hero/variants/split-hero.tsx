import * as React from "react";
import { Container, TechnicalLabel, Badge } from "@/components/ui";
import { HeroCtaButton } from "../hero-cta";
import type { PageHeroConfig } from "@/types/models";
import { cn } from "@/lib/utils";

interface SplitHeroProps {
  config: PageHeroConfig;
  className?: string;
  children?: React.ReactNode;
}

export function SplitHeroVariant({ config, className, children }: SplitHeroProps) {
  return (
    <section className={cn("w-full border-b border-border/70 py-10 sm:py-14 lg:py-16", className)}>
      <Container size="full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
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
              <p className="text-sm sm:text-base lg:text-lg text-foreground-secondary leading-relaxed max-w-2xl">
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

          {/* Right Column: Evidence Stats Ribbon */}
          {config.stats && config.stats.length > 0 && (
            <div className="lg:col-span-5 bg-surface/40 border border-border/70 rounded-xl p-5 sm:p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="font-mono text-[11px] uppercase tracking-wider text-foreground-muted">
                  OPERATIONAL EVIDENCE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 divide-y sm:divide-y-0 lg:divide-y divide-border/60">
                {config.stats.map((stat, idx) => (
                  <div key={idx} className={cn("space-y-0.5", idx > 0 ? "pt-3 sm:pt-0 lg:pt-3" : "")}>
                    <div className="text-xl sm:text-2xl font-bold text-foreground font-mono tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-foreground-secondary">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-[11px] text-foreground-muted">
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {children}
      </Container>
    </section>
  );
}
