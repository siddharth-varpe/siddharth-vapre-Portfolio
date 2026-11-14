import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminFeaturedSection } from "@/lib/server/db";
import { FeaturedEditor } from "@/components/admin/editors/featured-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Featured Highlights | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminFeaturedPage() {
  const session = await requireAdminSession({ returnTo: "/admin/featured" });
  if (!session) return null;

  const featuredConfig = await getAdminFeaturedSection();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Featured Highlights Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure the 2×2 showcase section directly below the Home Hero. Control enabled state, section headings, card slots, ordering, visual accents, and call-to-actions.
        </p>
      </div>

      <FeaturedEditor initialConfig={featuredConfig} />
    </div>
  );
}
