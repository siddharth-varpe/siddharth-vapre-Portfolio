"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { PageHeroConfig, HeroVariant } from "@/types/models";
import {
  Sparkles,
  Save,
  Loader2,
  Eye,
  Plus,
  Trash2,
  BookOpen,
  Briefcase,
  FolderGit2,
  Wrench,
  Trophy,
  Award,
  Send,
  Home,
} from "lucide-react";
import { DynamicHero } from "@/components/public/dynamic-hero";

interface PageHeroEditorProps {
  initialHeroes: Record<string, PageHeroConfig>;
}

const PAGE_KEYS = [
  { key: "home", label: "Home", icon: Home },
  { key: "about", label: "About", icon: BookOpen },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "achievements", label: "Achievements", icon: Trophy },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "contact", label: "Contact", icon: Send },
];

const HERO_VARIANTS: { value: HeroVariant; label: string; desc: string }[] = [
  { value: "editorial", label: "Editorial", desc: "Spacious, personal & philosophy-focused" },
  { value: "split", label: "Split Evidence", desc: "Narrative paired with operational metrics" },
  { value: "showcase", label: "Showcase / Work", desc: "Systems & proof-of-work catalog introduction" },
  { value: "technical", label: "Technical", desc: "Taxonomy pills & structured capabilities" },
  { value: "evidence", label: "Recognition & Evidence", desc: "Validated competitions, honors & awards" },
  { value: "credentials", label: "Credentials", desc: "Accredited certifications & verified IDs" },
  { value: "conversion", label: "Conversion", desc: "Direct action, SLA badge & inquiry pathways" },
  { value: "home", label: "Home Master", desc: "Approved interactive home portrait hero" },
];

