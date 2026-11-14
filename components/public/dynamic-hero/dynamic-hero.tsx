import * as React from "react";
import type { PageHeroConfig, ProjectDocument } from "@/types/models";
import { DEFAULT_PAGE_HEROES } from "@/lib/server/db/default-page-heroes";
import { EditorialHeroVariant } from "./variants/editorial-hero";
import { SplitHeroVariant } from "./variants/split-hero";
import { ShowcaseHeroVariant } from "./variants/showcase-hero";
import { ProjectDetailHeroVariant } from "./variants/project-detail-hero";
import { TechnicalHeroVariant } from "./variants/technical-hero";
import { EvidenceHeroVariant } from "./variants/evidence-hero";
import { CredentialsHeroVariant } from "./variants/credentials-hero";
import { ConversionHeroVariant } from "./variants/conversion-hero";

export interface DynamicHeroProps {
  pageKey?: string;
  config?: PageHeroConfig | null;
  project?: ProjectDocument;
  currentIndex?: number;
  totalProjects?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DynamicHero({
  pageKey,
  config: configProp,
  project,
  currentIndex,
  totalProjects,
  className,
  children,
}: DynamicHeroProps) {
  // If rendering project_detail variant with actual project record
  if (project) {
    return (
      <ProjectDetailHeroVariant
        project={project}
        config={configProp || undefined}
        currentIndex={currentIndex}
        totalProjects={totalProjects}
        className={className}
      >
        {children}
      </ProjectDetailHeroVariant>
    );
  }

  const effectiveConfig: PageHeroConfig =
    configProp ||
    (pageKey && DEFAULT_PAGE_HEROES[pageKey]) || {
      pageKey: pageKey || "generic",
      enabled: true,
      variant: "showcase",
      title: "Software Engineering Portfolio",
      description: "Production software systems, distributed architectures, and AI tooling.",
    };

  // If administrator disabled this hero from CMS
  if (effectiveConfig.enabled === false) {
    return children ? <>{children}</> : null;
  }

  switch (effectiveConfig.variant) {
    case "editorial":
      return (
        <EditorialHeroVariant config={effectiveConfig} className={className}>
          {children}
        </EditorialHeroVariant>
      );
    case "split":
      return (
        <SplitHeroVariant config={effectiveConfig} className={className}>
          {children}
        </SplitHeroVariant>
      );
    case "showcase":
      return (
        <ShowcaseHeroVariant config={effectiveConfig} className={className}>
          {children}
        </ShowcaseHeroVariant>
      );
    case "technical":
      return (
        <TechnicalHeroVariant config={effectiveConfig} className={className}>
          {children}
        </TechnicalHeroVariant>
      );
    case "evidence":
      return (
        <EvidenceHeroVariant config={effectiveConfig} className={className}>
          {children}
        </EvidenceHeroVariant>
      );
    case "credentials":
      return (
        <CredentialsHeroVariant config={effectiveConfig} className={className}>
          {children}
        </CredentialsHeroVariant>
      );
    case "conversion":
      return (
        <ConversionHeroVariant config={effectiveConfig} className={className}>
          {children}
        </ConversionHeroVariant>
      );
    default:
      return (
        <ShowcaseHeroVariant config={effectiveConfig} className={className}>
          {children}
        </ShowcaseHeroVariant>
      );
  }
}
