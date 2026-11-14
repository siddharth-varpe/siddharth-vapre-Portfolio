import * as React from "react";
import Link from "next/link";
import {
  Award,
  Medal,
  Trophy,
  ShieldCheck,
  Sparkles,
  Calendar,
  ArrowRight,
  MoreVertical,
} from "lucide-react";
import type {
  CertificationDocument,
  DistinctionsSectionConfig,
  DistinctionMetrics,
} from "@/types/models";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

interface VerifiedDistinctionsSectionProps {
  config: DistinctionsSectionConfig;
  certifications: CertificationDocument[];
  metrics: DistinctionMetrics;
}

/**
 * Deterministic Section Icon Mapping from approved set.
 */
function SectionIconBadge({ icon }: { icon: DistinctionsSectionConfig["sectionIcon"] }) {
  switch (icon) {
    case "trophy":
      return <Trophy className="w-4 h-4 text-amber-500" />;
    case "medal":
      return <Medal className="w-4 h-4 text-amber-500" />;
    case "badge":
      return <ShieldCheck className="w-4 h-4 text-amber-500" />;
    case "star":
      return <Sparkles className="w-4 h-4 text-amber-500" />;
    case "award":
    default:
      return <Award className="w-4 h-4 text-amber-500" />;
  }
}

/**
 * Original vector Trophy illustration for top-right mobile / desktop accent.
 * 100% original SVG — zero reference crop or embedded screenshot.
 */
function OriginalTrophyArt({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <div className={`relative ${className} select-none`} aria-hidden="true">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <radialGradient id="trophyAura" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FDE047" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cupGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="specularGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="handleL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="handleR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="pedestalBase" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="35%" stopColor="#64748B" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Ambient Warm Golden Aura */}
        <circle cx="104" cy="94" r="82" fill="url(#trophyAura)" />

        {/* Sparkle Stars */}
        <path d="M 44 48 Q 44 60 32 60 Q 44 60 44 72 Q 44 60 56 60 Q 44 60 44 48 Z" fill="#FBBF24" />
        <path d="M 166 32 Q 166 48 150 48 Q 166 48 166 64 Q 166 48 182 48 Q 166 48 166 32 Z" fill="#F59E0B" />
        <path d="M 28 98 Q 28 106 20 106 Q 28 106 28 114 Q 28 106 36 106 Q 28 106 28 98 Z" fill="#FDE047" />
        <path d="M 172 120 Q 172 130 162 130 Q 172 130 172 140 Q 172 130 182 130 Q 172 130 172 120 Z" fill="#FBBF24" />

        {/* Handles */}
        <path d="M 76 68 C 42 68 38 104 62 122 C 68 126 76 128 80 128 C 76 120 72 114 68 110 C 52 96 56 78 78 78 Z" fill="url(#handleL)" />
        <path d="M 134 68 C 168 68 172 104 148 122 C 142 126 134 128 130 128 C 134 120 138 114 142 110 C 158 96 154 78 132 78 Z" fill="url(#handleR)" />

        {/* Stem */}
        <path d="M 98 136 L 112 136 L 110 154 L 100 154 Z" fill="url(#cupGold)" />
        <ellipse cx="105" cy="154" rx="14" ry="4" fill="#F59E0B" />

        {/* Pedestal */}
        <path d="M 90 156 L 120 156 L 124 166 L 86 166 Z" fill="url(#cupGold)" />
        <rect x="80" y="166" width="50" height="18" rx="2" fill="url(#pedestalBase)" />
        <rect x="87" y="172" width="36" height="5" rx="1" fill="#FBBF24" opacity="0.9" />
        <rect x="74" y="184" width="62" height="6" rx="2" fill="#1E293B" />
        <rect x="76" y="184" width="58" height="1.5" fill="#94A3B8" />

        {/* Main Trophy Cup */}
        <path d="M 72 60 C 72 108 92 136 105 136 C 118 136 138 108 138 60 Z" fill="url(#cupGold)" />
        <ellipse cx="105" cy="60" rx="33" ry="9" fill="#92400E" />
        <ellipse cx="105" cy="58" rx="33" ry="8" fill="url(#cupGold)" />
        <ellipse cx="105" cy="58" rx="30" ry="5.5" fill="#FEF08A" opacity="0.6" />

        {/* Highlight Specular */}
        <path d="M 80 64 C 80 94 92 118 100 128 C 94 116 86 92 86 64 Z" fill="url(#specularGold)" opacity="0.55" />

        {/* Center Star on Cup */}
        <path d="M 105 82 L 108 91 L 117 91 L 110 96 L 112 105 L 105 100 L 98 105 L 100 96 L 93 91 L 102 91 Z" fill="#FFFFFF" opacity="0.95" />
        <path d="M 105 85 L 107 91 L 113 91 L 108 95 L 110 101 L 105 97 L 100 101 L 102 95 L 97 91 L 103 91 Z" fill="#FDE68A" />
      </svg>
    </div>
  );
}

