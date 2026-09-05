import * as React from "react";
import NextLink from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "default" | "subtle" | "accent" | "nav";
  isExternal?: boolean;
  showExternalIcon?: boolean;
}

/**
 * Accessible Link primitive handling internal routing and external navigation with
 * explicit security attributes (rel="noopener noreferrer").
 */
export function Link({
  href,
  variant = "default",
  isExternal = false,
  showExternalIcon = false,
  className,
  children,
  ...props
}: LinkProps) {
  const isAutoExternal = isExternal || href.startsWith("http://") || href.startsWith("https://");

  const variantClasses = {
    default: "text-foreground hover:text-white underline-offset-4 hover:underline",
    subtle: "text-foreground-muted hover:text-foreground transition-colors",
    accent: "text-accent hover:text-accent-hover transition-colors font-medium",
    nav: "text-foreground-secondary hover:text-white transition-colors text-sm font-medium",
  };

  const commonClasses = cn(
    "inline-flex items-center gap-1 rounded-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variantClasses[variant],
    className
  );

  if (isAutoExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={commonClasses}
        {...props}
      >
        {children}
        {showExternalIcon && <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />}
      </a>
    );
  }

  return (
    <NextLink href={href} className={commonClasses} {...props}>
      {children}
    </NextLink>
  );
}
