import "server-only";

export { adminAuth } from "@/lib/firebase/admin";
export {
  createAdminSessionCookie,
  verifyAdminSessionCookie,
  revokeAdminSession,
  setAdminCustomClaim,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase/auth";
export * from "./session";
export * from "./bootstrap";
export * from "./authorization";
export * from "./redirects";
