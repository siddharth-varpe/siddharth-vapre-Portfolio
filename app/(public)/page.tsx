import { buildMetadata, generatePersonJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  Code2,
  ChevronRight,
  Award,
} from "lucide-react";
import {
  getPublishedProfile,
  getPublishedHero,
  getPublishedMetrics,
  getPublishedProjects,
  getPublishedExperience,
} from "@/lib/server/db/repositories/content";
import {
  Container,
  BodyText,
  Button,
  Badge,
  SectionHeader,
  TechnicalLabel,
} from "@/components/ui";
import { HeroSection } from "@/components/public";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  SpotlightCard,
  AnimatedDivider,
} from "@/components/motion";

export const metadata: Metadata = buildMetadata({
  title: "Siddharth Varpe | Software Engineer | AI & Full-Stack",
  description:
    "Personal portfolio and proof-of-work platform for Siddharth Varpe — Full-Stack Software Engineer specializing in production-grade CRM and inventory systems, distributed architectures, and AI-assisted engineering.",
  pathname: "/",
});

/**
 * Public Home Page (Phase 8 — Master Design Direction Reset).
 *
 * DEFINITIVE VISUAL DIRECTION: Dark Systems / Technical Editorial
 * - Expansive desktop canvas (max-w-screen-2xl) with controlled text measure
 * - Asymmetric, one-piece editorial hero composition
 * - Future professional visual asset slot (pre-calibrated architectural zone)
 * - Open, horizontal evidence ribbon (no "card soup")
 * - High-density editorial project previews
 * - Zero fake telemetry; strictly authentic verified resume evidence
 */
