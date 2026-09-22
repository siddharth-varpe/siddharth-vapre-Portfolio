// Global test setup for Vitest
(process.env as Record<string, string | undefined>).NODE_ENV = "test";
process.env.BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6";
process.env.NEXT_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@siddharthvarpe.com";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "TestAdminPassword123!";
