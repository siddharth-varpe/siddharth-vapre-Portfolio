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
      <Container size="public" className="py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Identity Column */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
              <span className="font-sans text-lg font-bold tracking-tight text-foreground block">
                Siddharth Varpe
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted block mt-0.5">
                Software Engineer | AI & Full-Stack
              </span>
            </Link>
            <p className="text-sm text-foreground-secondary max-w-sm leading-relaxed">
              Building real solutions with code, AI, and measurable impact. Dedicated to architecting
              scalable distributed systems, robust full-stack platforms, and verified engineering proofs.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Index
            </h4>
            <ul className="space-y-2 text-xs">
              {PUBLIC_NAV_ITEMS.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Sections */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Evidence
            </h4>
            <ul className="space-y-2 text-xs">
              {PUBLIC_NAV_ITEMS.slice(5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
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
                  className="text-foreground-muted hover:text-accent transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <span>Active Resume</span>
                  <ArrowUpRight className="w-3 h-3 text-accent" />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Authentic Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/Siddharth-Varpe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-muted hover:text-foreground transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-foreground-subtle" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/siddharth-varpe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-muted hover:text-foreground transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@siddharthvarpe.dev"
                  className="text-foreground-muted hover:text-foreground transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-6 text-xs text-foreground-subtle">
          <div className="flex items-center gap-2">
            <MonoText className="text-[11px]">
              ENGINEERING ARCHITECTURE: NEXT.JS 15 • REACT 19 • CLOUD FIRESTORE
            </MonoText>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="text-foreground-subtle hover:text-foreground-muted transition-colors text-[11px]"
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
