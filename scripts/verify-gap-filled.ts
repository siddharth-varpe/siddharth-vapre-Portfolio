import { chromium } from "playwright";

async function verifyGapFilled() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  });

  // Test port 3001 where user is looking!
  const port = 3001;
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Capture hero on light mode
  await page.screenshot({ path: "scratch/port3001_1440_light.png" });
  console.log("📸 Saved scratch/port3001_1440_light.png");

  // Capture hero on dark mode
  await page.evaluate(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/port3001_1440_dark.png" });
  console.log("📸 Saved scratch/port3001_1440_dark.png");

  // Laptop view (1280x768)
  await page.setViewportSize({ width: 1280, height: 768 });
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch/port3001_1280_light.png" });
  console.log("📸 Saved scratch/port3001_1280_light.png");

  await browser.close();
  console.log("Verification on port 3001 complete!");
}

verifyGapFilled().catch(console.error);
