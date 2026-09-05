import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminRevisions } from "@/lib/server/db";
import { RevisionsManager } from "@/components/admin/managers/revisions-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Revision History | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminRevisionsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/revisions" });
  if (!session) return null;

  const revisionsData = await getAdminRevisions(undefined, { limit: 100 });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Content Revisions</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Inspect timestamped content changes, view complete JSON state snapshots, and safely roll back edits to earlier states.
        </p>
      </div>

      <RevisionsManager initialRevisions={JSON.parse(JSON.stringify(revisionsData.items))} />
    </div>
  );
}
