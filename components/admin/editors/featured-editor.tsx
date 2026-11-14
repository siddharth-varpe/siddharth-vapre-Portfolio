"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type {
  FeaturedSectionConfig,
  FeaturedItem,
  FeaturedItemType,
  FeaturedAccent,
} from "@/types/models";
import {
  Sparkles,
  Save,
  Loader2,
  Eye,
  RotateCcw,
  Code2,
  Briefcase,
  Trophy,
  Award,
  Layers,
} from "lucide-react";
import { FeaturedHighlightsSection } from "@/components/public/featured-highlights-section";
import { DEFAULT_FEATURED_SECTION } from "@/lib/server/db/default-featured-section";

interface FeaturedEditorProps {
  initialConfig: FeaturedSectionConfig;
}

const ITEM_TYPES: { value: FeaturedItemType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "project", label: "Project", icon: Code2 },
  { value: "experience", label: "Experience", icon: Briefcase },
  { value: "achievement", label: "Achievement", icon: Trophy },
  { value: "certification", label: "Certification", icon: Award },
];

const ACCENT_OPTIONS: { value: FeaturedAccent; label: string; color: string }[] = [
  { value: "blue", label: "Blue (Project)", color: "bg-blue-500" },
  { value: "green", label: "Green (Experience)", color: "bg-emerald-500" },
  { value: "orange", label: "Orange (Achievement)", color: "bg-amber-500" },
  { value: "purple", label: "Purple (Certification)", color: "bg-purple-500" },
];

function getBadgeIcon(iconName?: string, type?: FeaturedItemType) {
  const icon = (iconName || "").toLowerCase();
  if (icon === "code" || (!iconName && type === "project")) return Code2;
  if (icon === "briefcase" || (!iconName && type === "experience")) return Briefcase;
  if (icon === "trophy" || (!iconName && type === "achievement")) return Trophy;
  if (icon === "award" || icon === "certificate" || (!iconName && type === "certification")) return Award;
  return Sparkles;
}

