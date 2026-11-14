import type { OpportunitiesSectionConfig } from "@/types/models";

export const DEFAULT_OPPORTUNITIES_SECTION: OpportunitiesSectionConfig = {
  enabled: true,
  eyebrow: "OPEN FOR OPPORTUNITIES",
  titlePrimary: "Ready to engineer high-impact systems",
  titleAccent: "together.",
  description:
    "Whether you are hiring for full-stack software engineering roles, distributed systems, or AI application development, let's connect.",
  primaryCtaText: "Get in Touch",
  primaryCtaLink: "/contact",
  secondaryCtaText: "Download Resume PDF",
  secondaryCtaLink: "/api/resume/download",
  badges: [
    {
      id: "badge-1",
      label: "Full-Stack Development",
      icon: "users",
    },
    {
      id: "badge-2",
      label: "Distributed Systems",
      icon: "database",
    },
    {
      id: "badge-3",
      label: "AI Applications",
      icon: "lightning",
    },
  ],
};
