import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminTechnicalTaxonomy } from "@/lib/server/db";
import { TaxonomyEditor } from "@/components/admin/editors/taxonomy-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Technical Taxonomy | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminTaxonomyPage() {
  const session = await requireAdminSession({ returnTo: "/admin/taxonomy" });
  if (!session) return null;

  const taxonomyConfig = await getAdminTechnicalTaxonomy();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Technical Taxonomy Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure the categorized technical skill taxonomy section on the Home page. Manage the section heading, description, decorative technical illustration, individual skill cards, ordering, and call to action.
        </p>
      </div>

      <TaxonomyEditor initialConfig={taxonomyConfig} />
    </div>
  );
}
