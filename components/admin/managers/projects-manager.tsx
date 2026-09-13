"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { ProjectDocument, ContentStatus } from "@/types";
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit,
  Star,
  ExternalLink,
  Search,
} from "lucide-react";

interface ProjectsManagerProps {
  initialProjects: ProjectDocument[];
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<ProjectDocument[]>(initialProjects);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ProjectDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (project: ProjectDocument, newStatus: ContentStatus) => {
    if (!project._id) return;

    try {
      const res = await fetch(`/api/admin/projects/${project._id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update project status");

      setProjects((prev) =>
        prev.map((p) => (p._id?.toString() === project._id?.toString() ? json.data : p))
      );
      showToast(`Project moved to "${newStatus}"`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Status update failed", "error");
    }
  };

  const handleToggleFeatured = async (project: ProjectDocument) => {
    if (!project._id) return;

    try {
      const res = await fetch(`/api/admin/projects/${project._id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update featured flag");

      setProjects((prev) =>
        prev.map((p) => (p._id?.toString() === project._id?.toString() ? json.data : p))
      );
      showToast(project.featured ? "Project unfeatured" : "Project marked as featured!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/projects/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p._id?.toString() !== deleteTarget._id?.toString()));
      showToast(`Deleted "${deleteTarget.title}"`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "published", "draft", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Case Study</span>
          </Link>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No case studies found"
          description={
            statusFilter === "all"
              ? "No engineering case studies have been registered in the database yet."
              : `No projects currently in "${statusFilter}" status.`
          }
          action={{
            label: "Create First Project",
            onClick: () => (window.location.href = "/admin/projects/new"),
          }}
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3">Project Title / Slug</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-center">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredProjects.map((project) => (
                  <tr key={project._id?.toString()} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-white text-sm">{project.title}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">/{project.slug}</div>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-mono">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 font-mono">{project.year}</td>
                    <td className="px-4 py-3.5">
                      <select
                        value={project.status}
                        onChange={(e) =>
                          handleStatusChange(project, e.target.value as ContentStatus)
                        }
                        className={`text-[10px] font-mono px-2 py-1 rounded-md border bg-zinc-950 focus:outline-none ${
                          project.status === "published"
                            ? "text-emerald-400 border-emerald-500/30"
                            : project.status === "draft"
                            ? "text-amber-400 border-amber-500/30"
                            : "text-zinc-400 border-zinc-700"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1 rounded transition-colors ${
                          project.featured
                            ? "text-amber-400 hover:text-amber-300"
                            : "text-zinc-600 hover:text-zinc-400"
                        }`}
                        title={project.featured ? "Featured on Home" : "Click to feature"}
                      >
                        <Star className={`w-4 h-4 ${project.featured ? "fill-amber-400" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-zinc-400">
                      {project.order}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5">
                      {project.status === "published" && (
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="View live case study"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/projects/${project._id?.toString()}`}
                        className="inline-block p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Edit case study"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete project"
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

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Project Case Study"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone and will be logged in the activity audit trail.`}
        confirmLabel="Delete Case Study"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
