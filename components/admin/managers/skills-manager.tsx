"use client";

import React, { useState, useMemo } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type {
  SkillDocument,
  SkillCategoryDocument,
  SkillsPageSettings,
} from "@/types/models";
import { SkillsPageView } from "@/components/public/skills/skills-page-view";
import { TechIcon } from "@/components/public/tech-icons";
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Loader2,
  X,
  Orbit,
  Layers,
  Settings,
  Eye,
  ArrowUpDown,
  Search,
  Check,
} from "lucide-react";

interface SkillsManagerProps {
  initialSkills: SkillDocument[];
  initialCategories: SkillCategoryDocument[];
  initialSettings: SkillsPageSettings;
}

export function SkillsManager({
  initialSkills,
  initialCategories,
  initialSettings,
}: SkillsManagerProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"skills" | "categories" | "settings" | "preview">("skills");

  // State
  const [skills, setSkills] = useState<SkillDocument[]>(initialSkills);
  const [categories, setCategories] = useState<SkillCategoryDocument[]>(initialCategories);
  const [settings, setSettings] = useState<SkillsPageSettings>(initialSettings);

  // Skill Filters & Modals
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillDocument | null>(null);
  const [deleteSkillTarget, setDeleteSkillTarget] = useState<SkillDocument | null>(null);
  const [isDeletingSkill, setIsDeletingSkill] = useState(false);
  const [isSavingSkill, setIsSavingSkill] = useState(false);

  // Category Modals
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategoryDocument | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<SkillCategoryDocument | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Settings Save
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Skill Form
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: categories[0]?.name || "Frontend",
    description: "",
    icon: "",
    level: "Proficient" as SkillDocument["level"],
    years: 2,
    featured: false,
    orbit_enabled: true,
    order: 0,
    status: "published" as SkillDocument["status"],
  });

  // Category Form
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "code",
    accent: "blue",
    display_order: 1,
    enabled: true,
  });

  // Settings Form
  const [settingsForm, setSettingsForm] = useState<SkillsPageSettings>(initialSettings);

  // ---------------------------------------------------------------------------
  // SKILL ACTIONS
  // ---------------------------------------------------------------------------
  const openCreateSkillModal = () => {
    setEditingSkill(null);
    setSkillForm({
      name: "",
      category: activeCategoryFilter !== "All" ? activeCategoryFilter : categories[0]?.name || "Frontend",
      description: "",
      icon: "",
      level: "Proficient",
      years: 2,
      featured: false,
      orbit_enabled: true,
      order: skills.length + 1,
      status: "published",
    });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: SkillDocument) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      description: skill.description ?? "",
      icon: skill.icon ?? "",
      level: skill.level ?? "Proficient",
      years: skill.years ?? 2,
      featured: skill.featured ?? false,
      orbit_enabled: skill.orbit_enabled !== false,
      order: skill.order ?? 0,
      status: skill.status ?? "published",
    });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSkill(true);

    try {
      const payload = {
        name: skillForm.name.trim(),
        category: skillForm.category,
        description: skillForm.description.trim() || undefined,
        icon: skillForm.icon.trim() || undefined,
        level: skillForm.level || undefined,
        years: Number(skillForm.years) || 0,
        featured: skillForm.featured,
        orbit_enabled: skillForm.orbit_enabled,
        order: Number(skillForm.order) || 0,
        status: skillForm.status,
      };

      if (editingSkill?.id || editingSkill?._id) {
        const id = editingSkill.id || editingSkill._id;
        const res = await fetch(`/api/admin/skills/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update skill");

        setSkills((prev) =>
          prev.map((s) => (s.id === id || s._id === id ? json.data : s))
        );
        showToast("Skill updated successfully");
      } else {
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create skill");

        setSkills((prev) => [...prev, json.data]);
        showToast("Skill created successfully");
      }

      setSkillModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSavingSkill(false);
    }
  };

  const toggleSkillOrbit = async (skill: SkillDocument) => {
    const id = skill.id || skill._id;
    if (!id) return;
    const newOrbitState = !(skill.orbit_enabled !== false);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orbit_enabled: newOrbitState }),
      });
      if (!res.ok) throw new Error("Failed to toggle orbit state");
      setSkills((prev) =>
        prev.map((s) => (s.id === id || s._id === id ? { ...s, orbit_enabled: newOrbitState } : s))
      );
      showToast(newOrbitState ? `Added "${skill.name}" to Orbit` : `Removed "${skill.name}" from Orbit`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to toggle orbit", "error");
    }
  };

  const handleDeleteSkill = async () => {
    const id = deleteSkillTarget?.id || deleteSkillTarget?._id;
    if (!id) return;
    setIsDeletingSkill(true);

    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete skill");
      }

      setSkills((prev) => prev.filter((s) => s.id !== id && s._id !== id));
      showToast(`Deleted skill "${deleteSkillTarget.name}"`);
      setDeleteSkillTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeletingSkill(false);
    }
  };

  // ---------------------------------------------------------------------------
  // CATEGORY ACTIONS
  // ---------------------------------------------------------------------------
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      icon: "code",
      accent: "blue",
      display_order: categories.length + 1,
      enabled: true,
    });
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: SkillCategoryDocument) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "code",
      accent: cat.accent || "blue",
      display_order: cat.display_order ?? cat.order ?? 1,
      enabled: cat.enabled !== false,
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCategory(true);

    try {
      const payload = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
        icon: categoryForm.icon.trim() || "code",
        accent: categoryForm.accent || "blue",
        display_order: Number(categoryForm.display_order) || 1,
        enabled: categoryForm.enabled,
      };

      if (editingCategory?.id || editingCategory?._id) {
        const id = editingCategory.id || editingCategory._id;
        const res = await fetch(`/api/admin/skills/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update category");

        setCategories((prev) =>
          prev.map((c) => (c.id === id || c._id === id ? json.data : c))
        );
        // Also update any skills referencing old category name
        if (editingCategory.name !== payload.name) {
          setSkills((prev) =>
            prev.map((s) => (s.category === editingCategory.name ? { ...s, category: payload.name } : s))
          );
        }
        showToast("Category updated successfully");
      } else {
        const res = await fetch("/api/admin/skills/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create category");

        setCategories((prev) => [...prev, json.data]);
        showToast("Category created successfully");
      }

      setCategoryModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save category failed", "error");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    const id = deleteCategoryTarget?.id || deleteCategoryTarget?._id;
    if (!id) return;
    setIsDeletingCategory(true);

    try {
      const res = await fetch(`/api/admin/skills/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      showToast(`Deleted category "${deleteCategoryTarget.name}"`);
      setDeleteCategoryTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeletingCategory(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SETTINGS ACTIONS
  // ---------------------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      const res = await fetch("/api/admin/skills/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update settings");

      setSettings(json.data);
      showToast("Skills page & orbit settings saved successfully");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesCategory =
        activeCategoryFilter === "All" ||
        s.category?.toLowerCase() === activeCategoryFilter.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [skills, activeCategoryFilter, searchQuery]);

  // Derived computed metrics for Live Preview
  const previewMetrics = useMemo(() => {
    const totalSkills = skills.filter((s) => s.status === "published").length;
    const totalDomains = categories.filter((c) => c.enabled !== false).length;

    return (settings.metrics || []).map((m) => {
      let value = "";
      if (m.type === "tech_count") {
        value = `${totalSkills}+`;
      } else if (m.type === "domain_count") {
        value = `${totalDomains}+`;
      } else {
        value = m.customValue || m.label;
      }
      return {
        id: m.id,
        value,
        label: m.label,
        supportingText: m.supportingText,
        icon: m.icon,
      };
    });
  }, [skills, categories, settings]);

  return (
    <div className="space-y-6">
      {/* Top Tab Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "skills"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Skills Catalog ({skills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "categories"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "settings"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Orbit className="w-4 h-4" />
          <span>Orbit & Page Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "preview"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: SKILLS CATALOG
      ===================================================================== */}
      {activeTab === "skills" && (
        <div className="space-y-5">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
                  activeCategoryFilter === "All"
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                All ({skills.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id || c.name}
                  type="button"
                  onClick={() => setActiveCategoryFilter(c.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
                    activeCategoryFilter === c.name
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {c.name} ({skills.filter((s) => s.category === c.name).length})
                </button>
              ))}
            </div>

            {/* Search + Add */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={openCreateSkillModal}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Skills Table / Grid */}
          {filteredSkills.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No skills found"
              description="No technical competencies match the selected category or search filter."
              action={{
                label: "Add Skill",
                onClick: openCreateSkillModal,
              }}
            />
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-mono uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Skill</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-center">Orbit Display</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredSkills.map((skill) => (
                      <tr key={skill.id || skill.name} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                              <TechIcon name={skill.name} className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{skill.name}</div>
                              {skill.description && (
                                <div className="text-[11px] text-zinc-400 max-w-xs truncate">
                                  {skill.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-medium">
                          {skill.category}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSkillOrbit(skill)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                              skill.orbit_enabled !== false
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                                : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300"
                            }`}
                          >
                            <Orbit className="w-3 h-3" />
                            <span>{skill.orbit_enabled !== false ? "In Orbit" : "Hidden"}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-zinc-400">
                          {skill.level || "Proficient"}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400">
                          {skill.order ?? 0}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase ${
                              skill.status === "published"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {skill.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditSkillModal(skill)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                              title="Edit Skill"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteSkillTarget(skill)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: CATEGORIES MANAGEMENT
      ===================================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Dynamic Categories</h2>
              <p className="text-xs text-zinc-400">
                Categories dynamically organize public skill cards and pills.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateCategoryModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat.name);
              return (
                <div
                  key={cat.id || cat.name}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{cat.name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {catSkills.length} skills
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditCategoryModal(cat)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCategoryTarget(cat)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-900">
                    <span className="font-mono text-[11px]">Display Order: {cat.display_order ?? cat.order ?? 0}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                        cat.enabled !== false
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-900 text-zinc-500"
                      }`}
                    >
                      {cat.enabled !== false ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ORBIT & PAGE SETTINGS
      ===================================================================== */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          {/* Orbit Controls */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Orbit className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Rotating Technology Orbit Controls
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Orbit Enabled
                </label>
                <select
                  value={settingsForm.orbitEnabled ? "true" : "false"}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, orbitEnabled: e.target.value === "true" }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  <option value="true">Enabled (Rotating Orbit Active)</option>
                  <option value="false">Disabled (Static Orbit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Orbit Speed (Controlled Durations)
                </label>
                <select
                  value={settingsForm.orbitSpeed}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      orbitSpeed: e.target.value as SkillsPageSettings["orbitSpeed"],
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  <option value="slow">Slow (~32s full orbit)</option>
                  <option value="very-slow">Very Slow (~45s full orbit)</option>
                  <option value="ultra-slow">Ultra Slow (~60s full orbit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Orbit Direction
                </label>
                <select
                  value={settingsForm.orbitDirection}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      orbitDirection: e.target.value as SkillsPageSettings["orbitDirection"],
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  <option value="clockwise">Clockwise (Default)</option>
                  <option value="counterclockwise">Counterclockwise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Max Orbit Nodes (Recommended: 8)
                </label>
                <input
                  type="number"
                  min={3}
                  max={16}
                  value={settingsForm.maxOrbitNodes}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      maxOrbitNodes: Number(e.target.value) || 8,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Center Disc Text (Lines separated by newlines)
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.centerVisualText}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, centerVisualText: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Center Accent Word (Italicized in Blue)
                </label>
                <input
                  type="text"
                  value={settingsForm.centerVisualAccent}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, centerVisualAccent: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Hero Typography Settings */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Skills Page Hero Hierarchy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={settingsForm.eyebrow}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Title Primary</label>
                <input
                  type="text"
                  value={settingsForm.titlePrimary}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, titlePrimary: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Title Accent (Blue)</label>
                <input
                  type="text"
                  value={settingsForm.titleAccent}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, titleAccent: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Approach Banner Settings */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Bottom Approach Banner (MY APPROACH)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline Primary</label>
                <input
                  type="text"
                  value={settingsForm.approachBanner?.titlePrimary}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      approachBanner: { ...prev.approachBanner, titlePrimary: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline Accent</label>
                <input
                  type="text"
                  value={settingsForm.approachBanner?.titleAccent}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      approachBanner: { ...prev.approachBanner, titleAccent: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={settingsForm.approachBanner?.description}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      approachBanner: { ...prev.approachBanner, description: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={settingsForm.approachBanner?.ctaText}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      approachBanner: { ...prev.approachBanner, ctaText: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">CTA Destination</label>
                <input
                  type="text"
                  value={settingsForm.approachBanner?.ctaDestination}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      approachBanner: { ...prev.approachBanner, ctaDestination: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors disabled:opacity-50"
          >
            {isSavingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Settings</span>
          </button>
        </form>
      )}

      {/* =====================================================================
          TAB 4: LIVE PREVIEW
      ===================================================================== */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs flex items-center justify-between">
            <span>
              Real-time Live Preview using the exact same public SkillsPageView component.
            </span>
            <span className="font-mono text-[11px] text-blue-400">
              {skills.filter((s) => s.status === "published").length} active skills | {categories.length} categories
            </span>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-surface dark:bg-zinc-950 overflow-hidden shadow-2xl p-4 sm:p-6">
            <SkillsPageView
              settings={settings}
              categories={categories}
              skills={skills.filter((s) => s.status === "published")}
              metrics={previewMetrics}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: SKILL CREATE / EDIT
      ===================================================================== */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                type="button"
                onClick={() => setSkillModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. React.js, Python, PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Category *</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={skillForm.description}
                  onChange={(e) => setSkillForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. State management, hooks, component design"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Level</label>
                  <select
                    value={skillForm.level}
                    onChange={(e) =>
                      setSkillForm((prev) => ({ ...prev, level: e.target.value as SkillDocument["level"] }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="Proficient">Proficient</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Years of Exp</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={skillForm.years}
                    onChange={(e) => setSkillForm((prev) => ({ ...prev, years: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={skillForm.order}
                    onChange={(e) => setSkillForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Publication Status</label>
                  <select
                    value={skillForm.status}
                    onChange={(e) =>
                      setSkillForm((prev) => ({ ...prev, status: e.target.value as SkillDocument["status"] }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Orbit Inclusion Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Show in Technology Orbit</div>
                  <div className="text-[11px] text-zinc-400">
                    Includes this skill in the dynamic rotating orbit in the hero section.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={skillForm.orbit_enabled}
                  onChange={(e) => setSkillForm((prev) => ({ ...prev, orbit_enabled: e.target.checked }))}
                  className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSkill}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {isSavingSkill && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CATEGORY CREATE / EDIT
      ===================================================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Cloud & DevOps, Mobile"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Summary of engineering focus in this domain"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Icon Key</label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="code">Code (&lt;/&gt;)</option>
                    <option value="database">Database</option>
                    <option value="sparkles">Sparkles / AI</option>
                    <option value="wrench">Wrench / Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={categoryForm.display_order}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, display_order: Number(e.target.value) || 1 }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Category Enabled</div>
                  <div className="text-[11px] text-zinc-400">
                    Controls whether this category block appears on the public Skills page.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={categoryForm.enabled}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {isSavingCategory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Skill Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteSkillTarget)}
        title="Delete Skill"
        description={`Are you sure you want to delete "${deleteSkillTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeletingSkill}
        onConfirm={handleDeleteSkill}
        onCancel={() => setDeleteSkillTarget(null)}
      />

      {/* Delete Category Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteCategoryTarget)}
        title="Delete Category"
        description={`Are you sure you want to delete category "${deleteCategoryTarget?.name}"? A category cannot be deleted if active skills belong to it.`}
        confirmLabel="Delete"
        isLoading={isDeletingCategory}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCategoryTarget(null)}
      />
    </div>
  );
}
