import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/public/icons";
import { Container, TechnicalLabel, Badge } from "@/components/ui";
import type { ProjectDocument, PageHeroConfig } from "@/types/models";
import { cn } from "@/lib/utils";

interface ProjectDetailHeroProps {
  project: ProjectDocument;
  config?: PageHeroConfig;
  currentIndex?: number;
  totalProjects?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ProjectDetailHeroVariant({
  project,
  currentIndex = 0,
  totalProjects = 0,
  className,
  children,
}: ProjectDetailHeroProps) {
  const liveUrl = project.liveDemoUrl;
  const githubUrl = project.githubUrl;

  return (
    <div className={cn("space-y-6 sm:space-y-8", className)}>
      {/* 1. Back Navigation Breadcrumb */}
      <div className="w-full border-b border-border/70 py-2.5 sm:py-3.5 bg-surface/30 backdrop-blur-sm sticky top-14 sm:top-16 z-20">
        <Container size="full">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-foreground-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO PROJECTS</span>
            </Link>

            {totalProjects > 0 && (
              <span className="font-mono text-[11px] text-foreground-muted hidden sm:inline-block">
                CASE STUDY 0{project.order || currentIndex + 1} OF 0{totalProjects}
              </span>
            )}
          </div>
        </Container>
      </div>

      {/* 2. Hero Presentation */}
      <header className="w-full border-b border-border/80 pb-8 sm:pb-12 pt-2 sm:pt-4">
        <Container size="full" className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <TechnicalLabel>
                SYSTEMS CASE STUDY // {project.category.toUpperCase()}
              </TechnicalLabel>
            </div>

            {project.year && (
              <Badge variant="outline" className="font-mono text-xs">
                {project.year} PRODUCTION RELEASE
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12] max-w-4xl">
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="text-base sm:text-lg md:text-xl text-foreground-secondary max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <span>Launch Live System</span>
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-medium bg-surface/50 text-foreground hover:bg-surface-muted border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <GithubIcon className="w-4 h-4 mr-1.5 text-accent" />
                <span>Source Architecture</span>
              </a>
            )}
          </div>

          {/* Technology badges */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-surface-muted/60 border border-border/70 text-foreground-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {children}
        </Container>
      </header>
    </div>
  );
}
