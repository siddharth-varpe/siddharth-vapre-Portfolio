import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, ExternalLink, Download } from "lucide-react";
import { getPublishedCertifications } from "@/lib/server/db/repositories/content";
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
  title: "Certifications & Credentials | Siddharth Varpe",
  description:
    "Formal engineering certifications in UI/UX Design, Responsive Web Design, and Database Management Systems (DBMS) earned by Siddharth Varpe.",
  pathname: "/certifications",
});

export default async function CertificationsPage() {
  const certifications = await getPublishedCertifications();

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Certifications", path: "/certifications" }]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-14 sm:pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="CREDENTIALS & LICENSES"
        title="Technical Certifications"
        description="Formal training certifications and demonstrated engineering competencies in UI/UX, responsive systems, and relational databases."
        action={
          <a
            href="/api/resume/download"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download resume with verified credentials"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4 text-accent" />
              <span>Download Full Resume</span>
            </Button>
          </a>
        }
      />

      <Container size="public" className="space-y-8 sm:space-y-10">
        {certifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3">
            <TechnicalLabel>CREDENTIAL NOTICE</TechnicalLabel>
            <h3 className="text-base font-semibold text-foreground">Certifications Catalog In Progress</h3>
            <BodyText className="text-sm text-foreground-muted">
              Published technical credentials are currently being synchronized from the verified portfolio repository.
            </BodyText>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {certifications.map((cert) => (
              <Card
                key={cert.name + cert.issuer}
                className="bg-surface/85 border-border shadow-md flex flex-col justify-between p-3.5 sm:p-6 min-w-0"
              >
                <CardHeader className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="p-1 sm:p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <Badge variant="outline" className="text-[9px] sm:text-[11px] font-mono px-1.5 py-0">
                        {cert.issuer}
                      </Badge>
                    </div>

                    <span className="font-mono text-[10px] sm:text-xs text-foreground-muted">{cert.date}</span>
                  </div>

                  <CardTitle className="text-sm sm:text-lg font-bold text-foreground line-clamp-2 leading-snug">
                    {cert.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2.5 sm:space-y-4 pt-1">
                  {cert.description && (
                    <BodyText className="text-xs sm:text-sm text-foreground-secondary leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {cert.description}
                    </BodyText>
                  )}

                  {cert.credentialId && (
                    <div className="text-xs font-mono text-foreground-muted pt-2 border-t border-border/60">
                      Credential ID: <span className="text-foreground">{cert.credentialId}</span>
                    </div>
                  )}

                  {cert.credentialUrl && (
                    <div className="pt-2 border-t border-border/60">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
