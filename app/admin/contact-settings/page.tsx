import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminContactSettings } from "@/lib/server/db";
import { ContactSettingsEditor } from "@/components/admin/editors/contact-settings-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact & Socials | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminContactSettingsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/contact-settings" });
  if (!session) return null;

  const settings = await getAdminContactSettings();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Contact &amp; Social Links</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage contact endpoints, verified GitHub and LinkedIn destinations, and availability statements.
        </p>
      </div>

      <ContactSettingsEditor initialData={settings} />
    </div>
  );
}
