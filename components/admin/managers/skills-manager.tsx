"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { SkillDocument } from "@/types";
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
  X,
} from "lucide-react";

interface SkillsManagerProps {
  initialSkills: SkillDocument[];
}

const CATEGORIES: SkillDocument["category"][] = [
  "Frontend",
  "Backend",
  "AI & ML",
  "DevOps & Cloud",
  "Tools & Systems",
];

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const { showToast } = useToast();
  const [skills, setSkills] = useState<SkillDocument[]>(initialSkills);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SkillDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    category: "Backend" as SkillDocument["category"],
    description: "",
    icon: "",
    level: "Proficient" as SkillDocument["level"],
    years: 3,
    featured: false,
    order: 0,
    status: "published" as SkillDocument["status"],
  });

  const openCreateModal = () => {
    setEditingSkill(null);
    setForm({
      name: "",
      category: (activeCategory !== "All" ? activeCategory : "Backend") as SkillDocument["category"],
      description: "",
      icon: "",
      level: "Proficient",
      years: 3,
      featured: false,
      order: skills.length,
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (skill: SkillDocument) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      description: skill.description ?? "",
      icon: skill.icon ?? "",
      level: skill.level ?? "Proficient",
      years: skill.years ?? 3,
      featured: skill.featured ?? false,
      order: skill.order ?? 0,
      status: skill.status ?? "published",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || undefined,
        icon: form.icon.trim() || undefined,
        level: form.level || undefined,
        years: Number(form.years) || 0,
        featured: form.featured,
        order: Number(form.order) || 0,
        status: form.status,
      };

      if (editingSkill?._id) {
        const res = await fetch(`/api/admin/skills/${editingSkill._id.toString()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update skill");

        setSkills((prev) =>
          prev.map((s) => (s._id?.toString() === editingSkill._id?.toString() ? json.data : s))
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

      setModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/skills/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete skill");
      }

      setSkills((prev) => prev.filter((s) => s._id?.toString() !== deleteTarget._id?.toString()));
      showToast(`Deleted skill "${deleteTarget.name}"`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSkills = skills.filter((s) => activeCategory === "All" || s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Pills & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills Table / List */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No skills found"
          description={
            activeCategory === "All"
              ? "You haven't registered any technical skills yet."
              : `No skills in the "${activeCategory}" category.`
          }
          action={{
            label: "Add First Skill",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3">Skill</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Proficiency</th>
                  <th className="px-4 py-3">Years</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredSkills.map((skill) => (
                  <tr key={skill._id?.toString()} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-white flex items-center gap-2">
                      {skill.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      <span>{skill.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-mono">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300 font-mono text-[11px]">
                      {skill.level ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono">
                      {skill.years ? `${skill.years} yrs` : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          skill.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : skill.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {skill.status === "published" && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {skill.status === "draft" && <Clock className="w-2.5 h-2.5" />}
                        {skill.status === "archived" && <Archive className="w-2.5 h-2.5" />}
                        <span className="capitalize">{skill.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-zinc-400">
                      {skill.order}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Edit skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(skill)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-in fade-in duration-150">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-white mb-4">
              {editingSkill ? "Edit Technical Skill" : "Add Technical Skill"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Skill Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Next.js, PyTorch, Kubernetes"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as SkillDocument["category"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as SkillDocument["level"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Proficient">Proficient</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={form.years}
                    onChange={(e) => setForm({ ...form, years: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as SkillDocument["status"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Description / Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Core stack for enterprise distributed microservices"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
                  />
                  <span>Feature on homepage / primary skills summary</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSkill ? "Save Changes" : "Create Skill"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Technical Skill"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action records an audit log entry.`}
        confirmLabel="Delete Skill"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
