import { test, expect } from "@playwright/test";

test.describe("Admin Authentication & Route Protection", () => {
  test("unauthenticated visitor navigating to /admin is redirected to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    const loginHeading = page.locator("h1, h2");
    await expect(loginHeading.first()).toBeVisible();
  });

  test("unauthenticated visitor navigating to /admin/projects is redirected with returnTo parameter", async ({ page }) => {
    await page.goto("/admin/projects");
    await expect(page).toHaveURL(/\/admin\/login.*returnTo/);
  });

  test("unauthenticated request to protected API /api/admin/stats returns 401 Unauthorized", async ({ request }) => {
    const response = await request.get("/api/admin/stats");
    expect([401, 403]).toContain(response.status());
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.error.toLowerCase()).toContain("unauthorized");
  });

  test("submitting invalid credentials displays an appropriate error message", async ({ page }) => {
    await page.goto("/admin/login");

    const emailInput = page.locator("#admin-username");
    const passwordInput = page.locator("#admin-password");
    const submitBtn = page.locator("button[type='submit']");

    await expect(emailInput).toBeVisible();
    await emailInput.fill("invalid-admin@example.com");
    await passwordInput.fill("wrong-password-attempt");
    await submitBtn.click();

    // Verify error banner is displayed inside the login form
    const errorAlert = page.locator("form [role='alert'], [data-testid='login-error-alert']");
    await expect(errorAlert).toBeVisible({ timeout: 10000 });
    const alertText = await errorAlert.textContent();
    expect(alertText).toMatch(/invalid|failed|incorrect|too many/i);
  });
});
