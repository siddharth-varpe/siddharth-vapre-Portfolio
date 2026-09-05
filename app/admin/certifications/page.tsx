import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminCertifications } from "@/lib/server/db";
import { CertificationsManager } from "@/components/admin/managers/certifications-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certifications | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminCertificationsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/certifications" });
  if (!session) return null;

  const certifications = await getAdminCertifications();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Certifications Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Maintain technical certifications, cloud credentials, verification links, and issue dates.
        </p>
      </div>

      <CertificationsManager initialCertifications={certifications} />
    </div>
  );
}
