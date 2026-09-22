import { describe, it, expect } from "vitest";
import nextConfig from "@/next.config";

describe("Production HTTP Security Headers", () => {
  it("defines headers function in next.config.ts", async () => {
    expect(nextConfig.headers).toBeDefined();
    expect(typeof nextConfig.headers).toBe("function");

    if (nextConfig.headers) {
      const headerConfigs = await nextConfig.headers();
      expect(Array.isArray(headerConfigs)).toBe(true);
      expect(headerConfigs.length).toBeGreaterThan(0);

      const catchAll = headerConfigs.find((h) => h.source === "/:path*");
      expect(catchAll).toBeDefined();

      const headersMap = new Map(catchAll?.headers.map((h) => [h.key, h.value]));

      // 1. MIME-type sniffing defense
      expect(headersMap.get("X-Content-Type-Options")).toBe("nosniff");

      // 2. Clickjacking defense
      expect(headersMap.get("X-Frame-Options")).toBe("DENY");

      // 3. Referrer policy
      expect(headersMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

      // 4. Permissions policy
      expect(headersMap.get("Permissions-Policy")).toContain("camera=()");
      expect(headersMap.get("Permissions-Policy")).toContain("microphone=()");
      expect(headersMap.get("Permissions-Policy")).toContain("geolocation=()");

      // 5. Strict Transport Security (HSTS)
      expect(headersMap.get("Strict-Transport-Security")).toContain("max-age=");
      expect(headersMap.get("Strict-Transport-Security")).toContain("includeSubDomains");

      // 6. Content Security Policy (CSP)
      const csp = headersMap.get("Content-Security-Policy");
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("https://challenges.cloudflare.com");
    }
  });
});
