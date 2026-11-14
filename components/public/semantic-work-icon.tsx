import * as React from "react";
import type { SemanticWorkType } from "@/types/models";
import {
  BarChart3,
  Layers,
  Code2,
  Sparkles,
  Zap,
  Database,
  Layout,
  Server,
  Network,
  Briefcase,
} from "lucide-react";

export const SEMANTIC_WORK_TYPE_LABELS: Record<SemanticWorkType, string> = {
  crm: "CRM / Analytics",
  inventory: "Inventory / Storage",
  api: "API / Endpoints",
  ai: "AI / Machine Learning",
  automation: "Automation / Workflow",
  database: "Database / Schema",
  frontend: "Frontend / UI",
  backend: "Backend / Services",
  fullstack: "Full-Stack / Architecture",
  infrastructure: "Cloud / DevOps",
  other: "Engineering / Other",
};

interface SemanticWorkIconProps {
  type: SemanticWorkType;
  className?: string;
}

export function SemanticWorkIcon({ type, className = "w-5 h-5" }: SemanticWorkIconProps) {
  switch (type) {
    case "crm":
      return <BarChart3 className={className} aria-label="CRM & Analytics" />;
    case "inventory":
      return <Layers className={className} aria-label="Inventory & Storage" />;
    case "api":
      return <Code2 className={className} aria-label="API & Endpoints" />;
    case "ai":
      return <Sparkles className={className} aria-label="AI & Machine Learning" />;
    case "automation":
      return <Zap className={className} aria-label="Automation & Workflows" />;
    case "database":
      return <Database className={className} aria-label="Database & Schema" />;
    case "frontend":
      return <Layout className={className} aria-label="Frontend & UI" />;
    case "backend":
      return <Server className={className} aria-label="Backend & Services" />;
    case "fullstack":
      return <Layers className={className} aria-label="Full-Stack & Architecture" />;
    case "infrastructure":
      return <Network className={className} aria-label="Infrastructure & DevOps" />;
    case "other":
    default:
      return <Briefcase className={className} aria-label="Engineering Track" />;
  }
}
