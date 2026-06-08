import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-white/90 p-10 shadow-[0_35px_120px_-40px_rgba(15,23,42,0.25)] sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_35%)]" />
          <div className="relative flex flex-col gap-6">
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-emerald-50/80 px-4 py-2 text-sm text-emerald-700 shadow-sm">
              <span className="font-semibold">SCSPAY</span>
              <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">Secure Student Payment Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/images/logo.svg" alt="SCSPAY logo" width={140} height={42} priority />
            </div>
            <div className="max-w-xl space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Secure payments for students made simple.</h1>
              <p className="text-lg leading-8 text-slate-600">Access tuition, hostel, acceptance and departmental payments with a clean financial dashboard built for student life.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Trusted</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Modern fintech UI</p>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Ready</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Future-ready payments</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center sm:justify-start">
              <Image src="/images/secure-illustration.svg" alt="Secure payment illustration" width={380} height={260} className="rounded-[2rem]" />
            </div>
          </div>
        </section>
        <section className="rounded-[2.5rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.25)] sm:p-10">
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <span>Welcome back</span>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-slate-950">Login to your SCSPAY account</h2>
              <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue with secure student payments.</p>
            </div>
          </div>
          <LoginForm />
          <div className="mt-8 rounded-[2rem] bg-slate-50 p-4 text-sm text-slate-500">
            <p className="font-medium text-slate-700">No landing page needed.</p>
            <p className="mt-2">Jump straight into payments, receipts, and profile tools with SCSPAY.</p>
          </div>
          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Create account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
