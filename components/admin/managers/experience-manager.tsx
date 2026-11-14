"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import { ProfessionalTrackSection } from "@/components/public/professional-track-section";
import { SemanticWorkIcon, SEMANTIC_WORK_TYPE_LABELS } from "@/components/public/semantic-work-icon";
import { TechIcon } from "@/components/public/tech-icons";
import { formatDateRange } from "@/lib/utils/date-format";
import type {
  ExperienceDocument,
  ExperienceHighlight,
  SemanticWorkType,
} from "@/types/models";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Archive,
  Loader2,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  Sparkles,
} from "lucide-react";

interface ExperienceManagerProps {
  initialExperience: ExperienceDocument[];
}

export function ExperienceManager({ initialExperience }: ExperienceManagerProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<ExperienceDocument[]>(initialExperience);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [editingItem, setEditingItem] = useState<ExperienceDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state covering all 8 sections
  const [form, setForm] = useState({
    // A. Basic Information
    type: "work" as ExperienceDocument["type"],
    role: "",
    company: "",
    employmentType: "Full-time" as ExperienceDocument["employmentType"],
    workMode: "Hybrid" as "On-site" | "Hybrid" | "Remote",
    location: "Pune, Maharashtra, India",
    companyWebsite: "",
    // B. Company Branding
    companyLogoUrl: "",
    companyLogoPath: "",
    // C. Dates
    startDate: "2026-06",
    endDate: "2026-10",
    current: false,
    // D. Summary
    description: "",
    // E. Work Highlights
    highlights: [] as ExperienceHighlight[],
    // F. Technology Stack
    technologies: [] as string[],
    newTechInput: "",
    // G. CTA
    ctaLabel: "Full Timeline",
    ctaUrl: "/experience",
    // H. Status
    status: "published" as ExperienceDocument["status"],
    order: 0,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setActiveTab("edit");
    setForm({
      type: "work",
      role: "",
      company: "",
      employmentType: "Full-time",
      workMode: "Hybrid",
      location: "Pune, Maharashtra, India",
      companyWebsite: "",
      companyLogoUrl: "",
      companyLogoPath: "",
      startDate: "2026-06",
      endDate: "2026-10",
      current: false,
      description: "",
      highlights: [
        {
          id: `hl-${Date.now()}-1`,
          title: "Built & Deployed Full-Stack CRM",
          description:
            "Engineered and deployed a full-stack CRM managing 2,000–3,000+ customer records across 11 modules, reducing data retrieval time by ~90% and manual data entry by ~65%.",
          type: "crm",
          metrics: ["2,000–3,000+", "~90%", "~65%"],
          technologies: ["React.js", "Node.js", "PostgreSQL"],
          order: 0,
          enabled: true,
        },
      ],
      technologies: ["React.js", "Node.js", "JavaScript", "Python", "FastAPI", "PostgreSQL", "REST APIs", "WebSockets"],
      newTechInput: "",
      ctaLabel: "Full Timeline",
      ctaUrl: "/experience",
      status: "published",
      order: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ExperienceDocument) => {
    setEditingItem(item);
    setActiveTab("edit");

    // Standardize highlights
    const loadedHighlights: ExperienceHighlight[] = (item.highlights && item.highlights.length > 0)
      ? item.highlights
      : (item.responsibilities || []).map((resp, idx) => ({
          id: `hl-${idx + 1}`,
          title: idx === 0 ? "Built & Deployed Full-Stack CRM" : `Work Highlight ${idx + 1}`,
          description: resp,
          type: idx === 0 ? "crm" : "other",
          metrics: [],
          technologies: [],
          order: idx,
          enabled: true,
        }));

    setForm({
      type: item.type || "work",
      role: item.role,
      company: item.company,
      employmentType: item.employmentType || "Full-time",
      workMode: item.workMode || "Hybrid",
      location: item.location || "",
      companyWebsite: item.companyWebsite || "",
      companyLogoUrl: item.companyLogoUrl || "",
      companyLogoPath: item.companyLogoPath || "",
      startDate: item.startDate,
      endDate: item.endDate || "",
      current: Boolean(item.current),
      description: item.description || "",
      highlights: loadedHighlights,
      technologies: item.technologies || [],
      newTechInput: "",
      ctaLabel: item.ctaLabel || "Full Timeline",
      ctaUrl: item.ctaUrl || "/experience",
      status: item.status || "published",
      order: item.order ?? 0,
    });
    setModalOpen(true);
  };

  // Logo upload handler using Supabase Storage media API
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Company logo file must be under 5MB.", "error");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "company-logo");
      formData.append("visibility", "public");
      formData.append("associatedContentType", "experience");

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to upload company logo");
      }

      const { data } = await res.json();
      setForm((prev) => ({
        ...prev,
        companyLogoUrl: data.storageUrl,
        companyLogoPath: data.storageKey,
      }));
      showToast("Company logo uploaded successfully.", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      showToast(msg, "error");
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({
      ...prev,
      companyLogoUrl: "",
      companyLogoPath: "",
    }));
    showToast("Company logo removed.", "info");
  };

  // Highlight actions
  const handleAddHighlight = () => {
    const newHighlight: ExperienceHighlight = {
      id: `hl-${Date.now()}`,
      title: "New Work / Project Highlight",
      description: "Describe the key deliverable, metrics, and technical contributions.",
      type: "other",
      metrics: [],
      technologies: [],
      order: form.highlights.length,
      enabled: true,
    };
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight],
    }));
  };

  const handleUpdateHighlight = (id: string, updates: Partial<ExperienceHighlight>) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  };

  const handleDeleteHighlight = (id: string) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h.id !== id),
    }));
  };

  const handleMoveHighlight = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.highlights.length) return;

    const updated = [...form.highlights];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index orders
    const reindexed = updated.map((h, idx) => ({ ...h, order: idx }));
    setForm((prev) => ({ ...prev, highlights: reindexed }));
  };

  // Technology chips
  const handleAddTech = () => {
    const trimmed = form.newTechInput.trim();
    if (!trimmed) return;
    if (form.technologies.includes(trimmed)) {
      showToast("Technology already in stack applied list.", "info");
      return;
    }
    setForm((prev) => ({
      ...prev,
      technologies: [...prev.technologies, trimmed],
      newTechInput: "",
    }));
  };

  const handleRemoveTech = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  // Save form handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        type: form.type || "work",
        role: form.role.trim(),
        company: form.company.trim(),
        employmentType: form.employmentType,
        workMode: form.workMode,
        location: form.location.trim(),
        companyWebsite: form.companyWebsite.trim() || undefined,
        companyLogoUrl: form.companyLogoUrl.trim() || undefined,
        companyLogoPath: form.companyLogoPath.trim() || undefined,
        startDate: form.startDate.trim(),
        endDate: form.current ? undefined : form.endDate.trim() || undefined,
        current: form.current,
        description: form.description.trim(),
        responsibilities: form.highlights.map((h) => h.description),
        highlights: form.highlights,
        technologies: form.technologies,
        ctaLabel: form.ctaLabel.trim() || "Full Timeline",
        ctaUrl: form.ctaUrl.trim() || "/experience",
        order: form.order,
        status: form.status,
      };

      const url = editingItem
        ? `/api/admin/experience/${editingItem.id}`
        : "/api/admin/experience";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to persist professional track.");
      }

      const { data } = await res.json();

      if (editingItem) {
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? data : item)));
        showToast("Professional Track updated successfully.", "success");
      } else {
        setItems((prev) => [data, ...prev]);
        showToast("Professional Track created successfully.", "success");
      }

      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving track.";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Status toggle handler (publish / unpublish / archive)
  const handleStatusChange = async (item: ExperienceDocument, newStatus: ExperienceDocument["status"]) => {
    try {
      const res = await fetch(`/api/admin/experience/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const { data } = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)));
      showToast(`Track set to ${newStatus}.`, "success");
    } catch {
      showToast("Error updating track status", "error");
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/experience/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete track");

      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      showToast("Professional Track deleted successfully.", "success");
      setDeleteTarget(null);
    } catch {
      showToast("Error deleting track", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Derived preview document for live preview
  const previewDoc: ExperienceDocument = {
    id: editingItem?.id || "preview-id",
    _id: editingItem?.id || "preview-id",
    type: form.type || "work",
    role: form.role || "Software Developer Intern",
    company: form.company || "Opstech Solution Pvt. Ltd.",
    companyLogoUrl: form.companyLogoUrl || undefined,
    companyLogoPath: form.companyLogoPath || undefined,
    companyWebsite: form.companyWebsite || undefined,
    employmentType: form.employmentType,
    workMode: form.workMode,
    location: form.location || "Pune, Maharashtra, India",
    startDate: form.startDate || "Jun 2026",
    endDate: form.endDate || "Oct 2026",
    current: form.current,
    description: form.description || "Engineered and deployed production-grade full-stack CRM and inventory control platforms.",
    responsibilities: form.highlights.map((h) => h.description),
    highlights: form.highlights,
    technologies: form.technologies,
    ctaLabel: form.ctaLabel || "Full Timeline",
    ctaUrl: form.ctaUrl || "/experience",
    order: form.order,
    status: form.status,
    createdAt: editingItem?.createdAt || new Date(),
    updatedAt: new Date(),
  };

  const { durationText } = formatDateRange(form.startDate, form.endDate, form.current);

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <span>Professional Tracks</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            The newest <strong className="text-blue-400 font-semibold">published</strong> record automatically becomes the Home Track. All published records display in chronological order on the Experience page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Professional Track</span>
        </button>
      </div>

      {/* ADMIN LIST (Sorted newest first) */}
      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Professional Tracks found"
          description="Create your first professional track record to showcase career milestones, verified metrics, and technical contributions."
          action={{
            label: "Add Professional Track",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
          {items.map((item, idx) => {
            const itemDate = formatDateRange(item.startDate, item.endDate, item.current);
            const isHomeTrack = idx === 0 && item.status === "published";

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                {/* Left Item Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Company Logo or Fallback */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/80 p-1 flex items-center justify-center shrink-0">
                    {item.companyLogoUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.companyLogoUrl}
                          alt={item.company}
                          width={40}
                          height={40}
                          className="object-contain max-h-10 max-w-10"
                        />
                      </div>
                    ) : (
                      <Briefcase className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white truncate">
                        {item.role} <span className="text-zinc-400 font-normal">at</span>{" "}
                        <span className="text-blue-400">{item.company}</span>
                      </h3>

                      {/* Home Latest Track Badge */}
                      {isHomeTrack && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          <Sparkles className="w-3 h-3" /> Home Track
                        </span>
                      )}

                      {/* Type Badge */}
                      {item.type && (
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {item.type}
                        </span>
                      )}

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                          item.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-700/30 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{itemDate.rangeText}</span>
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{item.location}</span>
                        </span>
                      )}
                      {item.workMode && (
                        <span className="text-zinc-500 font-mono">• {item.workMode}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Item Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                  {/* Status Toggle Quick Buttons */}
                  {item.status !== "published" && (
                    <button
                      onClick={() => handleStatusChange(item, "published")}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors cursor-pointer"
                      title="Publish to public Home & Experience"
                    >
                      Publish
                    </button>
                  )}

                  {item.status === "published" && (
                    <button
                      onClick={() => handleStatusChange(item, "draft")}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                      title="Unpublish to draft"
                    >
                      Unpublish
                    </button>
                  )}

                  {item.status !== "archived" && (
                    <button
                      onClick={() => handleStatusChange(item, "archived")}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Archive track"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit full track details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete track"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROFESSIONAL TRACK EDITOR MODAL (8-SECTION ARCHITECTURE + LIVE PREVIEW)    */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-lg text-white">
                  {editingItem ? "Edit Professional Track" : "New Professional Track"}
                </h3>
              </div>

              {/* Edit / Preview Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex bg-zinc-800 p-1 rounded-xl border border-zinc-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === "edit"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "preview"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {activeTab === "preview" ? (
                /* LIVE PREVIEW PANE using the exact public component */
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-xs text-zinc-400 flex items-center justify-between">
                    <span>Rendering real-time public ProfessionalTrackSection preview</span>
                    <span className="font-mono text-blue-400">Light & Dark theme capable</span>
                  </div>
                  <div className="p-4 sm:p-8 bg-zinc-950/70 border border-zinc-800 rounded-2xl flex items-center justify-center">
                    <ProfessionalTrackSection track={previewDoc} isEmbedPreview={true} />
                  </div>
                </div>
              ) : (
                <form id="track-form" onSubmit={handleSave} className="space-y-8">
                  {/* ------------------------------------------------------------ */}
                  {/* A. BASIC INFORMATION                                         */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 border-b border-zinc-800 pb-2">
                      A. Basic Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Record Type *
                        </label>
                        <select
                          value={form.type || "work"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              type: e.target.value as ExperienceDocument["type"],
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="work">Work / Professional Experience</option>
                          <option value="education">Education / University</option>
                          <option value="achievement">Achievement / Recognition</option>
                          <option value="project">Project Track</option>
                          <option value="other">Other Track</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Role Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          placeholder="Software Developer Intern"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="Opstech Solution Pvt. Ltd."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Employment Type
                        </label>
                        <select
                          value={form.employmentType}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              employmentType: e.target.value as ExperienceDocument["employmentType"],
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Work Mode
                        </label>
                        <select
                          value={form.workMode}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              workMode: e.target.value as "On-site" | "Hybrid" | "Remote",
                            })
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="Pune, Maharashtra, India"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Company Website
                      </label>
                      <input
                        type="url"
                        value={form.companyWebsite}
                        onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                        placeholder="https://opstechsolution.com"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* B. COMPANY BRANDING & LOGO UPLOAD                            */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 border-b border-zinc-800 pb-2">
                      B. Company Branding
                    </h4>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 bg-zinc-800/40 border border-zinc-700/60 rounded-xl">
                      {/* Logo Preview */}
                      <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-600/60 p-2 flex items-center justify-center shrink-0">
                        {form.companyLogoUrl ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src={form.companyLogoUrl}
                              alt="Logo preview"
                              width={70}
                              height={70}
                              className="object-contain max-h-16 max-w-16"
                            />
                          </div>
                        ) : (
                          <Briefcase className="w-8 h-8 text-zinc-400" />
                        )}
                      </div>

                      {/* Controls */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="company-logo-input"
                          />
                          <label
                            htmlFor="company-logo-input"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-600/60 transition-colors cursor-pointer"
                          >
                            {isUploadingLogo ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>{form.companyLogoUrl ? "Replace Logo" : "Upload Logo"}</span>
                          </label>

                          {form.companyLogoUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
                            >
                              Remove Logo
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400">
                          Recommended: Clean transparent PNG, WebP or SVG format under 5MB. Persisted directly into Supabase Storage.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* C. DATES & DERIVED DURATION                                  */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400">
                        C. Dates & Chronology
                      </h4>
                      {durationText && (
                        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          Derived Duration: {durationText}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.startDate}
                          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                          placeholder="2026-06 or Jun 2026"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          disabled={form.current}
                          value={form.endDate}
                          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                          placeholder={form.current ? "Present" : "2026-10 or Oct 2026"}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="current-role-checkbox"
                        checked={form.current}
                        onChange={(e) =>
                          setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? "" : form.endDate })
                        }
                        className="rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="current-role-checkbox" className="text-xs text-zinc-300 cursor-pointer">
                        This is my current professional role (displays &quot;Present&quot;)
                      </label>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* D. SUMMARY                                                   */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 border-b border-zinc-800 pb-2">
                      D. Summary
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Professional Track Summary *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Engineered and deployed production-grade full-stack CRM and inventory control platforms delivering measurable operational efficiency."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* E. WORK HIGHLIGHTS & AUTOMATIC SEMANTIC ICONS                */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400">
                          E. Work Highlights (Automatic Semantic Icons)
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Admin selects semantic Work Type; system resolves icon deterministically. Numbers and metrics in descriptions are automatically highlighted in blue.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Highlight</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {form.highlights.map((hl, idx) => (
                        <div
                          key={hl.id}
                          className="p-4 bg-zinc-850 border border-zinc-750 rounded-xl space-y-3 bg-zinc-800/40 border-zinc-700/60"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              {/* Automatic Icon Preview */}
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                                <SemanticWorkIcon type={hl.type} className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-white">Highlight #{idx + 1}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveHighlight(idx, "up")}
                                disabled={idx === 0}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveHighlight(idx, "down")}
                                disabled={idx === form.highlights.length - 1}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHighlight(hl.id)}
                                className="p-1 text-zinc-400 hover:text-red-400 cursor-pointer ml-1"
                                title="Remove highlight"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                                Title *
                              </label>
                              <input
                                type="text"
                                required
                                value={hl.title}
                                onChange={(e) => handleUpdateHighlight(hl.id, { title: e.target.value })}
                                placeholder="Built & Deployed Full-Stack CRM"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                                Semantic Work Type *
                              </label>
                              <select
                                value={hl.type}
                                onChange={(e) =>
                                  handleUpdateHighlight(hl.id, {
                                    type: e.target.value as SemanticWorkType,
                                  })
                                }
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                              >
                                {Object.entries(SEMANTIC_WORK_TYPE_LABELS).map(([k, label]) => (
                                  <option key={k} value={k}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                              Description with Measurable Impact *
                            </label>
                            <textarea
                              required
                              rows={2}
                              value={hl.description}
                              onChange={(e) => handleUpdateHighlight(hl.id, { description: e.target.value })}
                              placeholder="Engineered CRM managing 2,000–3,000+ records across 11 modules, reducing retrieval time by ~90%."
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* F. TECHNOLOGY STACK                                          */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 border-b border-zinc-800 pb-2">
                      F. Technology Stack Applied (Automatic Logo Resolution)
                    </h4>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={form.newTechInput}
                        onChange={(e) => setForm({ ...form, newTechInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                        placeholder="Add technology (e.g. React.js, FastAPI, PostgreSQL)..."
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-600/60 transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {form.technologies.map((tech) => (
                        <div
                          key={tech}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-medium text-white shadow-2xs"
                        >
                          <TechIcon name={tech} className="w-4 h-4 shrink-0" />
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="text-zinc-400 hover:text-red-400 ml-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* G. CTA                                                       */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 border-b border-zinc-800 pb-2">
                      G. Action / CTA Destination
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Timeline Button Label
                        </label>
                        <input
                          type="text"
                          value={form.ctaLabel}
                          onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                          placeholder="Full Timeline"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Destination Route (Canonical /experience)
                        </label>
                        <input
                          type="text"
                          value={form.ctaUrl}
                          onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                          placeholder="/experience"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------ */}
                  {/* H. STATUS & PUBLISHING                                       */}
                  {/* ------------------------------------------------------------ */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 border-b border-zinc-800 pb-2">
                      H. Status & Visibility
                    </h4>

                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status-radio"
                          value="published"
                          checked={form.status === "published"}
                          onChange={() => setForm({ ...form, status: "published" })}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4 bg-zinc-800 border-zinc-700"
                        />
                        <span className="text-sm font-semibold text-emerald-400">Published (Public)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status-radio"
                          value="draft"
                          checked={form.status === "draft"}
                          onChange={() => setForm({ ...form, status: "draft" })}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4 bg-zinc-800 border-zinc-700"
                        />
                        <span className="text-sm font-semibold text-amber-400">Draft (Admin Only)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status-radio"
                          value="archived"
                          checked={form.status === "archived"}
                          onChange={() => setForm({ ...form, status: "archived" })}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4 bg-zinc-800 border-zinc-700"
                        />
                        <span className="text-sm font-semibold text-zinc-400">Archived</span>
                      </label>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="track-form"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingItem ? "Save Changes" : "Create Track"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Professional Track"
        description={`Are you sure you want to delete "${deleteTarget?.role} at ${deleteTarget?.company}"? This action removes the career milestone record permanently.`}
        confirmLabel="Delete Track"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
