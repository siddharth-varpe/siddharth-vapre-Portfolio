/**
 * Open Redirect Protection Utilities (Phase 4).
 *
 * Validates post-login and navigational redirects to prevent open redirection
 * attacks (OWASP A01:2021-Broken Access Control).
 */

const FORBIDDEN_SCHEMES = ["http:", "https:", "javascript:", "data:", "vbscript:", "file:"];

/**
 * Validates and sanitizes a redirect target URL.
 *
 * Enforces:
 * 1. Must be a relative path strictly within `/admin`.
 * 2. Cannot start with `//` (protocol-relative redirect to arbitrary external origin).
 * 3. Cannot contain backslashes `\` (bypasses URL parsing in certain user agents).
 * 4. Cannot contain scheme specifiers (`javascript:`, `https:`, etc.).
 *
 * @param target The target path from query parameters (e.g. `?returnTo=/admin/projects`)
 * @param fallback The safe default destination (default: `"/admin"`)
 * @returns The sanitized safe relative path
 */
export function getSafeRedirectUrl(target?: string | null, fallback = "/admin"): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();

  // Reject empty string
  if (!trimmed) {
    return fallback;
  }

  // Reject protocol-relative URLs (e.g. //evil.com)
  if (trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject backslashes (e.g. /\evil.com)
  if (trimmed.includes("\\")) {
    return fallback;
  }

  // Reject schemes (e.g. javascript:alert(1), https://evil.com)
  const lower = trimmed.toLowerCase();
  for (const scheme of FORBIDDEN_SCHEMES) {
    if (lower.startsWith(scheme) || lower.includes(`${scheme}//`)) {
      return fallback;
    }
  }

  // Must be an internal path starting with /admin
  if (!trimmed.startsWith("/admin")) {
    return fallback;
  }

  // Ensure path starts with a single slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  return trimmed;
}
