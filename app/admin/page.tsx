"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Admin login attempted with:", formData);

    // Simulated API call delay before routing to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/dashboard"); 
    }, 2000);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-3 font-sans select-none antialiased">
      {/* 1. Full-Screen Background Image (Cloudy Sky) */}
      <Image
        src="/images/logo.png"
        alt="Cloudy blue sky background"
        fill
        className="object-contain object-center z-0"
      />

      {/* Optional Overlay for readability/depth */}
      <div className="absolute inset-0 bg-slate-900/70 z-10" />

      {/* 3. Reusable Login Card Component (Integrated Shell) */}
      <div className="relative w-md h-120 max-w-md bg-white rounded-3xl border border-slate-200/60 overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-30">
        {/* Card Header and Intro */}
        <div className="flex flex-col items-center pt-5 pb-3 select-none">
          {/* Brand Logo Wrapper */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="flex flex-col gap-0.5 justify-center">
              <div className="flex items-center gap-1">
                <img src="/images/logo.png" alt="MyPay Logo" className="h-12 w-12 rounded-full object-contain" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-950 tracking-tight">
            Admin Sign In
          </h2>
          <p className="text-[13px] font-semibold text-slate-500 max-w-sm text-center leading-relaxed">
            Login with Email
          </p>
        </div>

        {/* --- Main Login Form --- */}
        <form onSubmit={handleLogin} className="px-10 pb-10 space-y-2">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                disabled={isLoading}
                placeholder="admin@ebolt.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
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

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={isLoading}
              className="text-xs font-bold text-slate-500 hover:text-emerald-800 transition disabled:opacity-40"
            >
              Forgot password?
            </button>
          </div>

          {/* The Main GREEN Branding Action Button with Spinner */}
          <button
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
              "Access Control Panel"
            )}
          </button>

          {/* Dotted Separator and Alternative Sign In */}
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

          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-1 pt-1">
            <button 
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center h-10 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition group active:scale-95 disabled:opacity-40"
            >
              <Image
                src="/images/google-icon.png"
                alt="Google"
                width={58}
                height={58}
              />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