/**
 * Original vector Certificate illustration for bottom-right accent.
 * 100% original SVG — zero reference crop or embedded screenshot.
 */
function OriginalCertificateArt({ className = "w-36 h-24" }: { className?: string }) {
  return (
    <div className={`relative ${className} select-none`} aria-hidden="true">
      <svg
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="certBlueGlow" cx="60%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <linearGradient id="rosetteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="tailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>

        {/* Ambient Glow */}
        <rect x="10" y="5" width="180" height="130" rx="30" fill="url(#certBlueGlow)" />

        {/* Background Paper Sheet */}
        <g transform="rotate(-6 95 70)">
          <rect x="25" y="24" width="125" height="85" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.75" />
        </g>

        {/* Foreground Paper Sheet */}
        <g transform="rotate(4 105 70)">
          <rect x="35" y="22" width="125" height="88" rx="8" fill="url(#sheetGrad)" stroke="#93C5FD" strokeWidth="1.5" />
          <rect x="41" y="28" width="113" height="76" rx="4" fill="none" stroke="#DBEAFE" strokeWidth="1" strokeDasharray="3 2" />

          {/* Certificate Content Lines */}
          <rect x="52" y="36" width="55" height="4" rx="2" fill="#3B82F6" />
          <rect x="52" y="46" width="76" height="2.5" rx="1.25" fill="#94A3B8" opacity="0.6" />
          <rect x="52" y="53" width="64" height="2" rx="1" fill="#CBD5E1" />
          <rect x="52" y="59" width="70" height="2" rx="1" fill="#CBD5E1" />
          <rect x="52" y="65" width="48" height="2" rx="1" fill="#CBD5E1" />

          {/* Signature Line */}
          <line x1="52" y1="84" x2="80" y2="84" stroke="#94A3B8" strokeWidth="1" />
          <rect x="52" y="87" width="22" height="1.5" rx="0.75" fill="#CBD5E1" />

          {/* Ribbon Tails */}
          <path d="M 124 74 L 118 96 L 126 92 L 132 95 L 127 74 Z" fill="url(#tailGrad)" />
          <path d="M 132 74 L 138 96 L 132 92 L 126 95 L 129 74 Z" fill="url(#tailGrad)" />

          {/* Rosette Badge */}
          <path
            d="M 128 58 L 131 63 L 136 62 L 137 67 L 142 68 L 140 73 L 144 76 L 140 80 L 142 85 L 137 86 L 136 91 L 131 90 L 128 95 L 125 90 L 120 91 L 119 86 L 114 85 L 116 80 L 112 76 L 116 73 L 114 68 L 119 67 L 120 62 L 125 63 Z"
            fill="url(#rosetteGrad)"
          />
          <circle cx="128" cy="76" r="11" fill="#1D4ED8" />
          <circle cx="128" cy="76" r="9.5" fill="#FBBF24" />
          <path d="M 128 71.5 L 129.5 75 L 133 75.5 L 130.5 77.5 L 131.5 81 L 128 79 L 124.5 81 L 125.5 77.5 L 123 75.5 L 126.5 75 Z" fill="#FFFFFF" />
        </g>

        {/* Sparkles */}
        <path d="M 18 42 Q 18 50 12 50 Q 18 50 18 58 Q 18 50 24 50 Q 18 50 18 42 Z" fill="#60A5FA" />
        <line x1="20" y1="68" x2="28" y2="65" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="78" x2="26" y2="78" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="88" x2="28" y2="91" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M 174 88 Q 174 94 169 94 Q 174 94 174 100 Q 174 94 179 94 Q 174 94 174 88 Z" fill="#FBBF24" />
      </svg>
    </div>
  );
}

/**
 * Rank / Distinction Medal Badge
 * Displays golden/silver ribboned medals with rank numbers "1" or "2",
 * or a verified shield badge for technical certifications.
 */
