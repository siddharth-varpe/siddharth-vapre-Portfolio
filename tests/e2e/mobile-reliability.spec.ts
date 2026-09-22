import { test, expect } from "@playwright/test";

const MOBILE_VIEWPORTS = [
  { name: "320px (Ultra-narrow iPhone SE1)", width: 320, height: 568 },
  { name: "360px (Galaxy S8 / Android Standard)", width: 360, height: 800 },
  { name: "375px (iPhone SE2 / SE3)", width: 375, height: 667 },
  { name: "390px (iPhone 12/13/14)", width: 390, height: 844 },
  { name: "414px (iPhone XR / 11)", width: 414, height: 896 },
  { name: "430px (iPhone 14/15/16 Pro Max)", width: 430, height: 932 },
  { name: "480px (Wide Mobile Viewport)", width: 480, height: 854 },
];

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/skills",
  "/achievements",
  "/certifications",
  "/contact",
];

test.describe("Mobile Viewport Overflow Audit", () => {
  for (const vp of MOBILE_VIEWPORTS) {
    test(`no horizontal overflow on ${vp.name} across public pages`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of PUBLIC_PAGES) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(250);

        // Check if document content width exceeds viewport width
        const overflow = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          return {
            scrollWidth,
            innerWidth,
            hasOverflow: scrollWidth > innerWidth,
          };
        });

        expect(
          overflow.hasOverflow,
          `Horizontal overflow detected on ${route} at ${vp.width}px! scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth}`
        ).toBe(false);
      }
    });
  }
});

test.describe("Mobile Navigation & Header Reliability", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
  });

  test("mobile menu button meets touch target and opens drawer", async ({ page }) => {
    const menuBtn = page.locator("button[aria-label*='navigation menu']");
    await expect(menuBtn).toBeVisible();

    const box = await menuBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(40);
      expect(box.height).toBeGreaterThanOrEqual(40);
    }

    // Click to open drawer
    await menuBtn.click();
    const drawer = page.locator("#mobile-navigation");
    await expect(drawer).toBeVisible();

    // Verify body scroll lock
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("hidden");

    // Verify last navigation item and download resume CTA are visible in drawer
    const resumeBtn = drawer.locator("a[href*='/api/resume/download']");
    await expect(resumeBtn).toBeVisible();

    // Close on escape key
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
  });
});

test.describe("Featured Projects Mobile Auto-Slider", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const carousel = page.locator("div[role='region'][aria-roledescription='carousel']");
    await carousel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  });

  test("slider renders clean carousel card with active project on mobile", async ({ page }) => {
    const carousel = page.locator("div[role='region'][aria-roledescription='carousel']");
    await expect(carousel).toBeVisible();

    // Verify active slide has title and case study link
    const caseStudyLink = carousel.locator("a[aria-label*='Read case study']");
    await expect(caseStudyLink).toBeVisible();
  });

  test("touch swipe advances slides on mobile", async ({ page }) => {
    const carousel = page.locator("div[role='region'][aria-roledescription='carousel']");
    await expect(carousel).toBeVisible();

    const sliderContainer = carousel.locator(".touch-pan-y");
    await expect(sliderContainer).toBeVisible();

    // Get initial slide label
    const initialSlide = await carousel.locator("div[role='group'][aria-roledescription='slide']").getAttribute("aria-label");

    const box = await sliderContainer.boundingBox();
    if (box) {
      // Simulate left swipe (drag from right to left)
      const startX = box.x + box.width * 0.8;
      const endX = box.x + box.width * 0.2;
      const y = box.y + box.height * 0.5;

      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 5 });
      await page.mouse.up();

      await page.waitForTimeout(600);

      // Verify slide changed
      const nextSlide = await carousel.locator("div[role='group'][aria-roledescription='slide']").getAttribute("aria-label");
      expect(nextSlide).not.toEqual(initialSlide);
    }
  });

  test("continuous autoscroll advances slides automatically", async ({ page }) => {
    const carousel = page.locator("div[role='region'][aria-roledescription='carousel']");
    await expect(carousel).toBeVisible();

    const initialSlide = await carousel.locator("div[role='group'][aria-roledescription='slide']").getAttribute("aria-label");

    // Wait for auto-scroll interval (5s) + animation buffer (1.2s)
    await page.waitForTimeout(6200);

    const autoAdvancedSlide = await carousel.locator("div[role='group'][aria-roledescription='slide']").getAttribute("aria-label");
    expect(autoAdvancedSlide).not.toEqual(initialSlide);
  });
});

test.describe("Mobile 2-Column Card Grid Systems", () => {
  test("skills page renders 2-column grid on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/skills");

    const twoColGrid = page.locator(".grid-cols-2").first();
    await expect(twoColGrid).toBeVisible();
  });

  test("achievements page renders responsive grid on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/achievements");

    const grid = page.locator(".grid.min-\\[380px\\]\\:grid-cols-2");
    await expect(grid).toBeVisible();
  });

  test("certifications page renders responsive grid on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/certifications");

    const grid = page.locator(".grid.min-\\[380px\\]\\:grid-cols-2");
    await expect(grid).toBeVisible();
  });
});

test.describe("Mobile Form Reliability & iOS Auto-Zoom Prevention", () => {
  test("contact inputs have computed font-size >= 16px to prevent iOS zoom", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/contact");

    const nameInput = page.locator("input#name");
    const emailInput = page.locator("input#email");
    const messageTextarea = page.locator("textarea#message");

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();

    const nameFontSize = await nameInput.evaluate(
      (el) => parseFloat(window.getComputedStyle(el).fontSize)
    );
    const emailFontSize = await emailInput.evaluate(
      (el) => parseFloat(window.getComputedStyle(el).fontSize)
    );
    const messageFontSize = await messageTextarea.evaluate(
      (el) => parseFloat(window.getComputedStyle(el).fontSize)
    );

    // Must be >= 16px to prevent iOS Safari auto-zoom
    expect(nameFontSize).toBeGreaterThanOrEqual(16);
    expect(emailFontSize).toBeGreaterThanOrEqual(16);
    expect(messageFontSize).toBeGreaterThanOrEqual(16);
  });
});
