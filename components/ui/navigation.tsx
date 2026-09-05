import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavContainerProps extends React.HTMLAttributes<HTMLElement> {
  density?: "public" | "admin";
}

/**
 * Navigation header container with blur border and responsive spacing.
 */
export function NavContainer({
  density = "public",
  className,
  children,
  ...props
}: NavContainerProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md",
        density === "public" ? "py-4" : "py-3",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </header>
  );
}

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
}

/**
 * Accessible Navigation Link with active state indicator.
 */
export function NavLink({
  href,
  isActive = false,
  className,
  children,
  ...props
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-1 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm",
        isActive
          ? "text-white font-semibold"
          : "text-foreground-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <span
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

export interface MobileNavShellProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

/**
 * Mobile navigation overlay container for small viewports.
 */
export function MobileNavShell({
  isOpen,
  className,
  children,
  ...props
}: MobileNavShellProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-[65px] z-50 border-b border-border bg-background/95 p-6 backdrop-blur-lg sm:hidden",
        className
      )}
      {...props}
    >
      <nav className="flex flex-col space-y-4">{children}</nav>
    </div>
  );
}
