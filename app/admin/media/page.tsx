import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminMedia } from "@/lib/server/db";
import { MediaManager } from "@/components/admin/managers/media-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Library | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const session = await requireAdminSession({ returnTo: "/admin/media" });
  if (!session) return null;

  const media = await getAdminMedia();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Media Library</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Catalog project screenshots, architectural diagrams, and certificate assets.
        </p>
      </div>

      <MediaManager initialMedia={media} />
    </div>
  );
}
