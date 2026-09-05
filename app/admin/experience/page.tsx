import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminExperience } from "@/lib/server/db";
import { ExperienceManager } from "@/components/admin/managers/experience-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Experience Management | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminExperiencePage() {
  const session = await requireAdminSession({ returnTo: "/admin/experience" });
  if (!session) return null;

  const experience = await getAdminExperience();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Experience Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Maintain career milestones, companies, roles, responsibilities, and technical stack chronologies.
        </p>
      </div>

      <ExperienceManager initialExperience={experience} />
    </div>
  );
}
