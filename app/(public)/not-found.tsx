import { NotFoundView } from "@/components/shared/not-found-view";

export default function PublicNotFound() {
  return (
    <NotFoundView
      title="404 — Page Not Found"
      message="The page or project case study you are looking for does not exist or is not published."
      homeHref="/projects"
      homeLabel="Browse Published Projects"
    />
  );
}
