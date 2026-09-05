"use client";

import { useEffect } from "react";
import { ErrorBoundaryView } from "@/components/shared/error-boundary-view";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Boundary Error]:", error.message);
  }, [error]);

  return (
    <ErrorBoundaryView
      title="Admin Portal Error"
      message="We encountered an issue in the administrative portal. Please try again."
      reset={reset}
    />
  );
}
