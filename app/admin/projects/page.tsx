import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminProjects } from "@/lib/server/db";
import { ProjectsManager } from "@/components/admin/managers/projects-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects Management | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/projects" });
  if (!session) return null;

  const result = await getAdminProjects({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Case Studies &amp; Projects</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Create, edit, publish, feature, and archive architectural engineering case studies.
        </p>
      </div>

      <ProjectsManager initialProjects={result.items} />
    </div>
  );
}
