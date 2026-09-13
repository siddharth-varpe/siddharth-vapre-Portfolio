"use client";

import * as React from "react";
import { Send, CheckCircle2, AlertCircle, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import { TurnstileWidget } from "./turnstile-widget";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  TechnicalLabel,
} from "@/components/ui";

interface ContactFormProps {
  turnstileSiteKey?: string;
}

type FormState =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "rate_limited";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
  company_hp: string; // Honeypot
}

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstileToken?: string;
}

export function ContactForm({ turnstileSiteKey = "" }: ContactFormProps) {
  const [values, setValues] = React.useState<FormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
    turnstileToken: "",
    company_hp: "",
  });

  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formState, setFormState] = React.useState<FormState>("idle");
  const [serverMessage, setServerMessage] = React.useState<string>("");

  // Validate fields client-side before submitting
  const validateForm = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Your name is required.";
    } else if (values.name.length > 100) {
      nextErrors.name = "Name cannot exceed 100 characters.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Your email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    } else if (values.email.length > 150) {
      nextErrors.email = "Email cannot exceed 150 characters.";
    }

    if (values.subject && values.subject.length > 150) {
      nextErrors.subject = "Subject cannot exceed 150 characters.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Please include a message.";
    } else if (values.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    } else if (values.message.length > 5000) {
      nextErrors.message = "Message cannot exceed 5000 characters.";
    }

    if (!values.turnstileToken) {
      nextErrors.turnstileToken = "Please complete the security verification challenge.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTurnstileVerify = React.useCallback((token: string) => {
    setValues((prev) => ({ ...prev, turnstileToken: token }));
    setErrors((prev) => ({ ...prev, turnstileToken: undefined }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 429) {
        setFormState("rate_limited");
        setServerMessage(
          data.error || "Rate limit exceeded. Please wait a few minutes before trying again."
        );
        return;
      }

      if (!response.ok) {
        setFormState("error");
        setServerMessage(
          data.error || "Failed to submit message. Please verify your input or try again."
        );
        return;
      }

      // Confirmed server-side persistence success
      setFormState("success");
      setServerMessage(
        data.message || "Your message has been securely recorded and routed to Siddharth Varpe."
      );
    } catch (err) {
      setFormState("error");
      setServerMessage(
        "Network connection error. Please check your internet connection or email directly."
      );
      console.error("[Contact Form Network Error]:", err);
    }
  };

  const handleReset = () => {
    setValues({
      name: "",
      email: "",
      subject: "",
      message: "",
      turnstileToken: "",
      company_hp: "",
    });
    setErrors({});
    setFormState("idle");
    setServerMessage("");
  };

  if (formState === "success") {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5 p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <TechnicalLabel className="text-emerald-400">STATUS // MESSAGE RECORDED</TechnicalLabel>
            <h3 className="text-xl font-bold text-foreground mt-0.5">Transmission Confirmed</h3>
          </div>
        </div>

        <p className="text-sm text-foreground-secondary leading-relaxed font-sans">
          {serverMessage}
        </p>

        <div className="p-4 rounded-lg border border-border bg-surface/80 space-y-2 text-xs font-mono text-foreground-muted">
          <div className="flex items-center justify-between">
            <span>DATABASE STORAGE:</span>
            <span className="text-emerald-400 font-semibold">PERSISTED (PostgreSQL Database)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>DISPATCH TARGET:</span>
            <span className="text-foreground">Siddharth Varpe</span>
          </div>
          <div className="flex items-center justify-between">
            <span>EXPECTED TURNAROUND:</span>
            <span className="text-accent">24–48 Hours</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Send Another Message</span>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-surface/90 shadow-xl">
      <CardHeader className="space-y-1.5 pb-6 border-b border-border/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <TechnicalLabel>INTERACTIVE INQUIRY PIPELINE</TechnicalLabel>
          </div>
          <span className="font-mono text-[10px] text-foreground-muted">TLS 1.3 ENCRYPTED</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Send a Direct Message
        </CardTitle>
        <CardDescription className="text-sm text-foreground-secondary leading-relaxed">
          Submit an engineering inquiry, collaboration request, or role opportunity. Messages are securely stored and reviewed personally.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-5 pt-6">
          {/* Honeypot field (hidden from real users, traps bots) */}
          <div
            style={{
              position: "absolute",
              opacity: 0,
              zIndex: -1,
              width: 0,
              height: 0,
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            <label htmlFor="company_hp">Company (leave blank)</label>
            <input
              type="text"
              id="company_hp"
              name="company_hp"
              value={values.company_hp}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Error Banner if server or rate limit error */}
          {(formState === "error" || formState === "rate_limited") && (
            <div
              role="alert"
              className="p-4 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-start gap-3 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-mono uppercase font-semibold text-rose-300 block">
                  {formState === "rate_limited" ? "RATE LIMIT TRIGGERED" : "SUBMISSION ERROR"}
                </span>
                <p className="text-foreground-secondary leading-relaxed">{serverMessage}</p>
              </div>
            </div>
          )}

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="font-mono text-xs uppercase tracking-wider text-foreground font-medium block"
              >
                Your Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                disabled={formState === "submitting"}
                placeholder="e.g. Alex Morgan"
                className={`w-full rounded-md border bg-surface-muted/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.name ? "border-rose-500/80 focus:ring-rose-500" : "border-border"
                }`}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                required
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-rose-400 font-mono" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-wider text-foreground font-medium block"
              >
                Email Address <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                disabled={formState === "submitting"}
                placeholder="e.g. alex@company.com"
                className={`w-full rounded-md border bg-surface-muted/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.email ? "border-rose-500/80 focus:ring-rose-500" : "border-border"
                }`}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-rose-400 font-mono" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="font-mono text-xs uppercase tracking-wider text-foreground font-medium block"
            >
              Subject / Topic <span className="text-foreground-muted text-[10px] lowercase">(optional)</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              disabled={formState === "submitting"}
              placeholder="e.g. Software Engineer Opportunity / Enterprise Project"
              className={`w-full rounded-md border bg-surface-muted/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                errors.subject ? "border-rose-500/80 focus:ring-rose-500" : "border-border"
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-rose-400 font-mono" role="alert">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="message"
                className="font-mono text-xs uppercase tracking-wider text-foreground font-medium block"
              >
                Message <span className="text-accent">*</span>
              </label>
              <span className="text-[11px] font-mono text-foreground-muted">
                {values.message.length} / 5000 chars
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={handleChange}
              disabled={formState === "submitting"}
              placeholder="Provide context regarding the engineering opportunity, problem statement, or inquiry..."
              className={`w-full rounded-md border bg-surface-muted/50 p-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-y leading-relaxed ${
                errors.message ? "border-rose-500/80 focus:ring-rose-500" : "border-border"
              }`}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            {errors.message && (
              <p id="message-error" className="text-xs text-rose-400 font-mono" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Cloudflare Turnstile Anti-Bot Widget */}
          <div className="pt-1">
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onVerify={handleTurnstileVerify}
              onError={() => setErrors((p) => ({ ...p, turnstileToken: "Verification error" }))}
              onExpire={() => setValues((p) => ({ ...p, turnstileToken: "" }))}
            />
            {errors.turnstileToken && (
              <p className="text-xs text-rose-400 font-mono pt-1" role="alert">
                {errors.turnstileToken}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/80">
          <div className="text-[11px] font-mono text-foreground-muted flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Spam Guarantee // Durable Persistence</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={formState === "submitting"}
            className="w-full sm:w-auto gap-2 text-xs font-semibold px-6 h-11"
          >
            {formState === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Recording Message...</span>
              </>
            ) : (
              <>
                <span>Transmit Message</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
