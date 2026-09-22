"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { HeroDocument } from "@/types";
import { Sparkles, Save, Loader2 } from "lucide-react";

interface HeroEditorProps {
  initialData: HeroDocument | null;
}

export function HeroEditor({ initialData }: HeroEditorProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    eyebrow: initialData?.eyebrow ?? "HELLO, I AM",
    name: initialData?.name ?? "Siddharth Varpe",
    headline: initialData?.headline ?? "Software & AI Engineer Crafting High-Impact Products",
    description:
      initialData?.description ??
      "Specializing in full-stack architecture, machine learning systems, and production web applications designed for scale and precision.",
    ctaLabel: initialData?.ctaLabel ?? "View Selected Works",
    ctaUrl: initialData?.ctaUrl ?? "/projects",
    supportingText: initialData?.supportingText ?? "Available for select engineering engagements",
    status: initialData?.status ?? "published",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update hero section");
      }

      showToast("Hero section updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update hero section", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hero Presentation Copy</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-zinc-400">Publication Status:</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as HeroDocument["status"] })}
              className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-white font-mono text-xs focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Eyebrow Text <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.eyebrow}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Hero Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Primary Headline <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Call To Action Label <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.ctaLabel}
              onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              CTA Destination URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Supporting Microcopy / Status
            </label>
            <input
              type="text"
              value={formData.supportingText}
              onChange={(e) => setFormData({ ...formData, supportingText: e.target.value })}
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
