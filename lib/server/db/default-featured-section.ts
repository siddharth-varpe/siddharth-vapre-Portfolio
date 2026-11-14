import type { FeaturedSectionConfig } from "@/types/models";

export const DEFAULT_FEATURED_SECTION: FeaturedSectionConfig = {
  enabled: true,
  eyebrow: "FEATURED",
  title: "Featured Highlights",
  description:
    "A quick look at the work, experience and achievements I'm most proud of. More projects, certifications and contributions on the dedicated page.",
  ctaText: "View All Featured",
  ctaLink: "/projects",
  items: [
    {
      id: "feat-1",
      type: "project",
      enabled: true,
      order: 1,
      accent: "blue",
      badge: {
        text: "Project",
        icon: "code",
        visible: true,
      },
      title: "CampusBuddy",
      subtitle: "AI-Powered Campus Management Platform",
      description:
        "An all-in-one platform for students with timetables, notes, announcements and an AI assistant to make campus life easier.",
      tags: ["React", "TypeScript", "Supabase", "Gemini API", "Tailwind CSS"],
      image: {
        url: "/images/featured/campusbuddy-preview.png",
        alt: "CampusBuddy AI student assistant interface preview",
        visible: true,
        position: "right",
      },
      annotation: "Built for Real Students",
      primaryCta: {
        text: "View Project",
        link: "/projects/collegestudentbuddy-campusbuddy",
      },
      secondaryCta: {
        text: "Live Demo",
        link: "https://collegestudentbuddy-campusbuddy-dzg.vercel.app/",
      },
    },
    {
      id: "feat-2",
      type: "experience",
      enabled: true,
      order: 2,
      accent: "green",
      badge: {
        text: "Experience",
        icon: "briefcase",
        visible: true,
      },
      title: "Software Developer Intern",
      subtitle: "Opstech Solution Pvt Ltd",
      metadata: {
        location: "Pune, Maharashtra (Hybrid)",
        duration: "Jul 2026 – Sep 2026 (3 Months)",
      },
      description:
        "Working on real-world web applications, feature implementation and bug fixes. Gaining hands-on experience with industry practices and development workflow.",
      tags: ["React", "Node.js", "MySQL", "Git", "REST APIs"],
      image: {
        url: "/images/featured/opstech-preview.png",
        alt: "Opstech Solution office workspace",
        visible: true,
        position: "right",
      },
      annotation: "Learning Building Growing",
      primaryCta: {
        text: "View Experience",
        link: "/experience",
      },
    },
    {
      id: "feat-3",
      type: "achievement",
      enabled: true,
      order: 3,
      accent: "orange",
      badge: {
        text: "Achievement",
        icon: "trophy",
        visible: true,
      },
      title: "2nd Rank – Prompt Engineering",
      subtitle: "Ajeenkya DY Patil School of Engineering",
      metadata: {
        organization: "Ajeenkya DY Patil School of Engineering",
        rank: "2nd Rank",
        date: "2025",
      },
      description:
        "Secured 2nd rank in the prompt engineering competition, showcasing my skills in AI, creativity and problem solving.",
      image: {
        url: "/images/featured/prompt-engineering-preview.png",
        alt: "Prompt Engineering Competition 2nd Rank award presentation",
        visible: true,
        position: "right",
      },
      primaryCta: {
        text: "View Achievement",
        link: "/achievements",
      },
    },
    {
      id: "feat-4",
      type: "certification",
      enabled: true,
      order: 4,
      accent: "purple",
      badge: {
        text: "Certification",
        icon: "award",
        visible: true,
      },
      title: "Google Generative AI",
      subtitle: "Professional Certificate",
      metadata: {
        issuer: "Google",
        date: "2025",
      },
      description:
        "Completed Google's Generative AI professional certification, covering foundation models, prompt design and real-world applications.",
      image: {
        url: "/images/featured/google-genai-cert.png",
        alt: "Google Generative AI Professional Certificate",
        visible: true,
        position: "right",
      },
      primaryCta: {
        text: "View Certificate",
        link: "/certifications",
      },
    },
  ],
};
