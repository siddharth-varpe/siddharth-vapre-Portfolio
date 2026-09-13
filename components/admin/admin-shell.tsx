"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Sparkles,
  BookOpen,
  FolderGit2,
  Wrench,
  Briefcase,
  Trophy,
  Award,
  TrendingUp,
  Send,
  Mail,
  Search,
  FileText,
  Image as ImageIcon,
  Globe,
  History,
  ShieldAlert,
  Lock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Terminal,
} from "lucide-react";
import { authClient } from "@/lib/client/auth";
import { ToastProvider } from "./toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Core Content",
    items: [
      { label: "Profile", href: "/admin/profile", icon: User },
      { label: "Hero Section", href: "/admin/hero", icon: Sparkles },
      { label: "About Section", href: "/admin/about", icon: BookOpen },
      { label: "Site Content", href: "/admin/site-content", icon: Globe },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
      { label: "Skills", href: "/admin/skills", icon: Wrench },
      { label: "Experience", href: "/admin/experience", icon: Briefcase },
      { label: "Achievements", href: "/admin/achievements", icon: Trophy },
      { label: "Certifications", href: "/admin/certifications", icon: Award },
      { label: "Metrics", href: "/admin/metrics", icon: TrendingUp },
    ],
  },
  {
    title: "Inquiries & SEO",
    items: [
      { label: "Contact Settings", href: "/admin/contact-settings", icon: Send },
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "SEO Metadata", href: "/admin/seo", icon: Search },
    ],
  },
  {
    title: "Assets & Files",
    items: [
      { label: "Resume Metadata", href: "/admin/resume", icon: FileText },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "System & Security",
    items: [
      { label: "Revisions", href: "/admin/revisions", icon: History },
      { label: "Activity Log", href: "/admin/activity", icon: ShieldAlert },
      { label: "Security & Access", href: "/admin/security", icon: Lock },
    ],
  },
];

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AdminShell({ children, userEmail = "admin" }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoggingOut(false);
    }
  };

  const currentNav = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
        {/* Mobile menu backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 border-r border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white hover:opacity-90 transition-opacity"
            >
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Siddharth Varpe</span>
                <span className="text-[10px] font-mono text-zinc-500 tracking-normal">Admin CMS Core</span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white p-1 rounded-md"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-xs"
                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                SV
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-zinc-200 truncate">Administrator</div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">{userEmail}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-zinc-600">admin</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-200 font-medium">{currentNav?.label ?? "Overview"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors shadow-xs"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </header>

          {/* Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
