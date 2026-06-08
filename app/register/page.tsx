import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-[2rem] bg-white/95 p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.25)] sm:p-12">
          <div className="flex flex-col gap-4 text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Register</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Create your SCSPAY account</h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">Complete the registration workflow to start managing your student payments and receipts.</p>
            </div>
            <Link href="/" className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Back to Login
            </Link>
          </div>
        </div>
        <div className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
