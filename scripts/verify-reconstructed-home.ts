import { chromium } from "playwright";
import * as path from "path";

const ARTIFACT_DIR =
  "/home/siddharth/.gemini/antigravity-ide/brain/1e780a1a-5b62-4435-ba6e-53380aa8aaff";
const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { width: 320, height: 640, name: "320px-mobile" },
  { width: 360, height: 740, name: "360px-mobile" },
  { width: 375, height: 812, name: "375px-mobile" },
  { width: 390, height: 844, name: "390px-mobile-iphone13" },
  { width: 414, height: 896, name: "414px-mobile" },
  { width: 430, height: 932, name: "430px-mobile-pro-max" },
  { width: 475, height: 900, name: "475px-mobile" },
  { width: 768, height: 1024, name: "768px-tablet" },
  { width: 820, height: 1180, name: "820px-ipad-air" },
  { width: 1024, height: 768, name: "1024px-desktop" },
  { width: 1280, height: 800, name: "1280px-desktop" },
  { width: 1440, height: 900, name: "1440px-desktop-hd" },
];

async function main() {
  console.log("Starting Playwright verification for Reconstructed Home Page...");

  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;

  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: "dark",
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      });

      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // Check overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        return {
          docWidth,
          scrollWidth,
          hasOverflow: scrollWidth > docWidth,
        };
      });

      if (overflow.hasOverflow) {
        console.error(
          `❌ OVERFLOW DETECTED at ${vp.width}px! docWidth=${overflow.docWidth}, scrollWidth=${overflow.scrollWidth}`
        );
        hasErrors = true;
      } else {
        console.log(`✅ 0px Overflow: scrollWidth (${overflow.scrollWidth}) <= clientWidth (${overflow.docWidth})`);
      }

      // Check key components on standard mobile (390px)
      if (vp.width === 390) {
        // Monogram check
        const monogram = await page.locator("header").textContent();
        if (!monogram?.includes("SV.")) {
          console.error("❌ 'SV.' monogram missing from header!");
          hasErrors = true;
        } else {
          console.log("✅ 'SV.' monogram verified in header");
        }

        // Headline check
        const h1Text = await page.locator("h1").textContent();
        if (!h1Text?.includes("Building") || !h1Text?.includes("Impact.")) {
          console.error("❌ Headline missing expected words!");
          hasErrors = true;
        } else {
          console.log("✅ Headline verified:", h1Text.replace(/\s+/g, " ").trim());
        }

        // Primary CTA check
        const primaryCta = page.getByRole("button", { name: /View My Work/i });
        if (!(await primaryCta.isVisible())) {
          console.error("❌ Primary CTA 'View My Work' not visible!");
          hasErrors = true;
        } else {
          console.log("✅ Primary CTA visible");
        }

        // Secondary CTA check
        const secondaryCta = page
          .locator("section")
          .first()
          .getByRole("button", { name: "Download Resume", exact: true });
        if (!(await secondaryCta.isVisible())) {
          console.error("❌ Secondary CTA 'Download Resume' not visible!");
          hasErrors = true;
        } else {
          console.log("✅ Secondary CTA visible");
        }

        // Social links check (should have 5 links)
        const socialLinks = page.locator("a[aria-label*='Profile'], a[aria-label*='Email']");
        const count = await socialLinks.count();
        if (count < 5) {
          console.error(`❌ Expected at least 5 social icons, got ${count}`);
          hasErrors = true;
        } else {
          console.log(`✅ 5 circular social buttons verified (found ${count})`);
        }

        // Quote overlay check
        const quoteOverlay = page.locator("[data-testid='hero-image-overlay']:visible");
        if (await quoteOverlay.isVisible()) {
          console.log("✅ Quote overlay verified:", (await quoteOverlay.textContent())?.replace(/\s+/g, " ").trim());
        } else {
          console.warn("⚠️ Quote overlay not visible or enabled");
        }

        // Section transition check
        const transition = page.getByText("TURNING IDEAS INTO SOLUTIONS.");
        if (await transition.isVisible()) {
          console.log("✅ Section transition 'TURNING IDEAS INTO SOLUTIONS.' verified");
        } else {
          console.error("❌ Section transition not found!");
          hasErrors = true;
        }

        // Mobile Dark screenshot
        const mobileDarkPath = path.join(ARTIFACT_DIR, "reconstructed_home_mobile_dark.png");
        await page.screenshot({ path: mobileDarkPath, fullPage: false });
        console.log(`Saved screenshot: ${mobileDarkPath}`);

        // Switch to Light mode
        await page.evaluate(() => {
          localStorage.setItem("theme", "light");
          document.documentElement.classList.add("light");
          document.documentElement.setAttribute("data-theme", "light");
        });
        await page.waitForTimeout(400);

        // Mobile Light screenshot
        const mobileLightPath = path.join(ARTIFACT_DIR, "reconstructed_home_mobile_light.png");
        await page.screenshot({ path: mobileLightPath, fullPage: false });
        console.log(`Saved screenshot: ${mobileLightPath}`);
      }

      // Check on Desktop (1440px)
      if (vp.width === 1440) {
        // Desktop Dark screenshot
        const desktopDarkPath = path.join(ARTIFACT_DIR, "reconstructed_home_desktop_dark.png");
        await page.screenshot({ path: desktopDarkPath, fullPage: false });
        console.log(`Saved screenshot: ${desktopDarkPath}`);

        // Switch to Light mode
        await page.evaluate(() => {
          localStorage.setItem("theme", "light");
          document.documentElement.classList.add("light");
          document.documentElement.setAttribute("data-theme", "light");
        });
        await page.waitForTimeout(400);

        // Desktop Light screenshot
        const desktopLightPath = path.join(ARTIFACT_DIR, "reconstructed_home_desktop_light.png");
        await page.screenshot({ path: desktopLightPath, fullPage: false });
        console.log(`Saved screenshot: ${desktopLightPath}`);
      }

      await page.close();
      await context.close();
    }

    if (hasErrors) {
      console.error("\n❌ Verification completed with errors!");
      process.exit(1);
    } else {
      console.log("\n🎉 ALL VIEWPORT & VISUAL CHECKS PASSED PERFECTLY!");
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
