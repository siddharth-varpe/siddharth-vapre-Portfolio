import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminAbout, getAdminAboutSection } from "@/lib/server/db";
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
  const aboutSection = await getAdminAboutSection();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">About Page Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage About page hero, metrics, timeline, architectural pillars, philosophy, and closing visual.
        </p>
      </div>

      <AboutEditor initialData={about} initialSectionConfig={aboutSection} />
    </div>
  );
}
