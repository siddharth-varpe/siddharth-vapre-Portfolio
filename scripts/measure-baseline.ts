import { chromium } from "@playwright/test";

interface MetricsReport {
  device: string;
  url: string;
  ttfbMs: number;
  domContentLoadedMs: number;
  loadMs: number;
  lcpMs: number;
  lcpElement: string;
  cls: number;
  totalTransferredBytes: number;
  scriptBytes: number;
  styleBytes: number;
  imageBytes: number;
  fontBytes: number;
  requestCount: number;
}

async function measurePage(url: string, isMobile = false): Promise<MetricsReport> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(
    isMobile
      ? {
          viewport: { width: 390, height: 844 },
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
          isMobile: true,
          hasTouch: true,
        }
      : {
          viewport: { width: 1440, height: 900 },
        }
  );

  const page = await context.newPage();

  let totalTransferredBytes = 0;
  let scriptBytes = 0;
  let styleBytes = 0;
  let imageBytes = 0;
  let fontBytes = 0;
  let requestCount = 0;

  page.on("response", async (res) => {
    requestCount++;
    try {
      const headers = res.headers();
      const length = parseInt(headers["content-length"] || "0", 10);
      const url = res.url();
      totalTransferredBytes += length;

      if (url.endsWith(".js") || headers["content-type"]?.includes("javascript")) {
        scriptBytes += length;
      } else if (url.endsWith(".css") || headers["content-type"]?.includes("css")) {
        styleBytes += length;
      } else if (headers["content-type"]?.includes("image") || url.match(/\.(png|jpg|jpeg|webp|svg|gif)/)) {
        imageBytes += length;
      } else if (headers["content-type"]?.includes("font") || url.match(/\.(woff|woff2|ttf|otf)/)) {
        fontBytes += length;
      }
    } catch {
      // ignore
    }
  });

  // Inject performance observer before navigation
  await page.addInitScript(() => {
    (window as unknown as { __lcp: number; __lcpElement: string; __cls: number }).__lcp = 0;
    (window as unknown as { __lcp: number; __lcpElement: string; __cls: number }).__lcpElement = "";
    (window as unknown as { __cls: number }).__cls = 0;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        (window as unknown as { __lcp: number; __lcpElement: string }).__lcp = lastEntry.startTime;
        (window as unknown as { __lcp: number; __lcpElement: string }).__lcpElement =
          (lastEntry as unknown as { element?: Element }).element?.tagName || "";
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as unknown as { hadRecentInput?: boolean }).hadRecentInput) {
          (window as unknown as { __cls: number }).__cls += (entry as unknown as { value: number }).value || 0;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const lcp = (window as unknown as { __lcp: number }).__lcp || 0;
    const lcpElement = (window as unknown as { __lcpElement: string }).__lcpElement || "";
    const cls = (window as unknown as { __cls: number }).__cls || 0;

    return {
      ttfb: nav ? nav.responseStart - nav.requestStart : 0,
      domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
      load: nav ? nav.loadEventEnd - nav.startTime : 0,
      lcp,
      lcpElement,
      cls,
    };
  });

  await browser.close();

  return {
    device: isMobile ? "Mobile (Pixel 7 / 390px)" : "Desktop (1440px)",
    url,
    ttfbMs: Math.round(metrics.ttfb),
    domContentLoadedMs: Math.round(metrics.domContentLoaded),
    loadMs: Math.round(metrics.load),
    lcpMs: Math.round(metrics.lcp),
    lcpElement: metrics.lcpElement,
    cls: parseFloat(metrics.cls.toFixed(4)),
    totalTransferredBytes,
    scriptBytes,
    styleBytes,
    imageBytes,
    fontBytes,
    requestCount,
  };
}

async function main() {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";
  console.log(`Auditing performance baseline against ${baseUrl}...\n`);

  const pages = ["/", "/projects", "/about", "/contact"];
  const results: MetricsReport[] = [];

  for (const p of pages) {
    const desktop = await measurePage(`${baseUrl}${p}`, false);
    const mobile = await measurePage(`${baseUrl}${p}`, true);
    results.push(desktop, mobile);
  }

  console.table(
    results.map((r) => ({
      Device: r.device,
      Page: r.url.replace(baseUrl, ""),
      "TTFB (ms)": r.ttfbMs,
      "DCL (ms)": r.domContentLoadedMs,
      "LCP (ms)": r.lcpMs,
      "LCP Tag": r.lcpElement,
      CLS: r.cls,
      "Requests": r.requestCount,
      "Total (KB)": Math.round(r.totalTransferredBytes / 1024),
      "JS (KB)": Math.round(r.scriptBytes / 1024),
      "Img (KB)": Math.round(r.imageBytes / 1024),
      "Font (KB)": Math.round(r.fontBytes / 1024),
    }))
  );
}

main().catch(console.error);
