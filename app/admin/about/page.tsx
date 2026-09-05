import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminAbout } from "@/lib/server/db";
import { AboutEditor } from "@/components/admin/editors/about-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Section | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminAboutPage() {
  const session = await requireAdminSession({ returnTo: "/admin/about" });
  if (!session) return null;

  const about = await getAdminAbout();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">About Section Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage personal biography, philosophy, technical interests, and professional positioning.
        </p>
      </div>

      <AboutEditor initialData={about} />
    </div>
  );
}
