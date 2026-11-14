"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { TechnicalTaxonomyConfig, TaxonomySkillItem } from "@/types/models";
import {
  Save,
  Loader2,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Code2,
  Sun,
  Moon,
} from "lucide-react";
import { TechnicalTaxonomySection } from "@/components/public/technical-taxonomy-section";
import { DEFAULT_TECHNICAL_TAXONOMY } from "@/lib/server/db/default-technical-taxonomy";

interface TaxonomyEditorProps {
  initialConfig: TechnicalTaxonomyConfig;
}

const SECTION_ICON_OPTIONS = [
  { value: "code", label: "Code < / > (Default)" },
  { value: "terminal", label: "Terminal" },
  { value: "cpu", label: "CPU / Chip" },
  { value: "database", label: "Database" },
  { value: "layers", label: "Layers / Architecture" },
];

const POSITION_OPTIONS = [
  { value: "top-right", label: "Top Right (Reference Default)" },
  { value: "center-right", label: "Center Right" },
  { value: "bottom-right", label: "Bottom Right" },
];

const MOBILE_VISIBILITY_OPTIONS = [
  { value: "show", label: "Show on Mobile (Reference Default)" },
  { value: "hide", label: "Hide on Mobile" },
];

const OPACITY_OPTIONS = [
  { value: "medium", label: "Medium (Reference Default)" },
  { value: "subtle", label: "Subtle (Lower Contrast)" },
];

const ACCENT_OPTIONS = [
  { value: "blue", label: "Blue Accent (Reference Default)" },
  { value: "neutral", label: "Neutral Accent" },
];

const POPULAR_SKILL_ICONS = [
  { value: "react", label: "React.js" },
  { value: "nextjs", label: "Next.js" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "fastapi", label: "FastAPI" },
  { value: "websockets", label: "WebSockets" },
  { value: "git", label: "Git" },
  { value: "typescript", label: "TypeScript" },
  { value: "docker", label: "Docker" },
  { value: "redis", label: "Redis" },
  { value: "graphql", label: "GraphQL" },
];

