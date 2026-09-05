import { requireAdminSession } from "@/lib/server/auth/session";
import { isUsingBootstrapPassword } from "@/lib/server/auth/bootstrap";
import { AdminPanel } from "@/components/admin/admin-panel";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account & Security | Admin CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSecurityPage() {
  const sessionContext = await requireAdminSession({ returnTo: "/admin/security" });

  if (!sessionContext) {
    return null;
  }

  const { user, session } = sessionContext;
  const isDefault = await isUsingBootstrapPassword(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>SECURITY ARCHITECTURE // HARD GATEWAY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Account & Security Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage administrative credentials, active sessions, and cryptographic keys.
          </p>
        </div>
      </div>

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
    </div>
  );
}
