import { chromium } from "@playwright/test";
import * as path from "path";

const VIEWPORTS = [
  { name: "mobile_320", width: 320, height: 640 },
  { name: "mobile_360", width: 360, height: 740 },
  { name: "mobile_375", width: 375, height: 812 },
  { name: "mobile_390", width: 390, height: 844 },
  { name: "mobile_414", width: 414, height: 896 },
  { name: "mobile_430", width: 430, height: 932 },
  { name: "mobile_475", width: 475, height: 844 },
  { name: "tablet_768", width: 768, height: 1024 },
  { name: "tablet_820", width: 820, height: 1180 },
  { name: "laptop_1024", width: 1024, height: 768 },
  { name: "desktop_1280", width: 1280, height: 800 },
  { name: "desktop_1440", width: 1440, height: 900 },
];

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/skills...");
  await page.goto("http://localhost:3000/skills", { waitUntil: "networkidle" });

  const artifactDir = "/home/siddharth/.gemini/antigravity-ide/brain/25cb1fa2-dc63-4441-b894-a6b6853cba89/.tempmediaStorage";

  // 1. Desktop Light (1440px)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  });
  await page.waitForTimeout(500);
  const desktopLightPath = path.join(artifactDir, "skills_desktop_light.png");
  await page.screenshot({ path: desktopLightPath, fullPage: true });
  console.log("Captured desktop light screenshot:", desktopLightPath);

  // 2. Desktop Dark (1440px)
  await page.evaluate(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  });
  await page.waitForTimeout(500);
  const desktopDarkPath = path.join(artifactDir, "skills_desktop_dark.png");
  await page.screenshot({ path: desktopDarkPath, fullPage: true });
  console.log("Captured desktop dark screenshot:", desktopDarkPath);

  // 3. Mobile Light (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  });
  await page.waitForTimeout(500);
  const mobileLightPath = path.join(artifactDir, "skills_mobile_light.png");
  await page.screenshot({ path: mobileLightPath, fullPage: true });
  console.log("Captured mobile light screenshot:", mobileLightPath);

  // 4. Mobile Dark (390px)
  await page.evaluate(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  });
  await page.waitForTimeout(500);
  const mobileDarkPath = path.join(artifactDir, "skills_mobile_dark.png");
  await page.screenshot({ path: mobileDarkPath, fullPage: true });
  console.log("Captured mobile dark screenshot:", mobileDarkPath);

  // 5. Test all 12 viewports for horizontal overflow
  console.log("\nTesting responsive matrix for horizontal overflow...");
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(200);
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): Overflow = ${hasOverflow ? "FAIL (Horizontal overflow detected!)" : "PASS (Clean layout)"}`);
  }

  await browser.close();
  console.log("\nSkills page visual & responsive verification complete!");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
