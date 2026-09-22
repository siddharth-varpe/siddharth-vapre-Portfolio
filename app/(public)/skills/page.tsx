import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Database, Wrench, Sparkles } from "lucide-react";
import { getPublishedSkills } from "@/lib/server/db/repositories/content";
import type { SkillDocument } from "@/types/models";
import { PageIntro } from "@/components/public/page-intro";
import { TechIcon } from "@/components/public/tech-icons";
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
  title: "Skills & Technologies | Siddharth Varpe",
  description:
    "Comprehensive technical taxonomy of languages, distributed backend systems, databases, and AI tooling applied by Siddharth Varpe.",
  pathname: "/skills",
});

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="w-4 h-4 text-blue-400" />,
  Backend: <Database className="w-4 h-4 text-emerald-400" />,
  "AI & ML": <Sparkles className="w-4 h-4 text-accent" />,
  "Tools & Systems": <Wrench className="w-4 h-4 text-amber-400" />,
};

export default async function SkillsPage() {
  const skills = await getPublishedSkills();

  // Explicit priority order for categories
  const categoryOrder: SkillDocument["category"][] = [
    "Frontend",
    "Backend",
    "AI & ML",
    "Tools & Systems",
  ];
  const existingCategories = new Set(skills.map((s) => s.category));
  const sortedCategories = [
    ...categoryOrder.filter((c) => existingCategories.has(c)),
    ...Array.from(existingCategories).filter(
      (c): c is SkillDocument["category"] => Boolean(c) && !categoryOrder.includes(c)
    ),
  ];

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Skills", path: "/skills" }]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-14 sm:pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="TECHNICAL TAXONOMY"
        title="Skills & Technologies"
        description="Categorized inventory of programming languages, distributed backend frameworks, databases, and AI tooling applied across production systems."
        action={
          <Link href="/projects">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>View Projects Built With These</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      />

      <Container size="public" className="space-y-8 sm:space-y-10">
        {skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3">
            <TechnicalLabel>TAXONOMY NOTICE</TechnicalLabel>
            <h3 className="text-base font-semibold text-foreground">Skills Catalog In Progress</h3>
            <BodyText className="text-sm text-foreground-muted">
              Published technical competencies are currently being synchronized from the verified portfolio repository.
            </BodyText>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {sortedCategories.map((category) => {
              const categorySkills = skills
                .filter((s) => (s.category || "General") === category)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

              return (
                <Card
                  key={category}
                  className="bg-surface/85 border-border shadow-md flex flex-col justify-between p-4 sm:p-6"
                >
                  <CardHeader className="space-y-2 border-b border-border/60 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-surface border border-border">
                          {CATEGORY_ICONS[category] || <Cpu className="w-4 h-4 text-accent" />}
                        </div>
                        <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                          {category}
                        </CardTitle>
                      </div>
                      <TechnicalLabel className="text-[10px]">
                        {categorySkills.length} SKILLS
                      </TechnicalLabel>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-3 sm:pt-5 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.name}
                          className="p-2 sm:p-3.5 rounded-lg border border-border/80 bg-surface/50 hover:bg-surface hover:border-accent/40 transition-all duration-200 flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3 group min-w-0"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border border-border bg-surface-muted/60 flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
                            <TechIcon name={skill.name} className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1 w-full">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] sm:text-xs font-semibold text-foreground truncate">
                                {skill.name}
                              </span>
                              {skill.level && (
                                <Badge
                                  variant={skill.level === "Advanced" ? "accent" : "outline"}
                                  className="text-[8px] sm:text-[9px] font-mono px-1 sm:px-1.5 py-0 shrink-0"
                                >
                                  {skill.level}
                                </Badge>
                              )}
                            </div>

                            {skill.description ? (
                              <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug line-clamp-1 sm:line-clamp-2">
                                {skill.description}
                              </p>
                            ) : (
                              typeof skill.years === "number" && (
                                <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">
                                  {skill.years}+ yrs
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
