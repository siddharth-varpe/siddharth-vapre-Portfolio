import * as React from "react";

interface TechIconProps {
  name: string;
  className?: string;
}

export function TechIcon({ name, className = "w-5 h-5" }: TechIconProps) {
  const normalized = name.toLowerCase();

  // React.js
  if (normalized.includes("react")) {
    return (
      <svg
        className={className}
        viewBox="-11.5 -10.23174 23 20.46348"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
        <g stroke="#00d8ff" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Next.js
  if (normalized.includes("next")) {
    return (
      <svg
        className={className}
        viewBox="0 0 180 180"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="90" cy="90" r="90" className="fill-foreground" />
        <path
          d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
          fill="url(#next_paint0)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#next_paint1)" />
        <defs>
          <linearGradient
            id="next_paint0"
            x1="109"
            y1="116.5"
            x2="144.5"
            y2="160.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="next_paint1"
            x1="121"
            y1="54"
            x2="120.799"
            y2="106.875"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // TypeScript
  if (normalized.includes("typescript") || normalized === "ts") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <path d="M12.5 10H7.5V12H9V18H11V12H12.5V10Z" fill="white" />
        <path d="M14 15.5C14.5 16.5 15.5 16.8 16.5 16.5C17.5 16.2 17.5 15.2 17.2 14.8C16.8 14.2 15.2 13.8 14.5 13.2C13.5 12.4 13.7 11 14.5 10.4C15.5 9.6 17 9.8 17.8 10.5L16.6 11.7C16.2 11.3 15.5 11.1 14.9 11.4C14.4 11.6 14.4 12.3 14.8 12.6C15.4 13.1 17 13.4 17.8 14.2C18.6 15 18.5 16.6 17.2 17.5C16 18.3 14.2 18 13 16.8L14 15.5Z" fill="white" />
      </svg>
    );
  }

  // Supabase
  if (normalized.includes("supabase")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12.92 2.15C12.48 1.45 11.4 1.76 11.4 2.59V11.5H3.6C2.69 11.5 2.21 12.58 2.82 13.24L11.08 21.85C11.52 22.55 12.6 22.24 12.6 21.41V12.5H20.4C21.31 12.5 21.79 11.42 21.18 10.76L12.92 2.15Z"
          fill="#3ECF8E"
        />
      </svg>
    );
  }

  // Gemini API
  if (normalized.includes("gemini")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
          fill="#9333EA"
        />
      </svg>
    );
  }

  // Mistral OCR
  if (normalized.includes("mistral")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="4" height="16" rx="1" fill="#EA580C" />
        <rect x="17" y="4" width="4" height="16" rx="1" fill="#EA580C" />
        <rect x="7" y="8" width="4" height="8" rx="0.5" fill="#F97316" />
        <rect x="13" y="8" width="4" height="8" rx="0.5" fill="#F97316" />
        <rect x="10" y="11" width="4" height="6" rx="0.5" fill="#FB923C" />
      </svg>
    );
  }

  // MySQL
  if (normalized.includes("mysql")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3C7.58 3 4 4.79 4 7V17C4 19.21 7.58 21 12 21C16.42 21 20 19.21 20 17V7C20 4.79 16.42 3 12 3ZM18 17C18 17.8 15.5 19 12 19C8.5 19 6 17.8 6 17V15.2C7.5 16.3 9.6 17 12 17C14.4 17 16.5 16.3 18 15.2V17ZM18 13C18 13.8 15.5 15 12 15C8.5 15 6 13.8 6 13V11.2C7.5 12.3 9.6 13 12 13C14.4 13 16.5 12.3 18 11.2V13ZM12 9C8.5 9 6 7.8 6 7C6 6.2 8.5 5 12 5C15.5 5 18 6.2 18 7C18 7.8 15.5 9 12 9Z"
          fill="#00758F"
        />
      </svg>
    );
  }

  // JavaScript
  if (normalized.includes("javascript") || normalized === "js") {
    return (
      <svg className={className} viewBox="0 0 630 630" aria-hidden="true">
        <rect width="630" height="630" fill="#f7df1e" rx="60" />
        <path
          d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.4-38.1-25.4-17.34 0-28.33 11-28.33 25.4 0 17.8 11 24.9 36.37 36l14.8 6.3c50.3 21.6 78.7 43.6 78.7 93.9 0 53.3-41.9 83.3-95.2 83.3-52.9 0-87.2-27.5-103.2-64.7zm-209.1 5.5c-8.9 9.7-19.5 15.6-32.1 15.6-18.6 0-25.8-9.7-25.8-31.7v-176.8h56.2v177.2c0 37.6 19.9 53.7 47.8 53.7 10.6 0 20.7-3.8 28.3-9.3v39.3c-15.6 7.6-34.7 12-51.6 12-11.4 0-16.9-2.5-22.8-10z"
          fill="#000000"
        />
      </svg>
    );
  }

  // HTML5 & CSS3
  if (normalized.includes("html") || normalized.includes("css")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 3L5.5 20L12 22L18.5 20L20 3H4Z"
          className="fill-orange-500/20 stroke-orange-500"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 7H16L15.5 11H8.5L9 15L12 16L15 15L15.2 13"
          className="stroke-orange-500"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Bootstrap
  if (normalized.includes("bootstrap")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="5" className="fill-purple-600" />
        <path
          d="M7 6H13C14.7 6 16 7.1 16 8.7C16 9.8 15.3 10.7 14.3 11.1C15.6 11.5 16.5 12.6 16.5 14C16.5 15.8 15.1 17 13.2 17H7V6ZM9.5 8.2V10.3H12.6C13.5 10.3 14.1 9.8 14.1 9.25C14.1 8.7 13.5 8.2 12.6 8.2H9.5ZM9.5 12.3V14.8H12.9C13.8 14.8 14.5 14.2 14.5 13.55C14.5 12.9 13.8 12.3 12.9 12.3H9.5Z"
          fill="white"
        />
      </svg>
    );
  }

  // Node.js
  if (normalized.includes("node")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2Z"
          className="fill-emerald-600/20 stroke-emerald-600"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 6L7.5 8.6V13.8L12 16.4L16.5 13.8V8.6L12 6Z"
          className="stroke-emerald-600"
          strokeWidth="1.2"
        />
        <circle cx="12" cy="11.2" r="1.5" className="fill-emerald-600" />
      </svg>
    );
  }

  // Python
  if (normalized.includes("python")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M11.8 2C8.6 2 6.7 3.4 6.7 5.7V7.5H12V8.2H4.4C2.3 8.2 1 9.9 1 12.4C1 15 2.5 16.5 4.9 16.5H6.2V14.6C6.2 12.4 8 10.6 10.2 10.6H13.7C15.6 10.6 17.1 9.1 17.1 7.2V5.7C17.1 3.4 15.1 2 11.8 2ZM9.3 4C9.9 4 10.4 4.5 10.4 5.1C10.4 5.7 9.9 6.2 9.3 6.2C8.7 6.2 8.2 5.7 8.2 5.1C8.2 4.5 8.7 4 9.3 4Z"
          className="fill-blue-500"
        />
        <path
          d="M12.2 22C15.4 22 17.3 20.6 17.3 18.3V16.5H12V15.8H19.6C21.7 15.8 23 14.1 23 11.6C23 9 21.5 7.5 19.1 7.5H17.8V9.4C17.8 11.6 16 13.4 13.8 13.4H10.3C8.4 13.4 6.9 14.9 6.9 16.8V18.3C6.9 20.6 8.9 22 12.2 22ZM14.7 20C14.1 20 13.6 19.5 13.6 18.9C13.6 18.3 14.1 17.8 14.7 17.8C15.3 17.8 15.8 18.3 15.8 18.9C15.8 19.5 15.3 20 14.7 20Z"
          className="fill-amber-400"
        />
      </svg>
    );
  }

  // PostgreSQL
  if (normalized.includes("postgres")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
          className="fill-sky-700/15 stroke-sky-600"
          strokeWidth="1.5"
        />
        <path
          d="M7 14.5C7.5 12 9 8 13 8C16 8 17 9.5 17 11.5C17 14 15 15.5 13 15.5C11.5 15.5 10.5 15 10 14"
          className="stroke-sky-600"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="11" r="1" className="fill-sky-600" />
      </svg>
    );
  }

  // FastAPI
  if (normalized.includes("fastapi")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" className="fill-emerald-500/20 stroke-teal-500" strokeWidth="1.5" />
        <path
          d="M13 3L6 14H12L11 21L18 10H12L13 3Z"
          className="fill-teal-500"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // REST APIs
  if (normalized.includes("rest") || normalized.includes("api")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="3" className="stroke-accent" strokeWidth="1.5" />
        <path d="M7 10L10 12L7 14" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="14" x2="16" y2="14" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // WebSockets
  if (normalized.includes("websocket") || normalized.includes("socket")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12C4 7.58172 7.58172 4 12 4M20 12C20 16.4183 16.4183 20 12 20" className="stroke-indigo-400" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="3" className="fill-indigo-500" />
        <path d="M12 4L14 6M12 4L14 2M12 20L10 18M12 20L10 22" className="stroke-indigo-400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // SQL & DBMS
  if (normalized.includes("sql") || normalized.includes("dbms")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" className="stroke-cyan-500" strokeWidth="1.5" />
        <path d="M21 12C21 13.66 17 15 12 15C7 15 3 13.66 3 12" className="stroke-cyan-500" strokeWidth="1.5" />
        <path d="M3 5V19C3 20.66 7 22 12 22C17 22 21 20.66 21 19V5" className="stroke-cyan-500" strokeWidth="1.5" />
      </svg>
    );
  }

  // Prompt Engineering
  if (normalized.includes("prompt")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="20" height="18" rx="4" className="stroke-purple-400" strokeWidth="1.5" />
        <path d="M6 8L10 12L6 16" className="stroke-purple-400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="16" x2="17" y2="16" className="stroke-purple-400" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="8" r="1.5" className="fill-purple-400 animate-pulse" />
      </svg>
    );
  }

  // LLM Tooling & Agents / AI
  if (normalized.includes("llm") || normalized.includes("agent") || normalized.includes("ai")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"
          className="fill-accent/20 stroke-accent"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="11" r="2" className="fill-accent" />
      </svg>
    );
  }

  // Git & GitHub
  if (normalized.includes("git")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21.7 10.9L13.1 2.3C12.7 1.9 12.1 1.9 11.7 2.3L9.7 4.3L12.3 6.9C13 6.7 13.8 6.9 14.3 7.4C14.9 8 15.1 8.8 14.8 9.5L17.3 12C18 11.7 18.9 11.9 19.4 12.5C20.1 13.2 20.1 14.2 19.4 14.9C18.7 15.6 17.7 15.6 17 14.9C16.5 14.4 16.3 13.6 16.5 12.9L14.1 10.5C13.9 10.6 13.6 10.6 13.3 10.6C12.8 10.6 12.3 10.4 11.9 10L9.3 12.6C9.5 13.3 9.3 14.1 8.8 14.6C8.1 15.3 7.1 15.3 6.4 14.6C5.7 13.9 5.7 12.9 6.4 12.2C6.9 11.7 7.7 11.5 8.4 11.7L11 9.1V6.1L4.3 12.8C3.9 13.2 3.9 13.8 4.3 14.2L12.9 22.8C13.3 23.2 13.9 23.2 14.3 22.8L21.7 15.4C22.1 15 22.1 14.4 21.7 14L21.7 10.9Z"
          className="fill-orange-600"
        />
      </svg>
    );
  }

  // Postman
  if (normalized.includes("postman")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" className="fill-orange-500/20 stroke-orange-500" strokeWidth="1.5" />
        <path
          d="M8 12L16 7L13 14L11 12.5L8 12Z"
          className="fill-orange-500 stroke-orange-500"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // VS Code & Linux
  if (normalized.includes("code") || normalized.includes("linux")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="3" className="stroke-blue-500" strokeWidth="1.5" />
        <path d="M7 8L11 12L7 16" className="stroke-blue-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="13" y1="16" x2="17" y2="16" className="stroke-blue-500" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // System Design
  if (normalized.includes("system design") || normalized.includes("architecture")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="7" height="6" rx="1.5" className="stroke-indigo-500" strokeWidth="1.5" />
        <rect x="15" y="3" width="7" height="6" rx="1.5" className="stroke-indigo-500" strokeWidth="1.5" />
        <rect x="8.5" y="15" width="7" height="6" rx="1.5" className="stroke-indigo-500" strokeWidth="1.5" />
        <path d="M5.5 9V12H18.5V9M12 12V15" className="stroke-indigo-400" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Data Structures & Algorithms
  if (normalized.includes("data structure") || normalized.includes("algorithm") || normalized.includes("dsa")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="4" r="2.5" className="stroke-emerald-500 fill-emerald-500/20" strokeWidth="1.5" />
        <circle cx="6" cy="14" r="2.5" className="stroke-emerald-500 fill-emerald-500/20" strokeWidth="1.5" />
        <circle cx="18" cy="14" r="2.5" className="stroke-emerald-500 fill-emerald-500/20" strokeWidth="1.5" />
        <circle cx="12" cy="20" r="2" className="stroke-emerald-500 fill-emerald-500/20" strokeWidth="1.5" />
        <path d="M10 6L7.5 11.5M14 6L16.5 11.5M8 15.5L10.5 18.5M16 15.5L13.5 18.5" className="stroke-emerald-400" strokeWidth="1.2" />
      </svg>
    );
  }

  // Default fallback
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" className="stroke-muted-foreground" strokeWidth="1.5" />
      <path d="M8 12H16M12 8V16" className="stroke-muted-foreground" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