export function PageHeroEditor({ initialHeroes }: PageHeroEditorProps) {
  const { showToast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string>("about");
  const [heroesState, setHeroesState] = useState<Record<string, PageHeroConfig>>(initialHeroes);
  const [isSaving, setIsSaving] = useState(false);

  const currentHero: PageHeroConfig = heroesState[selectedPage] || {
    pageKey: selectedPage,
    enabled: true,
    variant: "editorial",
    title: `${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} Section`,
  };

  const updateCurrentHero = (partial: Partial<PageHeroConfig>) => {
    setHeroesState((prev) => ({
      ...prev,
      [selectedPage]: {
        ...currentHero,
        ...partial,
        pageKey: selectedPage,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/page-heroes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: selectedPage,
          heroConfig: currentHero,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update page hero");
      }

      showToast(`Page hero for "${selectedPage}" updated successfully!`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update page hero", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const addStat = () => {
    const existing = currentHero.stats || [];
    if (existing.length >= 6) return;
    updateCurrentHero({
      stats: [...existing, { label: "Metric Name", value: "100%", description: "Key proof indicator" }],
    });
  };

  const removeStat = (index: number) => {
    const existing = currentHero.stats || [];
    updateCurrentHero({
      stats: existing.filter((_, i) => i !== index),
    });
  };

  const updateStat = (index: number, field: "label" | "value" | "description", val: string) => {
    const existing = currentHero.stats || [];
    const updated = [...existing];
    updated[index] = { ...updated[index], [field]: val };
    updateCurrentHero({ stats: updated });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. Page Selector Ribbon */}
      <div className="space-y-2">
        <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
          Select Page to Configure Hero
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PAGE_KEYS.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPage === p.key;
            return (
              <button
                key={p.key}
                type="button"
                data-testid={`select-page-${p.key}`}
                onClick={() => setSelectedPage(p.key)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600/15 border-blue-500/60 text-white shadow-sm ring-1 ring-blue-500/40"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-blue-400" : "text-zinc-500"}`} />
                <span className="capitalize">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>
                Hero Settings for <span className="text-blue-400 capitalize font-mono">/{selectedPage === "home" ? "" : selectedPage}</span>
              </span>
            </div>

            {/* Enable/Disable switch */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">Hero State:</span>
              <button
                type="button"
                role="switch"
                aria-checked={currentHero.enabled}
                data-testid="hero-enabled-toggle"
                onClick={() => updateCurrentHero({ enabled: !currentHero.enabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                  currentHero.enabled ? "bg-emerald-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    currentHero.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-mono font-medium ${currentHero.enabled ? "text-emerald-400" : "text-zinc-500"}`}>
                {currentHero.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Variant Selector */}
            <div>
              <label htmlFor="hero-variant-select" className="block text-xs font-mono text-zinc-400 mb-1.5">
                Hero Variant
              </label>
              <select
                id="hero-variant-select"
                data-testid="hero-variant-select"
                value={currentHero.variant}
                onChange={(e) => updateCurrentHero({ variant: e.target.value as HeroVariant })}
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
              >
                {HERO_VARIANTS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label} ({v.value})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                {HERO_VARIANTS.find((v) => v.value === currentHero.variant)?.desc}
              </p>
            </div>

            {/* Badge Text */}
            <div>
              <label htmlFor="hero-badge-input" className="block text-xs font-mono text-zinc-400 mb-1.5">
                Accent Badge / Tag (Optional)
              </label>
              <input
                id="hero-badge-input"
                data-testid="hero-badge-input"
                type="text"
                value={currentHero.badge || ""}
                onChange={(e) => updateCurrentHero({ badge: e.target.value })}
                placeholder="e.g. TRACK RECORD, PROOF OF WORK"
                maxLength={80}
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Eyebrow */}
            <div className="md:col-span-2">
              <label htmlFor="hero-eyebrow-input" className="block text-xs font-mono text-zinc-400 mb-1.5">
                Technical Eyebrow Headline
              </label>
              <input
                id="hero-eyebrow-input"
                data-testid="hero-eyebrow-input"
                type="text"
                value={currentHero.eyebrow || ""}
                onChange={(e) => updateCurrentHero({ eyebrow: e.target.value })}
                placeholder="e.g. BIOGRAPHY & PHILOSOPHY // SYSTEMS CASE STUDIES"
                maxLength={100}
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="hero-title-input" className="block text-xs font-mono text-zinc-400 mb-1.5">
                Primary Hero Title <span className="text-red-400">*</span>
              </label>
              <input
                id="hero-title-input"
                data-testid="hero-title-input"
                type="text"
                required
                value={currentHero.title || ""}
                onChange={(e) => updateCurrentHero({ title: e.target.value })}
                placeholder="e.g. Engineering Experience"
                maxLength={120}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="hero-description-input" className="block text-xs font-mono text-zinc-400">
                  Introductory Copy / Description
                </label>
                <span className="text-[11px] font-mono text-zinc-500">
                  {(currentHero.description || "").length} / 600
                </span>
              </div>
              <textarea
                id="hero-description-input"
                data-testid="hero-description-input"
                rows={3}
                value={currentHero.description || ""}
                onChange={(e) => updateCurrentHero({ description: e.target.value })}
                placeholder="Write a clear, concise introductory narrative for this page..."
                maxLength={600}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 3. Call-to-Actions (CTAs) */}
          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Hero Call-to-Actions (CTAs)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Primary CTA */}
              <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Primary CTA Button</span>
                </div>
                <div>
                  <label htmlFor="hero-primary-label" className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Button Label
                  </label>
                  <input
                    id="hero-primary-label"
                    data-testid="hero-primary-label"
                    type="text"
                    value={currentHero.primaryCta?.label || ""}
                    onChange={(e) =>
                      updateCurrentHero({
                        primaryCta: {
                          label: e.target.value,
                          url: currentHero.primaryCta?.url || "/projects",
                          variant: currentHero.primaryCta?.variant || "primary",
                          icon: currentHero.primaryCta?.icon || "arrow",
                        },
                      })
                    }
                    placeholder="e.g. Explore Projects"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                  />
                </div>
                <div>
                  <label htmlFor="hero-primary-url" className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Destination URL
                  </label>
                  <input
                    id="hero-primary-url"
                    data-testid="hero-primary-url"
                    type="text"
                    value={currentHero.primaryCta?.url || ""}
                    onChange={(e) =>
                      updateCurrentHero({
                        primaryCta: {
                          label: currentHero.primaryCta?.label || "Learn More",
                          url: e.target.value,
                          variant: currentHero.primaryCta?.variant || "primary",
                          icon: currentHero.primaryCta?.icon || "arrow",
                        },
                      })
                    }
                    placeholder="e.g. /projects or /api/resume/download"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white font-mono"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span>Secondary CTA Button (Optional)</span>
                </div>
                <div>
                  <label htmlFor="hero-secondary-label" className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Button Label
                  </label>
                  <input
                    id="hero-secondary-label"
                    data-testid="hero-secondary-label"
                    type="text"
                    value={currentHero.secondaryCta?.label || ""}
                    onChange={(e) =>
                      updateCurrentHero({
                        secondaryCta: {
                          label: e.target.value,
                          url: currentHero.secondaryCta?.url || "/contact",
                          variant: currentHero.secondaryCta?.variant || "outline",
                          icon: currentHero.secondaryCta?.icon || "mail",
                        },
                      })
                    }
                    placeholder="e.g. Download Resume"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                  />
                </div>
                <div>
                  <label htmlFor="hero-secondary-url" className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Destination URL
                  </label>
                  <input
                    id="hero-secondary-url"
                    data-testid="hero-secondary-url"
                    type="text"
                    value={currentHero.secondaryCta?.url || ""}
                    onChange={(e) =>
                      updateCurrentHero({
                        secondaryCta: {
                          label: currentHero.secondaryCta?.label || "Contact",
                          url: e.target.value,
                          variant: currentHero.secondaryCta?.variant || "outline",
                          icon: currentHero.secondaryCta?.icon || "mail",
                        },
                      })
                    }
                    placeholder="e.g. /contact or mailto:user@email.com"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Stats Ribbon Editor */}
          {["split", "showcase", "technical", "evidence", "credentials", "conversion"].includes(
            currentHero.variant
          ) && (
            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Approved Proof Stats (Max 6)
                </h3>
                {(currentHero.stats || []).length < 6 && (
                  <button
                    type="button"
                    onClick={addStat}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-mono"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(currentHero.stats || []).map((stat, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg items-center"
                  >
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Label (e.g. Reliability)"
                        value={stat.label}
                        onChange={(e) => updateStat(idx, "label", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Value (e.g. 99.9%)"
                        value={stat.value}
                        onChange={(e) => updateStat(idx, "value", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded text-white font-mono font-bold"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={stat.description || ""}
                        onChange={(e) => updateStat(idx, "description", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded text-white text-zinc-400"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeStat(idx)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isSaving}
              data-testid="save-page-hero-button"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 5. Live Interactive Preview */}
      <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Live Preview ({currentHero.variant} variant)</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">Rendered with active theme tokens</span>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-background overflow-hidden">
          <DynamicHero config={currentHero} />
        </div>
      </div>
    </div>
  );
}
