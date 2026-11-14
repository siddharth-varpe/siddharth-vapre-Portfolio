"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/public/theme-toggle";

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
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [mobileMenuOpen]);

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 dark:border-zinc-800/80 bg-background/90 dark:bg-[#08101a]/95 backdrop-blur-md transition-colors h-14 sm:h-16 flex items-center pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          aria-label="Siddharth Varpe Portfolio Home"
        >
          <span className="font-sans text-xl sm:text-2xl font-black tracking-tight select-none">
            <span className="text-foreground">S</span>
            <span className="text-blue-600 dark:text-blue-500">V.</span>
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-xs sm:text-sm font-bold tracking-wider text-foreground group-hover:text-accent transition-colors leading-tight uppercase">
              Siddharth Varpe
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground leading-tight">
              Software Engineer
            </span>
          </div>
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
                  "relative px-3 py-1.5 text-[13px] xl:text-sm font-medium transition-colors rounded-md flex flex-col items-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active
                    ? "text-blue-600 dark:text-blue-500 font-semibold"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover/50"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="relative z-10">{item.label}</span>
                {active && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : "activeNavIndicator"}
                    className="absolute -bottom-1 left-2.5 right-2.5 h-[2.5px] bg-blue-600 dark:bg-blue-500 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action & Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Visual Theme Toggle */}
          <ThemeToggle />

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
              className="text-xs h-8 gap-1.5 border-blue-200/90 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 rounded-xl font-medium active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </Button>
          </a>

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={cn(
              "lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-surface-hover active:scale-95 transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            )}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 sm:top-16 h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] z-50 bg-background/98 backdrop-blur-2xl border-t border-border lg:hidden flex flex-col overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-col justify-between flex-1 px-4 py-5 sm:px-6 space-y-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              {/* Navigation Links list */}
              <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                {PUBLIC_NAV_ITEMS.map((item) => {
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors min-h-[48px]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        active
                          ? "text-accent bg-accent/10 border border-accent/20"
                          : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover active:bg-surface-muted"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{item.label}</span>
                      {active ? (
                        <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground">&rarr;</span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 border-t border-border/80 space-y-4">
                <a
                  href="/api/resume/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" size="md" className="w-full gap-2 justify-center h-11 text-xs sm:text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    <span>Download Official Resume (PDF)</span>
                  </Button>
                </a>

                <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1 font-mono">
                  <span>Siddharth Varpe</span>
                  <span>Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

