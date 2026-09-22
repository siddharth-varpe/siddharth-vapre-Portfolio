import * as React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { Container, MonoText } from "@/components/ui";
import { PUBLIC_NAV_ITEMS } from "./constants";
import { GithubIcon, LinkedinIcon } from "./icons";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/80 bg-surface/50 text-foreground-secondary transition-colors">
      <Container size="public" className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
        {/* Desktop 5-col / Mobile layered hierarchy */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Identity Column */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
              <span className="font-sans text-base sm:text-lg font-bold tracking-tight text-foreground block">
                Siddharth Varpe
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted block mt-0.5">
                Software Engineer | AI &amp; Full-Stack
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-foreground-secondary max-w-sm leading-relaxed">
              Building real solutions with code, AI, and measurable impact. Dedicated to architecting
              scalable distributed systems, robust full-stack platforms, and verified engineering proofs.
            </p>
          </div>

          {/* Navigation & Evidence: 2-column grid on mobile, separate columns on desktop */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:contents">
            {/* Quick Navigation */}
            <div className="space-y-2.5 sm:space-y-3">
              <h4 className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground">
                Index
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                {PUBLIC_NAV_ITEMS.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-foreground-muted hover:text-accent transition-colors block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Evidence Sections */}
            <div className="space-y-2.5 sm:space-y-3">
              <h4 className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground">
                Evidence
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                {PUBLIC_NAV_ITEMS.slice(5).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-foreground-muted hover:text-accent transition-colors block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="/api/resume/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground-muted hover:text-accent transition-colors inline-flex items-center gap-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span>Active Resume</span>
                    <ArrowUpRight className="w-3 h-3 text-accent" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Connect & Authentic Links */}
          <div className="space-y-2.5 sm:space-y-3 pt-2 md:pt-0 border-t border-border/50 md:border-t-0">
            <h4 className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h4>
            <div className="flex flex-wrap md:flex-col gap-2 md:gap-2 text-xs">
              <a
                href="https://github.com/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border/60 bg-surface/60 md:border-0 md:bg-transparent md:p-0 text-foreground-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <GithubIcon className="w-3.5 h-3.5 text-foreground-subtle" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/siddharth-varpe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border/60 bg-surface/60 md:border-0 md:bg-transparent md:p-0 text-foreground-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:siddharth.varpe0@gmail.com"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border/60 bg-surface/60 md:border-0 md:bg-transparent md:p-0 text-foreground-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 pt-5 text-xs text-foreground-subtle">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <MonoText className="text-[10px] sm:text-[11px]">
              ARCHITECTURE: NEXT.JS 15 • REACT 19 • POSTGRESQL • SUPABASE
            </MonoText>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-[11px]">
            <Link
              href="/admin/login"
              className="text-foreground-subtle hover:text-foreground-muted transition-colors"
            >
              Admin Gateway
            </Link>
            <span>© {currentYear} Siddharth Varpe</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