export function TaxonomyEditor({ initialConfig }: TaxonomyEditorProps) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<TechnicalTaxonomyConfig>(
    initialConfig || DEFAULT_TECHNICAL_TAXONOMY
  );
  const [activeTab, setActiveTab] = useState<
    "general" | "decorative" | "skills" | "cta" | "preview"
  >("skills");
  const [isSaving, setIsSaving] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  // Modal State for Adding/Editing Skill
  const [editingSkill, setEditingSkill] = useState<TaxonomySkillItem | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);

  const updateGeneralField = <K extends keyof TechnicalTaxonomyConfig>(
    field: K,
    val: TechnicalTaxonomyConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const updateDecorativeField = <
    K extends keyof TechnicalTaxonomyConfig["decorativeVisual"]
  >(
    field: K,
    val: TechnicalTaxonomyConfig["decorativeVisual"][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      decorativeVisual: {
        ...prev.decorativeVisual,
        [field]: val,
      },
    }));
  };

  const updateCtaField = <K extends keyof TechnicalTaxonomyConfig["cta"]>(
    field: K,
    val: TechnicalTaxonomyConfig["cta"][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: val,
      },
    }));
  };

  // Skill CRUD Handlers
  const handleToggleSkill = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const handleDeleteSkill = (id: string) => {
    if (confirm("Are you sure you want to delete this skill item?")) {
      setConfig((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }));
      showToast("Skill removed");
    }
  };

  const handleMoveSkill = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.skills.length) return;

    const newSkills = [...config.skills];
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    // Renumber orders
    newSkills.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setConfig((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const handleOrderChange = (id: string, newOrder: number) => {
    setConfig((prev) => ({
      ...prev,
      skills: prev.skills
        .map((s) => (s.id === id ? { ...s, order: newOrder } : s))
        .sort((a, b) => a.order - b.order),
    }));
  };

  const handleOpenAddSkill = () => {
    const nextOrder = config.skills.length + 1;
    setEditingSkill({
      id: `tax-${Date.now()}`,
      name: "",
      category: "",
      icon: "react",
      order: nextOrder,
      enabled: true,
      link: "",
    });
    setIsNewSkill(true);
  };

  const handleOpenEditSkill = (skill: TaxonomySkillItem) => {
    setEditingSkill({ ...skill });
    setIsNewSkill(false);
  };

  const handleSaveSkillModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    if (!editingSkill.name.trim()) {
      showToast("Skill name is required", "error");
      return;
    }
    if (!editingSkill.category.trim()) {
      showToast("Category is required", "error");
      return;
    }

    if (isNewSkill) {
      setConfig((prev) => ({
        ...prev,
        skills: [...prev.skills, editingSkill].sort((a, b) => a.order - b.order),
      }));
      showToast("Skill added successfully");
    } else {
      setConfig((prev) => ({
        ...prev,
        skills: prev.skills
          .map((s) => (s.id === editingSkill.id ? editingSkill : s))
          .sort((a, b) => a.order - b.order),
      }));
      showToast("Skill updated successfully");
    }

    setEditingSkill(null);
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        "Reset Technical Taxonomy section to reference default configuration?"
      )
    ) {
      setConfig(DEFAULT_TECHNICAL_TAXONOMY);
      showToast("Reset to reference default configuration");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/taxonomy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error || "Failed to update Technical Taxonomy section"
        );
      }

      showToast("Technical Taxonomy section saved successfully!");
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Failed to update Technical Taxonomy",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-white">Technical Taxonomy CMS</span>
          <span className="ml-2 font-mono text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {config.enabled ? "ACTIVE PUBLICLY" : "DISABLED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Reference</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ${
            activeTab === "general"
              ? "bg-zinc-800 text-white shadow-xs"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("decorative")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ${
            activeTab === "decorative"
              ? "bg-zinc-800 text-white shadow-xs"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Decorative Visual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ${
            activeTab === "skills"
              ? "bg-zinc-800 text-white shadow-xs"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Skills ({config.skills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cta")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ${
            activeTab === "cta"
              ? "bg-zinc-800 text-white shadow-xs"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>CTA Button</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ml-auto ${
            activeTab === "preview"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Tab A: General */}
      {activeTab === "general" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-white">General Section Settings</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Control section visibility, typography, and section icon.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateGeneralField("enabled", e.target.checked)}
                className="h-4 w-4 rounded-sm border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-zinc-300">Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={config.eyebrow}
                maxLength={60}
                onChange={(e) => updateGeneralField("eyebrow", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
                placeholder="TECHNICAL TAXONOMY"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Section Top Icon
              </label>
              <select
                value={config.sectionIcon || "code"}
                onChange={(e) => updateGeneralField("sectionIcon", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              >
                {SECTION_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Title Primary (Black / Navy)
              </label>
              <input
                type="text"
                value={config.titlePrimary}
                maxLength={60}
                onChange={(e) => updateGeneralField("titlePrimary", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
                placeholder="Technical"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Title Accent (Vibrant Blue)
              </label>
              <input
                type="text"
                value={config.titleAccent}
                maxLength={60}
                onChange={(e) => updateGeneralField("titleAccent", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-blue-400 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-semibold"
                placeholder="Taxonomy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Taxonomy Description (Plain Text Textarea)
            </label>
            <textarea
              rows={3}
              value={config.description}
              maxLength={500}
              onChange={(e) => updateGeneralField("description", e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 leading-relaxed"
              placeholder="Categorized skills across React.js, Next.js, Node.js..."
            />
            <div className="text-[11px] text-zinc-500 mt-1 flex justify-between">
              <span>Plain text only. No HTML or arbitrary scripts allowed.</span>
              <span>{config.description.length}/500</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Decorative Visual */}
      {activeTab === "decorative" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-white">Decorative Visual Settings</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configure the technical code window illustration shown on the right side.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.decorativeVisual.enabled}
                onChange={(e) => updateDecorativeField("enabled", e.target.checked)}
                className="h-4 w-4 rounded-sm border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-zinc-300">Visual Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Visual Asset Reference
              </label>
              <input
                type="text"
                value={config.decorativeVisual.assetUrl}
                onChange={(e) => updateDecorativeField("assetUrl", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-mono text-xs"
                placeholder="/images/taxonomy-window-illustration.png"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Local asset or verified Storage URL.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Position Preset
              </label>
              <select
                value={config.decorativeVisual.position}
                onChange={(e) =>
                  updateDecorativeField(
                    "position",
                    e.target.value as "top-right" | "center-right" | "bottom-right"
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              >
                {POSITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Mobile Visibility
              </label>
              <select
                value={config.decorativeVisual.mobileVisibility}
                onChange={(e) =>
                  updateDecorativeField(
                    "mobileVisibility",
                    e.target.value as "show" | "hide"
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              >
                {MOBILE_VISIBILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Opacity Preset
              </label>
              <select
                value={config.decorativeVisual.opacityPreset}
                onChange={(e) =>
                  updateDecorativeField(
                    "opacityPreset",
                    e.target.value as "subtle" | "medium"
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              >
                {OPACITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Accent Variant
              </label>
              <select
                value={config.decorativeVisual.accentVariant}
                onChange={(e) =>
                  updateDecorativeField(
                    "accentVariant",
                    e.target.value as "blue" | "neutral"
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
              >
                {ACCENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab C: Skills */}
      {activeTab === "skills" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-white">
                Skill Cards ({config.skills.length} Items)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every skill card is individually editable, reorderable, and toggleable.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddSkill}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Skill</span>
            </button>
          </div>

          {/* Skill List */}
          <div className="space-y-2.5">
            {config.skills.map((skill, idx) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-3 p-3 bg-zinc-800/70 border border-zinc-700/60 rounded-xl hover:border-zinc-600 transition-colors"
              >
                {/* Left: Enable toggle & Squircle preview */}
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={skill.enabled}
                    onChange={() => handleToggleSkill(skill.id)}
                    className="h-4 w-4 rounded-sm border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                    title={skill.enabled ? "Disable skill" : "Enable skill"}
                  />

                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-xs font-mono text-blue-400 shrink-0">
                    {skill.icon ? skill.icon.slice(0, 3).toUpperCase() : "SKL"}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {skill.name}
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      Category: {skill.category} • Icon: {skill.icon}
                    </div>
                  </div>
                </div>

                {/* Right: Order controls, Edit, Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSkill(idx, "up")}
                      className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.skills.length - 1}
                      onClick={() => handleMoveSkill(idx, "down")}
                      className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={skill.order}
                      onChange={(e) =>
                        handleOrderChange(skill.id, parseInt(e.target.value, 10) || 1)
                      }
                      className="w-12 text-center font-mono text-xs py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-700 focus:outline-hidden focus:border-blue-500"
                      title="Display Order"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditSkill(skill)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Edit Skill"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab D: CTA */}
      {activeTab === "cta" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-white">Call to Action (CTA)</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configure the primary action button located at the bottom of the section.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.cta.enabled}
                onChange={(e) => updateCtaField("enabled", e.target.checked)}
                className="h-4 w-4 rounded-sm border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-zinc-300">CTA Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Button Text
              </label>
              <input
                type="text"
                value={config.cta.text}
                maxLength={60}
                onChange={(e) => updateCtaField("text", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
                placeholder="Explore Full Skill Catalog"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Destination Route
              </label>
              <input
                type="text"
                value={config.cta.destination}
                maxLength={100}
                onChange={(e) => updateCtaField("destination", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-mono text-xs"
                placeholder="/skills"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab E: Live Preview */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
            <div className="text-xs text-zinc-400 font-medium">
              Live Rendering Preview — Test Light &amp; Dark themes with configured database values
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewTheme("light")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  previewTheme === "light"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light Theme</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme("dark")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  previewTheme === "dark"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          <div
            className={`rounded-2xl border border-zinc-800 p-4 sm:p-6 transition-colors overflow-hidden ${
              previewTheme === "dark" ? "dark bg-zinc-950" : "bg-white"
            }`}
          >
            <TechnicalTaxonomySection config={config} />
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Skill */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">
                {isNewSkill ? "Add Skill Card" : "Edit Skill Card"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="text-zinc-400 hover:text-white text-sm p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSkillModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name}
                    maxLength={60}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, name: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
                    placeholder="React.js"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Category Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSkill.category}
                    maxLength={60}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, category: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
                    placeholder="Frontend"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Approved Icon Identifier
                  </label>
                  <select
                    value={editingSkill.icon}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, icon: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500"
                  >
                    {POPULAR_SKILL_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={editingSkill.order}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Optional Link (Route or external URL)
                </label>
                <input
                  type="text"
                  value={editingSkill.link || ""}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, link: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-mono text-xs"
                  placeholder="/skills"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="skill-enabled-check"
                  checked={editingSkill.enabled}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, enabled: e.target.checked })
                  }
                  className="h-4 w-4 rounded-sm border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="skill-enabled-check" className="text-xs text-zinc-300 cursor-pointer">
                  Card Enabled &amp; Visible in Grid
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
                >
                  {isNewSkill ? "Add Skill" : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
