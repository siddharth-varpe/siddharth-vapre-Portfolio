import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirror server-side validation schema
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
  company_hp: z.string().optional(),
});

describe("Contact Form Input Validation & Anti-Abuse", () => {
  it("accepts a valid contact submission", () => {
    const valid = {
      name: "Alice Recruiter",
      email: "alice@example.com",
      subject: "Senior Full-Stack Opportunity",
      message: "Hello Siddharth, I was very impressed by your work and would like to connect.",
      turnstileToken: "valid-dummy-token",
    };

    const res = contactApiSchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.name).toBe("Alice Recruiter");
      expect(res.data.email).toBe("alice@example.com");
    }
  });

  it("rejects empty name", () => {
    const payload = {
      name: "   ",
      email: "valid@example.com",
      message: "This is a valid message length exceeding ten characters.",
      turnstileToken: "token",
    };

    const res = contactApiSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it("rejects invalid email formats", () => {
    const invalidEmails = [
      "not-an-email",
      "missing-at.com",
      "@missing-user.com",
      "spaces in@email.com",
    ];

    for (const email of invalidEmails) {
      const res = contactApiSchema.safeParse({
        name: "Tester",
        email,
        message: "This is a valid message length exceeding ten characters.",
        turnstileToken: "token",
      });
      expect(res.success).toBe(false);
    }
  });

  it("rejects message shorter than 10 characters", () => {
    const payload = {
      name: "Tester",
      email: "valid@example.com",
      message: "Too short",
      turnstileToken: "token",
    };

    const res = contactApiSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it("rejects message exceeding 5000 characters", () => {
    const oversized = "A".repeat(5001);
    const payload = {
      name: "Tester",
      email: "valid@example.com",
      message: oversized,
      turnstileToken: "token",
    };

    const res = contactApiSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it("requires turnstile anti-bot token", () => {
    const payload = {
      name: "Tester",
      email: "valid@example.com",
      message: "Valid message length here for testing.",
      turnstileToken: "",
    };

    const res = contactApiSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it("identifies honeypot populated field", () => {
    const botPayload = {
      name: "Spam Bot",
      email: "bot@spam.com",
      message: "Buy cheap backlinks now for your site!",
      turnstileToken: "dummy",
      company_hp: "Bot Marketing Inc", // Honeypot populated!
    };

    const res = contactApiSchema.safeParse(botPayload);
    expect(res.success).toBe(true);
    // When company_hp has content, server silently traps and drops submission
    expect(res.data?.company_hp?.trim().length).toBeGreaterThan(0);
  });
});
