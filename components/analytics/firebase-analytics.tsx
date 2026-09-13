"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { clientApp } from "@/lib/firebase/client";

/**
 * Privacy-Conscious Firebase Analytics Provider.
 *
 * Security & Privacy Guards:
 * - Initializes strictly in production browser environments.
 * - Dynamically checks isSupported() before loading analytics code.
 * - Strictly bypasses tracking on private /admin routes.
 * - Zero tracking of user input, contact form fields, tokens, or credentials.
 * - Does NOT install any third-party or legacy Vercel tracking scripts.
 */
export function FirebaseAnalytics() {
  const pathname = usePathname();

  React.useEffect(() => {
    // Only run in browser and production
    if (typeof window === "undefined" || process.env.NODE_ENV !== "production") {
      return;
    }

    // Strictly skip admin routes to protect administrative privacy
    if (pathname?.startsWith("/admin")) {
      return;
    }

    let isMounted = true;

    async function initAnalytics() {
      try {
        const { getAnalytics, isSupported, logEvent } = await import("firebase/analytics");
        const supported = await isSupported();

        if (supported && isMounted) {
          const analytics = getAnalytics(clientApp);
          // Track public page view with sanitized route path
          logEvent(analytics, "page_view", {
            page_path: pathname,
            page_title: document.title,
          });
        }
      } catch {
        // Silently handle environments where analytics or IndexedDB is blocked
      }
    }

    initAnalytics();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return null;
}
