"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error telemetry or server reporting here
    console.error("[Global Error]:", error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] p-6 text-center text-[#fafafa] antialiased">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Application Error
          </h2>
          <p className="text-sm text-neutral-400">
            A critical application error occurred. Please try again or refresh the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
