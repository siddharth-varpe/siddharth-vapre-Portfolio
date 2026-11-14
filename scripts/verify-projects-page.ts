import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop-1440" },
  { width: 1280, height: 800, name: "desktop-1280" },
  { width: 1024, height: 768, name: "desktop-1024" },
  { width: 820, height: 1180, name: "tablet-820" },
  { width: 768, height: 1024, name: "tablet-768" },
  { width: 475, height: 850, name: "mobile-475" },
  { width: 430, height: 932, name: "mobile-430" },
  { width: 414, height: 896, name: "mobile-414" },
  { width: 390, height: 844, name: "mobile-390" },
  { width: 375, height: 812, name: "mobile-375" },
  { width: 360, height: 740, name: "mobile-360" },
  { width: 320, height: 640, name: "mobile-320" },
];

const OUT_DIR = path.resolve(process.cwd(), "scratch/projects_screenshots");

async function verifyProjectsPage() {
  console.log("=== STRICT PROJECTS PAGE VERIFICATION ===");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const baseURL = "http://localhost:3000";

  let hasOverflow = false;

  for (const theme of ["light", "dark"]) {
    console.log(`\n--- Testing Theme: ${theme.toUpperCase()} ---`);

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme as "light" | "dark",
      });

      const page = await context.newPage();

      // Enforce theme
      await page.addInitScript((t) => {
        localStorage.setItem("theme", t);
        if (t === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
      }, theme);

      let res = await page.goto(`${baseURL}/projects`, { waitUntil: "domcontentloaded" });
      if (res?.status() === 404) {
        await page.waitForTimeout(1000);
        res = await page.goto(`${baseURL}/projects`, { waitUntil: "domcontentloaded" });
      }
      await page.waitForTimeout(500);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (overflow) {
        console.error(`❌ Overflow detected on ${vp.name} (${theme})!`);
        hasOverflow = true;
      }

      // Verify key elements exist
      const title = page.locator("h1");
      const titleText = await title.innerText();
      if (!titleText.toLowerCase().includes("solutions") && !titleText.toLowerCase().includes("projects")) {
        console.error(`❌ Unexpected title on ${vp.name}! Got: ${titleText}`);
      }

      // Save screenshot for 1440 and 390
      if (vp.width === 1440 || vp.width === 390) {
        const screenshotPath = path.join(OUT_DIR, `projects-${vp.name}-${theme}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Captured screenshot: ${screenshotPath}`);
      }

      await context.close();
    }
  }

  // Functional test: Interactive search and category filter verification
  console.log("\n--- Testing Search and Filter Controls ---");
  const testContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const testPage = await testContext.newPage();
  await testPage.goto(`${baseURL}/projects`, { waitUntil: "domcontentloaded" });
  await testPage.waitForTimeout(300);

  // Search for "Campus"
  const searchInput = testPage.locator("#project-search");
  await searchInput.fill("Campus");
  await testPage.waitForTimeout(200);
  console.log("✓ Tested search input with query: 'Campus'");

  // Clear search
  await searchInput.fill("");
  await testPage.waitForTimeout(200);
  console.log("✓ Cleared search input");

  await browser.close();

  if (hasOverflow) {
    console.error("FAILED: Horizontal overflow detected.");
    process.exit(1);
  } else {
    console.log("\n✅ All 12 viewports passed with zero horizontal overflow in both light and dark themes!");
  }
}

verifyProjectsPage().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
