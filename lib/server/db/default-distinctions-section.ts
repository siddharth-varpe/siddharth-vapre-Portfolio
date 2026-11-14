import type { DistinctionsSectionConfig } from "@/types/models";

export const DEFAULT_DISTINCTIONS_SECTION: DistinctionsSectionConfig = {
  enabled: true,
  eyebrow: "VERIFIED DISTINCTIONS",
  titlePrimary: "Verified",
  titleAccent: "Distinctions",
  description:
    "1st & 2nd Rank University Awards in Prompt Engineering, plus verified NxtWave certifications.",
  sectionIcon: "award",
  decorativeVisual: {
    enabled: true,
    trophyAssetUrl: "/images/distinctions/trophy-distinction-art.svg",
    certificateAssetUrl: "/images/distinctions/certificate-distinction-art.svg",
    position: "top-right",
    mobileVisibility: "show",
    opacityPreset: "medium",
    accentVariant: "gold",
  },
  metrics: {
    ranksLabel: "University Ranks",
    ranksSubtext: "Prompt Engineering",
    certificationsLabel: "Certifications",
    certificationsSubtext: "NxtWave & More",
    verifiedLabel: "Verified",
    verifiedSubtext: "Authentic Credentials",
  },
  cta: {
    enabled: true,
    text: "View Honors & Certifications",
    destination: "/certifications",
  },
};
