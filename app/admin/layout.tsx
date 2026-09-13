import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Siddharth Varpe",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

import { getServerSession } from "@/lib/server/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin Layout Boundary (Phase 5).
 *
 * Wraps authenticated administrator sessions in the CMS AdminShell.
 * Preserves clean single-page container for unauthenticated views (/admin/login).
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <AdminShell userEmail={session.user.email}>
      {children}
    </AdminShell>
  );
}
