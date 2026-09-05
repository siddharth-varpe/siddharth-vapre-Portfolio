import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server/auth/session";
import { ensureBootstrapAdmin } from "@/lib/server/auth/bootstrap";
import { getSafeRedirectUrl } from "@/lib/server/auth/redirects";
import { LoginForm } from "@/components/admin/login-form";
import { Shield, KeyRound } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Login | Siddharth Varpe Portfolio",
  description: "Secure administrative gateway for Siddharth Varpe personal portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{
    returnTo?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  // Ensure the bootstrap account exists before presenting the login interface
  await ensureBootstrapAdmin();

  // If already authenticated, redirect safely to admin dashboard or requested returnTo
  const session = await getServerSession();
  const params = await searchParams;
  const safeReturnTo = getSafeRedirectUrl(params?.returnTo, "/admin");

  if (session) {
    redirect(safeReturnTo);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Badge */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] shadow-inner">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl font-sans">
            Administrative Access
          </h1>
          <p className="mt-1.5 text-xs text-neutral-400 font-mono">
            Siddharth Varpe · Control Center
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/60">
          <LoginForm returnTo={safeReturnTo} />
        </div>

        {/* Security Disclaimers */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-500 font-mono">
          <Shield className="h-3.5 w-3.5 text-neutral-500" />
          <span>Restricted system. All authentication attempts are logged.</span>
        </div>
      </div>
    </main>
  );
}
