import { test, expect } from "@playwright/test";

test.describe("Public Site Pages & Core Navigation", () => {
  const publicRoutes = [
    { path: "/", titleFragment: "Siddharth Varpe" },
    { path: "/about", titleFragment: "About" },
    { path: "/experience", titleFragment: "Experience" },
    { path: "/projects", titleFragment: "Projects" },
    { path: "/skills", titleFragment: "Skills" },
    { path: "/achievements", titleFragment: "Achievements" },
    { path: "/certifications", titleFragment: "Certifications" },
    { path: "/contact", titleFragment: "Contact" },
  ];

  for (const route of publicRoutes) {
    test(`loads public route ${route.path} with 200 status and valid title`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toContain(route.titleFragment);

      // Verify page has an accessible main heading
      const h1 = page.locator("h1");
      await expect(h1.first()).toBeVisible();

      // Ensure no uncaught fatal JavaScript errors occurred
      const criticalErrors = consoleErrors.filter(
        (e) => !e.includes("favicon") && !e.includes("deprecated")
      );
      expect(criticalErrors.length).toBe(0);
    });
  }

  test("projects page contains responsive 4-column grid layout", async ({ page }) => {
    await page.goto("/projects");
    const grid = page.locator(".lg\\:grid-cols-4");
    await expect(grid).toBeVisible();
  });

  test("theme toggle correctly toggles light and dark modes", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.locator("button[aria-label*='Switch to' i]");
    await expect(themeToggle).toBeVisible({ timeout: 10000 });

    const htmlElem = page.locator("html");
    const initialTheme = await htmlElem.getAttribute("data-theme");

    // Click to toggle
    await themeToggle.click();
    await expect(htmlElem).not.toHaveAttribute("data-theme", initialTheme || "unknown");
  });

  test("footer contains active resume link and architecture stamp", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const resumeLink = footer.locator("a[href*='/api/resume/download']");
    await expect(resumeLink).toBeVisible();

    const archStamp = footer.locator("text=ARCHITECTURE: NEXT.JS 15");
    await expect(archStamp).toBeVisible();
  });
});
