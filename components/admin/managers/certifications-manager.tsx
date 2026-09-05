"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { CertificationDocument } from "@/types";
import {
  Award,
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

interface CertificationsManagerProps {
  initialCertifications: CertificationDocument[];
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<CertificationDocument[]>(initialCertifications);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CertificationDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    date: "2024",
    credentialId: "",
    credentialUrl: "",
    certificateUrl: "",
    description: "",
    featured: false,
    order: 0,
    status: "published" as CertificationDocument["status"],
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      issuer: "",
      date: "2024",
      credentialId: "",
      credentialUrl: "",
      certificateUrl: "",
      description: "",
      featured: false,
      order: items.length,
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: CertificationDocument) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      issuer: item.issuer,
      date: item.date,
      credentialId: item.credentialId ?? "",
      credentialUrl: item.credentialUrl ?? "",
      certificateUrl: item.certificateUrl ?? "",
      description: item.description ?? "",
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
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        date: form.date.trim(),
        credentialId: form.credentialId.trim() || undefined,
        credentialUrl: form.credentialUrl.trim() || undefined,
        certificateUrl: form.certificateUrl.trim() || undefined,
        description: form.description.trim() || undefined,
        featured: form.featured,
        order: Number(form.order) || 0,
        status: form.status,
      };

      if (editingItem?._id) {
        const res = await fetch(`/api/admin/certifications/${editingItem._id.toString()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update certification");

        setItems((prev) =>
          prev.map((i) => (i._id?.toString() === editingItem._id?.toString() ? json.data : i))
        );
        showToast("Certification updated successfully");
      } else {
        const res = await fetch("/api/admin/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create certification");

        setItems((prev) => [...prev, json.data]);
        showToast("Certification created successfully");
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
      const res = await fetch(`/api/admin/certifications/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete certification");
      }

      setItems((prev) => prev.filter((i) => i._id?.toString() !== deleteTarget._id?.toString()));
      showToast(`Deleted "${deleteTarget.name}"`);
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
          Showing {items.length} verified certifications
        </p>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications yet"
          description="Register technical certifications, cloud credentials, and accredited specializations."
          action={{
            label: "Add First Certification",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3">Certification / Issuer</th>
                  <th className="px-4 py-3">Credential ID</th>
                  <th className="px-4 py-3">Issue Date</th>
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
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{item.issuer}</div>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                      {item.credentialId ?? "—"}
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
                      {item.credentialUrl && (
                        <a
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-1.5 text-zinc-400 hover:text-blue-400 rounded transition-colors"
                          title="View credential verification"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Edit certification"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete certification"
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
              {editingItem ? "Edit Certification" : "Add Certification"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Certification Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Issuer <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.issuer}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    required
                    placeholder="e.g. Amazon Web Services, Google"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={form.credentialId}
                    onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                    placeholder="e.g. AWS-123456"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Issue Date <span className="text-red-400">*</span>
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
                    onChange={(e) => setForm({ ...form, status: e.target.value as CertificationDocument["status"] })}
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
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={form.credentialUrl}
                  onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
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
                  <span>Feature on certificates showcase</span>
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
        title="Delete Certification"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
