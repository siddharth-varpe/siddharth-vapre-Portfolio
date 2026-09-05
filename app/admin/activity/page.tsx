import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminActivityLogs } from "@/lib/server/db";
import { ActivityManager } from "@/components/admin/managers/activity-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activity Audit Logs | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminActivityPage() {
  const session = await requireAdminSession({ returnTo: "/admin/activity" });
  if (!session) return null;

  const logsData = await getAdminActivityLogs({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Activity Audit Logs</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor all administrative authentication events, content mutations, and security changes recorded in the audit trail.
        </p>
      </div>

      <ActivityManager initialLogs={JSON.parse(JSON.stringify(logsData.items))} />
    </div>
  );
}
