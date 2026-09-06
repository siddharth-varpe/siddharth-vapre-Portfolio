"use client";

import React, { useState, useRef } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { MediaMetadataDocument } from "@/types";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  Copy,
  Check,
  Eye,
  FileText,
  Filter,
  User,
  FolderGit2,
} from "lucide-react";

interface MediaManagerProps {
  initialMedia: MediaMetadataDocument[];
}

export function MediaManager({ initialMedia }: MediaManagerProps) {
  const { showToast } = useToast();
  const [media, setMedia] = useState<MediaMetadataDocument[]>(initialMedia);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<MediaMetadataDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaMetadataDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<MediaMetadataDocument["category"]>("project");
  const [visibility, setVisibility] = useState<MediaMetadataDocument["visibility"]>("public");
  const [associationType, setAssociationType] = useState<"none" | "profile" | "project">("none");
  const [associatedProjectId, setAssociatedProjectId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please select a file to upload", "error");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("visibility", visibility);

      if (associationType === "profile") {
        formData.append("associatedContentType", "profile");
      } else if (associationType === "project" && associatedProjectId.trim()) {
        formData.append("associatedContentType", "project");
        formData.append("associatedContentId", associatedProjectId.trim());
      }

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload asset");

      setMedia((prev) => [json.data, ...prev]);
      showToast("Media asset uploaded and registered successfully!");

      // Reset
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setUploadModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/media/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete media asset");

      setMedia((prev) => prev.filter((m) => m._id?.toString() !== deleteTarget._id?.toString()));
      showToast("Media asset deleted successfully");
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Deletion failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Storage URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-500">
            Filter Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Media ({media.length})</option>
            <option value="profile">Profile Photo</option>
            <option value="project">Project Screenshots</option>
            <option value="certificate">Certificates</option>
            <option value="achievement">Achievements</option>
            <option value="resume">Resumes</option>
            <option value="general">General</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setFilePreviewUrl(null);
            setUploadModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media assets found"
          description={
            media.length === 0
              ? "Upload project screenshots, profile portraits, or certificates to populate your portfolio storage library."
              : "No media assets match your category filter."
          }
          action={{
            label: "Upload Media",
            onClick: () => setUploadModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.mimeType?.startsWith("image/");
            const idStr = item._id?.toString() || item.filename;

            return (
              <div
                key={idStr}
                className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden flex flex-col transition-all duration-200"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-800/80">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.storageUrl}
                      alt={item.filename}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <FileText className="w-8 h-8 text-blue-400" />
                      <span className="text-[10px] font-mono uppercase">{item.mimeType}</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-800">
                      {item.category}
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTarget(item)}
                      className="p-2 rounded-lg bg-zinc-800/90 text-white hover:bg-zinc-700 transition-colors"
                      title="Preview Asset"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.storageUrl, idStr)}
                      className="p-2 rounded-lg bg-zinc-800/90 text-white hover:bg-zinc-700 transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === idStr ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={item.storageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800/90 text-white hover:bg-zinc-700 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h4
                      className="text-xs font-semibold text-zinc-200 truncate"
                      title={item.filename}
                    >
                      {item.filename}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mt-1">
                      <span>{formatBytes(item.sizeBytes)}</span>
                      <span className="capitalize">{item.visibility}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Uploaded"}
                    </span>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-white">Upload Media Asset</h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              {/* Dropzone / File Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-800 hover:border-blue-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/40"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {filePreviewUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filePreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : selectedFile ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-300">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <span className="font-semibold">{selectedFile.name}</span>
                    <span className="font-mono text-zinc-500">
                      {formatBytes(selectedFile.size)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400 text-center">
                    <Upload className="w-8 h-8 text-zinc-500 mb-1" />
                    <span className="font-medium text-white">
                      Click to browse or drag and drop asset
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      PNG, JPEG, WebP, or PDF (up to 10MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase font-mono tracking-wider text-[10px]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as MediaMetadataDocument["category"])
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="project">Project Screenshot</option>
                    <option value="profile">Profile Photo</option>
                    <option value="certificate">Certification Image</option>
                    <option value="achievement">Achievement Image</option>
                    <option value="general">General Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase font-mono tracking-wider text-[10px]">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(e.target.value as MediaMetadataDocument["visibility"])
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private (Admin only)</option>
                  </select>
                </div>
              </div>

              {/* Content Association */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="block text-zinc-400 uppercase font-mono tracking-wider text-[10px]">
                  Content Association
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssociationType("none")}
                    className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                      associationType === "none"
                        ? "border-blue-500 bg-blue-500/10 text-white font-medium"
                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssociationType("profile");
                      setCategory("profile");
                    }}
                    className={`py-2 px-3 rounded-lg border text-center flex items-center justify-center gap-1.5 transition-colors ${
                      associationType === "profile"
                        ? "border-blue-500 bg-blue-500/10 text-white font-medium"
                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssociationType("project");
                      setCategory("project");
                    }}
                    className={`py-2 px-3 rounded-lg border text-center flex items-center justify-center gap-1.5 transition-colors ${
                      associationType === "project"
                        ? "border-blue-500 bg-blue-500/10 text-white font-medium"
                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    Project
                  </button>
                </div>

                {associationType === "project" && (
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Associated Project ID or Slug"
                      value={associatedProjectId}
                      onChange={(e) => setAssociatedProjectId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
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
                      <span>Upload to Vercel Blob</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect / Preview Modal */}
      {previewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white truncate max-w-md">
                {previewTarget.filename}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewTarget(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
              {previewTarget.mimeType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewTarget.storageUrl}
                  alt={previewTarget.filename}
                  className="max-h-96 w-auto object-contain rounded-xl border border-zinc-800 shadow-xl"
                />
              ) : (
                <div className="p-12 flex flex-col items-center gap-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <FileText className="w-16 h-16 text-blue-400" />
                  <span className="text-sm font-mono text-zinc-300">
                    PDF Document ({formatBytes(previewTarget.sizeBytes)})
                  </span>
                  <a
                    href={previewTarget.storageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Document
                  </a>
                </div>
              )}

              <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Category</span>
                  <span className="text-zinc-200 capitalize">{previewTarget.category}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">File Size</span>
                  <span className="text-zinc-200">{formatBytes(previewTarget.sizeBytes)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">MIME Type</span>
                  <span className="text-zinc-200">{previewTarget.mimeType}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Visibility</span>
                  <span className="text-zinc-200 capitalize">{previewTarget.visibility}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    previewTarget.storageUrl,
                    previewTarget._id?.toString() || ""
                  )
                }
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Storage URL
              </button>

              <button
                type="button"
                onClick={() => setPreviewTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media Asset"
        description={`Are you sure you want to permanently delete "${deleteTarget?.filename}"? This will remove the asset from storage and unlink any associated content.`}
        confirmLabel="Yes, Delete Asset"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
