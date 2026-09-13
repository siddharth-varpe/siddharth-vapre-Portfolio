import * as React from "react";
import { NotFoundView } from "@/components/shared/not-found-view";

export default function PublicNotFound() {
  return (
    <NotFoundView
      title="404 — Project Not Found"
      message="The engineering case study or project you are looking for does not exist or has not been published."
      homeHref="/projects"
      homeLabel="Back to All Projects"
    />
  );
}
