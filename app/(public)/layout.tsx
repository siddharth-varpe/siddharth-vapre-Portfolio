interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public Layout Shell Boundary (Phase 1).
 * Isolates public presentation layout from private admin routes.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Public layout boundary shell — header/nav to be integrated in Phase 7 */}
      <div className="flex-1">
        {children}
      </div>
      {/* Public layout boundary shell — footer to be integrated in Phase 7 */}
    </div>
  );
}
