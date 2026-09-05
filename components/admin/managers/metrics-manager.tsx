"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { MetricDocument } from "@/types";
import {
  TrendingUp,
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

interface MetricsManagerProps {
  initialMetrics: MetricDocument[];
}

export function MetricsManager({ initialMetrics }: MetricsManagerProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<MetricDocument[]>(initialMetrics);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MetricDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MetricDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    value: "",
    label: "",
    supportingText: "",
    context: "",
    icon: "",
    evidenceNote: "",
    featured: false,
    order: 0,
    status: "published" as MetricDocument["status"],
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      value: "",
      label: "",
      supportingText: "",
      context: "",
      icon: "",
      evidenceNote: "",
      featured: false,
      order: items.length,
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: MetricDocument) => {
    setEditingItem(item);
    setForm({
      value: item.value,
      label: item.label,
      supportingText: item.supportingText ?? "",
      context: item.context ?? "",
      icon: item.icon ?? "",
      evidenceNote: item.evidenceNote ?? "",
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
        value: form.value.trim(),
        label: form.label.trim(),
        supportingText: form.supportingText.trim() || undefined,
        context: form.context.trim() || undefined,
        icon: form.icon.trim() || undefined,
        evidenceNote: form.evidenceNote.trim() || undefined,
        featured: form.featured,
        order: Number(form.order) || 0,
        status: form.status,
      };

      if (editingItem?._id) {
        const res = await fetch(`/api/admin/metrics/${editingItem._id.toString()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update metric");

        setItems((prev) =>
          prev.map((i) => (i._id?.toString() === editingItem._id?.toString() ? json.data : i))
        );
        showToast("Metric updated successfully");
      } else {
        const res = await fetch("/api/admin/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create metric");

        setItems((prev) => [...prev, json.data]);
        showToast("Metric created successfully");
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
      const res = await fetch(`/api/admin/metrics/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete metric");
      }

      setItems((prev) => prev.filter((i) => i._id?.toString() !== deleteTarget._id?.toString()));
      showToast(`Deleted metric "${deleteTarget.label}"`);
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
          Showing {items.length} measurable metrics
        </p>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Metric</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No verified metrics yet"
          description="Maintain high-impact quantitative engineering proof points (e.g. latency, throughput, requests, users)."
          action={{
            label: "Add First Metric",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3">Metric Value</th>
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Context</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-center">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {items.map((item) => (
                  <tr key={item._id?.toString()} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-white text-base">
                      {item.value}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-zinc-200">{item.label}</td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                      {item.context ?? "General"}
                    </td>
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
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Edit metric"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete metric"
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
              {editingItem ? "Edit Impact Metric" : "Add Impact Metric"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Metric Value <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    required
                    placeholder="e.g. 99.99%, 8ms, 50k+"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Label <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    required
                    placeholder="e.g. Production Uptime"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Supporting Context Text
                </label>
                <input
                  type="text"
                  value={form.supportingText}
                  onChange={(e) => setForm({ ...form, supportingText: e.target.value })}
                  placeholder="e.g. Over 18 months of multi-region deployment"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Context Section
                  </label>
                  <input
                    type="text"
                    value={form.context}
                    onChange={(e) => setForm({ ...form, context: e.target.value })}
                    placeholder="e.g. Cloud Infrastructure"
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
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Evidence / Verification Note
                </label>
                <textarea
                  rows={2}
                  value={form.evidenceNote}
                  onChange={(e) => setForm({ ...form, evidenceNote: e.target.value })}
                  placeholder="Notes on how this metric is verified or benchmarked..."
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as MetricDocument["status"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
                    />
                    <span>Feature on hero/stats</span>
                  </label>
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
        title="Delete Metric"
        description={`Are you sure you want to delete metric "${deleteTarget?.label}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
