import "server-only";
import type { IEmailService } from "./index";

const RESEND_API_ENDPOINT = "https://api.resend.com/emails";

/**
 * Strictly escapes special HTML characters to prevent XSS and HTML injection in email clients.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class ResendEmailService implements IEmailService {
  private apiKey: string;
  private toEmail: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || "";
    this.toEmail = process.env.CONTACT_EMAIL || "siddharth.varpe0@gmail.com";
    this.fromEmail = process.env.RESEND_FROM_EMAIL || "Siddharth Portfolio <onboarding@resend.dev>";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.includes("placeholder"));
  }

  async sendContactNotification(params: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ messageId: string }> {
    if (!this.isConfigured()) {
      console.warn("[Email Notification]: RESEND_API_KEY is not configured. Email notification skipped.");
      throw new Error("RESEND_NOT_CONFIGURED: RESEND_API_KEY is not configured");
    }

    const safeName = escapeHtml(params.name.trim());
    const safeEmail = escapeHtml(params.email.trim());
    const safeSubject = escapeHtml(params.subject?.trim() || "New Portfolio Inquiry");
    const safeMessage = escapeHtml(params.message.trim()).replace(/\n/g, "<br />");
    const receivedAt = new Date().toUTCString();

    const plainText = [
      `New contact message received on Siddharth Varpe Portfolio:`,
      `--------------------------------------------------`,
      `Sender:  ${params.name.trim()} <${params.email.trim()}>`,
      `Subject: ${params.subject?.trim() || "Inquiry from Portfolio"}`,
      `Time:    ${receivedAt}`,
      `--------------------------------------------------`,
      `Message:`,
      params.message.trim(),
      `--------------------------------------------------`,
      `Review full message details in your Admin CMS:`,
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/messages`,
    ].join("\n");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090a0f; color: #f4f4f5; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #12131a; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; border-bottom: 1px solid #27272a; background-color: #181922;">
        <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8;">NEW INCOMING INQUIRY</span>
        <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 6px 0 0 0;">${safeSubject}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <table width="100%" style="font-size: 13px; color: #a1a1aa; margin-bottom: 20px;">
          <tr>
            <td style="padding: 4px 0; width: 80px; font-weight: 600;">From:</td>
            <td style="padding: 4px 0; color: #ffffff;">${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a>&gt;</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; width: 80px; font-weight: 600;">Date:</td>
            <td style="padding: 4px 0; color: #e4e4e7;">${receivedAt}</td>
          </tr>
        </table>
        <div style="background-color: #0d0e14; border: 1px solid #27272a; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e4e4e7; font-family: monospace;">
          ${safeMessage}
        </div>
        <div style="margin-top: 24px; text-align: right;">
          <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(params.subject || 'Your Inquiry')}" style="display: inline-block; background-color: #ffffff; color: #09090b; font-size: 12px; font-weight: 600; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Reply to ${safeName}</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 24px; background-color: #0d0e14; border-top: 1px solid #27272a; font-size: 11px; color: #71717a; text-align: center; font-family: monospace;">
        Siddharth Varpe Portfolio // Verified Contact Delivery Pipeline
      </td>
    </tr>
  </table>
</body>
</html>
`;

    try {
      const response = await fetch(RESEND_API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [this.toEmail],
          reply_to: params.email.trim(),
          subject: `[Portfolio Inquiry] ${params.subject?.trim() || `Message from ${params.name.trim()}`}`,
          text: plainText,
          html: htmlContent,
        }),
        signal: AbortSignal.timeout(10000),
      });

      const data = (await response.json()) as { id?: string; error?: { message?: string; name?: string } };

      if (!response.ok || !data.id) {
        const errorMsg = data.error?.message || `HTTP ${response.status} from Resend`;
        console.error(`[Resend Delivery Error]: ${errorMsg}`);
        throw new Error(`RESEND_DELIVERY_FAILED: ${errorMsg}`);
      }

      return { messageId: data.id };
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("RESEND_")) {
        throw error;
      }
      console.error("[Resend Network Exception]:", error instanceof Error ? error.message : "Unknown error");
      throw new Error(`RESEND_NETWORK_FAILED: ${error instanceof Error ? error.message : "Network error"}`);
    }
  }
}

export const emailService = new ResendEmailService();

export async function sendContactNotification(params: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ messageId: string }> {
  return emailService.sendContactNotification(params);
}
