"use client";

import React, { useState } from "react";
import { EmptyState } from "../empty-state";
import {
  Activity,
  Filter,
  Shield,
  FileText,
  Image as ImageIcon,
  Lock,
  Server,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  X,
} from "lucide-react";

export interface SerializedActivityLog {
  _id?: string;
  event: string;
  category: "auth" | "content" | "media" | "security" | "system";
  status: "success" | "failure" | "warning";
  actor: string;
  ipAddressMasked?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

interface ActivityManagerProps {
  initialLogs: SerializedActivityLog[];
}

export function ActivityManager({ initialLogs }: ActivityManagerProps) {
  const [logs] = useState<SerializedActivityLog[]>(initialLogs);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [inspectTarget, setInspectTarget] = useState<SerializedActivityLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "auth":
        return <Lock className="w-3.5 h-3.5 text-blue-400" />;
      case "content":
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      case "media":
        return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
      case "security":
        return <Shield className="w-3.5 h-3.5 text-red-400" />;
      case "system":
        return <Server className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            success
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            warning
          </span>
        );
      case "failure":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            failure
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-500">
            Filter By Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Categories ({logs.length})</option>
            <option value="content">Content</option>
            <option value="auth">Auth</option>
            <option value="security">Security</option>
            <option value="media">Media</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Showing {filteredLogs.length} of {logs.length} audit logs
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity recorded"
          description={
            logs.length === 0
              ? "Administrative mutations and security events will automatically be audited and listed here."
              : "No activity logs match the selected category."
          }
        />
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                      {log.event}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                        {getCategoryIcon(log.category)}
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                    <td className="py-3 px-4 text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="truncate max-w-[140px]">{log.actor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setInspectTarget(log)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors inline-flex items-center gap-1 text-[11px]"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Inspection Modal */}
      {inspectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                {getCategoryIcon(inspectTarget.category)}
                <h3 className="text-base font-semibold text-white truncate max-w-md">
                  {inspectTarget.event}
                </h3>
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
            <div className="px-6 py-3 bg-zinc-950/60 border-b border-zinc-800/80 grid grid-cols-2 gap-4 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{new Date(inspectTarget.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span>Actor: {inspectTarget.actor}</span>
              </div>
              {inspectTarget.ipAddressMasked && (
                <div>IP: {inspectTarget.ipAddressMasked}</div>
              )}
              {inspectTarget.userAgent && (
                <div className="truncate col-span-2 text-zinc-500 text-[10px]">
                  UA: {inspectTarget.userAgent}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs font-mono">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Audit Event Payload
              </span>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 overflow-x-auto max-h-80">
                {JSON.stringify(inspectTarget.details, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
              <button
                type="button"
                onClick={() => setInspectTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
