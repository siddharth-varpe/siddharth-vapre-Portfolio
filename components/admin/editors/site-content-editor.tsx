"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { SiteContentDocument } from "@/types";
import { Globe, Save, Loader2 } from "lucide-react";

interface SiteContentEditorProps {
  initialData: SiteContentDocument | null;
}

export function SiteContentEditor({ initialData }: SiteContentEditorProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    footerText:
      initialData?.footerText ??
      "Designed and engineered with strict attention to performance, modern design, and robust security.",
    copyright: initialData?.copyright ?? "© 2026 Siddharth Varpe. All rights reserved.",
    ctaHeadline: initialData?.globalCta?.headline ?? "Have a complex engineering challenge?",
    ctaSubheadline:
      initialData?.globalCta?.subheadline ??
      "Let's discuss architecture, systems engineering, or potential collaboration.",
    ctaButtonLabel: initialData?.globalCta?.buttonLabel ?? "Start a Conversation",
    ctaButtonDestination: initialData?.globalCta?.buttonDestination ?? "/contact",
    loadingMessage: initialData?.loadingMessage ?? "Initializing application...",
    emptyStateMessage: initialData?.emptyStateMessage ?? "No records found.",
    notFoundMessage: initialData?.notFoundMessage ?? "The requested resource could not be found.",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        footerText: formData.footerText,
        copyright: formData.copyright,
        globalCta: {
          headline: formData.ctaHeadline,
          subheadline: formData.ctaSubheadline,
          buttonLabel: formData.ctaButtonLabel,
          buttonDestination: formData.ctaButtonDestination,
        },
        loadingMessage: formData.loadingMessage || undefined,
        emptyStateMessage: formData.emptyStateMessage || undefined,
        notFoundMessage: formData.notFoundMessage || undefined,
      };

      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update site content");
      }

      showToast("Global site content updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update site content", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800 text-sm font-semibold text-white">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Footer &amp; Global Call-to-Action</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Footer Description Copy <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Copyright Notice <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.copyright}
              onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Global Bottom CTA Banner
            </h3>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                CTA Headline <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.ctaHeadline}
                onChange={(e) => setFormData({ ...formData, ctaHeadline: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                CTA Subheadline <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.ctaSubheadline}
                onChange={(e) => setFormData({ ...formData, ctaSubheadline: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  CTA Button Label <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonLabel}
                  onChange={(e) => setFormData({ ...formData, ctaButtonLabel: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  CTA Button Destination URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonDestination}
                  onChange={(e) => setFormData({ ...formData, ctaButtonDestination: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Global Microcopy &amp; Error Messages
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Loading State Copy
                </label>
                <input
                  type="text"
                  value={formData.loadingMessage}
                  onChange={(e) => setFormData({ ...formData, loadingMessage: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Empty State Copy
                </label>
                <input
                  type="text"
                  value={formData.emptyStateMessage}
                  onChange={(e) => setFormData({ ...formData, emptyStateMessage: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  404 Not Found Copy
                </label>
                <input
                  type="text"
                  value={formData.notFoundMessage}
                  onChange={(e) => setFormData({ ...formData, notFoundMessage: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
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
