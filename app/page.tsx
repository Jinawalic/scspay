"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    matricNumber: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      const response = await fetch("/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to sign you in right now");
      }

      router.replace(data.redirectTo ?? "/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign you in right now";
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-3 font-sans select-none antialiased">
      <Image
        src="/images/logo.png"
        alt="Cloudy blue sky background"
        fill
        className="object-contain object-center z-0"
      />

      <div className="absolute inset-0 bg-slate-900/70 z-10" />

      <div className="relative w-md h-120 max-w-md bg-white rounded-3xl border border-slate-200/60 overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-30">
        <div className="flex flex-col items-center pt-5 pb-3 select-none">
          <div className="flex items-center gap-2.5 px-2">
            <div className="flex flex-col gap-0.5 justify-center">
              <div className="flex items-center gap-1">
                <img src="/images/logo.png" alt="MyPay Logo" className="h-12 w-12 rounded-full object-contain" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-950 tracking-tight">
            Student Sign In
          </h2>
          <p className="text-[13px] font-semibold text-slate-500 max-w-sm text-center leading-relaxed">
            Login with Matric Number
          </p>
        </div>

        <form onSubmit={handleLogin} className="px-10 pb-10 space-y-2">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Matric Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                name="matricNumber"
                required
                disabled={isLoading}
                placeholder="FT24CMP0052"
                value={formData.matricNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                disabled={isLoading}
                placeholder="•••••••••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition disabled:opacity-60"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition disabled:opacity-40"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={isLoading}
              className="text-xs font-bold text-slate-500 hover:text-emerald-800 transition disabled:opacity-40"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 flex items-center justify-center gap-2 px-6 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition active:scale-95 tracking-wide mt-2 disabled:opacity-80 disabled:cursor-not-allowed disabled:active:scale-100 shadow-md shadow-emerald-800/10"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Login"
            )}
          </Button>

          <div className="relative select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dotted border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-white px-3 font-semibold text-slate-400 uppercase tracking-wider">
                Or sign in with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 pt-1">
            <button
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center h-10 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition group active:scale-95 disabled:opacity-40 disabled:active:scale-100"
            >
              <Image
                src="/images/google-icon.png"
                alt="Google"
                width={58}
                height={58}
              />
            </button>
          </div>

          {formError && (
            <p className="pt-1 text-center text-xs font-semibold text-rose-600">
              {formError}
            </p>
          )}

          <div className="text-center text-xs text-slate-500 font-semibold pt-2">
            Don't have an account?{" "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => router.push("/register")}
              className="text-emerald-800 font-bold hover:underline transition disabled:opacity-40"
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
