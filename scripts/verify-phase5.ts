import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import assert from "node:assert";
import {
  getRawDatabase,
  getAdminDashboardStats,
  getAdminHero,
  updateAdminHero,
  getAdminAbout,
  updateAdminAbout,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
  createAdminExperience,
  updateAdminExperience,
  deleteAdminExperience,
  getPublishedProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  createAdminAchievement,
  deleteAdminAchievement,
  createAdminCertification,
  deleteAdminCertification,
  createAdminMetric,
  deleteAdminMetric,
  updateAdminContactMessageStatus,
  deleteAdminContactMessage,
  getAdminRevisions,
  restoreRevision,
  getAdminActivityLogs,
} from "../lib/server/db";

// Direct handler imports for API route security tests
import { GET as getStatsRoute } from "../app/api/admin/stats/route";
import { GET as getSkillsRoute } from "../app/api/admin/skills/route";
import { PUT as putProfileRoute } from "../app/api/admin/profile/route";
import { POST as postProjectsRoute } from "../app/api/admin/projects/route";
import { POST as restoreRevisionRoute } from "../app/api/admin/revisions/restore/route";

// Colorized terminal formatting
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function logPass(title: string) {
  console.log(`  ${GREEN}✓${RESET} ${title}`);
}

async function runVerificationSuite() {
  console.log(`\n${BOLD}${CYAN}============================================================${RESET}`);
  console.log(`${BOLD}${CYAN}PHASE 5: ADMIN CMS & CONTENT OPERATIONS VERIFICATION SUITE${RESET}`);
  console.log(`${BOLD}${CYAN}============================================================${RESET}\n`);

  const db = getRawDatabase();
  const testActor = "Phase5-Verifier";

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Unauthenticated API Route Protection (401 Rejection)
    // -------------------------------------------------------------------------
    console.log(`${BOLD}1. API Route Security Boundary & Unauthorized Rejection${RESET}`);
    const statsRes = await getStatsRoute();
    assert.strictEqual(statsRes.status, 401, "GET /api/admin/stats must return 401 when unauthenticated");
    logPass("GET /api/admin/stats correctly returned 401 Unauthorized");

    const unauthSkillReq = new Request("http://localhost:3000/api/admin/skills", { method: "GET" });
    const skillsRes = await getSkillsRoute(unauthSkillReq);
    assert.strictEqual(skillsRes.status, 401, "GET /api/admin/skills must return 401 when unauthenticated");
    logPass("GET /api/admin/skills correctly returned 401 Unauthorized");

    const unauthProfileReq = new Request("http://localhost:3000/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Hacker" }),
    });
    const profileRes = await putProfileRoute(unauthProfileReq);
    assert.strictEqual(profileRes.status, 401, "PUT /api/admin/profile must return 401 when unauthenticated");
    logPass("PUT /api/admin/profile correctly returned 401 Unauthorized");

    const unauthProjectReq = new Request("http://localhost:3000/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Unauthorized Project" }),
    });
    const projRes = await postProjectsRoute(unauthProjectReq);
    assert.strictEqual(projRes.status, 401, "POST /api/admin/projects must return 401 when unauthenticated");
    logPass("POST /api/admin/projects correctly returned 401 Unauthorized");

    const unauthRestoreReq = new Request("http://localhost:3000/api/admin/revisions/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revisionId: "64b0f0000000000000000000" }),
    });
    const restoreRes = await restoreRevisionRoute(unauthRestoreReq);
    assert.strictEqual(restoreRes.status, 401, "POST /api/admin/revisions/restore must return 401 when unauthenticated");
    logPass("POST /api/admin/revisions/restore correctly returned 401 Unauthorized");

    // -------------------------------------------------------------------------
    // TEST 2: Dashboard Statistics & Metric Aggregations
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}2. Real Dashboard Stats & Aggregation Engine${RESET}`);
    const stats = await getAdminDashboardStats();
    assert(typeof stats.counts.projectsTotal === "number", "projectsTotal must be a number");
    assert(typeof stats.counts.projectsPublished === "number", "projectsPublished must be a number");
    assert(typeof stats.counts.skills === "number", "skills must be a number");
    assert(typeof stats.counts.messagesUnread === "number", "messagesUnread must be a number");
    assert(Array.isArray(stats.recentActivity), "recentActivity must be an array");
    assert(Array.isArray(stats.recentRevisions), "recentRevisions must be an array");
    logPass(
      `Dashboard stats queried successfully: ${stats.counts.projectsTotal} projects (${stats.counts.projectsPublished} published), ${stats.counts.skills} skills, ${stats.counts.messagesUnread} unread messages`
    );

    // -------------------------------------------------------------------------
    // TEST 3: Singleton Domain Mutability, Auditing & Revisions (Hero)
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}3. Singleton Domain Mutability, Auditing & Revisions (Hero)${RESET}`);
    const originalHero = await getAdminHero();
    const testHeadline = `Building Mission-Critical Web Applications [Test ${Date.now()}]`;
    
    const updatedHero = await updateAdminHero(
      {
        eyebrow: originalHero?.eyebrow || "Software Engineer",
        name: originalHero?.name || "Siddharth Varpe",
        headline: testHeadline,
        description:
          originalHero?.description ||
          "Architecting robust full-stack applications with Next.js, Node.js, and distributed data systems.",
        ctaLabel: "View Projects",
        ctaUrl: "#projects",
        supportingText: "Available for high-impact roles",
        status: "published",
      },
      testActor
    );

    assert.strictEqual(updatedHero.headline, testHeadline, "Hero headline must reflect updated value");
    logPass("Hero singleton updated successfully");

    // Verify revision record was created
    const heroRevisions = await getAdminRevisions(updatedHero._id?.toString(), { limit: 5 });
    assert(heroRevisions.items.length > 0, "A revision must be created for Hero update");
    assert.strictEqual(heroRevisions.items[0].contentType, "hero", "Revision content type must be 'hero'");
    assert.strictEqual(heroRevisions.items[0].actor, testActor, "Revision actor must match actor");
    logPass("Verified revision record created with snapshot and diff metadata");

    // -------------------------------------------------------------------------
    // TEST 4: Skills Domain CRUD
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}4. Skills Domain Complete CRUD Lifecycle${RESET}`);
    const skillName = `TestSkill-${Date.now()}`;
    const createdSkill = await createAdminSkill(
      {
        name: skillName,
        category: "Backend",
        level: "Proficient",
        featured: true,
        order: 999,
        years: 5,
        status: "published",
      },
      testActor
    );
    assert(createdSkill._id, "Skill must be created with an _id");
    assert.strictEqual(createdSkill.name, skillName, "Skill name must match input");
    logPass(`Created skill '${createdSkill.name}' with ID: ${createdSkill._id}`);

    const updatedSkill = await updateAdminSkill(
      createdSkill._id.toString(),
      {
        name: `${skillName}-Updated`,
        category: "DevOps & Cloud",
        level: "Advanced",
        featured: false,
        order: 1000,
        years: 6,
        status: "published",
      },
      testActor
    );
    assert.strictEqual(updatedSkill?.name, `${skillName}-Updated`, "Skill name must be updated");
    assert.strictEqual(updatedSkill?.category, "DevOps & Cloud", "Skill category must be updated");
    logPass(`Updated skill to '${updatedSkill?.name}' in category '${updatedSkill?.category}'`);

    const deleteSkillSuccess = await deleteAdminSkill(createdSkill._id.toString(), testActor);
    assert.strictEqual(deleteSkillSuccess, true, "deleteAdminSkill must return true");
    const skillCheck = await db.collection("skills").findOne({ _id: createdSkill._id });
    assert.strictEqual(skillCheck, null, "Deleted skill must not exist in collection");
    logPass(`Deleted skill and verified removal from database`);

    // -------------------------------------------------------------------------
    // TEST 5: Projects Domain CRUD & Publication Workflow Gate
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}5. Projects Domain CRUD & Publication Visibility Gate${RESET}`);
    const projectSlug = `test-portfolio-project-${Date.now()}`;
    const createdProject = await createAdminProject(
      {
        slug: projectSlug,
        title: "Phase 5 Test Microservices Platform",
        shortDescription: "Autonomous verification project summary.",
        fullDescription: "Comprehensive test description for verifying administrative CMS capabilities.",
        category: "Full Stack",
        year: "2025",
        role: "Lead Architect",
        problem: "Testing administrative state operations",
        objective: "Verify end-to-end publishing pipelines",
        solution: "Automated verification test execution",
        architectureSummary: "Next.js, TypeScript, MongoDB Atlas",
        implementation: ["API routes", "Admin Shell"],
        decisions: ["Use native drivers"],
        challenges: ["Zero downtime state updates"],
        impact: ["100% test coverage"],
        metrics: ["10x speed"],
        status: "draft", // Start as draft
        featured: false,
        order: 9999,
        technologies: ["Next.js", "TypeScript", "MongoDB Atlas"],
      },
      testActor
    );

    assert(createdProject._id, "Project must have an _id");
    assert.strictEqual(createdProject.status, "draft", "Initial project status must be 'draft'");
    logPass(`Created project '${createdProject.title}' with status 'draft'`);

    // Visibility Check: Public query must NOT return draft project
    const publicProjectsBefore = await getPublishedProjects();
    const foundDraftInPublic = publicProjectsBefore.some(
      (p) => p.slug === projectSlug
    );
    assert.strictEqual(foundDraftInPublic, false, "Draft project MUST NOT appear in getPublishedProjects()");
    logPass("Verified privacy gate: Draft project is hidden from public API");

    // Transition to Published
    const publishedProject = await updateAdminProject(
      createdProject._id.toString(),
      {
        slug: projectSlug,
        title: "Phase 5 Test Microservices Platform",
        shortDescription: "Autonomous verification project summary.",
        fullDescription: "Comprehensive test description for verifying administrative CMS capabilities.",
        category: "Full Stack",
        year: "2025",
        role: "Lead Architect",
        problem: "Testing administrative state operations",
        objective: "Verify end-to-end publishing pipelines",
        solution: "Automated verification test execution",
        architectureSummary: "Next.js, TypeScript, MongoDB Atlas",
        implementation: ["API routes", "Admin Shell"],
        decisions: ["Use native drivers"],
        challenges: ["Zero downtime state updates"],
        impact: ["100% test coverage"],
        metrics: ["10x speed"],
        status: "published", // Transition to published
        featured: false,
        order: 9999,
        technologies: ["Next.js", "TypeScript", "MongoDB Atlas"],
      },
      testActor
    );
    assert.strictEqual(publishedProject?.status, "published", "Project status must be 'published'");
    logPass("Updated project status to 'published'");

    // Visibility Check: Public query MUST return published project
    const publicProjectsAfter = await getPublishedProjects();
    const foundPublishedInPublic = publicProjectsAfter.some(
      (p) => p.slug === projectSlug
    );
    assert.strictEqual(foundPublishedInPublic, true, "Published project MUST appear in getPublishedProjects()");
    logPass("Verified publication gate: Published project is visible in public API");

    // Cleanup test project
    await deleteAdminProject(createdProject._id.toString(), testActor);
    const projCheck = await db.collection("projects").findOne({ _id: createdProject._id });
    assert.strictEqual(projCheck, null, "Deleted project must not exist in collection");
    logPass("Cleaned up test project successfully");

    // -------------------------------------------------------------------------
    // TEST 6: Experience Domain CRUD
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}6. Experience Domain CRUD Operations${RESET}`);
    const expRole = `Staff Systems Engineer [Test ${Date.now()}]`;
    const createdExp = await createAdminExperience(
      {
        company: "Test Enterprise Corp",
        role: expRole,
        location: "Pune, India",
        employmentType: "Full-time",
        startDate: "2024-01-01",
        current: true,
        description: "Leading high-scale distributed backend engineering.",
        responsibilities: ["Architected microservices for 1M+ active events"],
        technologies: ["Go", "Node.js", "Kubernetes"],
        order: 1,
        status: "published",
      },
      testActor
    );
    assert(createdExp._id, "Experience record must have an _id");
    logPass(`Created experience record: '${createdExp.role}' at '${createdExp.company}'`);

    const updatedExp = await updateAdminExperience(
      createdExp._id.toString(),
      {
        company: "Test Enterprise Corp",
        role: `${expRole} (Promoted)`,
        location: "Remote",
        employmentType: "Full-time",
        startDate: "2024-01-01",
        current: true,
        description: "Leading high-scale distributed backend engineering and architectural strategy.",
        responsibilities: ["Architected microservices for 2M+ active events"],
        technologies: ["Go", "Node.js", "Kubernetes", "gRPC"],
        order: 1,
        status: "published",
      },
      testActor
    );
    assert.strictEqual(updatedExp?.location, "Remote", "Experience location must be updated");
    logPass(`Updated experience record location to '${updatedExp?.location}'`);

    await deleteAdminExperience(createdExp._id.toString(), testActor);
    const expCheck = await db.collection("experience").findOne({ _id: createdExp._id });
    assert.strictEqual(expCheck, null, "Deleted experience must not exist in database");
    logPass("Cleaned up experience record");

    // -------------------------------------------------------------------------
    // TEST 7: Achievements, Certifications & Metrics Domains
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}7. Achievements, Certifications & Metrics Domain Operations${RESET}`);
    const testAch = await createAdminAchievement(
      {
        title: `Test Hackathon Winner ${Date.now()}`,
        organization: "National Tech Summit",
        date: "2025-06-01",
        description: "First place in national systems hackathon.",
        featured: true,
        order: 1,
        status: "published",
      },
      testActor
    );
    assert(testAch._id, "Achievement must be created");
    logPass(`Created achievement: '${testAch.title}'`);
    await deleteAdminAchievement(testAch._id.toString(), testActor);
    logPass("Deleted test achievement");

    const testCert = await createAdminCertification(
      {
        name: `Test AWS Certified Architect ${Date.now()}`,
        issuer: "Amazon Web Services",
        date: "2024-01-15",
        featured: true,
        order: 1,
        status: "published",
      },
      testActor
    );
    assert(testCert._id, "Certification must be created");
    logPass(`Created certification: '${testCert.name}'`);
    await deleteAdminCertification(testCert._id.toString(), testActor);
    logPass("Deleted test certification");

    const testMetric = await createAdminMetric(
      {
        label: "Transactions Per Second",
        value: "50,000+",
        supportingText: "Peak distributed throughput",
        featured: true,
        order: 1,
        status: "published",
      },
      testActor
    );
    assert(testMetric._id, "Metric must be created");
    logPass(`Created metric: '${testMetric.label}' (${testMetric.value})`);
    await deleteAdminMetric(testMetric._id.toString(), testActor);
    logPass("Deleted test metric");

    // -------------------------------------------------------------------------
    // TEST 8: Contact Messages Inbox Management
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}8. Contact Messages Inbox Management${RESET}`);
    const insertRes = await db.collection("contact_messages").insertOne({
      name: "Security Auditor",
      email: "auditor@example.com",
      subject: "Automated Phase 5 Verification",
      message: "Verifying administrator message triage and inbox workflows.",
      status: "unread",
      emailDeliveryStatus: "pending",
      turnstileVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const testMsgId = insertRes.insertedId;
    logPass(`Inserted test contact message with ID: ${testMsgId}`);

    const markedRead = await updateAdminContactMessageStatus(testMsgId.toString(), "mark-read", testActor);
    assert.strictEqual(markedRead?.status, "read", "Message status must be 'read'");
    logPass("Marked message as 'read'");

    const markedArchived = await updateAdminContactMessageStatus(testMsgId.toString(), "archive", testActor);
    assert.strictEqual(markedArchived?.status, "archived", "Message status must be 'archived'");
    logPass("Marked message as 'archived'");

    await deleteAdminContactMessage(testMsgId.toString(), testActor);
    const msgCheck = await db.collection("contact_messages").findOne({ _id: testMsgId });
    assert.strictEqual(msgCheck, null, "Deleted message must not exist in collection");
    logPass("Deleted test message successfully");

    // -------------------------------------------------------------------------
    // TEST 9: Revision Rollback & State Restoration Engine
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}9. Revision Rollback & State Restoration Engine${RESET}`);
    const aboutOriginal = await getAdminAbout();
    const baselineBio =
      aboutOriginal?.primaryDescription ||
      "Experienced software engineer specializing in scalable systems.";

    // Step A: Update to State 1
    const state1Bio = `State 1 Bio [Timestamp ${Date.now()}]`;
    const aboutState1 = await updateAdminAbout(
      {
        primaryDescription: state1Bio,
        philosophy: aboutOriginal?.philosophy || "Engineering simplicity over complexity.",
        order: 1,
        status: "published",
      },
      testActor
    );

    // Get the revision record created from updating to State 1
    const state1Revisions = await getAdminRevisions(aboutState1._id?.toString(), { limit: 1 });
    assert(state1Revisions.items.length > 0, "Revision must exist for state 1");
    const state1RevId = state1Revisions.items[0]._id?.toString();
    assert(state1RevId, "Revision ID must exist");
    logPass(`Saved state 1 bio and captured revision ID: ${state1RevId}`);

    // Step B: Update to State 2
    const state2Bio = `State 2 Overwritten Bio [Timestamp ${Date.now()}]`;
    await updateAdminAbout(
      {
        primaryDescription: state2Bio,
        philosophy: "Overwritten philosophy",
        order: 1,
        status: "published",
      },
      testActor
    );
    const aboutState2 = await getAdminAbout();
    assert.strictEqual(
      aboutState2?.primaryDescription,
      state2Bio,
      "Bio must now be State 2"
    );
    logPass(`Updated bio to state 2: '${state2Bio}'`);

    // Step C: Restore Revision from State 1
    const restoreSuccess = await restoreRevision(state1RevId, testActor);
    assert.strictEqual(restoreSuccess, true, "restoreRevision must return true");

    const aboutRestored = await getAdminAbout();
    assert.strictEqual(
      aboutRestored?.primaryDescription,
      state1Bio,
      "Restored bio must exactly match snapshot from State 1"
    );
    logPass(
      `Successfully restored About domain to snapshot State 1: '${aboutRestored?.primaryDescription}'`
    );

    // Cleanup About bio back to baseline
    await updateAdminAbout(
      {
        primaryDescription: baselineBio,
        philosophy: aboutOriginal?.philosophy || "Engineering simplicity over complexity.",
        order: 1,
        status: "published",
      },
      testActor
    );
    logPass("Restored About domain back to baseline content");

    // -------------------------------------------------------------------------
    // TEST 10: Activity Audit Logging & Query Filters
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}10. Activity Audit Trail Verification${RESET}`);
    const activityLogs = await getAdminActivityLogs({ limit: 20 });
    assert(activityLogs.items.length > 0, "Activity logs must contain entries from recent mutations");
    assert(
      activityLogs.items.some((log) => log.actor === testActor),
      `Activity logs must include actions recorded by '${testActor}'`
    );
    logPass(`Retrieved ${activityLogs.items.length} audit log items; test actor verified`);

    const contentLogs = await getAdminActivityLogs({ category: "content", limit: 10 });
    assert(
      contentLogs.items.every((log) => log.category === "content"),
      "All items in filtered query must have category 'content'"
    );
    logPass("Verified category filtering on activity audit logs");

    // -------------------------------------------------------------------------
    // FINAL SUMMARY
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}${GREEN}============================================================${RESET}`);
    console.log(`${BOLD}${GREEN}ALL 10 PHASE 5 ACCEPTANCE GATES PASSED SUCCESSFULLY!${RESET}`);
    console.log(`${BOLD}${GREEN}============================================================${RESET}\n`);

    process.exit(0);
  } catch (error) {
    console.error(`\n${BOLD}${RED}VERIFICATION FAILED:${RESET}`, error);
    process.exit(1);
  }
}

runVerificationSuite();
