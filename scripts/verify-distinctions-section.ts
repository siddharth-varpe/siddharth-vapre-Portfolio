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
    "distinctions_screenshots"
  );
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const theme of ["light", "dark"] as const) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });

      await page.emulateMedia({ reducedMotion: "reduce" });

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

      // 1. Locate Verified Distinctions Section
      const distinctionsSection = page.locator('section[aria-label="Verified Distinctions"]');
      if (await distinctionsSection.count() > 0) {
        await distinctionsSection.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        const outPath = path.join(outputDir, `distinctions-${vp.name}-${theme}.png`);
        await distinctionsSection.first().screenshot({ path: outPath });
      }

      // 2. Locate Open for Opportunities Section
      const oppsSection = page.locator('section[aria-label="Open for Opportunities"]');
      if (await oppsSection.count() > 0) {
        await oppsSection.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        const outPath = path.join(outputDir, `opportunities-${vp.name}-${theme}.png`);
        await oppsSection.first().screenshot({ path: outPath });
      }

      // 3. Capture Combined View of Both Sections (Matching Reference Image)
      if (await distinctionsSection.count() > 0 && await oppsSection.count() > 0) {
        // Scroll to distinctions section top
        await distinctionsSection.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);

        // Get bounding boxes of both sections
        const distBox = await distinctionsSection.first().boundingBox();
        const oppBox = await oppsSection.first().boundingBox();

        if (distBox && oppBox) {
          const clipX = Math.min(distBox.x, oppBox.x);
          const clipY = Math.min(distBox.y, oppBox.y);
          const clipWidth = Math.max(distBox.x + distBox.width, oppBox.x + oppBox.width) - clipX;
          const clipHeight = (oppBox.y + oppBox.height) - clipY;

          const outPath = path.join(outputDir, `combined-${vp.name}-${theme}.png`);
          await page.screenshot({
            path: outPath,
            clip: {
              x: Math.max(0, clipX - 10),
              y: Math.max(0, clipY - 10),
              width: clipWidth + 20,
              height: clipHeight + 20,
            },
          });
          console.log(`[Captured Combined] ${vp.name} (${theme}) -> ${outPath}`);
        }
      }

      await page.close();
    }
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
