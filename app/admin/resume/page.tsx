import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminResumes } from "@/lib/server/db";
import { ResumeManager } from "@/components/admin/managers/resume-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resume Metadata | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminResumePage() {
  const session = await requireAdminSession({ returnTo: "/admin/resume" });
  if (!session) return null;

  const resumes = await getAdminResumes();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Resume Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Control active resume versions, storage endpoints, and public download availability.
        </p>
      </div>

      <ResumeManager initialResumes={resumes} />
    </div>
  );
}
