import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSkills } from "@/lib/server/db";
import { SkillsManager } from "@/components/admin/managers/skills-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Skills Management | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/skills" });
  if (!session) return null;

  const skills = await getAdminSkills();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Skills Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Add, categorize, prioritize, and reorder technical competencies across engineering domains.
        </p>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
