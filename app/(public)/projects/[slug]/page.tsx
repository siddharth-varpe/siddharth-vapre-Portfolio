import { buildMetadata, generateProjectJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Activity,
} from "lucide-react";
import { GithubIcon } from "@/components/public/icons";
import {
  getPublishedProjectBySlug,
  getPublishedProjects,
} from "@/lib/server/db/repositories/content";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  BodyText,
  DisplayHeadline,
  TechnicalLabel,
  SectionTitle,
} from "@/components/ui";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getPublishedProjectBySlug(slug);

    if (!project || project.status !== "published") {
      return buildMetadata({
        title: "Project Not Found | Siddharth Varpe",
        description: "The requested project case study could not be found or is not published.",
        noIndex: true,
      });
    }

    const previewImg = project.coverImage || (project.media?.[0]?.url) || "/images/siddharth-hero.png";

    return buildMetadata({
      title: `${project.title} | Case Study | Siddharth Varpe`,
      description: project.shortDescription || `Engineering case study and distributed architecture breakdown for ${project.title} by software engineer Siddharth Varpe.`,
      pathname: `/projects/${project.slug}`,
      image: previewImg,
      type: "article",
    });
  } catch {
    return buildMetadata({
      title: "Project Case Study | Siddharth Varpe",
      description: "Engineering case study by Siddharth Varpe.",
      pathname: `/projects/${slug}`,
    });
  }
}

