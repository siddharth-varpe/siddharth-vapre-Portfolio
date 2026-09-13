"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, User, AlertCircle, ShieldCheck } from "lucide-react";
import { Input, Label } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/client/auth";

interface LoginFormProps {
  returnTo?: string;
}

export function LoginForm({ returnTo = "/admin" }: LoginFormProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Clean URL query parameters if a native browser form submission occurred
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryUser = urlParams.get("username");
      if (queryUser && !username) {
        setUsername(queryUser);
      }
      if (urlParams.has("password") || urlParams.has("username")) {
        const cleanUrl = window.location.pathname + (urlParams.get("returnTo") ? `?returnTo=${encodeURIComponent(urlParams.get("returnTo")!)}` : "");
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdentifier = username.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signIn(cleanIdentifier, cleanPassword);

      // Hard redirect to admin dashboard ensures session cookies are recognized by Server Components
      const destination = returnTo && returnTo.startsWith("/admin") ? returnTo : "/admin";
      window.location.href = destination;
    } catch (err: unknown) {
      console.error("[Login submission error]:", err);
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      if (msg.toLowerCase().includes("invalid-credential") || msg.toLowerCase().includes("user-not-found") || msg.toLowerCase().includes("wrong-password")) {
        setErrorMessage("Invalid credentials. Please verify your email/username and password.");
      } else if (msg.toLowerCase().includes("too-many-requests")) {
        setErrorMessage("Too many login attempts. Please wait 60 seconds before trying again.");
      } else {
        setErrorMessage(msg || "An unexpected authentication error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} action="#" method="post" className="space-y-4">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/20 p-3.5 text-sm text-red-300 transition-all"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">{errorMessage}</div>
        </div>
      )}

      <div>
        <Label htmlFor="admin-username" required>
          Username or Email
        </Label>
        <div className="relative">
          <Input
            id="admin-username"
            name="username"
            type="text"
            required
            autoComplete="username"
            autoFocus
            disabled={isLoading}
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10"
          />
          <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-500" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="admin-password" required className="mb-0">
            Password
          </Label>
        </div>
        <div className="relative">
          <Input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            disabled={isLoading}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
          />
          <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-500" />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        isLoading={isLoading}
        className="mt-6 font-medium"
      >
        Authenticate Session
      </Button>

      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/70" />
          <span>Encrypted Session · Firebase Authentication</span>
        </div>
      </div>
    </form>
  );
}
