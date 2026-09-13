import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage, updateContactMessageDelivery } from "@/lib/server/db";
import { checkRateLimit, hashClientIp } from "@/lib/server/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/server/services/turnstile";
import { sendContactNotification } from "@/lib/server/services/resend";

export const dynamic = "force-dynamic";

// Maximum allowable payload size (32 KB)
const MAX_PAYLOAD_BYTES = 32 * 1024;

const contactApiSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Invalid email address").max(150, "Email cannot exceed 150 characters"),
  subject: z.string().trim().max(150, "Subject cannot exceed 150 characters").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
  turnstileToken: z.string().trim().min(1, "Security anti-bot token is required"),
  // Honeypot field: optional string, if populated it triggers silent trap
  company_hp: z.string().optional(),
});

export async function POST(req: Request) {
  // 1. Enforce Request Size Limit
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Submission exceeds maximum allowed size (32KB)." },
      { status: 413 }
    );
  }

  // 2. CSRF & Origin Validation
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      const isAllowedLocal =
        (host.startsWith("localhost") || host.startsWith("127.0.0.1")) &&
        (originUrl.host.startsWith("localhost") || originUrl.host.startsWith("127.0.0.1"));

      if (!isAllowedLocal && originUrl.host !== host && !originUrl.host.endsWith(`.${host}`)) {
        return NextResponse.json(
          { error: "Cross-origin submission rejected." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Invalid origin header." }, { status: 403 });
    }
  }

  // 3. Extract and Anonymize Client IP for Rate Limiting
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : req.headers.get("x-real-ip") || "127.0.0.1";
  const ipHash = hashClientIp(clientIp);
  const userAgent = req.headers.get("user-agent") || undefined;

  // 4. Rate Limiting Check (5 requests per 10 minutes per IP)
  const rateLimitResult = checkRateLimit(ipHash, { max: 5, windowMs: 10 * 60 * 1000 });
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: `Too many submissions from this connection. Please wait ${rateLimitResult.retryAfterSeconds} seconds before trying again.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.retryAfterSeconds.toString(),
        },
      }
    );
  }

  // 5. Parse and Validate Request Body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request payload. JSON expected." }, { status: 400 });
  }

  const parsed = contactApiSchema.safeParse(body);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues.map((i) => i.message).join(". ");
    return NextResponse.json(
      {
        error: errorDetails || "Input validation failed. Please check your form values.",
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message, turnstileToken, company_hp } = parsed.data;

  // 6. Honeypot Check (Silently drop spam bots)
  if (company_hp && company_hp.trim().length > 0) {
    console.warn("[Contact Honeypot]: Automated submission trapped by honeypot field.");
    return NextResponse.json(
      { success: true, message: "Your message has been securely received." },
      { status: 200 }
    );
  }

  // 7. Server-Side Cloudflare Turnstile Verification
  const verification = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!verification.success) {
    return NextResponse.json(
      {
        error: "Security verification failed. Please complete the anti-bot challenge and try again.",
        codes: verification.errorCodes,
      },
      { status: 400 }
    );
  }

  // 8. RELIABILITY RULE STEP 1: Persist Message to Database FIRST
  let savedMessage;
  try {
    savedMessage = await saveContactMessage({
      name,
      email,
      subject,
      message,
      turnstileVerified: true,
      ipHash,
      userAgent,
    });
  } catch (dbError) {
    console.error("[Contact Database Error]: Failed to persist message to database:", dbError instanceof Error ? dbError.message : "Unknown");
    return NextResponse.json(
      { error: "Database service temporarily unavailable. Please reach out directly via email or try again in a few moments." },
      { status: 500 }
    );
  }

  // 9. RELIABILITY RULE STEP 2: Attempt Email Notification via Resend
  // If email fails, the message is NEVER lost; status is recorded as failed/skipped
  const messageId = savedMessage._id ? savedMessage._id.toString() : null;

  try {
    const emailResult = await sendContactNotification({
      name,
      email,
      subject,
      message,
    });

    if (messageId) {
      await updateContactMessageDelivery(messageId, {
        status: "sent",
        messageId: emailResult.messageId,
      });
    }
  } catch (emailError) {
    const isUnconfigured =
      emailError instanceof Error && emailError.message.includes("RESEND_NOT_CONFIGURED");

    console.warn(
      `[Contact Email]: Email notification ${isUnconfigured ? "skipped (unconfigured)" : "failed"}, message preserved in database.`,
      emailError instanceof Error ? emailError.message : ""
    );

    if (messageId) {
      try {
        await updateContactMessageDelivery(messageId, {
          status: isUnconfigured ? "skipped" : "failed",
        });
      } catch (deliveryStatusError) {
        console.error("[Contact Delivery Status Error]:", deliveryStatusError);
      }
    }
  }

  // 10. Return Confirmed Success to Visitor
  return NextResponse.json(
    {
      success: true,
      message: "Your message has been securely received and recorded. Siddharth will review it shortly.",
    },
    { status: 200 }
  );
}
