"use client";

interface ErrorBoundaryViewProps {
  title?: string;
  message?: string;
  reset?: () => void;
}

export function ErrorBoundaryView({
  title = "Something went wrong",
  message = "An unexpected error occurred while processing your request. Please try again.",
  reset,
}: ErrorBoundaryViewProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="text-sm text-neutral-400">
          {message}
        </p>
        {reset && (
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
