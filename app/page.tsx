import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile View: Styled exactly like the inspiration image */}
      <div className="md:hidden flex flex-col min-h-screen w-full bg-slate-950/90 text-white relative">
        {/* Top Section with Dark Background */}
        <div className="h-[40vh] w-full flex flex-col items-center justify-center relative overflow-hidden z-10">
          {/* Background Cover Image */}
          <Image
            src="/images/cover-bg.png"
            alt="Cover background"
            fill
            className="object-cover object-center pointer-events-none"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-950/45 z-0" />
        </div>

        {/* Bottom card containing the Login Form */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 py-8 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col justify-between text-[#1E2E42] relative z-20">
          <LoginForm layout="mobile" />
        </div>
      </div>

      {/* Desktop View: Keep original design */}
      <div className="hidden md:flex min-h-screen w-full items-center justify-center overflow-hidden">
        <div className="w-full">
          <div className="grid min-h-screen h-screen grid-cols-2 gap-10 items-center justify-center">
            {/* Left: Illustration & marketing */}
            <section className="flex w-full h-screen rounded-xl bg-white px-18 p-8 shadow-sm relative overflow-hidden items-center justify-center">
              <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center gap-4 text-center">
                <Image src="/images/login-bg.png" alt="Secure shield illustration" width={2000} height={2000} />
                <div className="space-y-4">
                  <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950">Secured Payment Portal for Science Communication.</h1>
                  <p className="text-sm leading-7 text-slate-500">Pay school fees, acceptance fees, hostel charges, and more with a clean, secure student payment experience.</p>
                </div>
              </div>
            </section>

            {/* Right: Login card */}
            <div className="mx-auto w-full max-w-xl">
              <section className="mx-auto w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 space-y-3 text-center sm:text-left">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">Welcome Back</h2>
                    <p className="mt-1 text-sm text-slate-500">Enter your credentials to sign in.</p>
                  </div>
                </div>
                <LoginForm layout="desktop" />
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
