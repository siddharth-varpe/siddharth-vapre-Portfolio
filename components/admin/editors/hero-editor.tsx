"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "../toast";
import type { HeroDocument, HeroImageOverlay } from "@/types";
import { Sparkles, Save, Loader2, Layers, Eye } from "lucide-react";

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
    imageOverlay: initialData?.imageOverlay ?? {
      enabled: false,
      text: "",
      textAlign: "center",
      horizontalPosition: "center",
      verticalPosition: "bottom",
      style: "badge",
      textColor: "light",
    },
    status: initialData?.status ?? "published",
  });
  const [isSaving, setIsSaving] = useState(false);

  const overlay = formData.imageOverlay;

  const updateOverlay = (patch: Partial<HeroImageOverlay>) => {
    setFormData((prev) => ({
      ...prev,
      imageOverlay: {
        ...prev.imageOverlay,
        ...patch,
      },
    }));
  };

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

      showToast("Hero section and image overlay updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update hero section", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper classes for live preview
  const getPreviewPositionClasses = () => {
    const vPos = overlay.verticalPosition;
    const hPos = overlay.horizontalPosition;

    let vClass = "bottom-4";
    if (vPos === "top") vClass = "top-4";
    else if (vPos === "center") vClass = "top-1/2 -translate-y-1/2";

    let hClass = "left-1/2 -translate-x-1/2";
    if (hPos === "left") hClass = "left-4";
    else if (hPos === "right") hClass = "right-4";

    return `${vClass} ${hClass}`;
  };

  const getPreviewStyleClasses = () => {
    const style = overlay.style;
    const color = overlay.textColor || "light";

    let colorClass = "text-white";
    if (color === "dark") colorClass = "text-zinc-950";
    else if (color === "accent") colorClass = "text-blue-400";

    if (style === "plain") {
      return `text-xs sm:text-sm font-semibold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${colorClass}`;
    }
    if (style === "technical") {
      return `inline-block font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-zinc-950/85 border border-zinc-700/80 shadow ${colorClass}`;
    }
    // "badge" (default)
    return `inline-block px-3 py-1 text-xs font-medium rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-700/80 shadow-md ${colorClass}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* 1. HERO COPY CARD */}
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

      {/* ========================================================================= */}
      {/* 2. DEDICATED ADMIN FORM: HERO IMAGE OVERLAY                                */}
      {/* Visually separated, dedicated card with live interactive preview          */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
        {/* Header with Title & Enable/Disable Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-white">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Hero Image Overlay</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Configure the text displayed directly over the hero image.
            </p>
          </div>

          {/* Control A: Enable Overlay Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-300">
              Overlay: <strong className={overlay.enabled ? "text-emerald-400" : "text-zinc-500"}>{overlay.enabled ? "ON" : "OFF"}</strong>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={overlay.enabled}
              onClick={() => updateOverlay({ enabled: !overlay.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                overlay.enabled ? "bg-blue-600" : "bg-zinc-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  overlay.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Control B: Overlay Text */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Overlay Text
              </label>
              <textarea
                id="overlay-text-input"
                data-testid="hero-overlay-text"
                rows={2}
                value={overlay.text}
                onChange={(e) => updateOverlay({ text: e.target.value })}
                placeholder="e.g. Building systems that solve real problems."
                maxLength={300}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1">
                <span>Plain text only · Escaped safely</span>
                <span>{overlay.text.length} / 300</span>
              </div>
            </div>

            {/* Grid of Placement & Style Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Control C: Text Alignment */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Text Alignment
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => updateOverlay({ textAlign: align })}
                      className={`py-1.5 text-xs font-mono capitalize rounded transition-colors ${
                        overlay.textAlign === align
                          ? "bg-zinc-800 text-white font-medium shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control D: Horizontal Position */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Horizontal Position
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(["left", "center", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => updateOverlay({ horizontalPosition: pos })}
                      className={`py-1.5 text-xs font-mono capitalize rounded transition-colors ${
                        overlay.horizontalPosition === pos
                          ? "bg-zinc-800 text-white font-medium shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control E: Vertical Position */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Vertical Position
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(["top", "center", "bottom"] as const).map((vPos) => (
                    <button
                      key={vPos}
                      type="button"
                      onClick={() => updateOverlay({ verticalPosition: vPos })}
                      className={`py-1.5 text-xs font-mono capitalize rounded transition-colors ${
                        overlay.verticalPosition === vPos
                          ? "bg-zinc-800 text-white font-medium shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {vPos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control F: Overlay Style */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Overlay Style
                </label>
                <select
                  value={overlay.style}
                  onChange={(e) => updateOverlay({ style: e.target.value as HeroImageOverlay["style"] })}
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="badge">Subtle Badge</option>
                  <option value="plain">Plain Text</option>
                  <option value="technical">Technical Label</option>
                </select>
              </div>

              {/* Control G: Safe Theme Text Color */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Text Color
                </label>
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(["light", "dark", "accent"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateOverlay({ textColor: color })}
                      className={`py-1.5 text-xs font-mono capitalize rounded transition-colors ${
                        (overlay.textColor || "light") === color
                          ? "bg-zinc-800 text-white font-medium shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {color === "light" ? "Light (White)" : color === "dark" ? "Dark (Deep)" : "Accent (Brand)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Live Image Overlay Preview</span>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner flex items-center justify-center">
              {/* The actual approved hero image */}
              <Image
                src="/images/siddharth-hero.png"
                alt="Approved hero portrait"
                fill
                className="object-cover object-[62%_22%]"
                sizes="400px"
              />

              {/* Soft ambient depth preview overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

              {/* Live Overlay Layer */}
              {overlay.enabled ? (
                overlay.text ? (
                  <div
                    className={`absolute z-10 max-w-[85%] pointer-events-none transition-all duration-200 ${getPreviewPositionClasses()} text-${overlay.textAlign}`}
                  >
                    <span className={getPreviewStyleClasses()}>
                      {overlay.text}
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-x-4 bottom-4 z-10 text-center">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-mono text-zinc-400 bg-black/60 rounded border border-zinc-800 backdrop-blur-sm">
                      Enter overlay text to preview
                    </span>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                  <span className="px-3 py-1.5 text-xs font-mono text-zinc-400 bg-zinc-900/90 rounded-md border border-zinc-800">
                    Overlay Disabled
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 mt-2 font-mono text-center">
              Uses approved hero asset · Updates live as controls change
            </p>
          </div>
        </div>
      </div>

      {/* Global Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
