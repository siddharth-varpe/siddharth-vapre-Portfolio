"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../toast";
import type { ProjectDocument, ContentStatus } from "@/types";
import {
  FolderGit2,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: ProjectDocument | null;
  isNew?: boolean;
}

export function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    shortDescription: initialData?.shortDescription ?? "",
    fullDescription: initialData?.fullDescription ?? "",
    category: initialData?.category ?? "Distributed Systems",
    year: initialData?.year ?? "2025",
    role: initialData?.role ?? "Lead Architect & Systems Engineer",
    problem: initialData?.problem ?? "",
    objective: initialData?.objective ?? "",
    solution: initialData?.solution ?? "",
    architectureSummary: initialData?.architectureSummary ?? "",
    implementation: initialData?.implementation?.join("\n") ?? "",
    decisions: initialData?.decisions?.join("\n") ?? "",
    challenges: initialData?.challenges?.join("\n") ?? "",
    impact: initialData?.impact?.join("\n") ?? "",
    metrics: initialData?.metrics?.join("\n") ?? "",
    technologies: initialData?.technologies?.join(", ") ?? "TypeScript, Next.js, Node.js",
    githubUrl: initialData?.githubUrl ?? "",
    liveDemoUrl: initialData?.liveDemoUrl ?? "",
    featured: initialData?.featured ?? false,
    status: (initialData?.status ?? "draft") as ContentStatus,
    order: initialData?.order ?? 0,
  });

  const autoGenerateSlug = () => {
    if (!form.title) return;
    const generated = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({ ...prev, slug: generated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        category: form.category.trim(),
        year: form.year.trim(),
        role: form.role.trim(),
        problem: form.problem.trim(),
        objective: form.objective.trim(),
        solution: form.solution.trim(),
        architectureSummary: form.architectureSummary.trim(),
        implementation: form.implementation.split("\n").map((s) => s.trim()).filter(Boolean),
        decisions: form.decisions.split("\n").map((s) => s.trim()).filter(Boolean),
        challenges: form.challenges.split("\n").map((s) => s.trim()).filter(Boolean),
        impact: form.impact.split("\n").map((s) => s.trim()).filter(Boolean),
        metrics: form.metrics.split("\n").map((s) => s.trim()).filter(Boolean),
        technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
        githubUrl: form.githubUrl.trim() || undefined,
        liveDemoUrl: form.liveDemoUrl.trim() || undefined,
        featured: form.featured,
        status: form.status,
        order: Number(form.order) || 0,
      };

      const url = isNew
        ? "/api/admin/projects"
        : `/api/admin/projects/${initialData?._id?.toString()}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save project");
      }

      showToast(isNew ? "Case study created successfully!" : "Case study updated successfully!");
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {isNew ? "Create Engineering Case Study" : `Edit Case Study: ${form.title}`}
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Structured architecture schema adhering to Phase 3 database specifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
            className="px-3 py-1.5 text-xs font-mono rounded-lg border bg-zinc-900 border-zinc-700 text-white focus:outline-none"
          >
            <option value="draft">Status: Draft</option>
            <option value="published">Status: Published</option>
            <option value="archived">Status: Archived</option>
          </select>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isNew ? "Create Project" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* 1. Core Identification & Meta */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-blue-400" />
          <span>1. Metadata &amp; Routing</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onBlur={autoGenerateSlug}
              required
              placeholder="e.g. Distributed Consensus Engine"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-zinc-400">
                URL Slug <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={autoGenerateSlug}
                className="text-[10px] text-blue-400 hover:underline font-mono"
              >
                Auto-generate
              </button>
            </div>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
              placeholder="distributed-consensus-engine"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              placeholder="e.g. Distributed Systems, Machine Learning"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Year Built <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
              placeholder="2025"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Engineering Role <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
              placeholder="Lead Architect & Systems Engineer"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded bg-zinc-950 border-zinc-800 text-blue-500"
            />
            <span>Feature this case study on the homepage showcase</span>
          </label>
        </div>
      </div>

      {/* 2. Descriptions */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
          2. Narrative &amp; Executive Summary
        </h2>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Short Description (Card teaser, 10 - 300 chars) <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            required
            placeholder="High-level overview suitable for card summaries..."
            className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Full Case Study Description (20 - 10,000 chars) <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={5}
            value={form.fullDescription}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
            required
            placeholder="Comprehensive description of the engineering project..."
            className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. Engineering Architecture Details */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
          3. Technical Deep Dive (Problem, Objective, Solution, Architecture)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Problem Statement <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              required
              placeholder="What bottlenecks or challenges prompted this project?"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Engineering Objective <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              required
              placeholder="Target throughput, latency constraints, requirements..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Solution Approach <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              required
              placeholder="How the technical architecture solved the problem..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Architecture Summary <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.architectureSummary}
              onChange={(e) => setForm({ ...form, architectureSummary: e.target.value })}
              required
              placeholder="Overview of layers, message brokers, caching, and state management..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Structured Arrays (Implementation, Decisions, Challenges, Impact, Metrics) */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
          4. Structured Evidence Points (One entry per line)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Implementation Highlights (One per line) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.implementation}
              onChange={(e) => setForm({ ...form, implementation: e.target.value })}
              required
              placeholder="Built custom WAL parser in Rust...&#10;Integrated zero-copy serialization..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Key Engineering Decisions (One per line) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.decisions}
              onChange={(e) => setForm({ ...form, decisions: e.target.value })}
              required
              placeholder="Chose append-only storage to guarantee sequential disk IO...&#10;Adopted Raft consensus..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Challenges Overcome (One per line) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.challenges}
              onChange={(e) => setForm({ ...form, challenges: e.target.value })}
              required
              placeholder="Mitigated network partitions during leader election...&#10;Reduced GC pauses..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Measured Business &amp; Technical Impact (One per line) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.impact}
              onChange={(e) => setForm({ ...form, impact: e.target.value })}
              required
              placeholder="Reduced P99 read latency from 240ms to 8ms...&#10;Saved 40% compute costs..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Key Performance Metrics (One per line) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.metrics}
              onChange={(e) => setForm({ ...form, metrics: e.target.value })}
              required
              placeholder="99.999% uptime SLA...&#10;50,000 requests/sec peak..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Technologies Stack (Comma separated) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              required
              placeholder="Rust, TypeScript, Next.js, Redis, Docker, Kafka"
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. External Proof & Verification Links */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
          5. Verification &amp; Demonstration Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              GitHub Repository URL (Optional)
            </label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Live Demo / Deployment URL (Optional)
            </label>
            <input
              type="url"
              value={form.liveDemoUrl}
              onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/admin/projects"
          className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isNew ? "Create Case Study" : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
