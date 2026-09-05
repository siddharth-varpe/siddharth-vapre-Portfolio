import { NotFoundView } from "@/components/shared/not-found-view";

export default function GlobalNotFound() {
  return (
    <NotFoundView
      title="404 — Page Not Found"
      message="The page you are looking for does not exist or has been moved."
      homeHref="/"
      homeLabel="Return to Portfolio"
    />
  );
}
