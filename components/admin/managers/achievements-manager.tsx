"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { AchievementDocument } from "@/types";
import {
  Trophy,
  Plus,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";

interface AchievementsManagerProps {
  initialAchievements: AchievementDocument[];
}

export function AchievementsManager({ initialAchievements }: AchievementsManagerProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<AchievementDocument[]>(initialAchievements);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AchievementDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    organization: "",
    rank: "",
    date: "2024",
    description: "",
    certificateUrl: "",
    verificationUrl: "",
    featured: false,
    order: 0,
    status: "published" as AchievementDocument["status"],
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      organization: "",
      rank: "",
      date: "2024",
      description: "",
      certificateUrl: "",
      verificationUrl: "",
      featured: false,
      order: items.length,
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: AchievementDocument) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      organization: item.organization,
      rank: item.rank ?? "",
      date: item.date,
      description: item.description,
      certificateUrl: item.certificateUrl ?? "",
      verificationUrl: item.verificationUrl ?? "",
      featured: item.featured ?? false,
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
        title: form.title.trim(),
        organization: form.organization.trim(),
        rank: form.rank.trim() || undefined,
        date: form.date.trim(),
        description: form.description.trim(),
        certificateUrl: form.certificateUrl.trim() || undefined,
        verificationUrl: form.verificationUrl.trim() || undefined,
        featured: form.featured,
        order: Number(form.order) || 0,
        status: form.status,
      };

      if (editingItem?._id) {
        const res = await fetch(`/api/admin/achievements/${editingItem._id.toString()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update achievement");

        setItems((prev) =>
          prev.map((i) => (i._id?.toString() === editingItem._id?.toString() ? json.data : i))
        );
        showToast("Achievement updated successfully");
      } else {
        const res = await fetch("/api/admin/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create achievement");

        setItems((prev) => [...prev, json.data]);
        showToast("Achievement created successfully");
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
      const res = await fetch(`/api/admin/achievements/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete achievement");
      }

      setItems((prev) => prev.filter((i) => i._id?.toString() !== deleteTarget._id?.toString()));
      showToast(`Deleted "${deleteTarget.title}"`);
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
          Showing {items.length} awards and honors
        </p>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Achievement</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Record hackathons, honors, competitions, and verified recognitions."
          action={{
            label: "Add First Achievement",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3">Achievement / Organization</th>
                  <th className="px-4 py-3">Rank / Position</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-center">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {items.map((item) => (
                  <tr key={item._id?.toString()} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-white text-sm flex items-center gap-1.5">
                        {item.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{item.organization}</div>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300 font-mono">
                      {item.rank ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]">
                          {item.rank}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono">{item.date}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
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
                    </td>
                    <td className="px-4 py-3.5 text-center text-zinc-400">
                      {item.featured ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mx-auto" /> : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-zinc-400">{item.order}</td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      {item.verificationUrl && (
                        <a
                          href={item.verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-1.5 text-zinc-400 hover:text-blue-400 rounded transition-colors"
                          title="View verification link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Edit achievement"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete achievement"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-white mb-4">
              {editingItem ? "Edit Achievement" : "Add Achievement"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. 1st Place National Hackathon"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Organization <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    required
                    placeholder="e.g. IEEE / ACM"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Rank / Standing (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    placeholder="1st Place / Top 1%"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    placeholder="2024"
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
                    onChange={(e) => setForm({ ...form, status: e.target.value as AchievementDocument["status"] })}
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
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="Details regarding the achievement..."
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Verification URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.verificationUrl}
                  onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
                  placeholder="https://..."
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
                  <span>Feature on honors &amp; awards section</span>
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
                  <span>{editingItem ? "Save Changes" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Achievement"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
