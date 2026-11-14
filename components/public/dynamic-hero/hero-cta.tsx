import * as React from "react";
import Link from "next/link";
import { ArrowRight, Download, Mail, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/public/icons";
import type { HeroCtaConfig } from "@/types/models";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  cta?: HeroCtaConfig;
  className?: string;
  defaultVariant?: "primary" | "secondary" | "outline" | "ghost";
}

export function HeroCtaButton({ cta, className, defaultVariant = "outline" }: HeroCtaProps) {
  if (!cta || !cta.label || !cta.url) return null;

  const variant = cta.variant || defaultVariant;
  const isExternal = cta.external || cta.url.startsWith("http://") || cta.url.startsWith("https://") || cta.url.startsWith("mailto:");

  const variantClasses = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90 border border-foreground font-medium shadow-sm",
    secondary:
      "bg-surface-muted text-foreground hover:bg-surface-subtle border border-border font-medium",
    outline:
      "bg-surface/50 text-foreground hover:bg-surface-muted border border-border hover:border-border-subtle",
    ghost:
      "bg-transparent text-foreground-secondary hover:text-foreground hover:bg-surface/50 border border-transparent",
  }[variant] || "bg-foreground text-background hover:bg-foreground/90 border border-foreground font-medium";

  const renderIcon = () => {
    switch (cta.icon) {
      case "arrow":
        return <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />;
      case "download":
        return <Download className="w-4 h-4 mr-1.5 text-accent" />;
      case "mail":
        return <Mail className="w-4 h-4 mr-1.5 text-accent" />;
      case "github":
        return <GithubIcon className="w-4 h-4 mr-1.5 text-accent" />;
      case "external":
        return <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-foreground-muted" />;
      default:
        return null;
    }
  };

  const content = (
    <>
      {["download", "mail", "github"].includes(cta.icon || "") && renderIcon()}
      <span>{cta.label}</span>
      {["arrow", "external"].includes(cta.icon || "") && renderIcon()}
    </>
  );

  const sharedClasses = cn(
    "group inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg text-sm transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variantClasses,
    className
  );

  if (isExternal || cta.download) {
    return (
      <a
        href={cta.url}
        target={isExternal && !cta.download ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        download={cta.download ? true : undefined}
        className={sharedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={cta.url} className={sharedClasses}>
      {content}
    </Link>
  );
}
