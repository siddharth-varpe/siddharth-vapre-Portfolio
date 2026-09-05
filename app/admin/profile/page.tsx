import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminProfile } from "@/lib/server/db";
import { ProfileEditor } from "@/components/admin/editors/profile-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile Management | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminProfilePage() {
  const session = await requireAdminSession({ returnTo: "/admin/profile" });
  if (!session) return null;

  const profile = await getAdminProfile();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Maintain primary developer biography, credentials, location, and contact metadata.
        </p>
      </div>

      <ProfileEditor initialData={profile} />
    </div>
  );
}
