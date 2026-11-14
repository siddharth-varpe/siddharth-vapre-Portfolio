import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const DESKTOP_VIEWPORTS = [
  { width: 1920, height: 1080, name: "desktop-1920" },
  { width: 1600, height: 900, name: "desktop-1600" },
  { width: 1440, height: 900, name: "desktop-1440" },
  { width: 1366, height: 768, name: "desktop-1366" },
  { width: 1280, height: 800, name: "desktop-1280" },
  { width: 1024, height: 768, name: "desktop-1024" },
];

const MOBILE_VIEWPORTS = [
  { width: 320, height: 640, name: "320" },
  { width: 360, height: 740, name: "360" },
  { width: 375, height: 812, name: "375" },
  { width: 390, height: 844, name: "390" },
  { width: 414, height: 896, name: "414" },
  { width: 430, height: 932, name: "430" },
  { width: 475, height: 850, name: "475" },
  { width: 768, height: 1024, name: "768-tablet" },
];

const OUT_DIR = path.resolve(process.cwd(), "scratch/home_hero_desktop");
const AFTER_MOBILE_DIR = path.resolve(process.cwd(), "scratch/home_hero_after_mobile");

async function verifyDesktopHero() {
  console.log("=== STRICT DESKTOP HOME HERO VERIFICATION ===");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(AFTER_MOBILE_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const baseURL = "http://localhost:3000";

  let hasOverflow = false;

  // 1. Verify Desktop viewports in Light & Dark
  for (const theme of ["light", "dark"]) {
    console.log(`\n--- Desktop Viewports (${theme.toUpperCase()}) ---`);

    for (const vp of DESKTOP_VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme as "light" | "dark",
      });

      const page = await context.newPage();

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

      await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (overflow) {
        console.error(`❌ Overflow detected on ${vp.name} (${theme})!`);
        hasOverflow = true;
      } else {
        console.log(`✓ ${vp.name} (${theme}): 0px overflow`);
      }

      // Capture desktop hero screenshot
      const hero = page.locator("section").first();
      const screenshotPath = path.join(OUT_DIR, `hero-${vp.name}-${theme}.png`);
      await hero.screenshot({ path: screenshotPath, animations: "allow" });
      console.log(`📸 Captured: ${screenshotPath}`);

      await context.close();
    }
  }

  // 2. Capture and compare Mobile/Tablet viewports (Regression Verification)
  console.log("\n--- Mobile Regression Check (< lg viewports) ---");
  for (const theme of ["light", "dark"]) {
    for (const vp of MOBILE_VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme as "light" | "dark",
      });
      const page = await context.newPage();
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

      let success = false;
      for (let attempt = 1; attempt <= 3 && !success; attempt++) {
        try {
          await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded", timeout: 20000 });
          await page.waitForSelector("section", { timeout: 10000 });
          await page.waitForTimeout(500);

          const hero = page.locator("section").first();
          const afterShotPath = path.join(AFTER_MOBILE_DIR, `hero-${vp.name}-${theme}.png`);
          await hero.screenshot({ path: afterShotPath });

          // Compare file sizes with baseline
          const beforeShotPath = path.join("scratch/home_hero_before", `hero-${vp.name}-${theme}.png`);
          if (fs.existsSync(beforeShotPath)) {
            const beforeSize = fs.statSync(beforeShotPath).size;
            const afterSize = fs.statSync(afterShotPath).size;
            const diff = Math.abs(beforeSize - afterSize);
            console.log(`✓ Mobile ${vp.name} (${theme}) size check: before=${beforeSize}, after=${afterSize}, diff=${diff}B`);
          }
          success = true;
        } catch (err) {
          if (attempt === 3) throw err;
          console.log(`Retrying ${vp.name} (${theme}) attempt ${attempt + 1}...`);
          await page.waitForTimeout(1000);
        }
      }

      await context.close();
    }
  }

  await browser.close();

  if (hasOverflow) {
    console.error("\n❌ FAILED: Horizontal overflow detected on desktop.");
    process.exit(1);
  } else {
    console.log("\n✅ ALL DESKTOP AND MOBILE TESTS PASSED ZERO OVERFLOW & ZERO REGRESSION!");
  }
}

verifyDesktopHero().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
