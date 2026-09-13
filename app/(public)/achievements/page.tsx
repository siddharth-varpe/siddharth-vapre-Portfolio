import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, ExternalLink, ArrowRight } from "lucide-react";
import { getPublishedAchievements } from "@/lib/server/db/repositories/content";
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
  title: "Achievements & Honors | Siddharth Varpe",
  description:
    "Competitive engineering recognitions, prompt engineering awards, and academic distinctions of Siddharth Varpe.",
  pathname: "/achievements",
});

export default async function AchievementsPage() {
  const achievements = await getPublishedAchievements();

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Achievements", path: "/achievements" }]);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="AWARDS & COMPETITIONS"
        title="Verified Distinctions"
        description="Official competitive engineering recognitions, university hackathon placements, and technical honors."
        action={
          <Link href="/certifications">
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>View Certifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      />

      <Container size="public" className="space-y-10">
        {achievements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center max-w-xl mx-auto space-y-3">
            <TechnicalLabel>DISTINCTION NOTICE</TechnicalLabel>
            <h3 className="text-base font-semibold text-foreground">Achievements Catalog In Progress</h3>
            <BodyText className="text-sm text-foreground-muted">
              Published honors and recognitions are currently being synchronized from the verified portfolio repository.
            </BodyText>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((item) => (
              <Card
                key={item.title + item.date}
                className="bg-surface/85 border-border shadow-md flex flex-col justify-between"
              >
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <Badge variant="accent" className="font-mono text-xs">
                        {item.rank || "Award Winner"}
                      </Badge>
                    </div>

                    <span className="font-mono text-xs text-foreground-muted">{item.date}</span>
                  </div>

                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {item.title}
                    </CardTitle>
                    {item.organization && (
                      <span className="text-xs font-mono text-foreground-muted block mt-1">
                        {item.organization}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  <BodyText className="text-sm text-foreground-secondary leading-relaxed">
                    {item.description}
                  </BodyText>

                  {item.verificationUrl && (
                    <div className="pt-2 border-t border-border/60">
                      <a
                        href={item.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                      >
                        <span>View Verification Record</span>
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
