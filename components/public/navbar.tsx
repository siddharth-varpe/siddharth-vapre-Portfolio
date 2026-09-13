"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { PUBLIC_NAV_ITEMS } from "./constants";

/**
 * Global Public Navigation Header (Phase 7 Public Shell + Phase 11 Motion).
 * Responsive header with desktop bar, layoutId active indicator, and accessible animated mobile drawer.
 */
export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          aria-label="Siddharth Varpe Portfolio Home"
        >
          <span className="font-sans text-base font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
            Siddharth Varpe
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            Software Engineer
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center space-x-1 relative"
          aria-label="Main Navigation"
        >
          {PUBLIC_NAV_ITEMS.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors rounded-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active
                    ? "text-white font-semibold"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover/50"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : "activeNavPill"}
                    className="absolute inset-0 bg-blue-600 rounded-md -z-10 shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action & Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          <a
            href="/api/resume/download"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
            aria-label="Download Siddharth Varpe's Resume PDF"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5 border-border hover:border-accent/50 active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span>Resume</span>
            </Button>
          </a>

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={cn(
              "lg:hidden flex items-center justify-center p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-surface-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            )}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[57px] bottom-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border lg:hidden flex flex-col justify-between overflow-y-auto px-6 py-8"
          >
            <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm font-medium uppercase tracking-wider rounded-lg transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      active
                        ? "text-accent bg-accent/10 font-semibold"
                        : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 border-t border-border/80 space-y-4">
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button variant="primary" size="md" className="w-full gap-2 justify-center">
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </Button>
              </a>

              <div className="flex items-center justify-between text-xs text-foreground-subtle pt-2 font-mono">
                <span>Siddharth Varpe</span>
                <span>Nashik, India</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
