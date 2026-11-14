import type { PageHeroConfig } from "@/types/models";

export const DEFAULT_PAGE_HEROES: Record<string, PageHeroConfig> = {
  home: {
    pageKey: "home",
    enabled: true,
    variant: "home",
    eyebrow: "SOFTWARE ENGINEER // AI & FULL-STACK",
    title: "Building Real Solutions with Code, AI and Impact.",
    description:
      "Full-stack software engineer focused on building production systems that eliminate operational friction and deliver measurable business outcomes.",
    badge: "OPEN TO ROLES",
    primaryCta: {
      label: "Explore Projects",
      url: "/projects",
      variant: "primary",
      icon: "arrow",
    },
    secondaryCta: {
      label: "Download Resume",
      url: "/api/resume/download",
      variant: "outline",
      download: true,
      icon: "download",
    },
  },
  about: {
    pageKey: "about",
    enabled: true,
    variant: "editorial",
    eyebrow: "BIOGRAPHY & PHILOSOPHY",
    title: "About Siddharth Varpe",
    description:
      "Full-stack software engineer focused on building production systems that eliminate operational friction and deliver measurable business outcomes.",
    badge: "ENGINEERING MINDSET",
    primaryCta: {
      label: "View Career Timeline",
      url: "/experience",
      variant: "primary",
      icon: "arrow",
    },
    secondaryCta: {
      label: "Resume PDF",
      url: "/api/resume/download",
      variant: "outline",
      download: true,
      icon: "download",
    },
  },
  experience: {
    pageKey: "experience",
    enabled: true,
    variant: "split",
    eyebrow: "PROFESSIONAL CAREER TIMELINE // ENTERPRISE IMPACT",
    title: "Engineering Experience",
    description:
      "Chronological record of software engineering roles, enterprise platforms delivered, and measurable operational outcomes in production environments.",
    badge: "TRACK RECORD",
    primaryCta: {
      label: "Download Official Resume",
      url: "/api/resume/download",
      variant: "outline",
      download: true,
      icon: "download",
    },
    secondaryCta: {
      label: "Explore Case Studies",
      url: "/projects",
      variant: "ghost",
      icon: "arrow",
    },
    stats: [
      { label: "Reliability Standard", value: "99.9%", description: "System stability" },
      { label: "SKUs Managed", value: "1,000+", description: "Inventory scale" },
      { label: "Daily Transactions", value: "10,000+", description: "Production throughput" },
    ],
  },
  projects: {
    pageKey: "projects",
    enabled: true,
    variant: "showcase",
    eyebrow: "SYSTEMS & CASE STUDIES // PRODUCTION IMPLEMENTATIONS",
    title: "Engineering Projects",
    description:
      "Production software, distributed system architectures, and enterprise platforms engineered for high throughput, sub-second latency, and measurable business impact.",
    badge: "PROOF OF WORK",
    primaryCta: {
      label: "Technical Skills",
      url: "/skills",
      variant: "outline",
      icon: "arrow",
    },
    secondaryCta: {
      label: "Contact Me",
      url: "/contact",
      variant: "ghost",
      icon: "mail",
    },
    stats: [
      { label: "Architectural Focus", value: "Full-Stack & AI", description: "Modern stack" },
      { label: "Engineering Rigor", value: "100%", description: "Production tested" },
    ],
  },
  skills: {
    pageKey: "skills",
    enabled: true,
    variant: "technical",
    eyebrow: "TECHNICAL TOOLKIT // CORE DISCIPLINES",
    title: "Skills & Technologies",
    description:
      "Comprehensive technical taxonomy of languages, distributed backend systems, relational databases, and applied AI tooling applied across production platforms.",
    badge: "4 CORE DOMAINS",
    primaryCta: {
      label: "View Projects",
      url: "/projects",
      variant: "outline",
      icon: "arrow",
    },
    secondaryCta: {
      label: "Credentials",
      url: "/certifications",
      variant: "ghost",
      icon: "external",
    },
    stats: [
      { label: "Backend Core", value: "Node · Python · Postgres", description: "High concurrency" },
      { label: "Applied AI", value: "FastAPI · LangChain", description: "Automation" },
    ],
  },
  achievements: {
    pageKey: "achievements",
    enabled: true,
    variant: "evidence",
    eyebrow: "VERIFIED RECOGNITION // COMPETITIONS & AWARDS",
    title: "Honors & Achievements",
    description:
      "Tangible recognitions, university prompt engineering rankings, and hackathon milestones validated through verified evidence and institutional proof.",
    badge: "VERIFIED HONORS",
    primaryCta: {
      label: "View Certifications",
      url: "/certifications",
      variant: "outline",
      icon: "arrow",
    },
    secondaryCta: {
      label: "Download Resume",
      url: "/api/resume/download",
      variant: "ghost",
      download: true,
      icon: "download",
    },
    stats: [
      { label: "Prompt Engineering", value: "1st & 2nd Rank", description: "University competition" },
      { label: "Evidence Rigor", value: "100% Verified", description: "Proof backed" },
    ],
  },
  certifications: {
    pageKey: "certifications",
    enabled: true,
    variant: "credentials",
    eyebrow: "CONTINUOUS LEARNING // VERIFIED COMPETENCIES",
    title: "Certifications & Credentials",
    description:
      "Verified professional certifications and technical specializations demonstrating continuous technical mastery in modern web and AI engineering.",
    badge: "ACCREDITED PROOFS",
    primaryCta: {
      label: "Inspect Skills",
      url: "/skills",
      variant: "outline",
      icon: "arrow",
    },
    secondaryCta: {
      label: "Direct Inquiry",
      url: "/contact",
      variant: "ghost",
      icon: "mail",
    },
    stats: [
      { label: "Issuing Bodies", value: "Accredited", description: "Recognized institutions" },
      { label: "Active Validation", value: "Lifetime", description: "Verifiable credential IDs" },
    ],
  },
  contact: {
    pageKey: "contact",
    enabled: true,
    variant: "conversion",
    eyebrow: "COMMUNICATION & COLLABORATION PIPELINE",
    title: "Contact & Channels",
    description:
      "Direct pathways for technical inquiries, software engineering opportunities, and architectural collaboration. Available for high-impact engineering roles.",
    badge: "AVAILABLE FOR ROLES",
    primaryCta: {
      label: "Jump to Form",
      url: "#contact-form",
      variant: "primary",
      icon: "mail",
    },
    secondaryCta: {
      label: "Email Directly",
      url: "mailto:siddharth.varpe0@gmail.com",
      variant: "outline",
      external: true,
      icon: "external",
    },
    stats: [
      { label: "Response SLA", value: "< 24 Hours", description: "Direct response time" },
      { label: "Primary Base", value: "Pune, India", description: "Open to remote" },
    ],
  },
};
