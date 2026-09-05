import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminProjectById } from "@/lib/server/db";
import { ProjectForm } from "@/components/admin/editors/project-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Case Study | Admin CMS",
  robots: { index: false, follow: false },
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await requireAdminSession({ returnTo: "/admin/projects" });
  if (!session) return null;

  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} isNew={false} />;
}
