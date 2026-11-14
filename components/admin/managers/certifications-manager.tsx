"use client";

import React, { useState, useRef } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type {
  CertificationDocument,
  CredentialType,
  DistinctionsSectionConfig,
  DistinctionMetrics,
} from "@/types/models";
import {
  Award,
  Trophy,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
  X,
  ExternalLink,
  Upload,
  Eye,
  Settings,
  List,
  Sparkles,
} from "lucide-react";
import { VerifiedDistinctionsSection } from "@/components/public/verified-distinctions-section";
import { DEFAULT_DISTINCTIONS_SECTION } from "@/lib/server/db/default-distinctions-section";

interface CertificationsManagerProps {
  initialCertifications: CertificationDocument[];
  initialDistinctionsSection?: DistinctionsSectionConfig;
  initialMetrics?: DistinctionMetrics;
}

const PRESET_TAGS = [
  "Prompt Engineering",
  "ADYPU",
  "Technovanza",
  "NxtWave",
  "UI/UX Design",
  "Responsive Web",
  "PostgreSQL",
  "SQL",
  "FastAPI",
  "React.js",
  "Python",
];

export function CertificationsManager({
  initialCertifications,
  initialDistinctionsSection = DEFAULT_DISTINCTIONS_SECTION,
  initialMetrics = { ranksCount: 2, certificationsCount: 3, verifiedPercentage: 100 },
}: CertificationsManagerProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active top tab
  const [activeTab, setActiveTab] = useState<"catalog" | "settings" | "preview">("catalog");

  // State: Certifications list
  const [items, setItems] = useState<CertificationDocument[]>(initialCertifications);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CertificationDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Status & Type Filter
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | CredentialType>("all");

  // Tag input state
  const [newTagInput, setNewTagInput] = useState("");

  // Record Form state
  const [form, setForm] = useState({
    name: "",
    title: "",
    issuer: "",
    credentialType: "certification" as CredentialType,
    date: "2025",
    issueDate: "2025",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    verificationUrl: "",
    certificateUrl: "",
    imagePath: "",
    tags: [] as string[],
    rank: "",
    description: "",
    featured: false,
    order: 0,
    status: "published" as CertificationDocument["status"],
  });

  // Section Configuration State
  const [sectionConfig, setSectionConfig] = useState<DistinctionsSectionConfig>(
    initialDistinctionsSection
  );
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Live Metrics Calculation
  const publishedCerts = items.filter((c) => c.status === "published");
  const liveMetrics: DistinctionMetrics = {
    ranksCount: initialMetrics.ranksCount,
    certificationsCount: publishedCerts.length,
    verifiedPercentage:
      publishedCerts.length > 0
        ? Math.round(
            (publishedCerts.filter((c) =>
              Boolean(
                (c.credentialId && c.credentialId.trim()) ||
                  (c.credentialUrl && c.credentialUrl.trim()) ||
                  (c.verificationUrl && c.verificationUrl.trim())
              )
            ).length /
              publishedCerts.length) *
              100
          )
        : 0,
  };

  // Open modal to create record
  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      title: "",
      issuer: "",
      credentialType: "certification",
      date: "2025",
      issueDate: "2025",
      expirationDate: "",
      credentialId: "",
      credentialUrl: "",
      verificationUrl: "",
      certificateUrl: "",
      imagePath: "",
      tags: ["NxtWave"],
      rank: "",
      description: "",
      featured: false,
      order: items.length,
      status: "published",
    });
    setNewTagInput("");
    setModalOpen(true);
  };

  // Open modal to edit record
  const openEditModal = (item: CertificationDocument) => {
    setEditingItem(item);
    setForm({
      name: item.name || item.title || "",
      title: item.title || item.name || "",
      issuer: item.issuer || "",
      credentialType: item.credentialType || "certification",
      date: item.date || item.issueDate || "2025",
      issueDate: item.issueDate || item.date || "2025",
      expirationDate: item.expirationDate || "",
      credentialId: item.credentialId || "",
      credentialUrl: item.credentialUrl || "",
      verificationUrl: item.verificationUrl || item.credentialUrl || "",
      certificateUrl: item.certificateUrl || "",
      imagePath: item.imagePath || "",
      tags: item.tags || [],
      rank: item.rank || "",
      description: item.description || "",
      featured: item.featured ?? false,
      order: item.order ?? 0,
      status: item.status ?? "published",
    });
    setNewTagInput("");
    setModalOpen(true);
  };

  // Handle Certificate Image Upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Certificate image must be under 5MB.", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "certificate");
      formData.append("visibility", "public");
      formData.append("associatedContentType", "certification");

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to upload certificate image");
      }

      const { data } = await res.json();
      setForm((prev) => ({
        ...prev,
        certificateUrl: data.storageUrl,
        imagePath: data.storageKey,
      }));
      showToast("Certificate image uploaded successfully.", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      showToast(msg, "error");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      certificateUrl: "",
      imagePath: "",
    }));
    showToast("Certificate image removed.", "info");
  };

  // Add / remove tags
  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || form.tags.includes(trimmed)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Save Certification Record
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name: (form.title || form.name).trim(),
        title: (form.title || form.name).trim(),
        issuer: form.issuer.trim(),
        credentialType: form.credentialType,
        date: (form.issueDate || form.date).trim(),
        issueDate: (form.issueDate || form.date).trim(),
        expirationDate: form.expirationDate.trim() || undefined,
        credentialId: form.credentialId.trim() || undefined,
        credentialUrl: form.credentialUrl.trim() || undefined,
        verificationUrl: form.verificationUrl.trim() || undefined,
        certificateUrl: form.certificateUrl.trim() || undefined,
        imagePath: form.imagePath.trim() || undefined,
        tags: form.tags,
        rank: form.rank.trim() || undefined,
        description: form.description.trim() || undefined,
        featured: form.featured,
        order: Number(form.order) || 0,
        status: form.status,
      };

      if (editingItem?._id || editingItem?.id) {
        const id = (editingItem._id || editingItem.id)!.toString();
        const res = await fetch(`/api/admin/certifications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update record");

        setItems((prev) =>
          prev.map((i) => ((i._id || i.id)?.toString() === id ? json.data : i))
        );
        showToast("Record updated successfully");
      } else {
        const res = await fetch("/api/admin/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create record");

        setItems((prev) => [json.data, ...prev]);
        showToast("Record created successfully");
      }

      setModalOpen(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Status Toggle (Publish / Unpublish / Archive)
  const handleQuickStatus = async (item: CertificationDocument, newStatus: CertificationDocument["status"]) => {
    const id = (item._id || item.id)!.toString();
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to change status");

      setItems((prev) =>
        prev.map((i) => ((i._id || i.id)?.toString() === id ? json.data : i))
      );
      showToast(`Status changed to ${newStatus}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  // Delete Record
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = (deleteTarget._id || deleteTarget.id)!.toString();
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete record");
      }

      setItems((prev) => prev.filter((i) => (i._id || i.id)?.toString() !== id));
      showToast(`Deleted "${deleteTarget.name || deleteTarget.title}"`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Section Configuration
  const handleSaveSectionConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);

    try {
      const res = await fetch("/api/admin/distinctions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionConfig),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save section settings");

      setSectionConfig(json.data);
      showToast("Verified Distinctions section settings saved.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Filtered Items for Catalog Tab
  const filteredItems = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.credentialType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Verified Distinctions & Certifications</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic 2-card Home preview + full credentials archive with automated real database metrics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "catalog"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Catalog ({items.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "settings"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Section Settings</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "preview"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CATALOG MANAGEMENT                                                 */}
      {/* ========================================================================= */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          {/* Action Bar & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-400 font-mono text-[11px] uppercase mr-1">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none"
              >
                <option value="all">All Statuses ({items.length})</option>
                <option value="published">Published ({items.filter((i) => i.status === "published").length})</option>
                <option value="draft">Draft ({items.filter((i) => i.status === "draft").length})</option>
                <option value="archived">Archived ({items.filter((i) => i.status === "archived").length})</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="certification">Certifications</option>
                <option value="award">Awards / Ranks</option>
                <option value="honor">Honors</option>
                <option value="license">Licenses</option>
              </select>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Distinction / Credential</span>
            </button>
          </div>

          {/* List Table */}
          {filteredItems.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No records found"
              description="No distinction or certification records match your current filter."
              action={{
                label: "Add New Record",
                onClick: openCreateModal,
              }}
            />
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="px-4 py-3">Home Slot</th>
                      <th className="px-4 py-3">Distinction / Issuer</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Issue Date</th>
                      <th className="px-4 py-3">Verification</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredItems.map((item) => {
                      const isPublished = item.status === "published";
                      const homeIndex = isPublished ? publishedCerts.indexOf(item) : -1;
                      const isHomeCandidate = homeIndex >= 0 && homeIndex < 2;

                      return (
                        <tr key={(item._id || item.id)?.toString()} className="hover:bg-zinc-900/60 transition-colors">
                          {/* Home Eligibility Indicator */}
                          <td className="px-4 py-3.5">
                            {isHomeCandidate ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                <span>Home Card #{homeIndex + 1}</span>
                              </span>
                            ) : isPublished ? (
                              <span className="text-[10px] font-mono text-zinc-500">Archive (Page)</span>
                            ) : (
                              <span className="text-[10px] font-mono text-zinc-600">Hidden</span>
                            )}
                          </td>

                          {/* Title & Issuer */}
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                              {item.credentialType === "award" ? (
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                              ) : (
                                <Award className="w-3.5 h-3.5 text-blue-400" />
                              )}
                              <span>{item.title || item.name}</span>
                              {item.rank && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  {item.rank}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">{item.issuer}</div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="text-[9px] font-mono px-1.5 py-0.2 rounded-xs bg-zinc-800 text-zinc-400"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Credential Type */}
                          <td className="px-4 py-3.5">
                            <span className="capitalize text-zinc-300 font-mono text-[11px]">
                              {item.credentialType || "certification"}
                            </span>
                          </td>

                          {/* Issue Date */}
                          <td className="px-4 py-3.5 font-mono text-zinc-300">
                            {item.issueDate || item.date}
                          </td>

                          {/* Verification Status */}
                          <td className="px-4 py-3.5">
                            {item.credentialId || item.credentialUrl || item.verificationUrl ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-zinc-500">Unverified</span>
                            )}
                          </td>

                          {/* Status */}
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

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right space-x-1">
                            {item.credentialUrl && (
                              <a
                                href={item.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-1.5 text-zinc-400 hover:text-blue-400 rounded transition-colors"
                                title="View verification link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() =>
                                handleQuickStatus(
                                  item,
                                  item.status === "published" ? "draft" : "published"
                                )
                              }
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                              title={item.status === "published" ? "Unpublish" : "Publish"}
                            >
                              {item.status === "published" ? (
                                <Clock className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                              title="Edit record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SECTION SETTINGS (CMS CONTROLS)                                    */}
      {/* ========================================================================= */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSectionConfig} className="space-y-6 max-w-4xl">
          {/* Section Enable & Eyebrow */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              <span>Section Header & Credential Overview</span>
            </h3>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionConfig.enabled}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, enabled: e.target.checked })
                  }
                  className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
                />
                <span>Enable Verified Distinctions section on Home page</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={sectionConfig.eyebrow}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, eyebrow: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Section Semantic Icon
                </label>
                <select
                  value={sectionConfig.sectionIcon}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      sectionIcon: e.target.value as DistinctionsSectionConfig["sectionIcon"],
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                >
                  <option value="award">Award (Ribbon Medal)</option>
                  <option value="medal">Medal</option>
                  <option value="trophy">Trophy</option>
                  <option value="badge">Badge (Shield Check)</option>
                  <option value="star">Star (Sparkles)</option>
                </select>
              </div>
            </div>

            {/* Title Primary & Accent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Title Primary
                </label>
                <input
                  type="text"
                  value={sectionConfig.titlePrimary}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, titlePrimary: e.target.value })
                  }
                  required
                  placeholder="e.g. Verified"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Title Accent (Royal Blue Token)
                </label>
                <input
                  type="text"
                  value={sectionConfig.titleAccent}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, titleAccent: e.target.value })
                  }
                  required
                  placeholder="e.g. Distinctions"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-semibold text-blue-400"
                />
              </div>
            </div>

            {/* Narrative Description */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Section Narrative Description
              </label>
              <textarea
                value={sectionConfig.description}
                onChange={(e) =>
                  setSectionConfig({ ...sectionConfig, description: e.target.value })
                }
                rows={2}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Dynamic Metrics Labels Control (Zero hardcoding) */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Dynamic Summary Metrics Labels</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Metric values (e.g. &quot;{liveMetrics.ranksCount}&quot;, &quot;{liveMetrics.certificationsCount}+&quot;, &quot;{liveMetrics.verifiedPercentage}%&quot;) are calculated dynamically from actual database records. You can customize their labels and supporting text.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Metric 1 */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                <div className="text-[11px] font-mono text-amber-400 font-semibold">
                  Metric 1: University Ranks ({liveMetrics.ranksCount})
                </div>
                <input
                  type="text"
                  value={sectionConfig.metrics.ranksLabel}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      metrics: { ...sectionConfig.metrics, ranksLabel: e.target.value },
                    })
                  }
                  placeholder="University Ranks"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                />
                <input
                  type="text"
                  value={sectionConfig.metrics.ranksSubtext}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      metrics: { ...sectionConfig.metrics, ranksSubtext: e.target.value },
                    })
                  }
                  placeholder="Prompt Engineering"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-400"
                />
              </div>

              {/* Metric 2 */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                <div className="text-[11px] font-mono text-blue-400 font-semibold">
                  Metric 2: Certifications ({liveMetrics.certificationsCount}+)
                </div>
                <input
                  type="text"
                  value={sectionConfig.metrics.certificationsLabel}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      metrics: { ...sectionConfig.metrics, certificationsLabel: e.target.value },
                    })
                  }
                  placeholder="Certifications"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                />
                <input
                  type="text"
                  value={sectionConfig.metrics.certificationsSubtext}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      metrics: { ...sectionConfig.metrics, certificationsSubtext: e.target.value },
                    })
                  }
                  placeholder="NxtWave & More"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-400"
                />
              </div>

              {/* Metric 3 */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Metric 3: Verified ({liveMetrics.verifiedPercentage}%)
                </div>
                <input
                  type="text"
                  value={sectionConfig.metrics.verifiedLabel}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      metrics: { ...sectionConfig.metrics, verifiedLabel: e.target.value },
                    })
                  }
                  placeholder="Verified"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-white"
                />
                <input
                  type="text"
                  value={sectionConfig.metrics.verifiedSubtext}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      metrics: { ...sectionConfig.metrics, verifiedSubtext: e.target.value },
                    })
                  }
                  placeholder="Authentic Credentials"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Decorative Visual Settings */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Original Decorative Visual Assets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Decorative Visuals Enabled
                </label>
                <select
                  value={sectionConfig.decorativeVisual.enabled ? "true" : "false"}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      decorativeVisual: {
                        ...sectionConfig.decorativeVisual,
                        enabled: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                >
                  <option value="true">Enabled (Trophy & Certificate)</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Mobile Trophy Visibility
                </label>
                <select
                  value={sectionConfig.decorativeVisual.mobileVisibility}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      decorativeVisual: {
                        ...sectionConfig.decorativeVisual,
                        mobileVisibility: e.target.value as "show" | "hide",
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                >
                  <option value="show">Show on Mobile (Reference layout)</option>
                  <option value="hide">Hide on Mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Accent Color Variant
                </label>
                <select
                  value={sectionConfig.decorativeVisual.accentVariant}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      decorativeVisual: {
                        ...sectionConfig.decorativeVisual,
                        accentVariant: e.target.value as "gold" | "blue" | "neutral",
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                >
                  <option value="gold">Gold (Reference standard)</option>
                  <option value="blue">Blue</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>
          </div>

          {/* Call to Action Controls */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-white">Call to Action (CTA)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={sectionConfig.cta.text}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      cta: { ...sectionConfig.cta, text: e.target.value },
                    })
                  }
                  required
                  placeholder="View Honors & Certifications"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={sectionConfig.cta.destination}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      cta: { ...sectionConfig.cta, destination: e.target.value },
                    })
                  }
                  required
                  placeholder="/certifications"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSavingConfig && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Section Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIVE PREVIEW                                                       */}
      {/* ========================================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center justify-between">
            <span>
              Live preview rendered with the actual public{" "}
              <code className="text-blue-400">VerifiedDistinctionsSection</code> component:
            </span>
            <span className="font-mono text-emerald-400">Active Published Cards: {publishedCerts.slice(0, 2).length}/2</span>
          </div>

          <div className="p-4 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950">
            <VerifiedDistinctionsSection
              config={sectionConfig}
              certifications={publishedCerts.slice(0, 2)}
              metrics={liveMetrics}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RECORD ADD / EDIT MODAL                                                   */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl space-y-5">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>{editingItem ? "Edit Distinction / Credential" : "Add Distinction / Credential"}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              {/* SECTION A: BASIC INFORMATION */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  A. Basic Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value, name: e.target.value })}
                      required
                      placeholder="e.g. Prompt Engineering — 1st Rank (ADYPU)"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Issuer / Organization <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.issuer}
                      onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                      required
                      placeholder="e.g. Ajeenkya DY Patil University, NxtWave"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Credential Type
                    </label>
                    <select
                      value={form.credentialType}
                      onChange={(e) =>
                        setForm({ ...form, credentialType: e.target.value as CredentialType })
                      }
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                    >
                      <option value="certification">Certification (Verified Credential)</option>
                      <option value="award">Award / Competition Rank</option>
                      <option value="honor">Honor / Recognition</option>
                      <option value="license">License</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Award Rank (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.rank}
                      onChange={(e) => setForm({ ...form, rank: e.target.value })}
                      placeholder="e.g. 1st Rank, 2nd Rank"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: DETAILS & DATES */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  B. Details &amp; Verification
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Summary Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="Brief description of the credential syllabus or award criteria."
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Issue Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.issueDate}
                      onChange={(e) => setForm({ ...form, issueDate: e.target.value, date: e.target.value })}
                      required
                      placeholder="e.g. 2025-03 or 2025"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={form.expirationDate}
                      onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
                      placeholder="e.g. 2028 or No Expiry"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono"
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
                      placeholder="e.g. NXT-UIUX-4091"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      value={form.credentialUrl}
                      onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Public Verification URL
                    </label>
                    <input
                      type="url"
                      value={form.verificationUrl}
                      onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: CERTIFICATE / CREDENTIAL IMAGE */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  C. Certificate / Credential Media (Supabase Storage)
                </div>

                <div className="flex items-center gap-4">
                  {form.certificateUrl ? (
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.certificateUrl}
                        alt="Certificate Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-16 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-500 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cert-file-input"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isUploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{form.certificateUrl ? "Replace Image" : "Upload Document"}</span>
                      </button>

                      {form.certificateUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Upload certificate PNG/JPG/WebP/PDF to Supabase Storage (max 5MB).
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION D: CONTROLLED TAGS */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  D. Card Tags
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-zinc-900 border border-zinc-700 text-white"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Preset Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-mono text-zinc-400 mr-1">Quick Add:</span>
                  {PRESET_TAGS.map((pTag) => (
                    <button
                      key={pTag}
                      type="button"
                      onClick={() => handleAddTag(pTag)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                        form.tags.includes(pTag)
                          ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                          : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      + {pTag}
                    </button>
                  ))}
                </div>

                {/* Custom Tag Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(newTagInput);
                      }
                    }}
                    placeholder="Custom tag (press Enter)"
                    className="flex-1 px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(newTagInput)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* SECTION E: STATUS & PUBLICATION */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  E. Publication &amp; Ordering
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as CertificationDocument["status"],
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-medium"
                    >
                      <option value="published">Published (Home &amp; Archive eligible)</option>
                      <option value="draft">Draft (Admin only)</option>
                      <option value="archived">Archived (Hidden from public)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Catalog Display Order
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.order}
                      onChange={(e) =>
                        setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex justify-end gap-2.5">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Save Changes" : "Create Distinction"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Distinction / Credential"
        description={`Are you sure you want to delete "${deleteTarget?.title || deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
