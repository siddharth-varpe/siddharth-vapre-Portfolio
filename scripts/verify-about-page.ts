import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIEWPORTS = [
  { width: 320, height: 600, label: "320px-mobile-compact" },
  { width: 360, height: 740, label: "360px-mobile-standard" },
  { width: 375, height: 667, label: "375px-iphone-se" },
  { width: 390, height: 844, label: "390px-iphone-14" },
  { width: 414, height: 896, label: "414px-mobile-large" },
  { width: 430, height: 932, label: "430px-iphone-14-pro-max" },
  { width: 475, height: 850, label: "475px-large-phablet" },
  { width: 768, height: 1024, label: "768px-tablet-portrait" },
  { width: 820, height: 1180, label: "820px-ipad-air" },
  { width: 1024, height: 768, label: "1024px-desktop-small" },
  { width: 1280, height: 800, label: "1280px-desktop-standard" },
  { width: 1440, height: 900, label: "1440px-desktop-wide" },
];

const OUTPUT_DIR = path.resolve(
  process.cwd(),
  "scratch/about_screenshots"
);

async function runVerification() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const baseURL = "http://localhost:3000";

  console.log("=== STARTING ABOUT PAGE PLAYWRIGHT VERIFICATION ===");
  console.log(`Target: ${baseURL}/about`);

  let anyOverflow = false;

  for (const vp of VIEWPORTS) {
    // 1. Light Mode
    const contextLight = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "light",
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${baseURL}/about`, { waitUntil: "networkidle" });

    // Explicitly enforce light mode in DOM
    await pageLight.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    });
    await pageLight.waitForTimeout(100);

    // Check horizontal overflow
    const overflowLight = await pageLight.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });

    if (overflowLight) {
      console.error(`❌ [Light] Horizontal overflow detected at ${vp.width}px (${vp.label})`);
      anyOverflow = true;
    } else {
      console.log(`✅ [Light] No horizontal overflow at ${vp.width}px (${vp.label})`);
    }

    // Capture screenshot
    const lightPath = path.join(OUTPUT_DIR, `about-${vp.label}-light.png`);
    await pageLight.screenshot({ path: lightPath, fullPage: true });

    // 2. Dark Mode
    const contextDark = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "dark",
    });
    const pageDark = await contextDark.newPage();
    await pageDark.goto(`${baseURL}/about`, { waitUntil: "networkidle" });

    // Explicitly enforce dark class in DOM
    await pageDark.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await pageDark.waitForTimeout(100);

    const overflowDark = await pageDark.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });

    if (overflowDark) {
      console.error(`❌ [Dark] Horizontal overflow detected at ${vp.width}px (${vp.label})`);
      anyOverflow = true;
    } else {
      console.log(`✅ [Dark] No horizontal overflow at ${vp.width}px (${vp.label})`);
    }

    const darkPath = path.join(OUTPUT_DIR, `about-${vp.label}-dark.png`);
    await pageDark.screenshot({ path: darkPath, fullPage: true });

    // Verify key elements exist on 1280px
    if (vp.width === 1280) {
      console.log("\n--- Verifying Section Content Elements on 1280px ---");

      // Verify Eyebrow
      const eyebrowVisible = await pageLight.locator("text=ABOUT ME").first().isVisible();
      console.log(`Eyebrow 'ABOUT ME' visible: ${eyebrowVisible}`);

      // Verify Title
      const titleVisible = await pageLight.locator("text=Turning Ideas").first().isVisible();
      console.log(`Title 'Turning Ideas' visible: ${titleVisible}`);

      // Verify Real Portrait
      const portraitSrc = await pageLight.locator("img[alt='Siddharth Varpe portrait']").first().getAttribute("src");
      console.log(`Portrait src: ${portraitSrc}`);
      const isOriginalPortrait = (portraitSrc || "").includes("siddharth-face-original");
      console.log(`Using approved authentic portrait: ${isOriginalPortrait}`);

      // Verify Experience Section
      const expVisible = await pageLight.locator("text=EXPERIENCE & BACKGROUND").first().isVisible();
      console.log(`Experience Section visible: ${expVisible}`);

      // Verify Pillars Section
      const pillarsVisible = await pageLight.locator("text=ARCHITECTURAL PILLARS").first().isVisible();
      console.log(`Architectural Pillars visible: ${pillarsVisible}`);

      // Verify Closing Visual
      const closingVisible = await pageLight.locator("img[alt='Developer looking at sunset over mountain horizon']").first().isVisible();
      console.log(`Closing Visual visible: ${closingVisible}`);
    }

    await contextLight.close();
    await contextDark.close();
  }

  await browser.close();

  if (anyOverflow) {
    console.error("\n❌ FAILED: Horizontal overflow was detected on some viewports.");
    process.exit(1);
  } else {
    console.log("\n🎉 ALL 12 VIEWPORTS PASSED WITH ZERO HORIZONTAL OVERFLOW!");
    console.log(`Screenshots saved to: ${OUTPUT_DIR}`);
  }
}

runVerification().catch((err) => {
  console.error("Verification script failed:", err);
  process.exit(1);
});
