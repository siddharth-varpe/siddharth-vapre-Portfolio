"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { OpportunitiesSectionConfig, OpportunityBadge } from "@/types/models";
import {
  Save,
  Loader2,
  RotateCcw,
  Briefcase,
  Users,
  Database,
  Server,
  Zap,
  Sparkles,
  Code2,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { OpenForOpportunitiesSection } from "@/components/public/open-for-opportunities-section";
import { DEFAULT_OPPORTUNITIES_SECTION } from "@/lib/server/db/default-opportunities-section";

interface OpportunitiesEditorProps {
  initialConfig: OpportunitiesSectionConfig;
}

const BADGE_ICONS: { value: OpportunityBadge["icon"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "users", label: "Users / Team", icon: Users },
  { value: "database", label: "Database", icon: Database },
  { value: "server", label: "Server / Infrastructure", icon: Server },
  { value: "lightning", label: "Lightning / Speed", icon: Zap },
  { value: "sparkles", label: "Sparkles / AI", icon: Sparkles },
  { value: "code", label: "Code / Engineering", icon: Code2 },
];

export function OpportunitiesEditor({ initialConfig }: OpportunitiesEditorProps) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<OpportunitiesSectionConfig>(
    initialConfig || DEFAULT_OPPORTUNITIES_SECTION
  );
  const [activeTab, setActiveTab] = useState<"general" | "badges" | "preview">("general");
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof OpportunitiesSectionConfig>(
    field: K,
    val: OpportunitiesSectionConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleToggleBadge = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      badges: prev.badges.filter((b) => b.id !== id),
    }));
  };

  const handleAddBadge = () => {
    if (config.badges.length >= 6) {
      showToast("Maximum of 6 badges allowed", "error");
      return;
    }
    const newBadge: OpportunityBadge = {
      id: `badge-${Date.now()}`,
      label: "New Capability",
      icon: "users",
    };
    setConfig((prev) => ({
      ...prev,
      badges: [...prev.badges, newBadge],
    }));
  };

  const handleUpdateBadge = (id: string, partial: Partial<OpportunityBadge>) => {
    setConfig((prev) => ({
      ...prev,
      badges: prev.badges.map((b) => (b.id === id ? { ...b, ...partial } : b)),
    }));
  };

  const handleMoveBadge = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.badges.length) return;

    const updated = [...config.badges];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setConfig((prev) => ({ ...prev, badges: updated }));
  };

  const handleResetToDefault = () => {
    if (confirm("Reset Open For Opportunities section to reference default configuration?")) {
      setConfig(DEFAULT_OPPORTUNITIES_SECTION);
      showToast("Reset to reference default configuration");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/opportunities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update Open For Opportunities section");
      }

      showToast("Open For Opportunities section updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update section", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">Open For Opportunities CMS</h2>
            <p className="text-xs text-zinc-400">
              Control the asymmetric call-to-action banner, origami artwork, headline, and capability badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-blue-500 text-white font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          General &amp; Headlines
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "badges"
              ? "border-blue-500 text-white font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Capability Badges ({config.badges.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "preview"
              ? "border-blue-500 text-white font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Tab 1: General & Headlines */}
      {activeTab === "general" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
            {/* Enabled Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">Enable Opportunities Section</span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  When enabled, this section appears immediately below Verified Distinctions on the Home page.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateField("enabled", e.target.checked)}
                className="w-4 h-4 rounded-sm border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Eyebrow */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Section Eyebrow <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={config.eyebrow}
                onChange={(e) => updateField("eyebrow", e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. OPEN FOR OPPORTUNITIES"
              />
            </div>

            {/* Dual Headlines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Primary Headline <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={config.titlePrimary}
                  onChange={(e) => updateField("titlePrimary", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Ready to engineer high-impact systems"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Accent Headline (Gradient Text) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={config.titleAccent}
                  onChange={(e) => updateField("titleAccent", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. together."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Description Subtext <span className="text-red-400">*</span>
              </label>
              <textarea
                value={config.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
                rows={3}
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                placeholder="Whether you are hiring for full-stack software engineering roles..."
              />
            </div>

            {/* Call to Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={config.primaryCtaText}
                  onChange={(e) => updateField("primaryCtaText", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Get in Touch"
                />
                <label className="block text-xs font-mono text-zinc-500 mt-2 mb-1">Primary CTA URL</label>
                <input
                  type="text"
                  value={config.primaryCtaLink}
                  onChange={(e) => updateField("primaryCtaLink", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="/contact"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Secondary CTA Button Label</label>
                <input
                  type="text"
                  value={config.secondaryCtaText}
                  onChange={(e) => updateField("secondaryCtaText", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Download Resume PDF"
                />
                <label className="block text-xs font-mono text-zinc-500 mt-2 mb-1">Secondary CTA URL</label>
                <input
                  type="text"
                  value={config.secondaryCtaLink}
                  onChange={(e) => updateField("secondaryCtaLink", e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="/api/resume/download"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Capability Badges */}
      {activeTab === "badges" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Floating Capability Badges</h3>
              <p className="text-xs text-zinc-400">
                Pill badges dynamically floating alongside the 3D origami vector airplane.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBadge}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.badges.map((badge, idx) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveBadge(idx, "up")}
                      className="p-1 hover:text-white disabled:opacity-30 rounded-sm hover:bg-zinc-800"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.badges.length - 1}
                      onClick={() => handleMoveBadge(idx, "down")}
                      className="p-1 hover:text-white disabled:opacity-30 rounded-sm hover:bg-zinc-800"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Badge Label Input */}
                  <input
                    type="text"
                    value={badge.label}
                    onChange={(e) => handleUpdateBadge(badge.id, { label: e.target.value })}
                    className="flex-1 max-w-xs px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Badge Label (e.g. Distributed Systems)"
                  />

                  {/* Icon Select */}
                  <select
                    value={badge.icon}
                    onChange={(e) =>
                      handleUpdateBadge(badge.id, {
                        icon: e.target.value as OpportunityBadge["icon"],
                      })
                    }
                    className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {BADGE_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={config.badges.length <= 1}
                  onClick={() => handleToggleBadge(badge.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                  title="Delete Badge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Preview */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span>Live render using the current in-memory configuration:</span>
            <span className="font-mono text-blue-400">Preview Mode</span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/40 border border-zinc-800">
            <OpenForOpportunitiesSection config={config} />
          </div>
        </div>
      )}
    </div>
  );
}
