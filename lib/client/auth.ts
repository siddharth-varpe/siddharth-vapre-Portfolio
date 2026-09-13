"use client";

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";

/**
 * =============================================================================
 * Firebase Authentication Client for React / Browser
 * =============================================================================
 * Authenticates user credentials via Firebase Web SDK and exchanges the ID token
 * for a secure, HTTP-only server __session cookie.
 * =============================================================================
 */

export async function signIn(identifier: string, password: string): Promise<UserCredential> {
  const cleanIdentifier = identifier.trim();
  const cleanPassword = password.trim();

  // Normalize username or email
  const email = cleanIdentifier.includes("@")
    ? cleanIdentifier.toLowerCase()
    : `${cleanIdentifier.toLowerCase()}@siddharthvarpe.com`;

  // 1. Authenticate with Firebase Web SDK
  const cred = await signInWithEmailAndPassword(clientAuth, email, cleanPassword);

  // 2. Retrieve ID token
  const idToken = await cred.user.getIdToken(true);

  // 3. Exchange for server-side __session cookie
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    await firebaseSignOut(clientAuth);
    throw new Error(errorData.message || "Failed to establish administrative session.");
  }

  return cred;
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(clientAuth);
  } catch (err) {
    console.warn("[Client Firebase SignOut Note]:", err);
  }

  try {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.warn("[Server Session Logout Note]:", err);
  }
}

export async function getSession(): Promise<{ session: unknown; user: unknown } | null> {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const authClient = {
  signIn,
  signOut,
  getSession,
};
