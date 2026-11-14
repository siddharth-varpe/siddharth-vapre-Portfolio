import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminPageHeroes } from "@/lib/server/db";
import { PageHeroEditor } from "@/components/admin/editors/page-hero-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dynamic Page Heroes | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminPageHeroesPage() {
  const session = await requireAdminSession({ returnTo: "/admin/page-heroes" });
  if (!session) return null;

  const heroes = await getAdminPageHeroes();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dynamic Page Heroes</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure purpose-built heroes for each public page across the portfolio. Customize copy, variants, badges, and CTAs.
        </p>
      </div>

      <PageHeroEditor initialHeroes={heroes} />
    </div>
  );
}
