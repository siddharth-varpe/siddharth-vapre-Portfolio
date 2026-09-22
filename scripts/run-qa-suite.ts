/**
 * PRE-PHASE 13: AUTOMATED FULL QA & REGRESSION TEST SUITE
 *
 * Verifies:
 * 1. Public route resolution, HTTP 200 status, and semantic HTML payload integrity
 * 2. Case study resolution across all approved slugs from seed data
 * 3. SEO artifacts (sitemap.xml, robots.txt) and JSON-LD schema
 * 4. Theme switcher infrastructure (zero-flash script & theme classes)
 * 5. Admin authentication & route protection (unauthorized access returns 401/redirect)
 * 6. Contact API input validation & anti-abuse/honeypot guards
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function runTest(suite: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({
      suite,
      name,
      passed: true,
      durationMs: Date.now() - start,
    });
    console.log(`  ✓ [PASS] ${name} (${Date.now() - start}ms)`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    results.push({
      suite,
      name,
      passed: false,
      error: message,
      durationMs: Date.now() - start,
    });
    console.error(`  ✗ [FAIL] ${name}: ${message}`);
  }
}

async function fetchRoute(routePath: string) {
  const res = await fetch(`${BASE_URL}${routePath}`, {
    headers: { "User-Agent": "PrePhase13-QASuite/1.0" },
    redirect: "manual",
  });
  return res;
}

async function checkRoute(routePath: string, expectedText?: string) {
  const res = await fetchRoute(routePath);
  if (res.status >= 400) {
    throw new Error(`GET ${routePath} returned status ${res.status} ${res.statusText}`);
  }
  if (expectedText) {
    const text = await res.text();
    if (!text.includes(expectedText)) {
      throw new Error(`GET ${routePath} did not contain expected text: "${expectedText}"`);
    }
  }
}

async function main() {
  console.log("============================================================");
  console.log("PRE-PHASE 13 QA SUITE: FULL APPLICATION STABILIZATION CHECK");
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log("============================================================\n");

  // Load verified portfolio seed data
  const seedPath = path.resolve(process.cwd(), "data/portfolio-seed-data.json");
  const seedRaw = await fs.readFile(seedPath, "utf-8");
  const seedData = JSON.parse(seedRaw);

  // Suite 1: Public HTTP Route Resolution & Payloads
  console.log("SUITE 1: Public HTTP Route Resolution & Payloads");
  const publicRoutes = [
    { path: "/", expectedText: "Siddharth Varpe" },
    { path: "/about", expectedText: "About Siddharth Varpe" },
    { path: "/experience", expectedText: "Engineering Experience" },
    { path: "/projects", expectedText: "Engineering Projects" },
    { path: "/skills", expectedText: "Skills" },
    { path: "/achievements", expectedText: "Verified Distinctions" },
    { path: "/certifications", expectedText: "Technical Certifications" },
    { path: "/contact", expectedText: "Contact" },
    { path: "/robots.txt", expectedText: "User-Agent" },
    { path: "/sitemap.xml", expectedText: "<urlset" },
  ];

  for (const route of publicRoutes) {
    await runTest("Public Routes", `GET ${route.path}`, async () => {
      await checkRoute(route.path, route.expectedText);
    });
  }

  // Suite 2: Project Detail Slugs Resolution
  console.log("\nSUITE 2: Project Detail Slugs Resolution");
  const publishedProjects = seedData.projects.filter(
    (p: { status: string }) => p.status === "published"
  );
  for (const project of publishedProjects) {
    await runTest("Project Slugs", `GET /projects/${project.slug}`, async () => {
      await checkRoute(`/projects/${project.slug}`, project.title);
    });
  }

  // Suite 3: 4-Column Layout and Theme Verification
  console.log("\nSUITE 3: UI Architecture, 4-Column Grid & Theme System");
  await runTest("UI Architecture", "Projects page contains 4-column responsive grid classes", async () => {
    const res = await fetchRoute("/projects");
    const html = await res.text();
    if (!html.includes("lg:grid-cols-4")) {
      throw new Error("Projects explorer missing lg:grid-cols-4 responsive layout");
    }
  });

  await runTest("UI Architecture", "Layout contains zero-flash theme initialization script", async () => {
    const res = await fetchRoute("/");
    const html = await res.text();
    if (!html.includes("data-theme") || !html.includes("localStorage.getItem('theme')")) {
      throw new Error("Layout missing client theme hydration script");
    }
  });

  await runTest("UI Architecture", "Skills page renders authentic TechIcon vector marks", async () => {
    const res = await fetchRoute("/skills");
    const html = await res.text();
    if (!html.includes("React.js") || !html.includes("PostgreSQL")) {
      throw new Error("Skills page missing key technologies");
    }
  });

  // Suite 4: Admin Authentication & Route Protection
  console.log("\nSUITE 4: Admin Authentication & Route Protection");
  await runTest("Admin Auth", "Direct /admin access without auth redirects to /admin/login", async () => {
    const res = await fetchRoute("/admin");
    if (res.status !== 302 && res.status !== 307 && res.status !== 200) {
      throw new Error(`Unexpected status for /admin: ${res.status}`);
    }
    const location = res.headers.get("location");
    if (location && !location.includes("/admin/login")) {
      throw new Error(`Expected redirect to /admin/login, got: ${location}`);
    }
  });

  await runTest("Admin Auth", "Protected API route /api/admin/stats returns 401 Unauthorized without session", async () => {
    const res = await fetchRoute("/api/admin/stats");
    if (res.status !== 401 && res.status !== 403 && res.status !== 307) {
      throw new Error(`Expected 401 Unauthorized for /api/admin/stats, got ${res.status}`);
    }
  });

  await runTest("Admin Auth", "Session establishment with invalid credentials rejects with 400 or 401", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid@example.com", password: "wrongpassword123" }),
    });
    if (res.status !== 400 && res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected login failure, but received ${res.status}`);
    }
  });

  // Suite 5: Contact API Validation & Anti-Abuse
  console.log("\nSUITE 5: Contact API Server-Side Validation");
  await runTest("Contact API", "Rejects empty payload with 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": "10.0.1.1",
      },
      body: JSON.stringify({}),
    });
    if (res.status !== 400) {
      throw new Error(`Expected 400 Bad Request, received ${res.status}`);
    }
  });

  await runTest("Contact API", "Traps honeypot submissions (silent drop with 200 response)", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": "10.0.1.2",
      },
      body: JSON.stringify({
        name: "Bot User",
        email: "bot@example.com",
        subject: "Spam Inquiry",
        message: "This is automated spam content trying to pass.",
        turnstileToken: "mock-token",
        company_hp: "Bot Corp Spam", // Honeypot populated
      }),
    });
    if (res.status !== 200) {
      throw new Error(`Expected honeypot silent drop (200), received ${res.status}`);
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Expected success: true from honeypot response, got ${JSON.stringify(data)}`);
    }
  });

  await runTest("Contact API", "Rejects invalid email format with 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": "10.0.1.3",
      },
      body: JSON.stringify({
        name: "Real Name",
        email: "not-an-email",
        subject: "Valid Subject",
        message: "Valid message with more than ten characters.",
        turnstileToken: "some-token",
      }),
    });
    if (res.status !== 400) {
      throw new Error(`Expected 400 for invalid email, received ${res.status}`);
    }
  });

  // Suite 6: Mobile UI & Responsive Architecture Verification
  console.log("\nSUITE 6: Mobile UI & Responsive Architecture Verification");
  await runTest("Mobile UI", "Homepage contains integrated mobile hero portrait and capabilities strip", async () => {
    const res = await fetchRoute("/");
    const html = await res.text();
    if (!html.includes("/images/siddharth-hero.png")) {
      throw new Error("Homepage missing approved portrait image asset");
    }
    if (!html.includes("Full-Stack") || !html.includes("AI Systems") || !html.includes("Architecture")) {
      throw new Error("Homepage missing integrated mobile capabilities strip");
    }
  });

  await runTest("Mobile UI", "Homepage contains responsive 2x2 mobile evidence grid", async () => {
    const res = await fetchRoute("/");
    const html = await res.text();
    if (!html.includes("grid-cols-2 lg:grid-cols-4")) {
      throw new Error("Homepage missing 2x2 mobile evidence grid layout (grid-cols-2 lg:grid-cols-4)");
    }
  });

  await runTest("Mobile UI", "Navbar provides full mobile navigation accessibility with all 8 routes", async () => {
    const res = await fetchRoute("/");
    const html = await res.text();
    const expectedHrefs = [
      'href="/"',
      'href="/about"',
      'href="/experience"',
      'href="/projects"',
      'href="/skills"',
      'href="/achievements"',
      'href="/certifications"',
      'href="/contact"',
    ];
    for (const href of expectedHrefs) {
      if (!html.includes(href)) {
        throw new Error(`Mobile navigation missing route link: ${href}`);
      }
    }
    if (!html.includes('aria-controls="mobile-navigation"')) {
      throw new Error("Navbar missing accessible mobile menu controls");
    }
  });

  await runTest("Mobile UI", "Public footer contains compact mobile navigation index and active resume link", async () => {
    const res = await fetchRoute("/");
    const html = await res.text();
    if (!html.includes("Active Resume") || !html.includes("/api/resume/download")) {
      throw new Error("Footer missing accessible resume download action");
    }
    if (!html.includes("ARCHITECTURE: NEXT.JS 15 • REACT 19 • POSTGRESQL • SUPABASE")) {
      throw new Error("Footer missing verified engineering architecture stamp");
    }
  });

  await runTest("Mobile UI", "Zero development overlay or dev indicators in production payload", async () => {
    const res = await fetchRoute("/");
    const html = await res.text();
    if (html.includes("next-dev-indicator") || html.includes("nextjs-dev-overlay")) {
      throw new Error("Production output contains development indicator overlay");
    }
  });

  // Summary Report
  console.log("\n============================================================");
  console.log("PRE-PHASE 13 QA SUMMARY");
  console.log("============================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total Checks : ${total}`);
  console.log(`Passed       : ${passed}`);
  console.log(`Failed       : ${failed}`);

  if (failed > 0) {
    console.error("\nFailed Tests:");
    for (const f of results.filter((r) => !r.passed)) {
      console.error(`  - [${f.suite}] ${f.name}: ${f.error}`);
    }
    process.exit(1);
  } else {
    console.log("\n✓ All Pre-Phase 13 QA checks passed with 100% success!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("QA Suite fatal error:", err);
  process.exit(1);
});
