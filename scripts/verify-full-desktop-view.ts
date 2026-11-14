import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop-1440" },
  { width: 1920, height: 1080, name: "desktop-1920" },
  { width: 1280, height: 800, name: "desktop-1280" },
  { width: 1024, height: 768, name: "desktop-1024" },
];

const OUT_DIR = path.resolve(process.cwd(), "scratch/home_hero_desktop");

async function captureFullDesktop() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const baseURL = "http://localhost:3000";

  for (const theme of ["light", "dark"]) {
    for (const vp of VIEWPORTS) {
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
      await page.waitForTimeout(600);

      const shotPath = path.join(OUT_DIR, `full-page-${vp.name}-${theme}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`📸 Full Viewport Captured: ${shotPath}`);
      await context.close();
    }
  }

  await browser.close();
}

captureFullDesktop().catch(console.error);
