"use client";

import * as React from "react";
import { LogOut, Key, CheckCircle, AlertTriangle, Shield, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/client/auth";
import { Button } from "@/components/ui/button";
import { Input, Label, FormErrorText, FormHelperText } from "@/components/ui/form-controls";
import { Badge } from "@/components/ui/badge";

interface AdminPanelProps {
  user: {
    id: string;
    name: string;
    username?: string;
    email: string;
  };
  session: {
    id: string;
    expiresAt: string | Date;
  };
  isDefaultPassword: boolean;
}

export function AdminPanel({ user, session, isDefaultPassword }: AdminPanelProps) {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordStatus, setPasswordStatus] = React.useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const [testStatus, setTestStatus] = React.useState<{
    loading: boolean;
    result?: string;
  }>({ loading: false });

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("[Logout error]:", err);
      setIsLoggingOut(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 8 characters long.",
      });
      return;
    }

    setIsChangingPassword(true);
    setPasswordStatus({ type: "idle" });

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordStatus({
          type: "error",
          message: data.message || data.error || "Failed to update password.",
        });
      } else {
        setPasswordStatus({
          type: "success",
          message: "Password updated successfully. Other sessions have been revoked.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordStatus({
        type: "error",
        message: "An error occurred while contacting the server.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTestProtectedApi = async () => {
    setTestStatus({ loading: true });
    try {
      const res = await fetch("/api/admin/test-protected");
      const data = await res.json();
      setTestStatus({
        loading: false,
        result: `Status ${res.status}: ${JSON.stringify(data, null, 2)}`,
      });
    } catch (err: unknown) {
      setTestStatus({
        loading: false,
        result: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Bootstrap Credentials Warning Banner */}
      {isDefaultPassword && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200 backdrop-blur-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
          <div className="flex-1 text-sm">
            <span className="font-semibold text-amber-300">Default Credentials Active: </span>
            Your administrative account is currently secured with initial bootstrap credentials.
            Please update your password using the form below before deploying to production.
          </div>
          <Badge variant="warning" className="font-mono">
            BOOTSTRAP
          </Badge>
        </div>
      )}

      {/* Admin Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Card */}
        <div className="rounded-xl border border-white/10 bg-surface-muted/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">
                Active Session
              </h2>
            </div>
            <Badge variant="success">
              AUTHENTICATED
            </Badge>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-neutral-400">Username</span>
              <span className="text-white font-semibold">{user.username || "admin"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-neutral-400">Admin Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-neutral-400">User ID</span>
              <span className="text-neutral-300 truncate max-w-[200px]">{user.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Session Expiry</span>
              <span className="text-neutral-300">
                {new Date(session.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="destructive"
              size="sm"
              isLoading={isLoggingOut}
              onClick={handleSignOut}
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Sign Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              isLoading={testStatus.loading}
              onClick={handleTestProtectedApi}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Verify Protected API
            </Button>
          </div>

          {testStatus.result && (
            <div className="mt-4 rounded-md bg-black/60 p-3 font-mono text-[11px] text-neutral-300 overflow-x-auto border border-white/5">
              <pre>{testStatus.result}</pre>
            </div>
          )}
        </div>

        {/* Change Password Card */}
        <div className="rounded-xl border border-white/10 bg-surface-muted/40 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Key className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">
              Security Credentials
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="current-pw" required>
                Current Password
              </Label>
              <Input
                id="current-pw"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="new-pw" required>
                New Password
              </Label>
              <Input
                id="new-pw"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className="h-9 text-xs"
              />
              <FormHelperText>Must include uppercase letter and number.</FormHelperText>
            </div>

            <div>
              <Label htmlFor="confirm-pw" required>
                Confirm New Password
              </Label>
              <Input
                id="confirm-pw"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 text-xs"
              />
            </div>

            {passwordStatus.type === "error" && (
              <FormErrorText>{passwordStatus.message}</FormErrorText>
            )}

            {passwordStatus.type === "success" && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2 font-medium">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isChangingPassword}
              className="mt-4 w-full"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
