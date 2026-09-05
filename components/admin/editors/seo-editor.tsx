"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { SeoMetadataDocument } from "@/types";
import { Search, Save, Loader2 } from "lucide-react";

interface SeoEditorProps {
  initialData: SeoMetadataDocument | null;
}

export function SeoEditor({ initialData }: SeoEditorProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title ?? "Siddharth Varpe — Senior Software & AI Engineer",
    description:
      initialData?.description ??
      "Personal portfolio and engineering case studies of Siddharth Varpe, specialized in full-stack web platforms, machine learning, and resilient cloud systems.",
    author: initialData?.author ?? "Siddharth Varpe",
    ogTitle: initialData?.ogTitle ?? "Siddharth Varpe — Engineering Portfolio",
    ogDescription:
      initialData?.ogDescription ??
      "Explore production case studies, systems architecture, and technical projects by Siddharth Varpe.",
    ogImageUrl: initialData?.ogImageUrl ?? "",
    canonicalUrl: initialData?.canonicalUrl ?? "https://siddharthvarpe.com",
    noIndex: initialData?.noIndex ?? false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = { ...formData };
      if (!payload.ogImageUrl) delete payload.ogImageUrl;

      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update SEO metadata");
      }

      showToast("SEO metadata updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update SEO metadata", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search Engine Optimization &amp; Open Graph</span>
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.noIndex}
              onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
              className="rounded bg-zinc-950 border-zinc-800 text-blue-500 focus:ring-0"
            />
            <span className="font-mono text-xs">Prevent Search Indexing (noindex)</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Meta Title Tag <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Meta Description (10 - 320 chars) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Author Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Canonical URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Social Sharing (Open Graph Cards)
            </h3>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Open Graph Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.ogTitle}
                onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Open Graph Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.ogDescription}
                onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Open Graph Image URL
              </label>
              <input
                type="url"
                value={formData.ogImageUrl}
                onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
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
