interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin Layout Boundary (Phase 1).
 *
 * Establishes the structural separation between the public portfolio
 * and the private administration interface.
 *
 * In Phase 4, server-side authentication and session checks (Better Auth)
 * will be enforced at this layout/middleware boundary.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-[#fafafa]">
      {/* Admin boundary container */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
