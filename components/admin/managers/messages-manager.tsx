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
} from "lucide-react";

interface MessagesManagerProps {
  initialMessages: ContactMessageDocument[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessageDocument[]>(initialMessages);
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
          {messages.filter((m) => m.status === "unread").length}
        </p>
      </div>

      {filteredMessages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages found"
          description={
            statusFilter === "all"
              ? "Your inbox is currently empty. Direct client inquiries submitted through the contact pipeline will be safely stored here."
              : `No messages matching status "${statusFilter}".`
          }
        />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/60 overflow-hidden">
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

                <div className="min-w-0 space-y-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
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
              </div>
              <h2 className="text-lg font-bold text-white">
                {activeMessage.subject || "Direct Inquiry from Portfolio"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="font-semibold text-white">{activeMessage.name}</span>
                <span>&lt;{activeMessage.email}&gt;</span>
              </div>
            </div>

            {/* Plain text representation - strictly immune to XSS */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 font-sans whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {activeMessage.message}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                  activeMessage.subject || "Your Inquiry"
                )}`}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Reply via Email
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
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800 rounded-lg"
                >
                  {activeMessage.status === "read" ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(activeMessage);
                  }}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Contact Message"
        description={`Are you sure you want to delete the message from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Message"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
