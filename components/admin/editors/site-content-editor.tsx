"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { Globe, Save, Loader2, LayoutTemplate } from "lucide-react";
import { DEFAULT_FOOTER_SECTION } from "@/lib/server/db/default-footer-section";
import type { SiteContentDocument, FooterSectionConfig } from "@/types/models";

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
    footerSection: (initialData?.footerSection ?? DEFAULT_FOOTER_SECTION) as FooterSectionConfig,
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
        footerSection: formData.footerSection,
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

      {/* Footer Settings Card */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800 text-sm font-semibold text-white">
          <LayoutTemplate className="w-4 h-4 text-blue-400" />
          <span>Footer Settings (Dynamic Reconstruction)</span>
        </div>

        {/* Identity Block */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Identity &amp; Brand Copy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Brand Name</label>
              <input
                type="text"
                value={formData.footerSection.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: { ...formData.footerSection, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Professional Title</label>
              <input
                type="text"
                value={formData.footerSection.professionalTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: { ...formData.footerSection, professionalTitle: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">Footer Description</label>
            <textarea
              rows={3}
              value={formData.footerSection.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footerSection: { ...formData.footerSection, description: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Summary Metrics
          </h3>
          <p className="text-xs text-zinc-500">
            Leave value overrides blank to derive counts dynamically from published database records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Projects Metric */}
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.footerSection.metrics.showProjects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footerSection: {
                        ...formData.footerSection,
                        metrics: { ...formData.footerSection.metrics, showProjects: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                />
                <span>Show Projects Metric</span>
              </label>
              <input
                type="text"
                placeholder="Label (e.g. Projects)"
                value={formData.footerSection.metrics.projectsLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      metrics: { ...formData.footerSection.metrics, projectsLabel: e.target.value },
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Override (blank = dynamic count)"
                value={formData.footerSection.metrics.projectsValue || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      metrics: {
                        ...formData.footerSection.metrics,
                        projectsValue: e.target.value || undefined,
                      },
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-white"
              />
            </div>

            {/* Awards Metric */}
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.footerSection.metrics.showAwards}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footerSection: {
                        ...formData.footerSection,
                        metrics: { ...formData.footerSection.metrics, showAwards: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                />
                <span>Show Awards Metric</span>
              </label>
              <input
                type="text"
                placeholder="Label (e.g. Awards)"
                value={formData.footerSection.metrics.awardsLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      metrics: { ...formData.footerSection.metrics, awardsLabel: e.target.value },
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Override (blank = dynamic count)"
                value={formData.footerSection.metrics.awardsValue || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      metrics: {
                        ...formData.footerSection.metrics,
                        awardsValue: e.target.value || undefined,
                      },
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-white"
              />
            </div>

            {/* Opportunities Metric */}
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.footerSection.metrics.showOpportunities}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footerSection: {
                        ...formData.footerSection,
                        metrics: { ...formData.footerSection.metrics, showOpportunities: e.target.checked },
                      },
                    })
                  }
                  className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                />
                <span>Show Opportunities Metric</span>
              </label>
              <input
                type="text"
                placeholder="Label (e.g. Open to)"
                value={formData.footerSection.metrics.opportunitiesLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      metrics: { ...formData.footerSection.metrics, opportunitiesLabel: e.target.value },
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Value (e.g. Opportunities)"
                value={formData.footerSection.metrics.opportunitiesValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      metrics: { ...formData.footerSection.metrics, opportunitiesValue: e.target.value },
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Connect & Social Settings */}
        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Connect Area &amp; Social Links
            </h3>
            <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.footerSection.connect.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      connect: { ...formData.footerSection.connect, enabled: e.target.checked },
                    },
                  })
                }
                className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Prompt Headline</label>
              <input
                type="text"
                value={formData.footerSection.connect.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      connect: { ...formData.footerSection.connect, title: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Prompt Description</label>
              <input
                type="text"
                value={formData.footerSection.connect.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      connect: { ...formData.footerSection.connect, description: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.footerSection.connect.githubUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      connect: { ...formData.footerSection.connect, githubUrl: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.footerSection.connect.linkedinUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      connect: { ...formData.footerSection.connect, linkedinUrl: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.footerSection.connect.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      connect: { ...formData.footerSection.connect, email: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Decorative Artwork Controls */}
        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Decorative Artwork Controls
            </h3>
            <label className="flex items-center gap-2 text-xs font-medium text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.footerSection.artwork.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      artwork: { ...formData.footerSection.artwork, enabled: e.target.checked },
                    },
                  })
                }
                className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
              />
              <span>Artwork Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Desktop Visibility</label>
              <select
                value={formData.footerSection.artwork.desktopVisibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      artwork: {
                        ...formData.footerSection.artwork,
                        desktopVisibility: e.target.value as "show" | "hide",
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
              >
                <option value="show">Show on Desktop</option>
                <option value="hide">Hide on Desktop</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Mobile Visibility</label>
              <select
                value={formData.footerSection.artwork.mobileVisibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      artwork: {
                        ...formData.footerSection.artwork,
                        mobileVisibility: e.target.value as "show" | "hide",
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
              >
                <option value="show">Show on Mobile</option>
                <option value="hide">Hide on Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Opacity Preset</label>
              <select
                value={formData.footerSection.artwork.opacityPreset}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      artwork: {
                        ...formData.footerSection.artwork,
                        opacityPreset: e.target.value as "full" | "medium" | "subtle",
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
              >
                <option value="full">Full Contrast</option>
                <option value="medium">Medium</option>
                <option value="subtle">Subtle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Bar Controls */}
        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Dark Bottom Bar &amp; Tagline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Footer Tagline</label>
              <input
                type="text"
                value={formData.footerSection.bottomBar.tagline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      bottomBar: { ...formData.footerSection.bottomBar, tagline: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Admin Link Text</label>
              <input
                type="text"
                value={formData.footerSection.bottomBar.adminLinkText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footerSection: {
                      ...formData.footerSection,
                      bottomBar: { ...formData.footerSection.bottomBar, adminLinkText: e.target.value },
                    },
                  })
                }
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
