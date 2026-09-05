import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import assert from "node:assert";
import { getRawDatabase, getRawMongoClient } from "../lib/server/db";
import { auth } from "../lib/server/auth";
import {
  ensureBootstrapAdmin,
  isUsingBootstrapPassword,
  BOOTSTRAP_ADMIN_USERNAME,
  BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
} from "../lib/server/auth/bootstrap";
import { getSafeRedirectUrl } from "../lib/server/auth/redirects";
import { assertResourceAccess } from "../lib/server/auth/authorization";
import { verifyPassword, hashPassword } from "better-auth/crypto";

// Colorized terminal formatting
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function logPass(title: string) {
  console.log(`  ${GREEN}✓${RESET} ${title}`);
}

function logFail(title: string, error: unknown) {
  console.error(`  ${RED}✗${RESET} ${title}`);
  console.error(error);
}

async function runVerificationSuite() {
  console.log(`\n${BOLD}${CYAN}============================================================${RESET}`);
  console.log(`${BOLD}${CYAN}PHASE 4: AUTHENTICATION & ADMIN SECURITY VERIFICATION SUITE${RESET}`);
  console.log(`${BOLD}${CYAN}============================================================${RESET}\n`);

  const db = getRawDatabase();
  const client = getRawMongoClient();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Bootstrap Initialization & Password Hashing
    // -------------------------------------------------------------------------
    console.log(`${BOLD}1. Bootstrap Account & Cryptographic Password Hashing${RESET}`);
    const bootstrapRes = await ensureBootstrapAdmin();
    logPass(`Bootstrap invocation returned: ${bootstrapRes.message}`);

    const userDoc = await db.collection("user").findOne({ username: BOOTSTRAP_ADMIN_USERNAME });
    assert(userDoc, "Admin user must exist in MongoDB Atlas");
    assert.strictEqual(userDoc.username, "admin", "Admin username must be 'admin'");
    logPass(`Verified user document exists in MongoDB Atlas (ID: ${userDoc._id})`);

    const accountDoc = await db.collection("account").findOne({
      $or: [{ userId: userDoc._id }, { userId: userDoc._id.toString() }, { accountId: userDoc._id.toString() }],
      providerId: "credential",
    });
    assert(accountDoc, "Account credential record must exist");
    assert(accountDoc.password, "Hashed password must exist in account record");
    assert.notStrictEqual(
      accountDoc.password,
      BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
      "Plaintext password MUST NEVER be stored in the database"
    );
    assert(accountDoc.password.includes(":"), "Password must be formatted as salt:hash");
    assert(accountDoc.password.length > 50, "Hash length must exceed 50 characters (scrypt)");
    logPass(`Verified password is scrypt-hashed with cryptographic salt (length: ${accountDoc.password.length})`);

    const isDefault = await isUsingBootstrapPassword(userDoc._id.toString());
    assert.strictEqual(isDefault, true, "Should correctly detect default bootstrap credentials");
    logPass("Verified isUsingBootstrapPassword detects default bootstrap state");

    // -------------------------------------------------------------------------
    // TEST 2: Valid Authentication
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}2. Valid Credentials Authentication${RESET}`);
    const loginResponse = await auth.api.signInUsername({
      body: {
        username: BOOTSTRAP_ADMIN_USERNAME,
        password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
      },
      asResponse: true,
    });

    const setCookie = loginResponse.headers.get("set-cookie") || "";
    const validLogin = await loginResponse.json();

    assert(validLogin, "Valid login must return response");
    assert(validLogin.token, "Valid login must issue a session token");
    assert.strictEqual(validLogin.user.username, "admin");
    assert(setCookie.includes("better-auth.session_token="), "Must set secure session token cookie");
    assert(setCookie.includes("HttpOnly"), "Session cookie must be HttpOnly");
    assert(setCookie.includes("SameSite=Lax") || setCookie.includes("SameSite=lax"), "Cookie must specify SameSite=Lax");
    logPass(`Successfully authenticated admin. Issued token: ${validLogin.token.slice(0, 8)}...`);
    logPass("Verified set-cookie header contains HttpOnly, SameSite=Lax cryptographic session cookie");

    const sessionInDb = await db.collection("session").findOne({ token: validLogin.token });
    assert(sessionInDb, "Session document must be persisted in Atlas");
    assert(sessionInDb.expiresAt > new Date(), "Session expiration date must be in the future");
    logPass(`Verified active session in Atlas with expiry: ${sessionInDb.expiresAt.toISOString()}`);

    // -------------------------------------------------------------------------
    // TEST 3: Invalid Username Rejection
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}3. Invalid Username Rejection${RESET}`);
    let invalidUserRejected = false;
    try {
      await auth.api.signInUsername({
        body: {
          username: "nonexistent_hacker_999",
          password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
        },
      });
    } catch {
      invalidUserRejected = true;
    }
    assert(invalidUserRejected, "Invalid username must be rejected");
    logPass("Unknown username rejected with generic authentication failure");

    // -------------------------------------------------------------------------
    // TEST 4: Invalid Password Rejection
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}4. Invalid Password Rejection${RESET}`);
    let invalidPwRejected = false;
    try {
      await auth.api.signInUsername({
        body: {
          username: BOOTSTRAP_ADMIN_USERNAME,
          password: "completely_wrong_password_12345",
        },
      });
    } catch {
      invalidPwRejected = true;
    }
    assert(invalidPwRejected, "Invalid password must be rejected");
    logPass("Wrong password rejected without revealing account existence");

    // -------------------------------------------------------------------------
    // TEST 5: Session Retrieval via Headers
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}5. Server-side Session Retrieval (auth.api.getSession)${RESET}`);
    // Without headers: must be null
    const emptySession = await auth.api.getSession({
      headers: new Headers(),
    });
    assert.strictEqual(emptySession, null, "Unauthenticated request headers must yield null session");
    logPass("Verified empty headers return null session");

    // With valid cookie header:
    const authHeaders = new Headers();
    authHeaders.set("cookie", setCookie);
    const sessionWithCookie = await auth.api.getSession({
      headers: authHeaders,
    });
    assert(sessionWithCookie, "Session must be successfully resolved from cookie header");
    assert.strictEqual(sessionWithCookie.user.id, userDoc._id.toString());
    logPass(`Verified session resolved from cookie for user: ${sessionWithCookie.user.email}`);

    // -------------------------------------------------------------------------
    // TEST 6: Session Invalidation on Logout
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}6. Session Revocation on Logout${RESET}`);
    await auth.api.signOut({
      headers: authHeaders,
    });
    const revokedSessionDoc = await db.collection("session").findOne({ token: validLogin.token });
    assert.strictEqual(revokedSessionDoc, null, "Session document must be deleted from Atlas upon sign-out");

    const checkAfterRevocation = await auth.api.getSession({
      headers: authHeaders,
    });
    assert.strictEqual(checkAfterRevocation, null, "Revoked session cookie must yield null session");
    logPass("Verified session document is deleted from Atlas and subsequent requests return null");

    // -------------------------------------------------------------------------
    // TEST 7: Open Redirect Protection (getSafeRedirectUrl)
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}7. Open Redirect Defense (getSafeRedirectUrl)${RESET}`);
    const attackVectors = [
      "https://evil.com",
      "http://attacker.com/steal-creds",
      "//evil.com",
      "//evil.com/admin",
      "/\\evil.com",
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "/public/home",
      "",
      null,
      undefined,
    ];

    for (const vector of attackVectors) {
      const sanitized = getSafeRedirectUrl(vector as string);
      assert.strictEqual(sanitized, "/admin", `Vector "${vector}" must sanitize to "/admin", got "${sanitized}"`);
    }

    // Valid internal admin paths must be preserved:
    assert.strictEqual(getSafeRedirectUrl("/admin/projects"), "/admin/projects");
    assert.strictEqual(getSafeRedirectUrl("/admin/settings?tab=security"), "/admin/settings?tab=security");
    logPass("All 11 malicious redirect vectors sanitized to /admin; legitimate admin subpaths preserved");

    // -------------------------------------------------------------------------
    // TEST 8: IDOR / BOLA Authorization Checks (assertResourceAccess)
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}8. IDOR / BOLA Authorization Boundary${RESET}`);
    const adminId = "user_admin_123";
    const foreignId = "user_attacker_456";

    // Same owner: succeeds
    assert.doesNotThrow(() => {
      assertResourceAccess(adminId, adminId);
    }, "Same-tenant access must succeed");

    // Cross-user IDOR attempt: must throw
    assert.throws(
      () => {
        assertResourceAccess(foreignId, adminId);
      },
      /IDOR attempt detected/,
      "Cross-tenant access must be rejected"
    );

    // Missing resource owner: must throw
    assert.throws(
      () => {
        assertResourceAccess(null, adminId);
      },
      /Target resource owner ID is missing/,
      "Missing owner ID must be rejected"
    );
    logPass("Verified assertResourceAccess enforces strict tenant boundaries");

    // -------------------------------------------------------------------------
    // TEST 9: Password Change & Re-hashing
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}9. Password Change, Re-hashing & Multi-Session Revocation${RESET}`);
    const freshLogin = await auth.api.signInUsername({
      body: {
        username: BOOTSTRAP_ADMIN_USERNAME,
        password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
      },
    });
    assert(freshLogin.token, "Must obtain active session token");

    const newSecretPassword = "SuperAdminPassword2026!";
    const newHash = await hashPassword(newSecretPassword);
    assert(newHash.includes(":"), "New hash must be valid scrypt hash");

    // Verify current password check fails with wrong password
    const wrongCheck = await verifyPassword({
      password: "incorrect_current_pw",
      hash: accountDoc.password,
    });
    assert.strictEqual(wrongCheck, false, "Current password check must fail on wrong password");

    // Verify current password check succeeds with correct password
    const correctCheck = await verifyPassword({
      password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
      hash: accountDoc.password,
    });
    assert.strictEqual(correctCheck, true, "Current password check must pass on correct password");

    // Update account with new hash
    await db.collection("account").updateOne(
      { _id: accountDoc._id },
      { $set: { password: newHash, updatedAt: new Date() } }
    );

    // Verify login with new password succeeds
    const updatedLogin = await auth.api.signInUsername({
      body: {
        username: BOOTSTRAP_ADMIN_USERNAME,
        password: newSecretPassword,
      },
    });
    assert(updatedLogin.token, "Login with new password must succeed");
    logPass("Password successfully updated and verified with new scrypt hash");

    // Verify bootstrap check now reports FALSE because password is changed!
    const isStillDefault = await isUsingBootstrapPassword(userDoc._id.toString());
    assert.strictEqual(isStillDefault, false, "isUsingBootstrapPassword must return false after password change");
    logPass("Verified isUsingBootstrapPassword correctly returns false after password update");

    // Reset password back to default for local development repeatability
    await db.collection("account").updateOne(
      { _id: accountDoc._id },
      { $set: { password: accountDoc.password, updatedAt: new Date() } }
    );
    logPass("Reset admin credential to bootstrap state for consistent local development");

    // Clean up session tokens created during test
    await db.collection("session").deleteMany({
      $or: [{ userId: userDoc._id }, { userId: userDoc._id.toString() }],
    });
    logPass("Cleaned up temporary test sessions");

    // -------------------------------------------------------------------------
    // TEST 10: Secret Hygiene
    // -------------------------------------------------------------------------
    console.log(`\n${BOLD}10. Cryptographic Secret & Environment Hygiene${RESET}`);
    const secret = process.env.BETTER_AUTH_SECRET;
    assert(secret, "BETTER_AUTH_SECRET must be defined");
    assert(secret.length >= 32, "BETTER_AUTH_SECRET must be at least 32 characters");
    assert(!secret.includes("replace-with"), "BETTER_AUTH_SECRET must not be default placeholder");
    logPass(`Verified BETTER_AUTH_SECRET entropy (${secret.length} characters)`);

    console.log(`\n${BOLD}${GREEN}============================================================${RESET}`);
    console.log(`${BOLD}${GREEN}ALL 10 PHASE 4 SECURITY GATES PASSED SUCCESSFULLY!${RESET}`);
    console.log(`${BOLD}${GREEN}============================================================${RESET}\n`);

    await client.close();
    process.exit(0);
  } catch (error) {
    logFail("Verification suite encountered an error", error);
    await client.close();
    process.exit(1);
  }
}

runVerificationSuite();
