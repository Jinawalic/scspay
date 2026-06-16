"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ToastNotification } from "@/components/admin/ToastNotification";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Forgot Password Modal States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [showForgotNew, setShowForgotNew] = useState(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      const response = await fetch("/api/admin/login", {
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

      router.replace(data.redirectTo ?? "/admin/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign you in right now";
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to reset password");
      }

      triggerToast("Password reset successful! You can now log in.", "success");

      // Reset states and close modal
      setForgotEmail("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setIsForgotOpen(false);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setForgotLoading(false);
    }
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
                placeholder="admin@gmail.com"
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
              onClick={() => setIsForgotOpen(true)}
              className="text-xs font-bold text-slate-500 hover:text-emerald-800 transition disabled:opacity-40 cursor-pointer"
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

          {formError && (
            <p className="pt-1 text-center text-xs font-semibold text-rose-600">
              {formError}
            </p>
          )}
        </form>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/60 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-950 tracking-tight">
                Reset Admin Password
              </h3>
              <button
                type="button"
                onClick={() => {
                  setForgotError("");
                  setIsForgotOpen(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-650 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showForgotNew ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNew(!showForgotNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showForgotNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showForgotConfirm ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirm(!showForgotConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showForgotConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {forgotError && (
                <p className="text-center text-xs font-semibold text-rose-600">
                  {forgotError}
                </p>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full h-10 flex items-center justify-center gap-2 px-6 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition active:scale-95 tracking-wide mt-2 disabled:opacity-85 disabled:cursor-not-allowed"
              >
                {forgotLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastNotification
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}