function RankMedalBadge({ index, cert }: { index: number; cert: CertificationDocument }) {
  const isAward = cert.credentialType === "award" || Boolean(cert.rank);
  const rankText = cert.rank || (index === 0 ? "1" : "2");
  const isFirst = rankText.includes("1") || index === 0;

  if (isAward) {
    if (isFirst) {
      return (
        <div className="relative flex items-center justify-center shrink-0 w-11 h-12" aria-hidden="true">
          {/* Ribbon Tails */}
          <div className="absolute -bottom-1 left-2 w-3.5 h-4 bg-amber-600 rounded-b-xs transform -rotate-12" />
          <div className="absolute -bottom-1 right-2 w-3.5 h-4 bg-amber-600 rounded-b-xs transform rotate-12" />
          {/* Gold Circular Disk */}
          <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 border border-amber-300 shadow-sm flex items-center justify-center">
            <span className="font-black text-amber-950 text-sm leading-none">1</span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative flex items-center justify-center shrink-0 w-11 h-12" aria-hidden="true">
        {/* Ribbon Tails */}
        <div className="absolute -bottom-1 left-2 w-3.5 h-4 bg-blue-600 rounded-b-xs transform -rotate-12" />
        <div className="absolute -bottom-1 right-2 w-3.5 h-4 bg-blue-600 rounded-b-xs transform rotate-12" />
        {/* Silver/Blue Circular Disk */}
        <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-b from-slate-100 via-blue-100 to-slate-300 border border-blue-200 shadow-sm flex items-center justify-center">
          <span className="font-black text-blue-950 text-sm leading-none">2</span>
        </div>
      </div>
    );
  }

  // Default Certification Rosette Badge
  return (
    <div className="relative flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#1D4ED8] dark:text-[#3B82F6]">
      <ShieldCheck className="w-5 h-5" />
    </div>
  );
}

/**
 * Format dynamic year from date string (e.g. "2025-03" -> "2025", "2025" -> "2025").
 */
function extractYear(dateStr?: string): string {
  if (!dateStr) return "2025";
  const match = dateStr.match(/\b\d{4}\b/);
  return match ? match[0] : dateStr;
}

/**
 * Deterministic tag badge style mapping.
 */
function getTagClass(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower.includes("prompt") || lower.includes("ai") || lower.includes("ui") || lower.includes("design")) {
    return "bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60";
  }
  if (lower.includes("adypu") || lower.includes("university") || lower.includes("wireframe")) {
    return "bg-amber-50 text-amber-800 border-amber-200/70 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60";
  }
  if (lower.includes("techno") || lower.includes("compet") || lower.includes("css")) {
    return "bg-purple-50 text-purple-800 border-purple-200/70 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60";
  }
  if (lower.includes("nxtwave") || lower.includes("dbms") || lower.includes("sql") || lower.includes("postgre")) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60";
  }
  return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
}

/**
 * Public Verified Distinctions Section Component.
 * Strict reproduction of Desktop and Mobile visual references:
 * - Left side: Squircle badge, title, description, and 3 data-driven metric cards.
 * - Right side: Exactly 2 latest published certification cards with medal/shield icons, tags, date.
 * - Bottom CTA: "View Honors & Certifications →" with original decorative certificate illustration.
 * - Mobile: Top-right original trophy illustration on soft golden aura.
 */
