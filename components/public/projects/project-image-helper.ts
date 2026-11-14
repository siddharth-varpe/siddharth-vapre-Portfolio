import type { ProjectDocument } from "@/types/models";

/**
 * Deterministically resolves the authentic preview image for a project from
 * the approved portfolio asset inventory.
 */
export function getProjectDisplayImage(project: ProjectDocument): string {
  // 1. If explicit coverImage is configured
  if (project.coverImage) {
    return project.coverImage;
  }

  // 2. If media array contains an image
  if (project.media && project.media.length > 0 && project.media[0].url) {
    return project.media[0].url;
  }

  // 3. Fallbacks to authentic verified screenshots by canonical project slug
  switch (project.slug) {
    case "campus-buddy":
      return "/uploads/blob/portfolio/project/card-campus-buddy@2x.png";
    case "crm-sr-enterprises":
      return "/uploads/blob/portfolio/project/1788715622610-126ed882-crm-sr-enterprises-dashboard.png";
    case "inventory-management-platform":
      return "/uploads/blob/portfolio/project/1788715627670-8ce575a1-stockmanager-enterprise-dashboard.png";
    case "portfolio-website":
      return "/images/current_desktop_light.png";
    default:
      return "/images/featured/campusbuddy-preview.png";
  }
}
