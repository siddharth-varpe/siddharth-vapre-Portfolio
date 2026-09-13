import Link from "next/link";
import { requireAdminSession } from "@/lib/server/auth/session";
import { isUsingBootstrapPassword } from "@/lib/server/auth/bootstrap";
import { getAdminDashboardStats } from "@/lib/server/db";
import {
  FolderGit2,
  Wrench,
  Briefcase,
  Trophy,
  Award,
  TrendingUp,
  Mail,
  ArrowUpRight,
  Plus,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileEdit,
  History,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Admin CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const sessionContext = await requireAdminSession({ returnTo: "/admin" });
  if (!sessionContext) return null;

  const { user } = sessionContext;
  const isDefaultPassword = await isUsingBootstrapPassword(user.id);
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Bootstrap Password Warning */}
      {isDefaultPassword && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="flex-1 text-sm">
            <span className="font-semibold text-white">Security Alert: Default Credentials Active.</span>
            <p className="mt-0.5 text-zinc-300">
              Your system is currently running default bootstrap credentials. Please change your password immediately in Account &amp; Security.
            </p>
          </div>
          <Link
            href="/admin/security"
            className="px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0"
          >
            Change Password
          </Link>
        </div>
      )}

      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span>ADMINISTRATIVE OVERVIEW</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CLOUD FIRESTORE ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Content Management Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time status of portfolio content domains, publication pipeline, and audit logs.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Inbox ({stats.counts.messagesUnread})</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Card */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Case Studies</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white font-mono">{stats.counts.projectsTotal}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-emerald-400 font-medium">{stats.counts.projectsPublished} published</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{stats.counts.projectsDraft} draft</span>
              <span>•</span>
              <span className="text-zinc-500">{stats.counts.projectsArchived} archived</span>
            </div>
          </div>
          <Link
            href="/admin/projects"
            className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Manage case studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Skills & Experience Card */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Skills &amp; Exp</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white font-mono">
              {stats.counts.skills + stats.counts.experience}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
              <span>{stats.counts.skills} skills</span>
              <span>•</span>
              <span>{stats.counts.experience} career milestones</span>
            </div>
          </div>
          <Link
            href="/admin/skills"
            className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>Manage competencies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Achievements & Certifications */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Honors &amp; Badges</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white font-mono">
              {stats.counts.achievements + stats.counts.certifications}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
              <span>{stats.counts.achievements} awards</span>
              <span>•</span>
              <span>{stats.counts.certifications} verified certs</span>
            </div>
          </div>
          <Link
            href="/admin/achievements"
            className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Manage honors</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Contact Messages Card */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Inquiries</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white font-mono">{stats.counts.messagesTotal}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-emerald-400 font-semibold">{stats.counts.messagesUnread} unread</span>
              <span>•</span>
              <span>Firestore permanent store</span>
            </div>
          </div>
          <Link
            href="/admin/messages"
            className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Open inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Secondary Quick Jump Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Profile", href: "/admin/profile", icon: FileEdit, count: "Core" },
          { label: "Hero Section", href: "/admin/hero", icon: Plus, count: "Intro" },
          { label: "About Bio", href: "/admin/about", icon: FileEdit, count: "Bio" },
          { label: "Metrics", href: "/admin/metrics", icon: TrendingUp, count: stats.counts.metrics },
          { label: "SEO Metadata", href: "/admin/seo", icon: Award, count: "Meta" },
          { label: "Global Content", href: "/admin/site-content", icon: Briefcase, count: "Footer/CTA" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-zinc-500 group-hover:text-blue-400 transition-colors">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-mono text-zinc-500">{item.count}</span>
              </div>
              <div className="mt-3 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Audit Logs & Revisions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-white">Recent Activity Audit</h2>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {stats.recentActivity.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No activity recorded yet.</p>
            ) : (
              stats.recentActivity.map((act) => (
                <div
                  key={act._id?.toString()}
                  className="flex items-start justify-between gap-3 text-xs py-2 border-b border-zinc-800/40 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-mono text-zinc-200">{act.event}</span>
                      <span className="text-zinc-500 ml-1.5 font-mono text-[10px]">by {act.actor}</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 font-mono shrink-0 text-[10px]">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Content Revisions */}
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-white">Recent Content Revisions</h2>
            </div>
            <Link
              href="/admin/revisions"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {stats.recentRevisions.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No content revisions recorded yet.</p>
            ) : (
              stats.recentRevisions.map((rev) => (
                <div
                  key={rev._id?.toString()}
                  className="flex items-start justify-between gap-3 text-xs py-2 border-b border-zinc-800/40 last:border-0"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] uppercase">
                      {rev.contentType}
                    </span>
                    <span className="text-zinc-300 font-mono text-[11px] truncate">
                      action: {rev.action}
                    </span>
                  </div>
                  <span className="text-zinc-500 font-mono shrink-0 text-[10px]">
                    {new Date(rev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
