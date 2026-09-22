"use client";

import { useEffect } from "react";
import { ErrorBoundaryView } from "@/components/shared/error-boundary-view";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Public Route Error]:", error.message);
  }, [error]);

  return (
    <ErrorBoundaryView
      title="Error Loading Content"
      message={
        process.env.NODE_ENV !== "production" && error?.message
          ? `${error.message}${error.digest ? ` (digest: ${error.digest})` : ""}`
          : "We encountered an issue loading this portfolio section. Please try again."
      }
      reset={reset}
    />
  );
}
