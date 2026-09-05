import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSiteContent } from "@/lib/server/db";
import { SiteContentEditor } from "@/components/admin/editors/site-content-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site Content | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminSiteContentPage() {
  const session = await requireAdminSession({ returnTo: "/admin/site-content" });
  if (!session) return null;

  const siteContent = await getAdminSiteContent();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Global Site Content</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage variable global content including footer copy, copyright text, bottom banner CTA, and system microcopy.
        </p>
      </div>

      <SiteContentEditor initialData={siteContent} />
    </div>
  );
}
