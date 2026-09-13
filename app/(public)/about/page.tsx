import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowRight, Globe } from "lucide-react";
import { getPublishedAbout, getPublishedProfile } from "@/lib/server/db/repositories/content";
import { PageIntro } from "@/components/public/page-intro";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  BodyText,
  TechnicalLabel,
  Badge,
  Button,
} from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "About | Siddharth Varpe — Software Engineer",
  description:
    "Professional background, engineering philosophy, and problem-solving mindset of Siddharth Varpe — Full-Stack Software Engineer.",
  pathname: "/about",
});

export default async function AboutPage() {
  const [about, profile] = await Promise.all([
    getPublishedAbout(),
    getPublishedProfile(),
  ]);
  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "About", path: "/about" }]);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="BIOGRAPHY & PHILOSOPHY"
        title="About Siddharth Varpe"
        description="Full-stack software engineer focused on building production systems that eliminate operational friction and deliver measurable business outcomes."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/experience">
              <Button variant="primary" size="sm" className="gap-1.5">
                <span>View Career Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download resume PDF"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="w-3.5 h-3.5 text-accent" />
                <span>Resume PDF</span>
              </Button>
            </a>
          </div>
        }
      />

      <Container size="public" className="space-y-16">
        {/* Core Narrative & Developer Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Story (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <TechnicalLabel>ENGINEERING MINDSET & BACKGROUND</TechnicalLabel>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Engineering with clarity, discipline, and measurable outcomes.
              </h2>
              <BodyText className="text-base leading-relaxed text-foreground-secondary">
                {about?.primaryDescription ||
                  "Full-Stack Software Engineer with experience building production-grade CRM and inventory systems. Skilled in JavaScript, React.js, Node.js, Python, PostgreSQL, and REST APIs, with hands-on AI-powered application development."}
              </BodyText>
              {about?.supportingDescription && (
                <BodyText className="text-base leading-relaxed text-foreground-secondary">
                  {about.supportingDescription}
                </BodyText>
              )}
            </div>

            {/* Philosophy Banner */}
            {about?.philosophy && (
              <div className="p-6 rounded-xl border border-accent/30 bg-accent/5 space-y-2">
                <TechnicalLabel className="text-accent">CORE PRINCIPLE</TechnicalLabel>
                <p className="text-base font-medium text-foreground italic leading-relaxed">
                  &ldquo;{about.philosophy}&rdquo;
                </p>
              </div>
            )}

            {/* Technical Areas of Interest */}
            {about?.interests && about.interests.length > 0 && (
              <div className="space-y-3 pt-2">
                <TechnicalLabel>CORE FOCUS AREAS & PASSIONS</TechnicalLabel>
                <div className="flex flex-wrap gap-2">
                  {about.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="neutral"
                      className="px-3 py-1 text-xs font-mono"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Identity & Technical Credentials Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-border/80 bg-surface/40 p-6 space-y-5">
              <div className="space-y-1.5 border-b border-border/70 pb-4">
                <TechnicalLabel>VERIFIED IDENTITY DOSSIER</TechnicalLabel>
                <h3 className="text-xl font-bold text-foreground">Siddharth Varpe</h3>
                <span className="text-xs font-mono text-foreground-muted block">
                  {profile?.title || "Software Engineer | AI & Full-Stack"}
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-foreground-muted block font-mono uppercase text-[10px] tracking-wider">
                    Base Location
                  </span>
                  <span className="text-foreground font-medium">
                    {profile?.location || "Pune, Maharashtra, India"}
                  </span>
                </div>

                <div>
                  <span className="text-foreground-muted block font-mono uppercase text-[10px] tracking-wider">
                    Availability Status
                  </span>
                  <span className="text-emerald-400 font-medium inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{profile?.availability || "Available for software engineering roles"}</span>
                  </span>
                </div>

                <div>
                  <span className="text-foreground-muted block font-mono uppercase text-[10px] tracking-wider">
                    Direct Channel
                  </span>
                  <a
                    href="mailto:siddharth.varpe0@gmail.com"
                    className="text-accent hover:underline break-all font-mono"
                  >
                    siddharth.varpe0@gmail.com
                  </a>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <span className="text-foreground-muted block font-mono uppercase text-[10px] tracking-wider mb-1">
                    Primary Disciplines
                  </span>
                  <span className="text-foreground-secondary leading-relaxed">
                    Full-Stack Systems · CRM Platforms · Python &amp; FastAPI · Prompt Engineering
                  </span>
                </div>
              </div>
            </div>

            {/* Spoken Languages Card */}
            <Card className="bg-surface/80 border-border p-4 space-y-3">
              <TechnicalLabel className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span>COMMUNICATION LANGUAGES</span>
              </TechnicalLabel>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">English</span>
                  <span className="font-mono text-foreground-muted">Professional Working</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Marathi</span>
                  <span className="font-mono text-accent font-semibold">Native / Bilingual</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Hindi</span>
                  <span className="font-mono text-foreground-muted">Limited Working</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Core Architectural Pillars */}
        {about?.cards && about.cards.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-border/80">
            <div className="space-y-1">
              <TechnicalLabel>FOUNDATIONS OF PRACTICE</TechnicalLabel>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Architectural Pillars
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {about.cards.map((card, idx) => (
                <Card key={idx} className="bg-surface/70 border-border p-5 space-y-3">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base font-bold text-foreground">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <BodyText className="text-xs text-foreground-secondary leading-relaxed">
                      {card.description}
                    </BodyText>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
