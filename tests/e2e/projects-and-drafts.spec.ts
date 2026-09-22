import { test, expect } from "@playwright/test";

test.describe("Project Detail Resolution & Draft Security", () => {
  const publishedSlugs = [
    { slug: "crm-sr-enterprises", expectedTitle: "CRM — SR Enterprises" },
    { slug: "inventory-management-platform", expectedTitle: "Inventory Management Platform" },
  ];

  for (const { slug, expectedTitle } of publishedSlugs) {
    test(`resolves published project slug /projects/${slug}`, async ({ page }) => {
      const response = await page.goto(`/projects/${slug}`);
      expect(response?.status()).toBe(200);

      const title = page.locator("h1");
      await expect(title).toBeVisible();
      await expect(title).toContainText(expectedTitle);

      // Verify essential case-study sections appear
      const bodyText = await page.textContent("body");
      expect(bodyText).toContain("Architecture");
      expect(bodyText).toContain("Tech Stack");
    });
  }

  test("returns 404 view when directly accessing non-existent or unpublished project slug", async ({ page }) => {
    const response = await page.goto("/projects/unreleased-private-draft-project");
    expect([200, 404]).toContain(response?.status());

    const bodyText = await page.textContent("body");
    expect(bodyText).toContain("404");
    expect(bodyText).toContain("Page Not Found");
  });
});
