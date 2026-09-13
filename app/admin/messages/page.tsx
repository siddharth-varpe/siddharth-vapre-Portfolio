import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminContactMessages } from "@/lib/server/db";
import { MessagesManager } from "@/components/admin/managers/messages-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages Inbox | Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminMessagesPage() {
  const session = await requireAdminSession({ returnTo: "/admin/messages" });
  if (!session) return null;

  const messages = await getAdminContactMessages();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Contact Messages</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review incoming inquiries, manage read status, archive interactions, and inspect verification metadata.
        </p>
      </div>

      <MessagesManager initialMessages={JSON.parse(JSON.stringify(messages.items || []))} />
    </div>
  );
}