export default async function HomePage() {
  const [profile, hero, metrics, projects, experiences] = await Promise.all([
    getPublishedProfile(),
    getPublishedHero(),
    getPublishedMetrics(),
    getPublishedProjects(),
    getPublishedExperience(),
  ]);

  const eyebrow = hero?.eyebrow || "SOFTWARE ENGINEER";
  const headline =
    hero?.headline || profile?.tagline || "Building Real Solutions with Code, AI and Impact.";
  const description =
    hero?.description ||
    profile?.summary ||
    "Full-Stack Software Engineer with experience building production-grade CRM and inventory systems. Skilled in JavaScript, React.js, Node.js, Python, PostgreSQL, and REST APIs, with hands-on AI-powered application development.";

  const availability = profile?.availability || "Available for Software Engineering roles";

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);
  const primaryExperience = experiences[0];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      <JsonLd data={generatePersonJsonLd(profile)} />
      {/* ========================================================================= */}
      {/* 1. HIGH-FIDELITY TECHNICAL EDITORIAL HERO SECTION                         */}
      {/* Matches reference screenshot with approved portrait image & atmospheric depth */}
      {/* ========================================================================= */}
      <HeroSection
        eyebrow={eyebrow}
        headline={headline}
        description={description}
        availability={availability}
        primaryCtaText={hero?.ctaLabel || "View My Work"}
        primaryCtaLink={hero?.ctaUrl || "/projects"}
        secondaryCtaText="Download Resume"
        secondaryCtaLink="/api/resume/download"
      />


      {/* ========================================================================= */}
      {/* 2. MEASURABLE BUSINESS IMPACT (OPEN EDITORIAL EVIDENCE RIBBON)             */}
      {/* Card reduction: Open horizontal evidence strip with hairline dividers      */}
      {/* Strictly verified metrics from resume/projects; zero fake telemetry        */}
      {/* ========================================================================= */}
      {metrics && metrics.length > 0 && (
        <section className="space-y-8">
          <Container size="public">
            <Reveal>
              <SectionHeader
                eyebrow="EVIDENCE &amp; OUTCOMES"
                title="Measurable Business Impact"
                description="Verifiable performance improvements and operational scale delivered across production software implementations."
              />
            </Reveal>

            {/* Expansive Horizontal Evidence Ribbon */}
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-y border-border/80 py-8">
              {metrics.map((metric, idx) => (
                <StaggerItem
                  key={idx}
                  className="flex flex-col justify-between space-y-3 lg:border-l lg:border-border/60 lg:first:border-l-0 lg:pl-6 lg:first:pl-0"
                >
                  <div className="space-y-1.5">
                    <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground block">
                      {metric.value}
                    </span>
                    <span className="text-sm font-semibold text-foreground tracking-wide block">
                      {metric.label}
                    </span>
                  </div>

                  {metric.supportingText && (
                    <span className="text-xs text-foreground-muted leading-relaxed block">
                      {metric.supportingText}
                    </span>
                  )}

                  {metric.context && (
                    <span className="text-[11px] font-mono text-accent/90 block uppercase tracking-wider pt-1">
                      {metric.context}
                    </span>
                  )}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Container>
        </section>
      )}

      {/* Subtle technical editorial divider */}
      <Container size="public">
        <AnimatedDivider />
      </Container>

      {/* ========================================================================= */}
      {/* 4. FEATURED PROJECTS PREVIEW (OPEN EDITORIAL SHOWCASE)                    */}
      {/* Structured whitespace, high visual fidelity, clear problem/solution/impact */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <Container size="public">
          <Reveal>
            <SectionHeader
              eyebrow="FEATURED IMPLEMENTATIONS"
              title="Production Software Projects"
              description="Selected enterprise platforms and systems engineered for high throughput, data integrity, and operational efficiency."
              action={
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-accent hover:text-accent-hover">
                    <span>Explore All Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              }
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6">
            {featuredProjects.map((project) => {
              const coverImage =
                project.media?.find((m) => m.type === "image" || !m.type)?.url ||
                project.coverImage;

              return (
                <SpotlightCard key={project.slug} className="rounded-lg h-full">
                  <article
                    className="group flex flex-col justify-between border border-border/80 bg-surface/40 hover:border-border-hover transition-all duration-300 overflow-hidden h-full rounded-lg"
                  >
                    {/* Screenshot Visual Plane */}
                    {coverImage && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-border/80">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono bg-background/90 text-foreground border border-border/80 backdrop-blur-md">
                            {project.year || "2026"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Editorial Body */}
                    <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-foreground-muted">
                          <TechnicalLabel>{project.category || "Full-Stack System"}</TechnicalLabel>
                          <span className="text-[11px] text-foreground-subtle uppercase tracking-wider">
                            {project.role}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-sm text-foreground-secondary leading-relaxed line-clamp-3 font-normal">
                          {project.shortDescription}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* Technology pills */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 5).map((tech) => (
                              <Badge key={tech} variant="neutral" className="text-[11px] font-mono">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 5 && (
                              <span className="text-[10px] font-mono text-foreground-muted self-center">
                                +{project.technologies.length - 5}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer: Action + Verified Impact */}
                        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                          >
                            <span>View Case Study</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>

                          {project.metrics && project.metrics.length > 0 && (
                            <span className="text-xs font-mono text-emerald-400 font-medium">
                              {project.metrics[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </SpotlightCard>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. PROFESSIONAL TRACK RECORD & EXPERIENCE SNAPSHOT                        */}
      {/* Open editorial presentation with timeline datum; verified metrics         */}
      {/* ========================================================================= */}
      {primaryExperience && (
        <section className="space-y-8">
          <Container size="public">
            <Reveal>
              <div className="border border-border/80 bg-surface/30 p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
                  <div className="space-y-1">
                    <TechnicalLabel>PROFESSIONAL TRACK RECORD</TechnicalLabel>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {primaryExperience.role} <span className="text-foreground-muted font-normal">at</span>{" "}
                      {primaryExperience.company}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full font-semibold">
                      {primaryExperience.startDate} – {primaryExperience.endDate || "Present"}
                    </span>
                    <Link href="/experience">
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <span>Full Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <BodyText className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-normal">
                      {primaryExperience.description}
                    </BodyText>

                    {primaryExperience.responsibilities && (
                      <ul className="space-y-2.5 text-xs sm:text-sm text-foreground-secondary">
                        {primaryExperience.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-accent mt-1 shrink-0 font-bold">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-4 p-5 border border-border/70 bg-background/50">
                    <TechnicalLabel>Stack Applied</TechnicalLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {primaryExperience.technologies.map((tech) => (
                        <Badge key={tech} variant="neutral" className="text-xs font-mono">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-border/60 text-xs text-foreground-muted">
                      Location: <span className="text-foreground font-medium">{primaryExperience.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. CAPABILITIES & VERIFIED DISTINCTIONS (SKILLS & AWARDS GATEWAY)         */}
      {/* Open 2-column editorial split; zero card soup                             */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <Container size="public">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Capability Editorial Block */}
              <div className="border border-border/80 bg-surface/30 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-accent">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Technical Taxonomy</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Categorized skills across React.js, Next.js, Node.js, Python, PostgreSQL, and REST/WebSocket architectures.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Badge variant="neutral">React.js</Badge>
                    <Badge variant="neutral">Next.js</Badge>
                    <Badge variant="neutral">Node.js</Badge>
                    <Badge variant="neutral">Python</Badge>
                    <Badge variant="neutral">FastAPI</Badge>
                    <Badge variant="neutral">PostgreSQL</Badge>
                    <Badge variant="neutral">WebSockets</Badge>
                    <Badge variant="neutral">Git</Badge>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <Link
                    href="/skills"
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Explore Full Skill Catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Distinctions & Awards Editorial Block */}
              <div className="border border-border/80 bg-surface/30 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Verified Distinctions</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    1st &amp; 2nd Rank University Awards in Prompt Engineering, plus verified NxtWave certifications.
                  </p>

                  <div className="space-y-2.5 text-xs pt-2">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="font-semibold text-foreground">
                        Prompt Engineering — 1st Rank (ADYPU)
                      </span>
                      <span className="font-mono text-accent">2025</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        Prompt Engineering — 2nd Rank (Technovanza)
                      </span>
                      <span className="font-mono text-accent">2025</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <Link
                    href="/achievements"
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>View Honors &amp; Certifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 7. CALL TO ACTION / CONTACT GATEWAY                                       */}
      {/* Expansive editorial closing statement                                     */}
      {/* ========================================================================= */}
      <section className="relative pt-4">
        <Container size="public">
          <Reveal>
            <div className="border border-border/90 bg-surface/60 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
              <div className="space-y-3 max-w-xl mx-auto">
                <TechnicalLabel>OPEN FOR OPPORTUNITIES</TechnicalLabel>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                  Ready to engineer high-impact systems together.
                </h3>
                <BodyText className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-normal">
                  Whether you are hiring for full-stack software engineering roles, distributed systems, or AI application development, let&apos;s connect.
                </BodyText>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/contact">
                  <Button variant="primary" size="lg" className="gap-2">
                    <span>Get in Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a
                  href="/api/resume/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download verified resume PDF"
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    <Download className="w-4 h-4 text-accent" />
                    <span>Download Resume PDF</span>
                  </Button>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