export function VerifiedDistinctionsSection({
  config,
  certifications,
  metrics,
}: VerifiedDistinctionsSectionProps) {
  if (!config.enabled) return null;

  // Enforce Home constraint: Exactly max 2 published records
  const homeCards = certifications.slice(0, 2);

  const metricsConfig = config.metrics || {
    ranksLabel: "University Ranks",
    ranksSubtext: "Prompt Engineering",
    certificationsLabel: "Certifications",
    certificationsSubtext: "NxtWave & More",
    verifiedLabel: "Verified",
    verifiedSubtext: "Authentic Credentials",
  };
  const ctaConfig = config.cta || {
    enabled: true,
    text: "View Honors & Certifications",
    destination: "/certifications",
  };

  return (
    <section
      aria-label="Verified Distinctions"
      className="space-y-5 sm:space-y-8"
    >
      <Container size="public">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-5 sm:p-7 lg:p-9 shadow-xs backdrop-blur-sm">
            {/* Subtle background glow accents */}
            <div
              className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-amber-400/5 dark:bg-amber-400/3 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Desktop 2-Column Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* ============================================================= */}
              {/* LEFT COLUMN: Header, Title, Description, and 3 Dynamic Metrics */}
              {/* ============================================================= */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                {/* Eyebrow & Mobile Trophy Row */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <SectionIconBadge icon={config.sectionIcon} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#2563EB] dark:text-[#60A5FA] uppercase">
                      {config.eyebrow}
                    </span>
                  </div>

                  {/* Mobile-Only Original Golden Trophy Illustration */}
                  {config.decorativeVisual?.mobileVisibility !== "hide" && (
                    <div className="sm:hidden -mt-2 -mr-2">
                      <OriginalTrophyArt className="w-24 h-24" />
                    </div>
                  )}
                </div>

                {/* Two-Part Editorial Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  <span>{config.titlePrimary}</span>{" "}
                  <span className="text-[#1D4ED8] dark:text-[#3B82F6]">
                    {config.titleAccent}
                  </span>
                </h2>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {config.description}
                </p>

                {/* 3 Summary Dynamic Metrics (Zero hardcoding) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                  {/* Metric #1: University Ranks */}
                  <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/40 flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {metrics.ranksCount}
                      </div>
                      <div className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-1">
                        {metricsConfig.ranksLabel}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {metricsConfig.ranksSubtext}
                      </div>
                    </div>
                  </div>

                  {/* Metric #2: Published Certifications */}
                  <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/40 flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {metrics.certificationsCount}+
                      </div>
                      <div className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-1">
                        {metricsConfig.certificationsLabel}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {metricsConfig.certificationsSubtext}
                      </div>
                    </div>
                  </div>

                  {/* Metric #3: % Verified */}
                  <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/40 flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {metrics.verifiedPercentage}%
                      </div>
                      <div className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-1">
                        {metricsConfig.verifiedLabel}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {metricsConfig.verifiedSubtext}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* RIGHT COLUMN: Exactly 2 Distinction Cards & Bottom CTA         */}
              {/* ============================================================= */}
              <div className="lg:col-span-6 space-y-3 sm:space-y-3.5">
                {/* Triple-dot icon (Desktop) */}
                <div className="hidden lg:flex justify-end pb-1 text-slate-400 dark:text-slate-500">
                  <MoreVertical className="w-4 h-4" />
                </div>

                {homeCards.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400">
                    No verified distinctions published yet.
                  </div>
                ) : (
                  homeCards.map((cert, idx) => {
                    const year = extractYear(cert.issueDate || cert.date);
                    const tags = cert.tags && cert.tags.length > 0 ? cert.tags : [cert.issuer];

                    return (
                      <div
                        key={cert.id || cert.name + idx}
                        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-800/50 p-4 sm:p-4.5 shadow-xs transition-all hover:border-blue-500/40 hover:shadow-md flex items-center justify-between gap-3 sm:gap-4"
                      >
                        {/* Left: Medal or Certificate Badge */}
                        <RankMedalBadge index={idx} cert={cert} />

                        {/* Middle: Title, Subtitle, Tags */}
                        <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                            {cert.title || cert.name}
                          </h3>

                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                            {cert.credentialType === "award"
                              ? cert.issuer.includes("University")
                                ? "University Award"
                                : "Competition Award"
                              : cert.issuer}
                          </div>

                          {/* Dynamic Tag Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full border ${getTagClass(
                                  tag
                                )}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: Calendar Icon + Year */}
                        <div className="shrink-0 flex flex-col items-center justify-center pl-2 sm:pl-3 border-l border-slate-100 dark:border-slate-800">
                          <Calendar className="w-4 h-4 text-[#1D4ED8] dark:text-[#3B82F6]" />
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#1D4ED8] dark:text-[#3B82F6] mt-0.5">
                            {year}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Bottom Row: View Honors CTA + Decorative Certificate Art */}
                {ctaConfig.enabled && (
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-3 relative overflow-hidden">
                    <Link
                      href={ctaConfig.destination}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1D4ED8] dark:text-[#3B82F6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    >
                      <span>{ctaConfig.text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Original Decorative Certificate Art */}
                    {config.decorativeVisual?.enabled && (
                      <div className="shrink-0 -mr-2 -my-2 pointer-events-none">
                        <OriginalCertificateArt className="w-28 sm:w-32 h-16 sm:h-20" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
