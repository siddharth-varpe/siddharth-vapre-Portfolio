import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section" | "aside" | "header" | "footer";
  hoverable?: boolean;
}

/**
 * Surface Card container adhering to the Dark Systems aesthetic.
 * Features restrained 1px graphite borders, deep dark surface, and optional subtle hover response.
 */
export function Card({
  as: Component = "div",
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  const Comp = Component as "div";
  return (
    <Comp
      className={cn(
        "rounded-lg border border-border bg-surface p-6 text-foreground",
        hoverable &&
          "transition-all duration-200 hover:border-border-hover hover:bg-surface-muted",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-medium tracking-tight text-foreground sm:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-foreground-muted", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-between pt-4 border-t border-border/50", className)}
      {...props}
    >
      {children}
    </div>
  );
}
