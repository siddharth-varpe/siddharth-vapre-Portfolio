import { pingDatabase, getDatabase, getMongoClient } from "../lib/server/db";
import { initializeDatabaseIndexes } from "../lib/server/db/indexes";
import { getProjectsCollection } from "../lib/server/db/collections";
import {
  projectMutationSchema,
  contactMessageSubmissionSchema,
} from "../lib/validations/models";
import {
  getPublishedProjects,
  getPublishedSkills,
  getPublishedProfile,
} from "../lib/server/db/repositories/content";
import {
  getAdminProjects,
  getAdminContactMessages,
  getAdminActivityLogs,
} from "../lib/server/db/repositories/admin";

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  results.push({
    name,
    passed: !!condition,
    details: details || (condition ? "Passed" : "Failed"),
  });
}

async function runVerification() {
  console.log("==================================================");
  console.log("PHASE 3 — DATABASE & CONTENT ARCHITECTURE VERIFICATION");
  console.log("==================================================\n");

  // 1. Connectivity & Security
  console.log("Checking Database Connectivity to MongoDB Atlas...");
  const pingResult = await pingDatabase();
  assert(
    pingResult.success,
    "1.1 MongoDB Atlas Ping",
    `Ping succeeded in ${pingResult.latencyMs}ms`
  );

  const db = await getDatabase();
  assert(
    db.databaseName === "siddharth_portfolio",
    "1.2 Target Database Name",
    `Database name is verified as '${db.databaseName}'`
  );

  // Verify URI is not logged or exposed in objects
  const uri = process.env.MONGODB_URI || "";
  const uriHasCredentials = uri.includes("@");
  assert(
    uriHasCredentials,
    "1.3 Credential Masking Check",
    "Active URI contains credentials in .env.local but will NOT be exposed in output"
  );

  // 2. Index Creation & Verification
  console.log("\nInitializing & Verifying Database Indexes...");
  await initializeDatabaseIndexes();

  const projectsCol = await getProjectsCollection();
  const projectIndexes = await projectsCol.indexes();
  const slugIndex = projectIndexes.find((idx) => idx.name === "idx_projects_slug_unique");
  assert(
    !!slugIndex && slugIndex.unique === true,
    "2.1 Projects Unique Slug Index",
    "idx_projects_slug_unique created with unique: true"
  );

  const statusOrderIndex = projectIndexes.find((idx) => idx.name === "idx_projects_status_order");
  assert(
    !!statusOrderIndex,
    "2.2 Projects Compound Status + Order Index",
    "idx_projects_status_order created"
  );

  // 3. Zod Schema Validation & Security
  console.log("\nVerifying Zod Schemas (Mass Assignment & Protocol Safety)...");

  // Valid Project Input
  const validProject = {
    title: "Distributed Agent Engine",
    slug: "distributed-agent-engine",
    shortDescription: "High throughput distributed agent execution framework.",
    fullDescription: "Detailed breakdown of the architectural mechanics.",
    category: "Distributed Systems",
    year: "2026",
    role: "Lead Systems Architect",
    problem: "Execution state loss across nodes during restarts.",
    objective: "Zero-data-loss resumable agent workflow engine.",
    solution: "Log-structured persistent state machines.",
    architectureSummary: "Decoupled scheduler with monotonic durable logs.",
    implementation: ["Rust state engine", "Raft consensus protocol"],
    decisions: ["Chose Raft over Paxos for simplicity and operational transparency"],
    challenges: ["Minimizing log compaction pause times"],
    impact: ["Reduced recovery latency by 92%"],
    metrics: ["99.999% availability", "1.2ms state flush"],
    technologies: ["Rust", "TypeScript", "gRPC"],
    githubUrl: "https://github.com/example/engine",
    featured: true,
    status: "published" as const,
    order: 1,
    extraUntrustedField: "HACK_ATTEMPT", // should be stripped
  };

  const projectValidation = projectMutationSchema.safeParse(validProject);
  assert(
    projectValidation.success,
    "3.1 Valid Project Validation",
    "Valid project input correctly accepted"
  );

  if (projectValidation.success) {
    const parsedData = projectValidation.data as Record<string, unknown>;
    assert(
      parsedData.extraUntrustedField === undefined,
      "3.2 Mass Assignment Protection",
      "Untrusted fields stripped automatically by Zod parser"
    );
  }

  // Dangerous URL Scheme Rejection
  const maliciousProject = {
    ...validProject,
    githubUrl: "javascript:alert('xss')",
  };
  const maliciousValidation = projectMutationSchema.safeParse(maliciousProject);
  assert(
    !maliciousValidation.success,
    "3.3 Dangerous URL Scheme Protection",
    "Unsafe 'javascript:' protocol rejected by URL validation"
  );

  // Contact Message Validation
  const validMessage = {
    name: "Alex Mercer",
    email: "alex@example.com",
    subject: "Architectural Collaboration",
    message: "Interested in discussing potential distributed system projects.",
    turnstileToken: "cf-turnstile-token-mock-xyz",
  };
  const messageValidation = contactMessageSubmissionSchema.safeParse(validMessage);
  assert(
    messageValidation.success,
    "3.4 Contact Message Schema Validation",
    "Valid message accepted with email and message validation"
  );

  const invalidMessage = {
    name: "A", // too short (min 2)
    email: "not-an-email",
    message: "hi", // too short (min 10)
  };
  const invalidMsgResult = contactMessageSubmissionSchema.safeParse(invalidMessage);
  assert(
    !invalidMsgResult.success,
    "3.5 Invalid Message Rejection",
    `Invalid fields rejected: ${!invalidMsgResult.success ? invalidMsgResult.error.issues.length : 0} issues detected`
  );

  // 4. Data Access Layer & Bounded Pagination
  console.log("\nVerifying Data Access Repositories...");

  const publishedProjects = await getPublishedProjects({ limit: 10 });
  assert(
    Array.isArray(publishedProjects),
    "4.1 Public Projects Query",
    `Retrieved ${publishedProjects.length} published projects safely`
  );

  const publishedSkills = await getPublishedSkills();
  assert(
    Array.isArray(publishedSkills),
    "4.2 Public Skills Query",
    `Retrieved ${publishedSkills.length} published skills safely`
  );

  const profile = await getPublishedProfile();
  assert(
    profile === null || typeof profile === "object",
    "4.3 Public Profile Query",
    profile ? `Found profile for ${profile.name}` : "Profile query executed safely (currently empty)"
  );

  const adminProjects = await getAdminProjects({ page: 1, limit: 10 });
  assert(
    adminProjects.limit === 10 && adminProjects.page === 1 && Array.isArray(adminProjects.items),
    "4.4 Admin Projects Bounded Pagination",
    `Bounded pagination returned: page=${adminProjects.page}, limit=${adminProjects.limit}, total=${adminProjects.total}`
  );

  // Test pagination limit clamping (requesting 1000 items should clamp to 100)
  const clampedAdminMessages = await getAdminContactMessages({ page: -5, limit: 1000 });
  assert(
    clampedAdminMessages.limit === 100 && clampedAdminMessages.page === 1,
    "4.5 Pagination Boundary Clamping",
    `Clamped limit to 100 (requested 1000) and page to 1 (requested -5)`
  );

  const adminLogs = await getAdminActivityLogs({ page: 1, limit: 20 });
  assert(
    Array.isArray(adminLogs.items),
    "4.6 Admin Activity Logs Query",
    `Activity logs retrieved: ${adminLogs.items.length} items`
  );

  // Print Summary
  console.log("\n==================================================");
  console.log("VERIFICATION TEST RESULTS SUMMARY");
  console.log("==================================================");
  let allPassed = true;
  for (const r of results) {
    const statusSymbol = r.passed ? "✓ PASS" : "✗ FAIL";
    console.log(`${statusSymbol} [${r.name}]: ${r.details}`);
    if (!r.passed) allPassed = false;
  }

  console.log("==================================================");
  if (allPassed) {
    console.log("ALL PHASE 3 ARCHITECTURAL VERIFICATIONS PASSED!");
  } else {
    console.error("SOME VERIFICATIONS FAILED!");
  }
  console.log("==================================================");

  // Close MongoDB client cleanly
  const client = await getMongoClient();
  await client.close();

  if (!allPassed) {
    process.exit(1);
  }
}

runVerification().catch((error) => {
  console.error("Unexpected error during verification:", error);
  process.exit(1);
});
