"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { AboutDocument } from "@/types";
import { BookOpen, Save, Loader2 } from "lucide-react";

interface AboutEditorProps {
  initialData: AboutDocument | null;
}

export function AboutEditor({ initialData }: AboutEditorProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    primaryDescription:
      initialData?.primaryDescription ??
      "I am an engineer with a deep focus on building resilient backend architectures, intuitive user interfaces, and applied AI workflows.",
    supportingDescription:
      initialData?.supportingDescription ??
      "With rigorous attention to performance, security, and developer ergonomics, I design software meant for real-world production demands.",
    philosophy:
      initialData?.philosophy ??
      "Simplicity over complexity. High cohesion, low coupling, and rigorous security verification by default.",
    interests: initialData?.interests?.join(", ") ?? "Distributed Systems, Machine Learning, UI/UX, Performance",
    status: initialData?.status ?? "published",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        primaryDescription: formData.primaryDescription,
        supportingDescription: formData.supportingDescription || undefined,
        philosophy: formData.philosophy || undefined,
        interests: formData.interests
          ? formData.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        status: formData.status,
      };

      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update about section");
      }

      showToast("About section updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update about section", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Biography &amp; Engineering Philosophy</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-zinc-400">Status:</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AboutDocument["status"] })}
              className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-white font-mono text-xs focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Primary Biography Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.primaryDescription}
              onChange={(e) => setFormData({ ...formData, primaryDescription: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Supporting / Background Description
            </label>
            <textarea
              rows={3}
              value={formData.supportingDescription}
              onChange={(e) => setFormData({ ...formData, supportingDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Engineering Philosophy &amp; Core Principles
            </label>
            <textarea
              rows={3}
              value={formData.philosophy}
              onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Interests / Focus Topics (Comma separated)
            </label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="Distributed Systems, Machine Learning, UI/UX"
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
