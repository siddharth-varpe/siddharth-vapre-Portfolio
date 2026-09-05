"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import {
  History,
  RotateCcw,
  Eye,
  FileCode2,
  Filter,
  User,
  Clock,
  X,
} from "lucide-react";

export interface SerializedRevision {
  _id?: string;
  contentId: string;
  contentType: string;
  action: "create" | "update" | "delete";
  actor: string;
  timestamp: string;
  diffSummary?: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
}

interface RevisionsManagerProps {
  initialRevisions: SerializedRevision[];
}

export function RevisionsManager({ initialRevisions }: RevisionsManagerProps) {
  const { showToast } = useToast();
  const [revisions] = useState<SerializedRevision[]>(initialRevisions);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [inspectTarget, setInspectTarget] = useState<SerializedRevision | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<SerializedRevision | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const filteredRevisions = revisions.filter((rev) => {
    if (typeFilter !== "all" && rev.contentType !== typeFilter) return false;
    return true;
  });

  const availableTypes = Array.from(new Set(revisions.map((r) => r.contentType))).sort();

  const handleRestore = async () => {
    if (!restoreTarget?._id) return;

    setIsRestoring(true);
    try {
      const res = await fetch("/api/admin/revisions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId: restoreTarget._id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to restore revision");

      showToast("Revision successfully restored to live state!");
      setRestoreTarget(null);
      // Wait briefly, then reload to display restored live state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Restoration failed", "error");
    } finally {
      setIsRestoring(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "update":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "delete":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-500">Filter By Domain:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Domains ({revisions.length})</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type} ({revisions.filter((r) => r.contentType === type).length})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Total Revisions Recorded: {revisions.length}
        </div>
      </div>

      {filteredRevisions.length === 0 ? (
        <EmptyState
          icon={History}
          title="No revisions found"
          description={
            revisions.length === 0
              ? "Content revisions will automatically appear here whenever portfolio sections are edited."
              : "No revisions match your domain filter."
          }
        />
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredRevisions.map((rev) => (
                  <tr key={rev._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-zinc-200">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {rev.contentType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getActionBadge(
                          rev.action
                        )}`}
                      >
                        {rev.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 max-w-xs truncate">
                      {rev.diffSummary || "Modified content record"}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{rev.actor}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono whitespace-nowrap">
                      {new Date(rev.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectTarget(rev)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
                          title="Inspect Snapshot"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRestoreTarget(rev)}
                          className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors flex items-center gap-1"
                          title="Restore to this state"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Restore</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Snapshot Modal */}
      {inspectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">
                  Revision Snapshot: {inspectTarget.contentType}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getActionBadge(
                    inspectTarget.action
                  )}`}
                >
                  {inspectTarget.action}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectTarget(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Meta */}
            <div className="px-6 py-3 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{new Date(inspectTarget.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span>Actor: {inspectTarget.actor}</span>
              </div>
              <div className="font-mono text-zinc-500">
                Content ID: {inspectTarget.contentId}
              </div>
            </div>

            {/* Modal Content / JSON Diffs */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs font-mono">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block mb-2">
                  Target Snapshot State (To Be Restored)
                </span>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 overflow-x-auto max-h-72">
                  {JSON.stringify(inspectTarget.previousState || inspectTarget.newState, null, 2)}
                </pre>
              </div>

              {inspectTarget.newState && inspectTarget.previousState && (
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block mb-2">
                    Subsequent State
                  </span>
                  <pre className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/60 text-zinc-400 overflow-x-auto max-h-48">
                    {JSON.stringify(inspectTarget.newState, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
              <button
                type="button"
                onClick={() => setInspectTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = inspectTarget;
                  setInspectTarget(null);
                  setRestoreTarget(target);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-black bg-amber-400 hover:bg-amber-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore This Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!restoreTarget}
        title="Restore Revision State"
        description={`Are you sure you want to restore domain "${restoreTarget?.contentType}" to this earlier revision snapshot? This will overwrite the current live database document.`}
        confirmLabel="Yes, Restore Revision"
        isDestructive={false}
        isLoading={isRestoring}
        onConfirm={handleRestore}
        onCancel={() => setRestoreTarget(null)}
      />
    </div>
  );
}
