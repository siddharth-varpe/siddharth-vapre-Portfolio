import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const VIEWPORTS = [
  { width: 320, height: 650, name: "mobile-320" },
  { width: 360, height: 740, name: "mobile-360" },
  { width: 375, height: 667, name: "mobile-375" },
  { width: 390, height: 844, name: "mobile-390" },
  { width: 414, height: 896, name: "mobile-414" },
  { width: 430, height: 932, name: "mobile-430" },
  { width: 475, height: 850, name: "mobile-475" },
  { width: 768, height: 1024, name: "tablet-768" },
  { width: 820, height: 1180, name: "tablet-820" },
  { width: 1024, height: 768, name: "desktop-1024" },
  { width: 1280, height: 800, name: "desktop-1280" },
  { width: 1440, height: 900, name: "desktop-1440" },
];

async function main() {
  const outputDir = path.join(
    process.cwd(),
    "scratch",
    "track_screenshots"
  );
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const theme of ["light", "dark"] as const) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });

      // Set theme in localStorage before navigating
      await page.addInitScript((th) => {
        localStorage.setItem("theme", th);
      }, theme);

      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

      // Ensure html class matches theme
      await page.evaluate((th) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(th);
        document.documentElement.setAttribute("data-theme", th);
      }, theme);

      await page.waitForTimeout(400);

      // Locate the Professional Track Section
      const section = page.locator('section[aria-label="Professional Track Record"]');
      if (await section.count() > 0) {
        const outPath = path.join(outputDir, `${vp.name}-${theme}.png`);
        await section.first().screenshot({ path: outPath });
        console.log(`[Captured] ${vp.name} (${theme}) -> ${outPath}`);
      } else {
        console.warn(`[Missing] Professional track section not found at ${vp.name}`);
      }

      await page.close();
    }
  }

  await browser.close();
  console.log("All professional track responsive screenshots captured!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
