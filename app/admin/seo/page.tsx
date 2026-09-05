import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSeo } from "@/lib/server/db";
import { SeoEditor } from "@/components/admin/editors/seo-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SEO Metadata | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminSeoPage() {
  const session = await requireAdminSession({ returnTo: "/admin/seo" });
  if (!session) return null;

  const seo = await getAdminSeo();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">SEO &amp; Open Graph Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure search engine indexing directives, Open Graph sharing cards, and canonical addresses.
        </p>
      </div>

      <SeoEditor initialData={seo} />
    </div>
  );
}