export function FeaturedEditor({ initialConfig }: FeaturedEditorProps) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<FeaturedSectionConfig>(initialConfig || DEFAULT_FEATURED_SECTION);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"section" | "slots">("slots");
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  const activeItem: FeaturedItem = config.items[activeSlotIdx] || {
    id: `feat-${activeSlotIdx + 1}`,
    type: "project",
    enabled: true,
    order: activeSlotIdx + 1,
    badge: { text: "Featured", icon: "code", visible: true },
    title: "New Featured Item",
    description: "Featured item summary.",
    accent: "blue",
    primaryCta: { text: "Learn More", link: "/projects" },
  };

  const updateSectionField = <K extends keyof FeaturedSectionConfig>(
    field: K,
    val: FeaturedSectionConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const updateActiveItem = (partial: Partial<FeaturedItem>) => {
    setConfig((prev) => {
      const items = [...prev.items];
      items[activeSlotIdx] = {
        ...items[activeSlotIdx],
        ...partial,
      };
      return {
        ...prev,
        items,
      };
    });
  };

  const handleResetToDefault = () => {
    if (confirm("Reset all Featured Highlights configuration to default reference values?")) {
      setConfig(DEFAULT_FEATURED_SECTION);
      showToast("Reset to reference default configuration");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update Featured Highlights section");
      }

      showToast("Featured Highlights section updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update Featured Highlights", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-white">Featured Highlights Configuration</span>
          <span className="ml-2 font-mono text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {config.enabled ? "ACTIVE PUBLICLY" : "DISABLED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{showPreview ? "Hide Live Preview" : "Show Live Preview"}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Tab Controls: Section Settings vs 4 Slots */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("section")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "section"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          Section Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("slots")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "slots"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          Featured Item Slots (4)
        </button>
      </div>

      {/* Tab 1: Section Settings */}
      {activeTab === "section" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-white">Section-Level Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 md:col-span-2 pt-1 pb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => updateSectionField("enabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
              <span className="text-sm font-medium text-zinc-200">
                Enable Featured Highlights Section on Home Page
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Eyebrow Label</label>
              <input
                type="text"
                value={config.eyebrow}
                onChange={(e) => updateSectionField("eyebrow", e.target.value)}
                placeholder="FEATURED"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Section Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateSectionField("title", e.target.value)}
                placeholder="Featured Highlights"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-400 mb-1">Supporting Description</label>
              <textarea
                value={config.description}
                onChange={(e) => updateSectionField("description", e.target.value)}
                rows={2}
                placeholder="A quick look at the work, experience and achievements I'm most proud of..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">View All Button Label</label>
              <input
                type="text"
                value={config.ctaText}
                onChange={(e) => updateSectionField("ctaText", e.target.value)}
                placeholder="View All Featured"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">View All Button URL</label>
              <input
                type="text"
                value={config.ctaLink}
                onChange={(e) => updateSectionField("ctaLink", e.target.value)}
                placeholder="/projects"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 4 Configurable Slots */}
      {activeTab === "slots" && (
        <div className="space-y-4">
          {/* Slot Selector Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {config.items.map((item, idx) => {
              const ItemIcon = getBadgeIcon(item.badge?.icon, item.type);
              const isSelected = activeSlotIdx === idx;
              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => setActiveSlotIdx(idx)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 shadow-sm"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                      Slot {idx + 1}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.enabled ? "bg-emerald-500" : "bg-zinc-600"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white truncate">
                    <ItemIcon className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                    <span className="truncate">{item.title || `Item ${idx + 1}`}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 capitalize mt-0.5">
                    {item.type} · Order #{item.order}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Item Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Configuring Slot {activeSlotIdx + 1}: {activeItem.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select item type and customize all visual fields, tags, and CTAs.
                </p>
              </div>

              {/* Slot Enabled Toggle */}
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeItem.enabled}
                    onChange={(e) => updateActiveItem({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
                <span className="text-xs font-medium text-zinc-300">
                  {activeItem.enabled ? "Visible Publicly" : "Hidden"}
                </span>
              </div>
            </div>

            {/* Type & Order & Accent Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Item Type</label>
                <select
                  value={activeItem.type}
                  onChange={(e) => {
                    const newType = e.target.value as FeaturedItemType;
                    const badgeTextMap: Record<FeaturedItemType, string> = {
                      project: "Project",
                      experience: "Experience",
                      achievement: "Achievement",
                      certification: "Certification",
                    };
                    const accentMap: Record<FeaturedItemType, FeaturedAccent> = {
                      project: "blue",
                      experience: "green",
                      achievement: "orange",
                      certification: "purple",
                    };
                    updateActiveItem({
                      type: newType,
                      badge: {
                        ...activeItem.badge,
                        text: badgeTextMap[newType] || "Featured",
                      },
                      accent: accentMap[newType] || "blue",
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Display Order</label>
                <select
                  value={activeItem.order}
                  onChange={(e) => updateActiveItem({ order: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      Position #{num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Accent Variant</label>
                <select
                  value={activeItem.accent}
                  onChange={(e) => updateActiveItem({ accent: e.target.value as FeaturedAccent })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {ACCENT_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Badge Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={activeItem.badge?.text || ""}
                  onChange={(e) =>
                    updateActiveItem({
                      badge: { ...activeItem.badge, text: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Badge Icon</label>
                <select
                  value={activeItem.badge?.icon || "code"}
                  onChange={(e) =>
                    updateActiveItem({
                      badge: { ...activeItem.badge, icon: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="code">Code (&lt;/&gt;)</option>
                  <option value="briefcase">Briefcase (Work)</option>
                  <option value="trophy">Trophy (Achievement)</option>
                  <option value="award">Award (Certificate)</option>
                  <option value="file">File / Document</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeItem.badge?.visible !== false}
                    onChange={(e) =>
                      updateActiveItem({
                        badge: { ...activeItem.badge, visible: e.target.checked },
                      })
                    }
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300">Show Badge on Card</span>
                </label>
              </div>
            </div>

            {/* Core Card Copy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Card Title</label>
                <input
                  type="text"
                  value={activeItem.title}
                  onChange={(e) => updateActiveItem({ title: e.target.value })}
                  placeholder="e.g. CampusBuddy"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Subtitle / Company / Organization
                </label>
                <input
                  type="text"
                  value={activeItem.subtitle || ""}
                  onChange={(e) => updateActiveItem({ subtitle: e.target.value })}
                  placeholder="e.g. AI-Powered Campus Management Platform"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  value={activeItem.description}
                  onChange={(e) => updateActiveItem({ description: e.target.value })}
                  rows={2}
                  placeholder="Card summary description..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Top-Right Script / Annotation (Optional)
                </label>
                <input
                  type="text"
                  value={activeItem.annotation || ""}
                  onChange={(e) => updateActiveItem({ annotation: e.target.value })}
                  placeholder='e.g. "Built for Real Students", "Learning Building Growing"'
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Type-Specific Fields */}
            {activeItem.type === "experience" && (
              <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Experience Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Location & Mode</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.location || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, location: e.target.value },
                        })
                      }
                      placeholder="Pune, Maharashtra (Hybrid)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Duration / Period</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.duration || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, duration: e.target.value },
                        })
                      }
                      placeholder="Jul 2026 – Sep 2026 (3 Months)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeItem.type === "achievement" && (
              <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  Achievement Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Organization / Event</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.organization || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, organization: e.target.value },
                        })
                      }
                      placeholder="Ajeenkya DY Patil School of Engineering"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Rank / Recognition</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.rank || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, rank: e.target.value },
                        })
                      }
                      placeholder="2nd Rank"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Year / Date</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.date || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, date: e.target.value },
                        })
                      }
                      placeholder="2025"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeItem.type === "certification" && (
              <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                  Certification Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.issuer || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, issuer: e.target.value },
                        })
                      }
                      placeholder="Google"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Year / Date</label>
                    <input
                      type="text"
                      value={activeItem.metadata?.date || ""}
                      onChange={(e) =>
                        updateActiveItem({
                          metadata: { ...activeItem.metadata, date: e.target.value },
                        })
                      }
                      placeholder="2025"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Technology Tags */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Technology Chips (Comma-separated)
              </label>
              <input
                type="text"
                value={(activeItem.tags || []).join(", ")}
                onChange={(e) =>
                  updateActiveItem({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="React, TypeScript, Supabase, Node.js"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Image Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Card Image Asset Path / URL
                </label>
                <input
                  type="text"
                  value={activeItem.image?.url || ""}
                  onChange={(e) =>
                    updateActiveItem({
                      image: {
                        url: e.target.value,
                        alt: activeItem.image?.alt || activeItem.title,
                        visible: activeItem.image?.visible !== false,
                        position: activeItem.image?.position || "right",
                      },
                    })
                  }
                  placeholder="/images/featured/campusbuddy-preview.png"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Image Fit</label>
                <select
                  value={activeItem.image?.position || "right"}
                  onChange={(e) =>
                    updateActiveItem({
                      image: {
                        url: activeItem.image?.url || "",
                        alt: activeItem.image?.alt || activeItem.title,
                        visible: activeItem.image?.visible !== false,
                        position: e.target.value as "right" | "bottom" | "cover" | "contain",
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="right">Right (Cover)</option>
                  <option value="contain">Contain (Padded)</option>
                  <option value="cover">Full Cover</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Primary CTA Text &amp; Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={activeItem.primaryCta?.text || ""}
                    onChange={(e) =>
                      updateActiveItem({
                        primaryCta: {
                          text: e.target.value,
                          link: activeItem.primaryCta?.link || "/projects",
                        },
                      })
                    }
                    placeholder="View Project"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={activeItem.primaryCta?.link || ""}
                    onChange={(e) =>
                      updateActiveItem({
                        primaryCta: {
                          text: activeItem.primaryCta?.text || "Learn More",
                          link: e.target.value,
                        },
                      })
                    }
                    placeholder="/projects/collegestudentbuddy-campusbuddy"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Secondary CTA (Optional Text &amp; Destination)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={activeItem.secondaryCta?.text || ""}
                    onChange={(e) =>
                      updateActiveItem({
                        secondaryCta: {
                          text: e.target.value,
                          link: activeItem.secondaryCta?.link || "#",
                        },
                      })
                    }
                    placeholder="Live Demo"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={activeItem.secondaryCta?.link || ""}
                    onChange={(e) =>
                      updateActiveItem({
                        secondaryCta: {
                          text: activeItem.secondaryCta?.text || "Demo",
                          link: e.target.value,
                        },
                      })
                    }
                    placeholder="https://collegestudentbuddy-campusbuddy-dzg.vercel.app/"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Container */}
      {showPreview && (
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase font-bold text-zinc-400 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-blue-400" />
              Live Preview of Public Section (Real-Time CMS State)
            </span>
          </div>
          <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-[#091019] shadow-lg">
            <FeaturedHighlightsSection config={config} />
          </div>
        </div>
      )}
    </div>
  );
}
