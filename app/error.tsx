"use client";

import { useEffect } from "react";
import { ErrorBoundaryView } from "@/components/shared/error-boundary-view";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error]:", error.message);
  }, [error]);

  return (
    <ErrorBoundaryView
      title="Application Error"
      message="We encountered an unexpected error while loading this page."
      reset={reset}
    />
  );
}
