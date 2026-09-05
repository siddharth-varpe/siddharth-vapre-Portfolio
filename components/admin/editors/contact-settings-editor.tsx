"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import type { ContactSettingsDocument } from "@/types";
import { Send, Save, Loader2 } from "lucide-react";

interface ContactSettingsEditorProps {
  initialData: ContactSettingsDocument | null;
}

export function ContactSettingsEditor({ initialData }: ContactSettingsEditorProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: initialData?.email ?? "siddharth@example.com",
    linkedinUrl: initialData?.linkedinUrl ?? "https://linkedin.com/in/siddharth-varpe",
    githubUrl: initialData?.githubUrl ?? "https://github.com/siddharth-varpe",
    location: initialData?.location ?? "Bengaluru, India",
    ctaDestination: initialData?.ctaDestination ?? "mailto:siddharth@example.com",
    availabilityNotice:
      initialData?.availabilityNotice ?? "Currently accepting inquiries for select engineering roles and advisory.",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/contact-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update contact settings");
      }

      showToast("Contact & social settings updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update contact settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800 text-sm font-semibold text-white">
          <Send className="w-4 h-4 text-blue-400" />
          <span>Contact Channels &amp; Social Links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Primary Inquiries Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              LinkedIn Profile URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              required
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              GitHub Profile URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              required
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Contact CTA Destination (URL or mailto) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.ctaDestination}
              onChange={(e) => setFormData({ ...formData, ctaDestination: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Availability Notice
            </label>
            <input
              type="text"
              value={formData.availabilityNotice}
              onChange={(e) => setFormData({ ...formData, availabilityNotice: e.target.value })}
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
