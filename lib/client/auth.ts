"use client";

import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

/**
 * Better Auth Client for React / Browser.
 *
 * Provides typed auth methods (signIn, signOut, useSession) configured
 * with the username plugin for administrative login.
 */
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  plugins: [
    usernameClient(),
  ],
});

export const {
  signIn,
  signOut,
  useSession,
  getSession,
  changePassword,
} = authClient;
