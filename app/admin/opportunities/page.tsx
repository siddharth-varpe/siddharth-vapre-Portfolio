import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminOpportunitiesSection } from "@/lib/server/db";
import { OpportunitiesEditor } from "@/components/admin/editors/opportunities-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Opportunities Section | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminOpportunitiesPage() {
  const session = await requireAdminSession({ returnTo: "/admin/opportunities" });
  if (!session) return null;

  const sectionConfig = await getAdminOpportunitiesSection();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Opportunities Section Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure the interactive &quot;Open For Opportunities&quot; CTA section on the Home page. Control headline, description, target roles, badges, button destinations, and visibility.
        </p>
      </div>

      <OpportunitiesEditor initialConfig={sectionConfig} />
    </div>
  );
}
