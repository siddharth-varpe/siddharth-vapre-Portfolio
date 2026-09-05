import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminMetrics } from "@/lib/server/db";
import { MetricsManager } from "@/components/admin/managers/metrics-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Metrics Management | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminMetricsPage() {
  const session = await requireAdminSession({ returnTo: "/admin/metrics" });
  if (!session) return null;

  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Impact &amp; Architecture Metrics</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Maintain verified quantitative achievements, latency benchmarks, uptime statistics, and scale metrics.
        </p>
      </div>

      <MetricsManager initialMetrics={metrics} />
    </div>
  );
}
