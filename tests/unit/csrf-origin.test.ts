import { describe, it, expect } from "vitest";
import { isAllowedOrigin } from "@/lib/server/auth/session";

describe("CSRF & Origin Verification (isAllowedOrigin)", () => {
  it("allows same-origin requests matching host", () => {
    const headers = new Headers();
    headers.set("origin", "https://siddharthvarpe.com");
    headers.set("host", "siddharthvarpe.com");

    expect(isAllowedOrigin(headers)).toBe(true);
  });

  it("allows local requests in development/testing", () => {
    const headers = new Headers();
    headers.set("origin", "http://localhost:3000");
    headers.set("host", "localhost:3000");

    expect(isAllowedOrigin(headers)).toBe(true);
  });

  it("rejects malicious cross-origin requests", () => {
    const headers = new Headers();
    headers.set("origin", "https://evil-phishing-attacker.com");
    headers.set("host", "siddharthvarpe.com");

    expect(isAllowedOrigin(headers)).toBe(false);
  });

  it("evaluates referer header when origin header is absent", () => {
    const validReferer = new Headers();
    validReferer.set("referer", "https://siddharthvarpe.com/admin/projects");
    validReferer.set("host", "siddharthvarpe.com");
    expect(isAllowedOrigin(validReferer)).toBe(true);

    const maliciousReferer = new Headers();
    maliciousReferer.set("referer", "https://evil-site.com/exploit");
    maliciousReferer.set("host", "siddharthvarpe.com");
    expect(isAllowedOrigin(maliciousReferer)).toBe(false);
  });

  it("allows server-to-server or direct internal requests with neither origin nor referer", () => {
    const directHeaders = new Headers();
    directHeaders.set("host", "localhost:3000");
    expect(isAllowedOrigin(directHeaders)).toBe(true);
  });
});
