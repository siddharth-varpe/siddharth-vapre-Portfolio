"use client";

import React, { useState } from "react";
import { useToast } from "../toast";
import { ConfirmDialog } from "../confirm-dialog";
import { EmptyState } from "../empty-state";
import type { ContactMessageDocument } from "@/types";
import {
  Mail,
  MailOpen,
  Archive,
  Trash2,
  CheckCircle2,
  X,
  ShieldCheck,
  Send,
} from "lucide-react";

interface MessagesManagerProps {
  initialMessages: ContactMessageDocument[] | { items: ContactMessageDocument[] };
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const { showToast } = useToast();
  const rawList = Array.isArray(initialMessages)
    ? initialMessages
    : (initialMessages as { items?: ContactMessageDocument[] })?.items || [];

  const [messages, setMessages] = useState<ContactMessageDocument[]>(rawList);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeMessage, setActiveMessage] = useState<ContactMessageDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = async (
    msg: ContactMessageDocument,
    action: "mark-read" | "mark-unread" | "archive"
  ) => {
    if (!msg._id) return;

    try {
      const res = await fetch(`/api/admin/messages/${msg._id.toString()}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action failed");

      setMessages((prev) =>
        prev.map((m) => (m._id?.toString() === msg._id?.toString() ? json.data : m))
      );

      if (activeMessage?._id?.toString() === msg._id?.toString()) {
        setActiveMessage(json.data);
      }

      showToast(`Message marked as ${action.replace("mark-", "")}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Action failed", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget._id.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Delete failed");
      }

      setMessages((prev) => prev.filter((m) => m._id?.toString() !== deleteTarget._id?.toString()));
      if (activeMessage?._id?.toString() === deleteTarget._id?.toString()) {
        setActiveMessage(null);
      }
      showToast("Message permanently deleted");
      setDeleteTarget(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (statusFilter === "all") return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs & Summary Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {["all", "unread", "read", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-400">
          Total: {messages.length} messages | Unread:{" "}
          <span className="text-blue-400 font-semibold">
            {messages.filter((m) => m.status === "unread").length}
          </span>
        </p>
      </div>

      {filteredMessages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages found"
          description={
            statusFilter === "all"
              ? "Your inbox is currently empty. Inquiries submitted via the public contact pipeline will be durably stored in the database and listed here."
              : `No messages matching status "${statusFilter}".`
          }
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/60 overflow-hidden shadow-xl">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id?.toString()}
              onClick={() => {
                setActiveMessage(msg);
                if (msg.status === "unread") {
                  handleAction(msg, "mark-read");
                }
              }}
              className={`p-4 sm:p-5 cursor-pointer transition-colors flex items-start justify-between gap-4 hover:bg-zinc-900/80 ${
                msg.status === "unread" ? "bg-blue-950/20" : ""
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`p-2 rounded-full shrink-0 ${
                    msg.status === "unread"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {msg.status === "unread" ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                </div>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        msg.status === "unread" ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono truncate">&lt;{msg.email}&gt;</span>
                  </div>

                  <div className="text-xs text-zinc-200 font-medium truncate">
                    {msg.subject || "Inquiry from Portfolio"}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  {/* Metadata telemetry badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Email delivery status badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        msg.emailDeliveryStatus === "sent"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : msg.emailDeliveryStatus === "failed"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : msg.emailDeliveryStatus === "skipped"
                          ? "bg-zinc-800 border-zinc-700 text-zinc-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                      title={
                        msg.emailDeliveryStatus === "sent"
                          ? `Resend notification dispatched (ID: ${msg.emailMessageId || "N/A"})`
                          : msg.emailDeliveryStatus === "failed"
                          ? "Email notification failed; message safely preserved in database"
                          : msg.emailDeliveryStatus === "skipped"
                          ? "Resend unconfigured; message safely preserved in database"
                          : "Email notification pending"
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>Email: {msg.emailDeliveryStatus || "pending"}</span>
                    </span>

                    {msg.turnstileVerified && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Anti-Bot Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[10px] font-mono text-zinc-500">
                  {new Date(msg.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      handleAction(msg, msg.status === "read" ? "mark-unread" : "mark-read")
                    }
                    className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                    title={msg.status === "read" ? "Mark unread" : "Mark read"}
                  >
                    {msg.status === "read" ? <Mail className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleAction(msg, "archive")}
                    className="p-1.5 text-zinc-500 hover:text-amber-400 rounded hover:bg-zinc-800 transition-colors"
                    title="Archive message"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal - Safely Renders Plain Text Only (Zero HTML Execution) */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl space-y-5">
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span>INQUIRY MESSAGE</span>
                <span>•</span>
                <span>{new Date(activeMessage.createdAt).toLocaleString()}</span>
                <span>•</span>
                <span className="text-zinc-400 uppercase">{activeMessage.status}</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {activeMessage.subject || "Direct Inquiry from Portfolio"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="font-semibold text-white">{activeMessage.name}</span>
                <span>&lt;{activeMessage.email}&gt;</span>
              </div>
            </div>

            {/* Delivery & Security Telemetry Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">EMAIL DELIVERY</span>
                <span
                  className={`font-semibold capitalize ${
                    activeMessage.emailDeliveryStatus === "sent"
                      ? "text-emerald-400"
                      : activeMessage.emailDeliveryStatus === "failed"
                      ? "text-rose-400"
                      : "text-zinc-400"
                  }`}
                >
                  {activeMessage.emailDeliveryStatus || "pending"}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">SECURITY STATUS</span>
                <span className="text-blue-400 font-semibold">
                  {activeMessage.turnstileVerified ? "Turnstile Passed" : "Unverified"}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">DATABASE</span>
                <span className="text-emerald-400 font-semibold">Firestore Stored</span>
              </div>
              {activeMessage.emailMessageId && (
                <div className="col-span-2 sm:col-span-3 pt-1 border-t border-zinc-800/80">
                  <span className="text-zinc-500 block text-[10px]">RESEND MESSAGE ID:</span>
                  <span className="text-zinc-300 truncate block text-[11px]">
                    {activeMessage.emailMessageId}
                  </span>
                </div>
              )}
            </div>

            {/* Plain text representation - strictly immune to XSS */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {activeMessage.message}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800 text-xs">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                  activeMessage.subject || "Your Portfolio Inquiry"
                )}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleAction(
                      activeMessage,
                      activeMessage.status === "read" ? "mark-unread" : "mark-read"
                    );
                    setActiveMessage(null);
                  }}
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800 rounded-lg transition-colors"
                >
                  {activeMessage.status === "read" ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => {
                    handleAction(activeMessage, "archive");
                    setActiveMessage(null);
                  }}
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-amber-400 bg-zinc-800 rounded-lg transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(activeMessage);
                  }}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Contact Message"
        description={`Are you sure you want to permanently delete the message from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Message"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
