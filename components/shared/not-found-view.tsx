import Link from "next/link";

interface NotFoundViewProps {
  title?: string;
  message?: string;
  homeHref?: string;
  homeLabel?: string;
}

export function NotFoundView({
  title = "404 — Page Not Found",
  message = "The requested page or resource could not be found.",
  homeHref = "/",
  homeLabel = "Return Home",
}: NotFoundViewProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-sm text-neutral-400">
          {message}
        </p>
        <div>
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
