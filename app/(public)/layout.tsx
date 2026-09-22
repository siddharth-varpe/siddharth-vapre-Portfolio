export const dynamic = "force-dynamic";
import * as React from "react";
import { PublicNavbar, PublicFooter } from "@/components/public";
import { ScrollProgressBar } from "@/components/motion";

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public Root Layout Shell (Phase 7 + Phase 11 Motion).
 *
 * Provides the global layout frame for all public routes:
 * - Persistent reading scroll progress bar
 * - Persistent, sticky public navigation with mobile drawer
 * - Main responsive content viewport
 * - Standardized public footer with authentic social and platform metadata
 * - Strict separation from authenticated admin boundaries
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent">
      {/* Technical Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Global Public Navigation */}
      <PublicNavbar />

      {/* Main Page Content Viewport */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Public Footer */}
      <PublicFooter />
    </div>
  );
}
