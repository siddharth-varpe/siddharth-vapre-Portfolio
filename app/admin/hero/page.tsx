import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminHero } from "@/lib/server/db";
import { HeroEditor } from "@/components/admin/editors/hero-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hero Section | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminHeroPage() {
  const session = await requireAdminSession({ returnTo: "/admin/hero" });
  if (!session) return null;

  const hero = await getAdminHero();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Hero Section Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Control above-the-fold headline, introduction copy, call-to-actions, and publication state.
        </p>
      </div>

      <HeroEditor initialData={hero} />
    </div>
  );
}
