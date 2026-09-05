import { auth } from "@/lib/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Route handler for Better Auth endpoints.
 * Mounts standard auth routes (/api/auth/sign-in/username, /api/auth/sign-out, /api/auth/session, etc.).
 */
export const { GET, POST } = toNextJsHandler(auth);
