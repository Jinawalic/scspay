import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function HomePage() {
  return (
    <main className="min-h-screen h-screen bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
      <div className="w-full">
        <div className="grid min-h-screen h-screen grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center">
          {/* Left: Illustration & marketing (desktop-only) */}
          <section className="hidden md:flex w-full h-screen rounded-xl bg-white px-18 p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center gap-4 text-center">
              <Image src="/images/login-bg.png" alt="Secure shield illustration" width={2000} height={2000} />
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950">Secured Payment Portal for Science Communication.</h1>
                <p className="text-sm leading-7 text-slate-500">Pay school fees, acceptance fees, hostel charges, and more with a clean, secure student payment experience.</p>
              </div>
            </div>
          </section>

          {/* Right: Login card (always visible; on mobile it becomes the main view) */}
          <div className="mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-xl md:hidden">
              <Image src="/images/login-bg.png" alt="Login background" fill className="object-cover" />
              <div className="absolute inset-0 bg-slate-950/40" />
              <section className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
                <div className="mb-6 space-y-3 text-center sm:text-left">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">Welcome Back</h2>
                    <p className="mt-1 text-sm text-slate-500">Enter your credentials to sign in.</p>
                  </div>
                </div>
                <LoginForm />
              </section>
            </div>
            <section className="hidden md:block mx-auto w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 space-y-3 text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Welcome Back</h2>
                  <p className="mt-1 text-sm text-slate-500">Enter your credentials to sign in.</p>
                </div>
              </div>
              <LoginForm />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
