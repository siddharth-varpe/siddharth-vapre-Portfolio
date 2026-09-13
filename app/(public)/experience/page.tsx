import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { Download, TrendingUp } from "lucide-react";
import { getPublishedExperience } from "@/lib/server/db/repositories/content";
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
  title: "Experience & Roles | Siddharth Varpe — Software Engineer",
  description:
    "Chronological engineering roles, enterprise platform implementations, and measurable operational impact delivered by Siddharth Varpe.",
  pathname: "/experience",
});

export default async function ExperiencePage() {
  const experiences = await getPublishedExperience();

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Experience", path: "/experience" }]);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="PROFESSIONAL CAREER TIMELINE"
        title="Engineering Experience"
        description="Chronological record of software engineering roles, enterprise platforms delivered, and measurable operational outcomes."
        action={
          <a
            href="/api/resume/download"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download verified resume PDF"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4 text-accent" />
              <span>Download Official Resume</span>
            </Button>
          </a>
        }
      />

      <Container size="public" className="space-y-10">
        {experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center max-w-xl mx-auto space-y-3">
            <TechnicalLabel>TIMELINE NOTICE</TechnicalLabel>
            <h3 className="text-base font-semibold text-foreground">Experience Catalog In Progress</h3>
            <BodyText className="text-sm text-foreground-muted">
              Published career milestones are currently being synchronized from the verified portfolio repository.
            </BodyText>
          </div>
        ) : (
          <div className="relative border-l border-border/80 pl-6 sm:pl-10 ml-3 sm:ml-6 space-y-12">
            {experiences.map((exp) => (
              <div key={exp.company + exp.role} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-background" />

                <Card className="bg-surface/85 border-border shadow-lg p-2 sm:p-4">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                          {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : exp.current ? "– Present" : ""}
                        </span>
                        {exp.employmentType && (
                          <Badge variant="outline" className="text-[11px] font-mono">
                            {exp.employmentType}
                          </Badge>
                        )}
                      </div>

                      {exp.location && (
                        <span className="text-xs text-foreground-muted font-mono">{exp.location}</span>
                      )}
                    </div>

                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                        {exp.role} <span className="text-foreground-muted font-normal">at</span>{" "}
                        <span className="text-accent">{exp.company}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-2">
                    {exp.description && (
                      <BodyText className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                        {exp.description}
                      </BodyText>
                    )}

                    {/* Measurable Impact Highlights */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="space-y-2.5">
                        <TechnicalLabel className="text-xs">
                          KEY CONTRIBUTIONS & MEASURABLE OUTCOMES
                        </TechnicalLabel>
                        <ul className="space-y-2 text-xs sm:text-sm text-foreground-secondary">
                          {exp.responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="text-accent mt-1 shrink-0 font-bold">•</span>
                              <span className="leading-relaxed">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Verifiable Impact Metrics Tags */}
                    {exp.metrics && exp.metrics.length > 0 && (
                      <div className="space-y-2 p-3.5 rounded-xl border border-border/80 bg-background/50">
                        <TechnicalLabel className="text-[10px] text-foreground-muted flex items-center gap-1.5">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span>VERIFIED METRICS FROM ROLE</span>
                        </TechnicalLabel>
                        <div className="flex flex-wrap gap-2">
                          {exp.metrics.map((m) => (
                            <span
                              key={m}
                              className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-0.5 rounded-md"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technology Stack Applied */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <TechnicalLabel className="text-[10px] text-foreground-muted">
                          TECHNOLOGY STACK APPLIED
                        </TechnicalLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="neutral" className="text-xs font-mono">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
