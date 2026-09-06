"use client";

import React, { useState, useRef } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { ResumeMetadataDocument } from "@/types";
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
  Download,
  Star,
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
  const [isUploading, setIsUploading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [version, setVersion] = useState("2025.1");
  const [makeActive, setMakeActive] = useState(true);
  const [downloadEnabled, setDownloadEnabled] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeResume = resumes.find((r) => r.active && !r.archived);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      showToast("Only PDF files are supported for resumes.", "error");
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please select a PDF file to upload", "error");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("version", version.trim() || "1.0");
      formData.append("makeActive", String(makeActive));
      formData.append("downloadEnabled", String(downloadEnabled));

      const res = await fetch("/api/admin/resume/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload resume");

      if (makeActive) {
        setResumes((prev) => [json.data, ...prev.map((r) => ({ ...r, active: false }))]);
      } else {
        setResumes((prev) => [json.data, ...prev]);
      }

      showToast("Resume version uploaded successfully!");
      setSelectedFile(null);
      setModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleActivate = async (id: string) => {
    setActivatingId(id);
    try {
      const res = await fetch(`/api/admin/resume/${id}/activate`, {
        method: "POST",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to activate resume");

      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          active: r._id?.toString() === id,
        }))
      );

      showToast(json.message || "Resume version set as active public resume!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Activation failed", "error");
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/resume/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete resume");

      setResumes((prev) =>
        prev.filter((r) => r._id?.toString() !== deleteTarget._id?.toString())
      );
      showToast("Resume version deleted successfully");
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Deletion failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Active Resume Status Card */}
      {activeResume ? (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-300">
                  Active Public Resume
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v{activeResume.version}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                {activeResume.filename} • {formatBytes(activeResume.fileSizeBytes)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Test Public Download</span>
            </a>

            <a
              href={activeResume.storageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Open raw storage URL"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 font-mono">
          <span>⚠️ No resume is currently marked active. Public download link will return 404.</span>
        </div>
      )}

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-400 font-mono">
          Total Versions Stored: {resumes.length}
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Version</span>
        </button>
      </div>

      {/* Resume Versions Table */}
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resume versions found"
          description="Upload your authentic professional resume PDF to make it available for download."
          action={{
            label: "Upload Resume",
            onClick: () => setModalOpen(true),
          }}
        />
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {resumes.map((item) => {
                  const idStr = item._id?.toString() || item.version;
                  const isActivating = activatingId === idStr;

                  return (
                    <tr key={idStr} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        v{item.version}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate max-w-xs">{item.filename}</span>
                      </td>
                      <td className="py-3 px-4">
                        {item.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">
                        {formatBytes(item.fileSizeBytes)}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                        {item.uploadTimestamp
                          ? new Date(item.uploadTimestamp).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={item.storageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors inline-flex items-center gap-1 text-[11px]"
                            title="View / Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>View</span>
                          </a>

                          {!item.active && (
                            <button
                              type="button"
                              disabled={isActivating}
                              onClick={() => handleActivate(idStr)}
                              className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors inline-flex items-center gap-1 text-[11px] disabled:opacity-50"
                              title="Set as Active Public Resume"
                            >
                              {isActivating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Star className="w-3.5 h-3.5" />
                              )}
                              <span>Set Active</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Version"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-white">Upload Resume PDF</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-800 hover:border-blue-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/40"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-300">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <span className="font-semibold text-center truncate max-w-[240px]">
                      {selectedFile.name}
                    </span>
                    <span className="font-mono text-zinc-500">
                      {formatBytes(selectedFile.size)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400 text-center">
                    <Upload className="w-8 h-8 text-zinc-500 mb-1" />
                    <span className="font-medium text-white">Select Resume PDF</span>
                    <span className="text-[11px] text-zinc-500">
                      Strictly PDF format (up to 5MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Version Input */}
              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase font-mono tracking-wider text-[10px]">
                  Version Tag
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 2025.1 or 2.0"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={makeActive}
                    onChange={(e) => setMakeActive(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-zinc-300">Set as current active public resume</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={downloadEnabled}
                    onChange={(e) => setDownloadEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-zinc-300">Enable public download</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload & Store</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Resume Version"
        description={`Are you sure you want to delete resume version v${deleteTarget?.version}? If this is the active version, public downloads will be disabled until another version is activated.`}
        confirmLabel="Yes, Delete Version"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
