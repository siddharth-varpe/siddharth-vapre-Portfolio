"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { MediaMetadataDocument } from "@/types";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Loader2,
  X,
} from "lucide-react";

interface MediaManagerProps {
  initialMedia: MediaMetadataDocument[];
}

export function MediaManager({ initialMedia }: MediaManagerProps) {
  const { showToast } = useToast();
  const [media, setMedia] = useState<MediaMetadataDocument[]>(initialMedia);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaMetadataDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    filename: "",
    storageUrl: "",
    mimeType: "image/webp",
    sizeBytes: 150000,
    category: "project" as MediaMetadataDocument["category"],
    visibility: "public" as MediaMetadataDocument["visibility"],
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to register media metadata");

      setMedia((prev) => [json.data, ...prev]);
      showToast("Media metadata registered successfully!");
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
      const res = await fetch(`/api/admin/media/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete media metadata");
      }

      setMedia((prev) => prev.filter((m) => m._id?.toString() !== deleteTarget._id?.toString()));
      showToast("Media record removed");
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
        <div>
          <span className="font-semibold text-white">Phase 5 Media Boundary:</span> Media metadata references and categories are managed here. Full direct Vercel Blob file uploads, multipart parsing, and signed image optimization will be added in Phase 6.
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-zinc-400">
          Showing {media.length} media metadata records
        </p>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Media Metadata</span>
        </button>
      </div>

      {media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Media library empty"
          description="No media assets or screenshot references currently registered."
          action={{
            label: "Register First Asset",
            onClick: () => setModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <div
              key={item._id?.toString()}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {(item.sizeBytes / 1024).toFixed(0)} KB
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white truncate" title={item.filename}>
                  {item.filename}
                </h3>
                <p className="text-xs text-zinc-500 font-mono truncate">{item.storageUrl}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <a
                  href={item.storageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete metadata"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
              Register Media Asset Metadata
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Filename <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.filename}
                  onChange={(e) => setForm({ ...form, filename: e.target.value })}
                  required
                  placeholder="e.g. distributed-architecture.png"
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Storage / CDN URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={form.storageUrl}
                  onChange={(e) => setForm({ ...form, storageUrl: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as MediaMetadataDocument["category"] })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="project">Project Asset</option>
                    <option value="profile">Profile Photo</option>
                    <option value="certificate">Certificate</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    MIME Type <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.mimeType}
                    onChange={(e) => setForm({ ...form, mimeType: e.target.value })}
                    required
                    placeholder="image/webp"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none font-mono"
                  />
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
                  <span>Register</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Record"
        description={`Are you sure you want to remove metadata for "${deleteTarget?.filename}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
