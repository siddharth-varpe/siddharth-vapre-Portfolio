import { requireAdminSession } from "@/lib/server/auth/session";
import {
  getAdminCertifications,
  getAdminDistinctionsSection,
  getDistinctionMetrics,
} from "@/lib/server/db";
import { CertificationsManager } from "@/components/admin/managers/certifications-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verified Distinctions & Certifications | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminCertificationsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/certifications" });
  if (!session) return null;

  const [certifications, distinctionsSection, metrics] = await Promise.all([
    getAdminCertifications(),
    getAdminDistinctionsSection(),
    getDistinctionMetrics(),
  ]);

  return (
    <div className="space-y-6">
      <CertificationsManager
        initialCertifications={certifications}
        initialDistinctionsSection={distinctionsSection}
        initialMetrics={metrics}
      />
    </div>
  );
}
