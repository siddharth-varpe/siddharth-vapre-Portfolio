import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function verifyFooter() {
  console.log("=== Verifying Strict Footer UI Reconstruction ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const outDir = path.resolve(process.cwd(), "scratch/footer_screenshots");
  fs.mkdirSync(outDir, { recursive: true });

  const viewports = [
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

  // 1. Functional & Visual Tests on Desktop (Light & Dark)
  for (const theme of ["light", "dark"]) {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: theme as "light" | "dark" });
    await page.addInitScript((t) => {
      localStorage.setItem("theme", t);
    }, theme);
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const footer = page.locator("footer");
    await expectVisible(footer, "Footer container");

    // Scroll to footer
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Verify key elements
    const archStamp = footer.locator("text=ARCHITECTURE: NEXT.JS 15");
    await expectVisible(archStamp, "Architecture Stamp");

    const resumeLink = footer.locator("a[href*='/api/resume/download']");
    await expectVisible(resumeLink, "Active Resume Link");

    const adminLink = footer.locator("a[href*='/admin/login']");
    await expectVisible(adminLink, "Admin Gateway Link");

    // Capture screenshot of footer
    const screenshotPath = path.join(outDir, `footer-desktop-1440-${theme}.png`);
    await footer.screenshot({ path: screenshotPath });
    console.log(`📸 Captured: ${screenshotPath}`);

    // Test Back to Top button
    if (theme === "light") {
      const backToTop = footer.locator("button[aria-label='Scroll back to top of page']");
      if (await backToTop.isVisible()) {
        await backToTop.click();
        await page.waitForTimeout(600);
        const scrollY = await page.evaluate(() => window.scrollY);
        console.log(`⬆️ Back to Top clicked, scrollY is now: ${scrollY}`);
      }
    }
    await page.close();
  }

  // 2. Mobile Tests (Light & Dark)
  for (const theme of ["light", "dark"]) {
    const page = await context.newPage();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: theme as "light" | "dark" });
    await page.addInitScript((t) => {
      localStorage.setItem("theme", t);
    }, theme);
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const screenshotPath = path.join(outDir, `footer-mobile-375-${theme}.png`);
    await footer.screenshot({ path: screenshotPath });
    console.log(`📸 Captured: ${screenshotPath}`);
    await page.close();
  }

  // 3. Overflow Test across all 12 viewports
  console.log("\n--- Checking for Horizontal Overflow across 12 Viewports ---");
  const overflowPage = await context.newPage();
  let anyOverflow = false;
  for (const vp of viewports) {
    await overflowPage.setViewportSize({ width: vp.width, height: vp.height });
    await overflowPage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    const footer = overflowPage.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await overflowPage.waitForTimeout(100);

    const hasOverflow = await overflowPage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (hasOverflow) {
      console.error(`❌ Overflow detected at ${vp.width}px (${vp.name})`);
      anyOverflow = true;
    } else {
      console.log(`✅ No overflow at ${vp.width}px (${vp.name})`);
    }
  }

  await browser.close();

  if (anyOverflow) {
    console.error("FAILED: Horizontal overflow detected.");
    process.exit(1);
  } else {
    console.log("\n🎉 ALL FOOTER VERIFICATION CHECKS PASSED!");
  }
}

async function expectVisible(locator: { isVisible: () => Promise<boolean> }, name: string) {
  const visible = await locator.isVisible();
  if (!visible) {
    throw new Error(`Expected element "${name}" to be visible!`);
  }
  console.log(`✅ Element verified visible: ${name}`);
}

verifyFooter().catch((err) => {
  console.error("Footer verification failed:", err);
  process.exit(1);
});
