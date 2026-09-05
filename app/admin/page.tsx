/**
 * Admin Root Page (Phase 1).
 *
 * Minimal boundary confirming the administrative route tree is established.
 * Full admin authentication (Phase 4) and CMS dashboard (Phase 5) will be
 * introduced in subsequent phases.
 */
export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Admin Portal
      </h1>
      <p className="mt-2 text-sm text-neutral-400">
        Administrative boundary initialized. Phase 1 active.
      </p>
    </main>
  );
}