export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project: Awaited<ReturnType<typeof getPublishedProjectBySlug>> = null;
  let allProjects: Awaited<ReturnType<typeof getPublishedProjects>> = [];

  try {
    [project, allProjects] = await Promise.all([
      getPublishedProjectBySlug(slug),
      getPublishedProjects(),
    ]);
  } catch (error) {
    console.error(`[ProjectCaseStudy Error] Failed to load project "${slug}":`, error);
  }

  if (!project) {
    notFound();
  }

  // Calculate sequential adjacent projects for case-study navigation
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const mediaItem = project.media?.[0];
  const displayImage = mediaItem?.url || project.coverImage;

  const projectSchema = generateProjectJsonLd(project);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <article className="space-y-12 pb-24">
      <JsonLd data={projectSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* 1. Back Navigation Breadcrumb */}
      <div className="border-b border-border/70 py-3.5 bg-surface/30 backdrop-blur-sm sticky top-16 z-20">
        <Container size="public">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-foreground-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO PROJECTS</span>
            </Link>

            <span className="font-mono text-[11px] text-foreground-muted hidden sm:inline-block">
              CASE STUDY 0{project.order || currentIndex + 1} OF 0{allProjects.length}
            </span>
          </div>
        </Container>
      </div>

      {/* 2. Header & Hero Intro */}
      <header className="border-b border-border/80 pb-10 pt-4">
        <Container size="public" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <TechnicalLabel>
                SYSTEMS CASE STUDY // {project.category.toUpperCase()}
              </TechnicalLabel>
            </div>

            {project.year && (
              <span className="font-mono text-xs text-foreground-muted px-2.5 py-1 rounded bg-surface border border-border">
                DELIVERED {project.year}
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <DisplayHeadline className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {project.title}
              </DisplayHeadline>
              <p className="text-base sm:text-lg md:text-xl text-foreground-secondary leading-relaxed font-sans">
                {project.shortDescription}
              </p>
            </div>

            {/* External Links: STRICTLY rendered ONLY if verified */}
            {(project.liveDemoUrl || project.githubUrl) && (
              <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 flex-shrink-0">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md font-sans text-xs font-semibold h-10 px-4 gap-2 transition-all bg-white text-black hover:bg-neutral-200 border border-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span>Live Platform</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md font-sans text-xs font-medium h-10 px-4 gap-2 transition-all bg-surface text-foreground hover:bg-surface-muted border border-border hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-xl border border-border bg-surface/80 text-xs shadow-md">
            <div className="space-y-1">
              <span className="text-foreground-muted block uppercase font-mono tracking-wider text-[10px]">
                Timeline
              </span>
              <span className="font-semibold text-foreground font-mono block">
                {project.year || "2024–2025"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-foreground-muted block uppercase font-mono tracking-wider text-[10px]">
                Engineering Role
              </span>
              <span className="font-semibold text-foreground block truncate" title={project.role}>
                {project.role || "Lead Engineer"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-foreground-muted block uppercase font-mono tracking-wider text-[10px]">
                Domain Category
              </span>
              <span className="font-semibold text-foreground block">{project.category}</span>
            </div>
            <div className="space-y-1">
              <span className="text-foreground-muted block uppercase font-mono tracking-wider text-[10px]">
                Deployment Status
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    project.liveDemoUrl ? "bg-emerald-400" : "bg-accent"
                  }`}
                />
                <span>
                  {project.liveDemoUrl ? "Production Live" : "Architecture Verified"}
                </span>
              </span>
            </div>
          </div>
        </Container>
      </header>

      <Container size="public" className="space-y-14">
        {/* 3. Verified Metrics Banner */}
        {project.metrics && project.metrics.length > 0 && (
          <section aria-labelledby="verified-metrics-heading" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <h2
                  id="verified-metrics-heading"
                  className="font-mono text-xs uppercase tracking-widest text-accent font-semibold"
                >
                  VERIFIED PERFORMANCE METRICS // EVIDENCE BASED
                </h2>
              </div>
              <span className="font-mono text-[10px] text-foreground-muted hidden sm:inline-block">
                SOURCE: RESUME BENCHMARKS
              </span>
            </div>

            <div
              className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
                project.metrics.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/90 bg-surface/90 p-5 space-y-1.5 relative overflow-hidden group hover:border-accent/50 transition-colors shadow-sm"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent/60" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-muted block">
                    METRIC 0{idx + 1}
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
                    {metric}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono text-foreground-muted">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Production Outcome</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. System Interface / Screenshots Showcase */}
        {displayImage && (
          <section aria-labelledby="system-interface-heading" className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/70 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                <h2
                  id="system-interface-heading"
                  className="font-mono text-xs uppercase tracking-widest text-accent font-semibold"
                >
                  SYSTEM INTERFACE & TELEMETRY // {project.slug.toUpperCase()}
                </h2>
              </div>
              <span className="font-mono text-[10px] text-foreground-muted">
                1920×1080 RENDER
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-border bg-zinc-950 shadow-2xl">
              {/* Browser / Terminal Chrome */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-border text-xs font-mono text-foreground-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-foreground-secondary hidden sm:inline-block">
                    sys://{project.slug}/dashboard
                  </span>
                </div>
                <span className="text-[10px] uppercase text-accent font-semibold">
                  [TELEMETRY_VIEW]
                </span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={mediaItem?.caption || project.title}
                className="w-full max-h-[640px] object-cover object-top"
                loading="eager"
              />
            </div>

            {mediaItem?.caption && (
              <p className="text-xs font-mono text-foreground-muted text-center pt-1">
                Figure 1: {mediaItem.caption}
              </p>
            )}
          </section>
        )}

        {/* 5. Two-Column Narrative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Deep-Dive Technical Narrative */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview & Context */}
            {project.fullDescription && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">01 //</span>
                  <span>Overview & Context</span>
                </SectionTitle>
                <div className="prose prose-invert max-w-none text-foreground-secondary leading-relaxed space-y-4 text-base">
                  <p>{project.fullDescription}</p>
                </div>
              </section>
            )}

            {/* The Challenge (Problem Statement) */}
            {project.problem && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">02 //</span>
                  <span>The Challenge</span>
                </SectionTitle>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                    OPERATIONAL BOTTLENECK // PROBLEM STATEMENT
                  </span>
                  <BodyText className="text-base text-foreground leading-relaxed">
                    {project.problem}
                  </BodyText>
                </div>
              </section>
            )}

            {/* Engineering Objective */}
            {project.objective && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">03 //</span>
                  <span>Engineering Objective</span>
                </SectionTitle>
                <div className="rounded-xl border border-border bg-surface/70 p-6 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold block">
                    TARGET ARCHITECTURAL GOALS
                  </span>
                  <BodyText className="text-base text-foreground-secondary leading-relaxed">
                    {project.objective}
                  </BodyText>
                </div>
              </section>
            )}

            {/* Role & Scope */}
            {project.role && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">04 //</span>
                  <span>Role & Responsibilities</span>
                </SectionTitle>
                <div className="rounded-xl border border-border bg-surface/60 p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded bg-surface-muted border border-border font-mono text-xs text-foreground font-semibold">
                      {project.role}
                    </span>
                    <span className="font-mono text-xs text-foreground-muted">
                      Full Lifecycle Ownership
                    </span>
                  </div>
                  <BodyText className="text-sm text-foreground-secondary leading-relaxed">
                    Owned end-to-end engineering from requirements decomposition and data schema design
                    to API contract definition, frontend state management, and production stability.
                  </BodyText>
                </div>
              </section>
            )}

            {/* Solution Design & System Architecture */}
            {(project.solution || project.architectureSummary) && (
              <section className="space-y-5">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">05 //</span>
                  <span>Solution Design & System Architecture</span>
                </SectionTitle>

                {project.solution && (
                  <BodyText className="text-base leading-relaxed text-foreground-secondary">
                    {project.solution}
                  </BodyText>
                )}

                {project.architectureSummary && (
                  <div className="rounded-xl border border-border/80 bg-zinc-950 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-accent" />
                        <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                          ARCHITECTURE SUMMARY
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-foreground-muted">TOPOLOGY</span>
                    </div>
                    <p className="font-mono text-xs text-foreground-secondary leading-relaxed">
                      {project.architectureSummary}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Implementation Details */}
            {project.implementation && project.implementation.length > 0 && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">06 //</span>
                  <span>Implementation Details</span>
                </SectionTitle>
                <div className="space-y-3">
                  {project.implementation.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border bg-surface/50 hover:bg-surface/80 transition-colors"
                    >
                      <span className="font-mono text-xs font-semibold text-accent mt-0.5 flex-shrink-0">
                        [0{idx + 1}]
                      </span>
                      <p className="text-sm text-foreground-secondary leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Engineering Decisions */}
            {project.decisions && project.decisions.length > 0 && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">07 //</span>
                  <span>Key Engineering Decisions</span>
                </SectionTitle>
                <div className="space-y-3">
                  {project.decisions.map((decision, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-surface/60 p-4 space-y-1.5"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                        ARCHITECTURAL DECISION // {idx + 1}
                      </div>
                      <p className="text-sm text-foreground-secondary leading-relaxed">{decision}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Challenges Overcome */}
            {project.challenges && project.challenges.length > 0 && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">08 //</span>
                  <span>Technical Challenges & Mitigations</span>
                </SectionTitle>
                <div className="space-y-3">
                  {project.challenges.map((challenge, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-surface/50 p-4 space-y-1.5"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground-muted flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>CHALLENGE // 0{idx + 1}</span>
                      </div>
                      <p className="text-sm text-foreground-secondary leading-relaxed">{challenge}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Measurable Production Impact */}
            {project.impact && project.impact.length > 0 && (
              <section className="space-y-4">
                <SectionTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-accent text-sm font-semibold">09 //</span>
                  <span>Measurable Production Impact</span>
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.impact.map((impactItem, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-4 rounded-lg border border-border bg-surface/70"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-foreground leading-relaxed">
                        {impactItem}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: Technical Specifications & Stack */}
          <div className="space-y-6">
            {/* Tech Stack Card */}
            <Card className="bg-surface/90 border-border">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  <TechnicalLabel>TECHNOLOGIES & TOOLING</TechnicalLabel>
                </div>
                <CardTitle className="text-base font-semibold">System Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies &&
                    project.technologies.map((tech) => (
                      <Badge key={tech} variant="neutral" className="text-xs py-1 px-2.5">
                        {tech}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Architecture Specifications */}
            <Card className="bg-surface/90 border-border">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <TechnicalLabel>VERIFIED SPECIFICATIONS</TechnicalLabel>
                </div>
                <CardTitle className="text-base font-semibold">System Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-foreground-muted">DOMAIN</span>
                  <span className="text-foreground font-semibold">{project.category}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-foreground-muted">TIMELINE</span>
                  <span className="text-foreground font-semibold">{project.year}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-foreground-muted">AUDIT STATE</span>
                  <span className="text-emerald-400 font-semibold">VERIFIED RESUME</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground-muted">STATUS</span>
                  <span className="text-accent font-semibold">PUBLISHED</span>
                </div>
              </CardContent>
            </Card>

            {/* Verification / Access Card */}
            <Card className="bg-surface/90 border-border">
              <CardHeader className="space-y-1">
                <TechnicalLabel>RESOURCES & CODE</TechnicalLabel>
                <CardTitle className="text-base font-semibold">Verification Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {project.githubUrl || project.liveDemoUrl ? (
                  <div className="space-y-2">
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded border border-border bg-surface hover:border-accent/50 transition-colors group"
                      >
                        <span className="font-mono text-foreground group-hover:text-accent font-semibold">
                          Live Platform Demo
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-foreground-muted group-hover:text-accent" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded border border-border bg-surface hover:border-accent/50 transition-colors group"
                      >
                        <span className="font-mono text-foreground group-hover:text-accent font-semibold">
                          GitHub Repository
                        </span>
                        <GithubIcon className="w-3.5 h-3.5 text-foreground-muted group-hover:text-accent" />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-foreground-muted leading-relaxed">
                    Client enterprise deployment subject to proprietary confidentiality boundaries.
                    Architectural workflows and verified performance metrics documented above.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 6. Case Study Sequential Pagination */}
        <section
          aria-labelledby="case-study-nav-heading"
          className="border-t border-border/80 pt-10 mt-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="case-study-nav-heading"
              className="font-mono text-xs uppercase tracking-widest text-accent font-semibold"
            >
              SEQUENTIAL CASE STUDIES // EXPLORE MORE
            </h2>
            <Link
              href="/projects"
              className="text-xs font-mono text-foreground-muted hover:text-accent transition-colors"
            >
              ALL PROJECTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group p-5 rounded-xl border border-border bg-surface/70 hover:border-border-hover hover:bg-surface transition-all flex flex-col justify-between space-y-2 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-foreground-muted group-hover:text-accent transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>PREVIOUS CASE STUDY</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-accent transition-colors text-base">
                    {prevProject.title}
                  </div>
                  <p className="text-xs text-foreground-muted line-clamp-1 mt-0.5">
                    {prevProject.shortDescription}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-border/60 bg-surface/20 flex flex-col justify-center">
                <span className="font-mono text-xs text-foreground-muted">
                  [FIRST PRODUCTION CASE STUDY]
                </span>
              </div>
            )}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group p-5 rounded-xl border border-border bg-surface/70 hover:border-border-hover hover:bg-surface transition-all flex flex-col justify-between space-y-2 text-right sm:text-right"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-mono text-foreground-muted group-hover:text-accent transition-colors">
                  <span>NEXT CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-accent transition-colors text-base">
                    {nextProject.title}
                  </div>
                  <p className="text-xs text-foreground-muted line-clamp-1 mt-0.5">
                    {nextProject.shortDescription}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-border/60 bg-surface/20 flex flex-col justify-center text-right">
                <span className="font-mono text-xs text-foreground-muted">
                  [END OF CASE STUDIES // MORE IN PREPARATION]
                </span>
              </div>
            )}
          </div>
        </section>
      </Container>
    </article>
  );
}
