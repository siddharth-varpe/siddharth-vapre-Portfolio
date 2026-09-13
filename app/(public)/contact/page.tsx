import { buildMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import * as React from "react";
import type { Metadata } from "next";
import { Mail, MessageSquare, ArrowUpRight, ShieldCheck, Clock, MapPin, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/public/icons";
import { PageIntro } from "@/components/public/page-intro";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  BodyText,
  TechnicalLabel,
} from "@/components/ui";
import { ContactForm } from "@/components/public/contact-form";
import { getPublishedProfile } from "@/lib/server/db/repositories/content";
import { publicEnv } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Inquiries | Siddharth Varpe",
  description:
    "Direct contact pipeline, verified communication channels, and secure inquiry transmission for software engineer Siddharth Varpe.",
  pathname: "/contact",
});

export default async function ContactPage() {
  const profile = await getPublishedProfile();
  const email = profile?.email || "siddharth.varpe0@gmail.com";
  const location = profile?.location || "Pune, Maharashtra, India";
  const turnstileKey = publicEnv.TURNSTILE_SITE_KEY;

  const breadcrumbs = generateBreadcrumbJsonLd([{ name: "Contact", path: "/contact" }]);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={breadcrumbs} />
      <PageIntro
        eyebrow="COMMUNICATION & COLLABORATION PIPELINE"
        title="Contact & Channels"
        description="Direct pathways for technical inquiries, software engineering opportunities, and architectural collaboration."
      />

      <Container size="public" className="space-y-14">
        {/* Main Grid: Interactive Form & Direct Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm turnstileSiteKey={turnstileKey} />
          </div>

          {/* Right Column: Direct Channels & Operational SLA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <TechnicalLabel>DIRECT CHANNELS</TechnicalLabel>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Alternative Contact Pathways
              </h2>
              <BodyText className="text-sm text-foreground-secondary leading-relaxed">
                Prefer direct communication? Reach out through verified professional channels or schedule an engineering conversation.
              </BodyText>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              <a
                href={`mailto:${email}`}
                className="p-4 rounded-xl border border-border bg-surface/80 hover:border-accent/60 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                        Direct Email
                      </span>
                      <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors break-all">
                        {email}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground-subtle group-hover:text-accent transition-colors" />
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-border bg-surface/80 hover:border-accent/60 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                        LinkedIn Profile
                      </span>
                      <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        linkedin.com/in/siddharth-varpe
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground-subtle group-hover:text-accent transition-colors" />
                </div>
              </a>

              <a
                href="https://github.com/Siddharth-Varpe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-border bg-surface/80 hover:border-accent/60 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-foreground">
                      <GithubIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                        GitHub Profile
                      </span>
                      <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        github.com/Siddharth-Varpe
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground-subtle group-hover:text-accent transition-colors" />
                </div>
              </a>

              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-border bg-surface/80 hover:border-accent/60 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                        Official Résumé
                      </span>
                      <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        Download Verified PDF
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground-subtle group-hover:text-accent transition-colors" />
                </div>
              </a>
            </div>

            {/* Response SLA / Verification Card */}
            <Card className="bg-surface border-border shadow-md">
              <CardHeader className="space-y-1 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <TechnicalLabel>OPERATIONAL EXPECTATION</TechnicalLabel>
                </div>
                <CardTitle className="text-base font-semibold">Response Protocols</CardTitle>
                <CardDescription className="text-xs">
                  All messages submitted via the contact pipeline or direct email are received personally by Siddharth.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> TURNAROUND
                  </span>
                  <span className="text-foreground font-semibold">24–48 Hours SLA</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> LOCATION
                  </span>
                  <span className="text-foreground font-medium">{location}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> TIMEZONE
                  </span>
                  <span className="text-foreground">IST (UTC +5:30)</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> ANTI-SPAM
                  </span>
                  <span className="text-emerald-400 font-semibold">Cloudflare Turnstile Active</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
