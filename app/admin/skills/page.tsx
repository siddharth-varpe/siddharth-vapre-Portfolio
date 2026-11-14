import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSkills, getAdminSkillCategories, getSkillsPageSettings } from "@/lib/server/db";
import { SkillsManager } from "@/components/admin/managers/skills-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Skills & Orbit Management | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/skills" });
  if (!session) return null;

  const [skills, categories, settings] = await Promise.all([
    getAdminSkills(),
    getAdminSkillCategories(),
    getSkillsPageSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Skills & Orbit Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage technical skills, dynamic categories, rotating orbit configuration, and factual hero metrics.
        </p>
      </div>

      <SkillsManager
        initialSkills={skills}
        initialCategories={categories}
        initialSettings={settings}
      />
    </div>
  );
}
