import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { Trophy, ExternalLink } from "lucide-react";
import { getPublishedAchievements, getPageHero } from "@/lib/server/db/repositories/content";
import { DynamicHero } from "@/components/public/dynamic-hero";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  BodyText,
  TechnicalLabel,
  Badge,
} from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Achievements & Honors | Siddharth Varpe",
  description:
    "Competitive engineering recognitions, prompt engineering awards, and academic distinctions of Siddharth Varpe.",
  pathname: "/achievements",
});

export default async function AchievementsPage() {
  const [achievements, pageHero] = await Promise.all([
    getPublishedAchievements(),
    getPageHero("achievements"),
  ]);

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Achievements", path: "/achievements" }]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-14 sm:pb-20">
      <JsonLd data={breadcrumbs} />
      <DynamicHero pageKey="achievements" config={pageHero} />

      <Container size="public" className="space-y-8 sm:space-y-10">
        {achievements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3">
            <TechnicalLabel>DISTINCTION NOTICE</TechnicalLabel>
            <h3 className="text-base font-semibold text-foreground">Achievements Catalog In Progress</h3>
            <BodyText className="text-sm text-foreground-muted">
              Published honors and recognitions are currently being synchronized from the verified portfolio repository.
            </BodyText>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6">
            {achievements.map((item) => (
              <Card
                key={item.title + item.date}
                className="bg-surface/85 border-border shadow-md flex flex-col justify-between p-3.5 sm:p-6 min-w-0"
              >
                <CardHeader className="space-y-2 sm:space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="p-1 sm:p-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <Badge variant="accent" className="font-mono text-[9px] sm:text-xs px-1.5 py-0">
                        {item.rank || "Award Winner"}
                      </Badge>
                    </div>

                    <span className="font-mono text-[10px] sm:text-xs text-foreground-muted">{item.date}</span>
                  </div>

                  <div>
                    <CardTitle className="text-sm sm:text-xl font-bold text-foreground line-clamp-2 leading-snug">
                      {item.title}
                    </CardTitle>
                    {item.organization && (
                      <span className="text-[11px] sm:text-xs font-mono text-foreground-muted block mt-0.5 sm:mt-1 truncate">
                        {item.organization}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2.5 sm:space-y-4 pt-1 sm:pt-2">
                  <BodyText className="text-xs sm:text-sm text-foreground-secondary leading-relaxed line-clamp-3 sm:line-clamp-none">
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
