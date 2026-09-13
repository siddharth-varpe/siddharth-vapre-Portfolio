import "server-only";
import type { IVerificationService } from "./index";

const CLOUDFLARE_VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export class CloudflareTurnstileService implements IVerificationService {
  private secretKey: string;

  constructor() {
    this.secretKey =
      process.env.TURNSTILE_SECRET_KEY ||
      // Cloudflare official dummy testing secret key (always passes)
      "1x0000000000000000000000000000000AA";
  }

  async verifyToken(
    token: string,
    remoteIp?: string
  ): Promise<{ success: boolean; errorCodes?: string[] }> {
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return { success: false, errorCodes: ["missing-input-response"] };
    }

    if (!this.secretKey || this.secretKey.trim().length === 0) {
      console.error("[Turnstile Error]: TURNSTILE_SECRET_KEY is not configured.");
      return { success: false, errorCodes: ["missing-secret-key"] };
    }

    try {
      // In non-production, route test failure simulation through Cloudflare's official fail test secret (2x0000000000000000000000000000000AA)
      const secret =
        process.env.NODE_ENV !== "production" &&
        (token === "test-turnstile-fail-token" || token === "simulate-turnstile-fail")
          ? "2x0000000000000000000000000000000AA"
          : this.secretKey;

      const formData = new URLSearchParams();
      formData.append("secret", secret);
      formData.append("response", token.trim());
      if (remoteIp) {
        formData.append("remoteip", remoteIp);
      }

      const response = await fetch(CLOUDFLARE_VERIFY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        // Timeout after 8 seconds
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        console.error(`[Turnstile Error]: Cloudflare endpoint returned status ${response.status}`);
        return { success: false, errorCodes: [`http-status-${response.status}`] };
      }

      const outcome = (await response.json()) as {
        success: boolean;
        "error-codes"?: string[];
        challenge_ts?: string;
        hostname?: string;
      };

      return {
        success: Boolean(outcome.success),
        errorCodes: outcome["error-codes"],
      };
    } catch (error) {
      console.error("[Turnstile Exception]: Verification request failed:", error instanceof Error ? error.message : "Unknown error");
      return { success: false, errorCodes: ["internal-verification-error"] };
    }
  }
}

export const turnstileService = new CloudflareTurnstileService();

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  return turnstileService.verifyToken(token, remoteIp);
}
