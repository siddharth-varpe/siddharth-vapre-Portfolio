"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { ResumeMetadataDocument } from "@/types";
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface ResumeManagerProps {
  initialResumes: ResumeMetadataDocument[];
}

export function ResumeManager({ initialResumes }: ResumeManagerProps) {
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<ResumeMetadataDocument[]>(initialResumes);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ResumeMetadataDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    filename: "Siddharth_Varpe_Resume_2025.pdf",
    storageUrl: "https://storage.example.com/resumes/siddharth-varpe-2025.pdf",
    version: "2025.1",
    active: true,
    archived: false,
    downloadEnabled: true,
    fileSizeBytes: 245000,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create resume metadata");

      // If set active, update local list
      if (form.active) {
        setResumes((prev) => [json.data, ...prev.map((r) => ({ ...r, active: false }))]);
      } else {
        setResumes((prev) => [json.data, ...prev]);
      }

      showToast("Resume metadata registered successfully!");
      setModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetActive = async (resume: ResumeMetadataDocument) => {
    if (!resume._id) return;

    try {
      const res = await fetch(`/api/admin/resume/${resume._id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to set active resume");
      }

      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          active: r._id?.toString() === resume._id?.toString(),
        }))
      );
      showToast(`Set "${resume.version}" as active public resume`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/resume/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete resume metadata");
      }

      setResumes((prev) => prev.filter((r) => r._id?.toString() !== deleteTarget._id?.toString()));
      showToast("Resume metadata removed");
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
        <div>
          <span className="font-semibold text-white">Phase 5 Metadata Mode:</span> Resume metadata records, active flags, and download accessibility are managed here. Direct Vercel Blob cloud binary uploads will be integrated in Phase 6.
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-zinc-400">
          Showing {resumes.length} registered resume versions
        </p>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Resume Version</span>
        </button>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resume versions registered"
          description="Register version metadata to control public PDF download availability."
          action={{
            label: "Register Version",
            onClick: () => setModalOpen(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume._id?.toString()}
              className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                resume.active
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{resume.filename}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-400">
                    v{resume.version}
                  </span>

                  {resume.active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Active Public Version</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetActive(resume)}
                      className="text-[10px] font-mono text-blue-400 hover:underline"
                    >
                      Set as Active
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>
                    Uploaded: {new Date(resume.uploadTimestamp).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Downloads: {resume.downloadEnabled ? "Enabled" : "Disabled"}
                  </span>
                  {resume.fileSizeBytes && (
                    <>
                      <span>•</span>
                      <span>{(resume.fileSizeBytes / 1024).toFixed(0)} KB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={resume.storageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Preview document"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setDeleteTarget(resume)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete metadata"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Modal */}
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
              Register Resume Version
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
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Storage / Cloud URL <span className="text-red-400">*</span>
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
                    Version Identifier <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    required
                    placeholder="2025.1"
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    File Size (Bytes)
                  </label>
                  <input
                    type="number"
                    value={form.fileSizeBytes}
                    onChange={(e) => setForm({ ...form, fileSizeBytes: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
                  />
                  <span>Set as active public resume version</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.downloadEnabled}
                    onChange={(e) => setForm({ ...form, downloadEnabled: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
                  />
                  <span>Enable public download button</span>
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
                  <span>Register Version</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Resume Version"
        description={`Are you sure you want to delete metadata for "${deleteTarget?.filename}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
