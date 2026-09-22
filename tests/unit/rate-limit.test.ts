import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  hashClientIp,
  resetRateLimitStore,
} from "@/lib/server/security/rate-limit";

describe("Rate Limiter & IP Anonymization", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  describe("hashClientIp", () => {
    it("returns consistent 16-character SHA-256 hex slice", () => {
      const hash1 = hashClientIp("192.168.1.1");
      const hash2 = hashClientIp("192.168.1.1");
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(16);
      expect(/^[0-9a-f]{16}$/.test(hash1)).toBe(true);
    });

    it("produces distinct hashes for distinct IP addresses", () => {
      const hashA = hashClientIp("10.0.0.1");
      const hashB = hashClientIp("10.0.0.2");
      expect(hashA).not.toBe(hashB);
    });
  });

  describe("checkRateLimit", () => {
    it("allows requests up to configured limit", () => {
      const key = "test_client_allowed";
      const max = 3;

      const r1 = checkRateLimit(key, { max, windowMs: 60000 });
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit(key, { max, windowMs: 60000 });
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit(key, { max, windowMs: 60000 });
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);

      // 4th request exceeds max
      const r4 = checkRateLimit(key, { max, windowMs: 60000 });
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);
      expect(r4.retryAfterSeconds).toBeGreaterThan(0);
    });

    it("resets store correctly when requested", () => {
      const key = "test_client_reset";
      checkRateLimit(key, { max: 1 });
      const blocked = checkRateLimit(key, { max: 1 });
      expect(blocked.allowed).toBe(false);

      resetRateLimitStore(key);

      const fresh = checkRateLimit(key, { max: 1 });
      expect(fresh.allowed).toBe(true);
    });
  });
});
