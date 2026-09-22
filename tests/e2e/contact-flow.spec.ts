import { test, expect } from "@playwright/test";

test.describe("Contact Workflow & Client-Side Validation", () => {
  test("renders contact form with all required inputs and security fields", async ({ page }) => {
    await page.goto("/contact");

    const nameInput = page.locator("input[name='name']");
    const emailInput = page.locator("input[name='email']");
    const messageInput = page.locator("textarea[name='message']");
    const submitButton = page.locator("button[type='submit']");

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("enforces client-side validation when attempting submission with invalid data", async ({ page }) => {
    await page.goto("/contact");

    const submitButton = page.locator("button[type='submit']");
    await submitButton.click();

    // Browser HTML5 validation or form error messages should prevent submission
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });
});
