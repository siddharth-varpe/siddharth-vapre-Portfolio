import { requireAdminSession } from "@/lib/server/auth/session";
import { isUsingBootstrapPassword } from "@/lib/server/auth/bootstrap";
import { AdminPanel } from "@/components/admin/admin-panel";
import { Terminal } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Dashboard | Siddharth Varpe Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Protected Admin Root Page (Phase 4).
 *
 * Enforces server-side authentication via `requireAdminSession()`.
 * Unauthenticated requests are automatically intercepted and redirected to `/admin/login`.
 */
export default async function AdminPage() {
  const sessionContext = await requireAdminSession({ returnTo: "/admin" });

  if (!sessionContext) {
    return null;
  }

  const { user, session } = sessionContext;
  const isDefault = await isUsingBootstrapPassword(user.id);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <Terminal className="h-3.5 w-3.5 text-accent" />
            <span>SIDDHARTH VARPE // CORE ADMIN GATEWAY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Authentication & Security Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-xs font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENCRYPTED HTTPS</span>
          </div>
        </div>
      </div>

      {/* Admin Panel Component */}
      <AdminPanel
        user={{
          id: user.id,
          name: user.name,
          username: (user as { username?: string }).username,
          email: user.email,
        }}
        session={{
          id: session.id,
          expiresAt: session.expiresAt,
        }}
        isDefaultPassword={isDefault}
      />
    </main>
  );
}
