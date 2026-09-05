import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminAchievements } from "@/lib/server/db";
import { AchievementsManager } from "@/components/admin/managers/achievements-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Achievements | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminAchievementsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/achievements" });
  if (!session) return null;

  const achievements = await getAdminAchievements();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Achievements &amp; Honors</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Maintain verified competition awards, national rankings, and academic or professional honors.
        </p>
      </div>

      <AchievementsManager initialAchievements={achievements} />
    </div>
  );
}
