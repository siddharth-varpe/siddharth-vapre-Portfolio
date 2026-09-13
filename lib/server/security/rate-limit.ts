import "server-only";
import crypto from "node:crypto";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window cache
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Anonymize client IP address into a non-reversible truncated SHA-256 hash for logging/storage.
 */
export function hashClientIp(ip: string): string {
  const salt = process.env.BETTER_AUTH_SECRET || "portfolio_contact_salt";
  return crypto
    .createHash("sha256")
    .update(`${ip}:${salt}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Server-side sliding-window rate limiter.
 * Default: 5 requests per 10 minutes per key.
 */
export function checkRateLimit(
  key: string,
  options: { max?: number; windowMs?: number } = {}
): RateLimitResult {
  const max = options.max ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000; // 10 minutes
  const now = Date.now();

  cleanupStaleEntries(windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= max) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      allowed: false,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = max - record.timestamps.length;
  const resetTime = now + windowMs;

  return {
    allowed: true,
    remaining,
    resetTime,
    retryAfterSeconds: 0,
  };
}

/**
 * Clear rate limit store (useful for automated testing).
 */
export function resetRateLimitStore(key?: string): void {
  if (key) {
    rateLimitStore.delete(key);
  } else {
    rateLimitStore.clear();
  }
}
