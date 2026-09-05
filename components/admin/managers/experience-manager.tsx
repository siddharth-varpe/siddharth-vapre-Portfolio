"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { ExperienceDocument } from "@/types";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
  X,
} from "lucide-react";

interface ExperienceManagerProps {
  initialExperience: ExperienceDocument[];
}

export function ExperienceManager({ initialExperience }: ExperienceManagerProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<ExperienceDocument[]>(initialExperience);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    company: "",
    role: "",
    employmentType: "Full-time" as ExperienceDocument["employmentType"],
    location: "Bengaluru, India",
    startDate: "2024-01",
    endDate: "",
    current: true,
    description: "",
    responsibilities: "",
    technologies: "",
    order: 0,
    status: "published" as ExperienceDocument["status"],
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      company: "",
      role: "",
      employmentType: "Full-time",
      location: "Bengaluru, India",
      startDate: "2024-01",
      endDate: "",
      current: true,
      description: "",
      responsibilities: "",
      technologies: "",
      order: items.length,
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ExperienceDocument) => {
    setEditingItem(item);
    setForm({
      company: item.company,
      role: item.role,
      employmentType: item.employmentType,
      location: item.location,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      current: item.current,
      description: item.description,
      responsibilities: item.responsibilities.join("\n"),
      technologies: item.technologies.join(", "),
      order: item.order ?? 0,
      status: item.status ?? "published",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        company: form.company.trim(),
        role: form.role.trim(),
        employmentType: form.employmentType,
        location: form.location.trim(),
        startDate: form.startDate.trim(),
        endDate: form.current ? undefined : form.endDate.trim() || undefined,
        current: form.current,
        description: form.description.trim(),
        responsibilities: form.responsibilities
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        technologies: form.technologies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        order: Number(form.order) || 0,
        status: form.status,
      };

      if (editingItem?._id) {
        const res = await fetch(`/api/admin/experience/${editingItem._id.toString()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update experience");

        setItems((prev) =>
          prev.map((i) => (i._id?.toString() === editingItem._id?.toString() ? json.data : i))
        );
        showToast("Experience record updated successfully");
      } else {
        const res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create experience");

        setItems((prev) => [...prev, json.data]);
        showToast("Experience record created successfully");
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
      const res = await fetch(`/api/admin/experience/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete experience");
      }

      setItems((prev) => prev.filter((i) => i._id?.toString() !== deleteTarget._id?.toString()));
      showToast(`Deleted "${deleteTarget.role} at ${deleteTarget.company}"`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-zinc-400">
          Showing {items.length} employment milestones
        </p>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience records"
          description="No career records have been entered yet."
          action={{
            label: "Add Career Milestone",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id?.toString()}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{item.role}</h3>
                  <span className="text-xs text-zinc-400">at</span>
                  <span className="text-sm font-medium text-blue-400">{item.company}</span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ml-2 ${
                      item.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : item.status === "draft"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {item.status === "published" && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {item.status === "draft" && <Clock className="w-2.5 h-2.5" />}
                    {item.status === "archived" && <Archive className="w-2.5 h-2.5" />}
                    <span className="capitalize">{item.status}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      {item.startDate} — {item.current ? "Present" : item.endDate}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{item.location}</span>
                  </span>
                  <span>•</span>
                  <span className="text-zinc-500">{item.employmentType}</span>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 pt-1">{item.description}</p>
              </div>

              <div className="flex items-center gap-1 self-end md:self-center shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Edit record"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-white mb-4">
              {editingItem ? "Edit Experience Record" : "Add Experience Record"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Role Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={form.employmentType}
                    onChange={(e) => setForm({ ...form, employmentType: e.target.value as ExperienceDocument["employmentType"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Start Date (e.g. 2024-01 or Jan 2024) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    disabled={form.current}
                    placeholder={form.current ? "Present" : "2024-12"}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.current}
                    onChange={(e) => setForm({ ...form, current: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
                  />
                  <span>Currently employed here (Present)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Role Overview Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Key Responsibilities (One per line) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.responsibilities}
                  onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                  required
                  placeholder="Architected microservices...&#10;Scaled ML models..."
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Technologies Used (Comma separated) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  required
                  placeholder="Next.js, TypeScript, PostgreSQL, Docker"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    onChange={(e) => setForm({ ...form, status: e.target.value as ExperienceDocument["status"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
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
                  <span>{editingItem ? "Save Changes" : "Create Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Experience Milestone"
        description={`Are you sure you want to delete "${deleteTarget?.role} at ${deleteTarget?.company}"?`}
        confirmLabel="Delete Record"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
