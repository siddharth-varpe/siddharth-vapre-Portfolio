import { requireAdminSession } from "@/lib/server/auth/session";
import { ProjectForm } from "@/components/admin/editors/project-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Case Study | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  const session = await requireAdminSession({ returnTo: "/admin/projects/new" });
  if (!session) return null;

  return <ProjectForm isNew={true} />;
}
