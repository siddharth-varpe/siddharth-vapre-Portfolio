import type { FooterSectionConfig } from "@/types/models";

export const DEFAULT_FOOTER_SECTION: FooterSectionConfig = {
  enabled: true,
  title: "Siddharth Varpe",
  professionalTitle: "SOFTWARE ENGINEER | AI & FULL-STACK",
  description:
    "Building real solutions with code, AI, and measurable impact. Dedicated to architecting scalable distributed systems, robust full-stack platforms, and verified engineering proofs.",
  metrics: {
    projectsLabel: "Projects",
    showProjects: true,
    awardsLabel: "Awards",
    showAwards: true,
    opportunitiesLabel: "Open to",
    opportunitiesValue: "Opportunities",
    showOpportunities: true,
  },
  connect: {
    enabled: true,
    title: "Let's Build Something Amazing",
    description: "Open to full-time roles, collaborations and interesting projects.",
    primaryButtonLabel: "Get in Touch",
    primaryButtonHref: "/contact",
    githubUrl: "https://github.com/siddharth-varpe",
    linkedinUrl: "https://www.linkedin.com/in/siddharth-varpe",
    email: "siddharth.varpe0@gmail.com",
  },
  artwork: {
    enabled: true,
    desktopArtworkUrl: "/images/footer/developer-desk-scene.webp",
    mobileArtworkUrl: "/images/footer/mountain-connect-bg.jpg",
    desktopVisibility: "show",
    mobileVisibility: "show",
    positionPreset: "right",
    opacityPreset: "full",
  },
  bottomBar: {
    tagline: "ENGINEER • BUILD • IMPACT",
    adminLinkText: "Admin Gateway",
    showPrivacy: false,
    privacyText: "Privacy",
    showTerms: false,
    termsText: "Terms",
  },
};
