"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type {
  AboutDocument,
  AboutSectionConfig,
  AboutMetricItem,
  AboutTimelineItem,
  AboutPillarItem,
} from "@/types";
import { DEFAULT_ABOUT_SECTION } from "@/lib/server/db/default-about-section";
import {
  BookOpen,
  Save,
  Loader2,
  Sparkles,
  Layers,
  Clock,
  Quote,
  Image as ImageIcon,
  Plus,
  Trash2,
  UserCheck,
  Shield,
  TrendingUp,
} from "lucide-react";

interface AboutEditorProps {
  initialData: AboutDocument | null;
  initialSectionConfig?: AboutSectionConfig | null;
}

type TabKey =
  | "general"
  | "hero"
  | "metrics"
  | "personal"
  | "timeline"
  | "philosophy"
  | "pillars"
  | "closing";

export function AboutEditor({ initialData, initialSectionConfig }: AboutEditorProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isSaving, setIsSaving] = useState(false);

  // Consolidated state matching AboutSectionConfig
  const [config, setConfig] = useState<AboutSectionConfig>(() => {
    const base = initialSectionConfig || DEFAULT_ABOUT_SECTION;
    return {
      ...DEFAULT_ABOUT_SECTION,
      ...base,
      contextBadge: {
        ...DEFAULT_ABOUT_SECTION.contextBadge,
        ...(base.contextBadge || {}),
      },
      personalDetails: {
        ...DEFAULT_ABOUT_SECTION.personalDetails,
        ...(base.personalDetails || {}),
      },
      actions: {
        ...DEFAULT_ABOUT_SECTION.actions,
        ...(base.actions || {}),
      },
      backgroundSection: {
        ...DEFAULT_ABOUT_SECTION.backgroundSection,
        ...(base.backgroundSection || {}),
      },
      closingVisual: {
        ...DEFAULT_ABOUT_SECTION.closingVisual,
        ...(base.closingVisual || {}),
      },
      metrics:
        base.metrics && base.metrics.length > 0 ? base.metrics : DEFAULT_ABOUT_SECTION.metrics,
      timeline:
        base.timeline && base.timeline.length > 0 ? base.timeline : DEFAULT_ABOUT_SECTION.timeline,
      pillars:
        base.pillars && base.pillars.length > 0 ? base.pillars : DEFAULT_ABOUT_SECTION.pillars,
    };
  });

  const [legacyAbout] = useState({
    primaryDescription:
      initialData?.primaryDescription ||
      "Full-stack software engineer focused on building production systems that eliminate operational friction and deliver measurable outcomes.",
    supportingDescription:
      initialData?.supportingDescription ||
      "I work on full-stack web applications, AI integrations, and real-world problem solving.",
    interests:
      initialData?.interests?.join(", ") ||
      "Production Systems, AI Integration & Automation, Full-Stack Architecture",
    status: initialData?.status || "published",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Save new reference-locked About Section config
      const resSection = await fetch("/api/admin/about-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const sectionJson = await resSection.json();
      if (!resSection.ok) {
        throw new Error(sectionJson.error || "Failed to update About section config");
      }

      // 2. Synchronize legacy about document if applicable
      await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aboutDescription: config.description,
          primaryDescription: legacyAbout.primaryDescription,
          supportingDescription: legacyAbout.supportingDescription,
          philosophy: config.backgroundSection.quote,
          interests: legacyAbout.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          status: legacyAbout.status,
        }),
      }).catch((err) => console.warn("Legacy about sync warning:", err));

      showToast("About page settings saved successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to save About page settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper mutators for metrics
  const updateMetric = (idx: number, patch: Partial<AboutMetricItem>) => {
    const updated = [...config.metrics];
    updated[idx] = { ...updated[idx], ...patch };
    setConfig({ ...config, metrics: updated });
  };

  const addMetric = () => {
    const newMetric: AboutMetricItem = {
      id: `metric_${Date.now()}`,
      enabled: true,
      sourceType: "projects",
      label: "New Metric",
      icon: "code",
      order: config.metrics.length + 1,
    };
    setConfig({
      ...config,
      metrics: [...config.metrics, newMetric],
    });
  };

  const removeMetric = (idx: number) => {
    const updated = config.metrics.filter((_, i) => i !== idx);
    setConfig({ ...config, metrics: updated });
  };

  // Helper mutators for timeline
  const updateTimelineItem = (idx: number, patch: Partial<AboutTimelineItem>) => {
    const updated = [...config.timeline];
    updated[idx] = { ...updated[idx], ...patch };
    setConfig({ ...config, timeline: updated });
  };

  const addTimelineItem = () => {
    const newItem: AboutTimelineItem = {
      id: `timeline_${Date.now()}`,
      enabled: true,
      period: "2026 – Present",
      title: "Engineering Milestone",
      organization: "Organization / University",
      bullets: ["Key responsibility or outcome achieved."],
      category: "work",
      order: config.timeline.length + 1,
    };
    setConfig({
      ...config,
      timeline: [...config.timeline, newItem],
    });
  };

  const removeTimelineItem = (idx: number) => {
    const updated = config.timeline.filter((_, i) => i !== idx);
    setConfig({ ...config, timeline: updated });
  };

  // Helper mutators for pillars
  const updatePillar = (idx: number, patch: Partial<AboutPillarItem>) => {
    const updated = [...config.pillars];
    updated[idx] = { ...updated[idx], ...patch };
    setConfig({ ...config, pillars: updated });
  };

  const addPillar = () => {
    const nextNum = (config.pillars.length + 1).toString().padStart(2, "0");
    const newPillar: AboutPillarItem = {
      id: `pillar_${Date.now()}`,
      enabled: true,
      number: nextNum,
      icon: "cube",
      title: "New Architectural Pillar",
      description: "Summary of the pillar's engineering foundation and impact.",
      destinationUrl: "/projects",
      order: config.pillars.length + 1,
    };
    setConfig({
      ...config,
      pillars: [...config.pillars, newPillar],
    });
  };

  const removePillar = (idx: number) => {
    const updated = config.pillars.filter((_, i) => i !== idx);
    setConfig({ ...config, pillars: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "general" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "hero" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero &amp; Portrait</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "metrics" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Metrics ({config.metrics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "personal" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Personal Row</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "timeline" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline ({config.timeline.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("philosophy")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "philosophy" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>Philosophy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pillars")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "pillars" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pillars ({config.pillars.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("closing")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "closing" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Closing Visual</span>
        </button>
      </div>

      {/* TAB 1: GENERAL */}
      {activeTab === "general" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-white">General About Settings</h2>
              <p className="text-xs text-zinc-400">Headlines, eyebrow labels, and primary introductory narrative.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-0"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Eyebrow Text (Header Badge)
              </label>
              <input
                type="text"
                value={config.eyebrow}
                onChange={(e) => setConfig({ ...config, eyebrow: e.target.value })}
                placeholder="ABOUT ME"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Hero Sub-Badge / Education Status
              </label>
              <input
                type="text"
                value={config.educationBadge}
                onChange={(e) => setConfig({ ...config, educationBadge: e.target.value })}
                placeholder="Undergraduate Engineer • 2024 – 2028"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Title Primary (Editorial Heading)
              </label>
              <input
                type="text"
                value={config.titlePrimary}
                onChange={(e) => setConfig({ ...config, titlePrimary: e.target.value })}
                placeholder="Turning Ideas into"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Title Accent (Blue Highlight Word)
              </label>
              <input
                type="text"
                value={config.titleAccent}
                onChange={(e) => setConfig({ ...config, titleAccent: e.target.value })}
                placeholder="Real Impact."
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-blue-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Introductory Biography Description (Hero Intro Copy)
            </label>
            <textarea
              rows={4}
              value={config.description || ""}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="I'm Siddharth Varpe, an undergraduate engineer passionate about building practical and scalable web applications..."
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1">
              <span>Plain text only · Rendered safely on public About hero</span>
              <span>{(config.description || "").length} chars</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO & PORTRAIT */}
      {activeTab === "hero" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="pb-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Hero Visual Composition &amp; Actions</h2>
            <p className="text-xs text-zinc-400">
              Configure portrait asset, context status card, and primary/secondary CTA destinations.
            </p>
          </div>

          {/* Portrait Asset Card with Strict Constraint Guard */}
          <div className="p-4 rounded-lg bg-zinc-950 border border-blue-900/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Original Authentic Portrait Asset (Strict Non-Generative Constraint)</span>
            </div>
            <p className="text-xs text-zinc-400">
              Per strict requirement, only approved authentic portfolio portrait assets can be selected.
              Generative editing, face altering, and screenshot cropping are disabled.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Portrait Image Source
                </label>
                <select
                  value={config.portraitAsset}
                  onChange={(e) => setConfig({ ...config, portraitAsset: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                >
                  <option value="/images/about/siddharth-about-hero.jpg">
                    /images/about/siddharth-about-hero.jpg (Dedicated About Hero Portrait)
                  </option>
                  <option value="/images/siddharth-face-original.png">
                    /images/siddharth-face-original.png (Primary Authentic Portrait)
                  </option>
                  <option value="/images/siddharth-face.png">
                    /images/siddharth-face.png (Approved Square Alternate)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Signature Handwritten Name
                </label>
                <input
                  type="text"
                  disabled
                  value="Siddharth Varpe (Vector Overlay)"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-400 font-mono text-xs cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Context Badge Card */}
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white">Floating Context Badge</div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                <input
                  type="checkbox"
                  checked={config.contextBadge.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contextBadge: { ...config.contextBadge, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-0"
                />
                <span>Badge Visible</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Status Indicator Label
                </label>
                <input
                  type="text"
                  value={config.contextBadge.label}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contextBadge: { ...config.contextBadge, label: e.target.value },
                    })
                  }
                  placeholder="Currently Learning"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Context Subtext
                </label>
                <input
                  type="text"
                  value={config.contextBadge.subtext}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contextBadge: { ...config.contextBadge, subtext: e.target.value },
                    })
                  }
                  placeholder="Full-Stack Development & AI"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="text-xs font-semibold text-white">Call to Action Buttons</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Primary Action (Dark Button)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.actions.primaryLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, primaryLabel: e.target.value },
                      })
                    }
                    placeholder="View My Journey"
                    className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                  />
                  <input
                    type="text"
                    value={config.actions.primaryUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, primaryUrl: e.target.value },
                      })
                    }
                    placeholder="#experience"
                    className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Secondary Action (Outline Button)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.actions.secondaryLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, secondaryLabel: e.target.value },
                      })
                    }
                    placeholder="Resume PDF"
                    className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                  />
                  <input
                    type="text"
                    value={config.actions.secondaryUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        actions: { ...config.actions, secondaryUrl: e.target.value },
                      })
                    }
                    placeholder="/api/resume/download"
                    className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: METRICS */}
      {activeTab === "metrics" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Hero Metric Cards</h2>
              <p className="text-xs text-zinc-400">
                Configure compact metrics. Database-derived items automatically calculate real counts.
              </p>
            </div>
            <button
              type="button"
              onClick={addMetric}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.metrics.map((metric, idx) => (
              <div
                key={metric.id}
                className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-500">#{idx + 1}</span>
                    <span className="font-semibold text-white">{metric.label}</span>
                    {metric.sourceType !== "custom" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800/60">
                        Live DB ({metric.sourceType})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-zinc-400">
                      <input
                        type="checkbox"
                        checked={metric.enabled}
                        onChange={(e) => updateMetric(idx, { enabled: e.target.checked })}
                        className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-blue-600"
                      />
                      <span>Enabled</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMetric(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove Metric"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Label</label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => updateMetric(idx, { label: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Data Source
                    </label>
                    <select
                      value={metric.sourceType}
                      onChange={(e) =>
                        updateMetric(idx, {
                          sourceType: e.target.value as AboutMetricItem["sourceType"],
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    >
                      <option value="projects">Projects Count (Live DB)</option>
                      <option value="achievements">Awards Count (Live DB)</option>
                      <option value="certifications">Certifications Count (Live DB)</option>
                      <option value="custom">Custom Static Value</option>
                    </select>
                  </div>

                  {metric.sourceType === "custom" ? (
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Custom Value
                      </label>
                      <input
                        type="text"
                        value={metric.customValue || ""}
                        onChange={(e) => updateMetric(idx, { customValue: e.target.value })}
                        placeholder="3+ Years"
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Calculation
                      </label>
                      <div className="px-2.5 py-1.5 bg-zinc-900/50 border border-zinc-800/60 rounded text-zinc-400 font-mono text-[11px]">
                        Auto-calculated from DB
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Icon</label>
                    <select
                      value={metric.icon}
                      onChange={(e) =>
                        updateMetric(idx, {
                          icon: e.target.value as AboutMetricItem["icon"],
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    >
                      <option value="code">Code (Projects)</option>
                      <option value="trophy">Trophy (Awards/Ranks)</option>
                      <option value="book">Book (Learning/Education)</option>
                      <option value="lightning">Lightning (Self-Driven)</option>
                      <option value="award">Award</option>
                      <option value="star">Star</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERSONAL DETAILS ROW */}
      {activeTab === "personal" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="pb-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Personal Information Row</h2>
            <p className="text-xs text-zinc-400">
              Compact 3-column badge row placed directly below metrics in the hero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={config.personalDetails.location}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    personalDetails: { ...config.personalDetails, location: e.target.value },
                  })
                }
                placeholder="Pune, Maharashtra, India"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Education / Degree Status
              </label>
              <input
                type="text"
                value={config.personalDetails.education}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    personalDetails: { ...config.personalDetails, education: e.target.value },
                  })
                }
                placeholder="Undergraduate Engineer (2024 – 2028)"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Availability Status
              </label>
              <input
                type="text"
                value={config.personalDetails.availability}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    personalDetails: { ...config.personalDetails, availability: e.target.value },
                  })
                }
                placeholder="Open to Opportunities"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Experience &amp; Background Timeline</h2>
              <p className="text-xs text-zinc-400">
                Data-driven vertical timeline with categorized badges and bullet points.
              </p>
            </div>
            <button
              type="button"
              onClick={addTimelineItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={config.backgroundSection.eyebrow}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    backgroundSection: { ...config.backgroundSection, eyebrow: e.target.value },
                  })
                }
                placeholder="EXPERIENCE & BACKGROUND"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Section Headline
              </label>
              <input
                type="text"
                value={config.backgroundSection.heading}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    backgroundSection: { ...config.backgroundSection, heading: e.target.value },
                  })
                }
                placeholder="Engineering with clarity, discipline, and measurable outcomes."
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Section Narrative Description
            </label>
            <textarea
              rows={3}
              value={config.backgroundSection.description}
              onChange={(e) =>
                setConfig({
                  ...config,
                  backgroundSection: { ...config.backgroundSection, description: e.target.value },
                })
              }
              placeholder="I work on full-stack web applications, AI integrations, and real-world problem solving..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white leading-relaxed"
            />
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Timeline Milestones ({config.timeline.length})
            </h3>
            {config.timeline.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-500">#{idx + 1}</span>
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-zinc-400">@ {item.organization}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-zinc-400">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => updateTimelineItem(idx, { enabled: e.target.checked })}
                        className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-blue-600"
                      />
                      <span>Enabled</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Period (e.g., 2026 – Present)
                    </label>
                    <input
                      type="text"
                      value={item.period}
                      onChange={(e) => updateTimelineItem(idx, { period: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Title / Role</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateTimelineItem(idx, { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={item.organization}
                      onChange={(e) => updateTimelineItem(idx, { organization: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Subtitle / Degree Details</label>
                    <input
                      type="text"
                      value={item.subtitle || ""}
                      onChange={(e) => updateTimelineItem(idx, { subtitle: e.target.value })}
                      placeholder="B.E. in Electronics & Telecommunication"
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Category</label>
                    <select
                      value={item.category}
                      onChange={(e) =>
                        updateTimelineItem(idx, {
                          category: e.target.value as AboutTimelineItem["category"],
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    >
                      <option value="work">Work (Blue tag)</option>
                      <option value="education">Education (Purple tag)</option>
                      <option value="growth">Growth (Green tag)</option>
                      <option value="achievement">Achievement (Amber tag)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Bullet Points (one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={item.bullets?.join("\n") || ""}
                    onChange={(e) =>
                      updateTimelineItem(idx, {
                        bullets: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Worked on full-stack solutions and AI integrations.&#10;Contributing to real-world product development."
                    className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PHILOSOPHY */}
      {activeTab === "philosophy" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="pb-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Philosophy &amp; Quote Block</h2>
            <p className="text-xs text-zinc-400">
              Callout block placed directly alongside the timeline with blue quote accent.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Core Engineering Philosophy Statement
            </label>
            <textarea
              rows={4}
              value={config.backgroundSection.quote}
              onChange={(e) =>
                setConfig({
                  ...config,
                  backgroundSection: { ...config.backgroundSection, quote: e.target.value },
                })
              }
              placeholder="Build software and systems that are useful, simple, and scalable — with a focus on real impact."
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white italic leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 7: ARCHITECTURAL PILLARS */}
      {activeTab === "pillars" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Architectural Pillars</h2>
              <p className="text-xs text-zinc-400">
                Core domain capabilities shown in 3 structured cards with numbered sequence.
              </p>
            </div>
            <button
              type="button"
              onClick={addPillar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="space-y-4">
            {config.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-bold">{pillar.number}</span>
                    <span className="font-semibold text-white">{pillar.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-zinc-400">
                      <input
                        type="checkbox"
                        checked={pillar.enabled}
                        onChange={(e) => updatePillar(idx, { enabled: e.target.checked })}
                        className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-blue-600"
                      />
                      <span>Enabled</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removePillar(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove Pillar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Number</label>
                    <input
                      type="text"
                      value={pillar.number}
                      onChange={(e) => updatePillar(idx, { number: e.target.value })}
                      placeholder="01"
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updatePillar(idx, { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Icon</label>
                    <select
                      value={pillar.icon}
                      onChange={(e) =>
                        updatePillar(idx, {
                          icon: e.target.value as AboutPillarItem["icon"],
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    >
                      <option value="cube">Cube / Production Systems</option>
                      <option value="brain">Brain / AI & Automation</option>
                      <option value="layers">Layers / Full-Stack Architecture</option>
                      <option value="system">System</option>
                      <option value="shield">Shield</option>
                      <option value="code">Code</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) => updatePillar(idx, { description: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={pillar.destinationUrl || ""}
                      onChange={(e) => updatePillar(idx, { destinationUrl: e.target.value })}
                      placeholder="/projects"
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: CLOSING VISUAL */}
      {activeTab === "closing" && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Bottom Closing Visual Card</h2>
              <p className="text-xs text-zinc-400">
                Panoramic landscape photograph with handwritten calligraphic quote overlay.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={config.closingVisual.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    closingVisual: { ...config.closingVisual, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-0"
              />
              <span>Closing Card Visible</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Image Source (Original High-Res Asset)
              </label>
              <input
                type="text"
                value={config.closingVisual.imageUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    closingVisual: { ...config.closingVisual, imageUrl: e.target.value },
                  })
                }
                placeholder="/images/about/about-closing-landscape.jpg"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Calligraphic Closing Quote
              </label>
              <input
                type="text"
                value={config.closingVisual.quote}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    closingVisual: { ...config.closingVisual, quote: e.target.value },
                  })
                }
                placeholder="A better tomorrow is built today with what you learn now."
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white italic"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-400">
          Changes will instantly update both Supabase PostgreSQL and local published cache.
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save About Settings</span>
        </button>
      </div>
    </form>
  );
}
