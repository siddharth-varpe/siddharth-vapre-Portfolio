import type { AboutSectionConfig } from "@/types/models";

export const DEFAULT_ABOUT_SECTION: AboutSectionConfig = {
  enabled: true,
  eyebrow: "ABOUT ME",
  educationBadge: "Undergraduate Engineer • 2024 – 2028",
  titlePrimary: "Turning Ideas into",
  titleAccent: "Real Impact.",
  description:
    "I'm Siddharth Varpe, an undergraduate engineer passionate about building practical and scalable web applications, working with modern technologies and AI tools to solve real-world problems. I enjoy turning ideas into useful products through clean code, good design, and continuous learning.",
  portraitAsset: "/images/about/siddharth-about-hero.jpg",
  contextBadge: {
    enabled: true,
    label: "Currently Learning",
    subtext: "Full-Stack Development & AI",
  },
  metrics: [
    {
      id: "m-projects",
      enabled: true,
      sourceType: "projects",
      label: "Projects Built",
      icon: "code",
      order: 1,
    },
    {
      id: "m-ranks",
      enabled: true,
      sourceType: "achievements",
      label: "University Ranks",
      icon: "trophy",
      order: 2,
    },
    {
      id: "m-learning",
      enabled: true,
      sourceType: "custom",
      customValue: "3+",
      label: "Years of Learning",
      icon: "book",
      order: 3,
    },
    {
      id: "m-driven",
      enabled: true,
      sourceType: "custom",
      customValue: "100%",
      label: "Self Driven",
      icon: "lightning",
      order: 4,
    },
  ],
  personalDetails: {
    location: "Pune, Maharashtra, India",
    education: "Undergraduate Engineer (2024 – 2028)",
    availability: "Open to Opportunities",
  },
  actions: {
    primaryLabel: "View My Journey",
    primaryUrl: "#experience",
    secondaryLabel: "Resume PDF",
    secondaryUrl: "/api/resume/download",
  },
  backgroundSection: {
    eyebrow: "EXPERIENCE & BACKGROUND",
    heading: "Engineering with clarity, discipline, and measurable outcomes.",
    description:
      "I work on full-stack web applications, AI integrations, and real-world problem solving. I enjoy collaborating in teams and delivering useful products through automated workflows, optimized operations, and clean, user-focused design.",
    quote:
      "Build software and systems that are useful, simple, and scalable — with a focus on real impact.",
  },
  timeline: [
    {
      id: "tl-intern",
      enabled: true,
      period: "2026 – Present",
      title: "Software Developer Intern",
      organization: "Opstech Solution Pvt. Ltd.",
      bullets: [
        "Worked on full-stack solutions and AI integrations.",
        "Contributing to real-world product development.",
      ],
      category: "work",
      order: 1,
    },
    {
      id: "tl-edu",
      enabled: true,
      period: "2024 – 2028",
      title: "Undergraduate Engineer",
      organization:
        "Ajeenkya DY Patil School of Engineering Affiliated to Savitribai Phule Pune University",
      subtitle: "B.E. in Electronics & Telecommunication",
      bullets: [],
      category: "education",
      order: 2,
    },
    {
      id: "tl-growth",
      enabled: true,
      period: "2023 – Present",
      title: "Projects & Competitions",
      organization: "University & Technical Hackathons",
      bullets: [
        "Built multiple web applications and participated in hackathons.",
        "Secured 2nd rank in a prompt engineering competition.",
      ],
      category: "growth",
      order: 3,
    },
  ],
  pillars: [
    {
      id: "pil-1",
      enabled: true,
      number: "01",
      icon: "cube",
      title: "Production Systems",
      description:
        "Designing and building scalable applications handling real data and users.",
      destinationUrl: "/projects",
      order: 1,
    },
    {
      id: "pil-2",
      enabled: true,
      number: "02",
      icon: "brain",
      title: "AI Integration & Automation",
      description:
        "Leveraging LLMs and APIs to create intelligent solutions and automate workflows.",
      destinationUrl: "/projects",
      order: 2,
    },
    {
      id: "pil-3",
      enabled: true,
      number: "03",
      icon: "layers",
      title: "Full-Stack Architecture",
      description:
        "Building end-to-end web applications with modern technologies and clean architecture.",
      destinationUrl: "/projects",
      order: 3,
    },
  ],
  closingVisual: {
    enabled: true,
    imageUrl: "/images/about/about-closing-landscape.jpg",
    quote: "A better tomorrow is built today with what you learn now.",
  },
};
