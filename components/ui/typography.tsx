import * as React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

/**
 * Editorial Display Headline for hero and high-impact introductory sections.
 */
export function DisplayHeadline({
  as: Component = "h1",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Page Title for major public and administrative views.
 */
export function PageTitle({
  as: Component = "h1",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Section Title for content divisions and case study subsections.
 */
export function SectionTitle({
  as: Component = "h2",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Item Title for discrete items, modules, and sub-headings.
 */
export function ItemTitle({
  as: Component = "h3",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "text-lg font-medium tracking-tight text-foreground sm:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Standard Body Text with optimal line-height and contrast.
 */
export function BodyText({
  as: Component = "p",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "text-base leading-relaxed text-foreground-secondary",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Supporting Subtext for descriptions and helper annotations.
 */
export function Subtext({
  as: Component = "p",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "text-sm leading-normal text-foreground-muted",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Technical Label / Eyebrow for system categories and section identifiers.
 */
export function TechnicalLabel({
  as: Component = "span",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-widest text-accent",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Monospace code/system text.
 */
export function MonoText({
  as: Component = "span",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-mono text-xs text-foreground-muted sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
