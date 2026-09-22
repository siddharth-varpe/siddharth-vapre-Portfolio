import { buildMetadata } from "@/lib/seo";
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
  getPublishedContactSettings,
} from "@/lib/server/db/repositories/content";
import {
  Container,
  BodyText,
  Button,
  Badge,
  SectionHeader,
  TechnicalLabel,
} from "@/components/ui";
import { HeroSection, FeaturedProjectsSlider } from "@/components/public";
import { TechIcon } from "@/components/public/tech-icons";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
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
  const [profile, hero, metrics, projects, experiences, contactSettings] = await Promise.all([
    getPublishedProfile(),
    getPublishedHero(),
    getPublishedMetrics(),
    getPublishedProjects(),
    getPublishedExperience(),
    getPublishedContactSettings(),
  ]);

  const eyebrow = hero?.eyebrow || "SOFTWARE ENGINEER";
  const headline =
    hero?.headline || profile?.tagline || "Building Real Solutions with Code, AI and Impact.";
  const description =
    hero?.description ||
    profile?.summary ||
    "Software engineer with experience building production-grade CRM and inventory systems. Specializing in high-throughput full-stack applications, distributed architectures, and AI integrations.";

  const availability = profile?.availability || "Available for Software Engineering roles";

  const featuredProjects = projects.filter((p) => p.featured);
  const primaryExperience = experiences[0];

  const socialLinks = contactSettings
    ? {
        linkedin: contactSettings.linkedinUrl,
        github: contactSettings.githubUrl,
        email: contactSettings.email,
        instagram: contactSettings.instagramUrl,
        twitter: contactSettings.twitterUrl,
      }
    : undefined;

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24 pb-14 sm:pb-20">
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
        socialLinks={socialLinks}
      />

      {/* ========================================================================= */}
      {/* 2. MEASURABLE BUSINESS IMPACT (RESPONSIVE EVIDENCE SYSTEM)                 */}
      {/* Mobile: 2x2 compact grid answering WHAT / HOW MUCH / WHERE                 */}
      {/* Desktop: Expansive horizontal evidence ribbon with hairline dividers       */}
      {/* ========================================================================= */}
      {metrics && metrics.length > 0 && (
        <section className="space-y-5 sm:space-y-8">
          <Container size="public">
            <Reveal>
              <SectionHeader
                eyebrow="EVIDENCE &amp; OUTCOMES"
                title="Measurable Business Impact"
                description="Verifiable performance improvements and operational scale delivered across production software implementations."
              />
            </Reveal>

            {/* Structured Evidence System: 2x2 on Mobile, 4-col on Desktop */}
            <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 pt-4 sm:pt-6 border-y border-border/80 py-4 sm:py-8">
              {metrics.map((metric, idx) => (
                <StaggerItem
                  key={idx}
                  className="flex flex-col justify-between p-3 sm:p-0 rounded-lg sm:rounded-none bg-surface/40 sm:bg-transparent border border-border/60 sm:border-0 lg:border-l lg:border-border/60 lg:first:border-l-0 lg:pl-6 lg:first:pl-0 space-y-2 sm:space-y-3"
                >
                  <div className="space-y-1 sm:space-y-1.5">
                    <span className="font-mono text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground block">
                      {metric.value}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight block leading-snug">
                      {metric.label}
                    </span>
                  </div>

                  {metric.context && (
                    <span className="text-[10px] sm:text-[11px] font-mono text-accent/90 block uppercase tracking-wider pt-0.5 sm:pt-1">
                      {metric.context}
                    </span>
                  )}

                  {metric.supportingText && (
                    <span className="hidden sm:block text-xs text-foreground-muted leading-relaxed">
                      {metric.supportingText}
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
      {/* 3. FEATURED PROJECTS PREVIEW (OPEN EDITORIAL SHOWCASE)                    */}
      {/* Structured whitespace, high visual fidelity, clear problem/solution/impact */}
      {/* ========================================================================= */}
      <section className="space-y-5 sm:space-y-8">
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

          <FeaturedProjectsSlider projects={featuredProjects} />
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROFESSIONAL TRACK RECORD & EXPERIENCE SNAPSHOT                        */}
      {/* Open editorial presentation with timeline datum; verified metrics         */}
      {/* ========================================================================= */}
      {primaryExperience && (
        <section className="space-y-5 sm:space-y-8">
          <Container size="public">
            <Reveal>
              <div className="border border-border/80 bg-surface/30 p-4 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border/70 pb-4 sm:pb-6">
                  <div className="space-y-1">
                    <TechnicalLabel>PROFESSIONAL TRACK RECORD</TechnicalLabel>
                    <h3 className="text-lg sm:text-2xl font-bold text-foreground">
                      {primaryExperience.role} <span className="text-foreground-muted font-normal">at</span>{" "}
                      {primaryExperience.company}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full font-semibold">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="md:col-span-2 space-y-3 sm:space-y-4">
                    <BodyText className="text-xs sm:text-base text-foreground-secondary leading-relaxed font-normal">
                      {primaryExperience.description}
                    </BodyText>

                    {primaryExperience.responsibilities && (
                      <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-foreground-secondary">
                        {primaryExperience.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-accent mt-0.5 shrink-0 font-bold">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 border border-border/70 bg-background/50 rounded-md">
                    <TechnicalLabel>Stack Applied</TechnicalLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {primaryExperience.technologies.map((tech) => (
                        <Badge key={tech} variant="neutral" className="text-xs font-mono">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-2 sm:pt-3 border-t border-border/60 text-xs text-foreground-muted">
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
      {/* 5. CAPABILITIES & VERIFIED DISTINCTIONS (SKILLS & AWARDS GATEWAY)         */}
      {/* Open 2-column editorial split; compact on mobile                          */}
      {/* ========================================================================= */}
      <section className="space-y-5 sm:space-y-8">
        <Container size="public">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Technical Capability Editorial Block */}
              <div className="border border-border/80 bg-surface/30 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 flex flex-col justify-between rounded-lg">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-accent">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Technical Taxonomy</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Categorized skills across React.js, Next.js, Node.js, Python, PostgreSQL, and REST/WebSocket architectures.
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    {[
                      "React.js",
                      "Next.js",
                      "Node.js",
                      "Python",
                      "FastAPI",
                      "PostgreSQL",
                      "WebSockets",
                      "Git",
                    ].map((tech) => (
                      <Badge
                        key={tech}
                        variant="neutral"
                        className="inline-flex items-center gap-1.5 py-0.5 px-2 text-xs"
                      >
                        <TechIcon name={tech} className="w-3.5 h-3.5" />
                        <span>{tech}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3 sm:pt-4">
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
              <div className="border border-border/80 bg-surface/30 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 flex flex-col justify-between rounded-lg">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Verified Distinctions</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    1st &amp; 2nd Rank University Awards in Prompt Engineering, plus verified NxtWave certifications.
                  </p>

                  <div className="space-y-2 text-xs pt-1 sm:pt-2">
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

                <div className="border-t border-border/60 pt-3 sm:pt-4">
                  <Link
                    href="/achievements"
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>View Honors &amp; Certifications</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION / CONTACT GATEWAY                                       */}
      {/* Expansive editorial closing statement                                     */}
      {/* ========================================================================= */}
      <section className="relative pt-2 sm:pt-4">
        <Container size="public">
          <Reveal>
            <div className="border border-border/90 bg-surface/60 p-6 sm:p-10 lg:p-14 text-center space-y-5 sm:space-y-6 relative overflow-hidden rounded-lg">
              <div className="space-y-2.5 sm:space-y-3 max-w-xl mx-auto">
                <TechnicalLabel>OPEN FOR OPPORTUNITIES</TechnicalLabel>
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                  Ready to engineer high-impact systems together.
                </h3>
                <BodyText className="text-xs sm:text-base text-foreground-secondary leading-relaxed font-normal">
                  Whether you are hiring for full-stack software engineering roles, distributed systems, or AI application development, let&apos;s connect.
                </BodyText>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link href="/contact">
                  <Button variant="primary" size="md" className="gap-2 sm:h-11 px-5 text-xs sm:text-sm font-semibold">
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
                  <Button variant="outline" size="md" className="gap-2 sm:h-11 px-5 text-xs sm:text-sm font-semibold">
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
