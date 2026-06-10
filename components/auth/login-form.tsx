"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Hash, Eye, EyeOff, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  matricNumber: z.string().min(3, "Enter your matric number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ layout = "desktop" }: { layout?: "desktop" | "mobile" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/dashboard");
  };

  if (layout === "mobile") {
    const matricValue = watch("matricNumber") ?? "";

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1E2E42] text-center mt-2">
            Login to Account
          </h2>

          {/* Matric Number Input Box */}
          <div className="space-y-1">
            <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
              <Hash className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
              <div className="flex-1 flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Matriculation Number
                </span>
                <input
                  type="text"
                  placeholder="FT23CMP0002"
                  {...register("matricNumber")}
                  className="w-full text-sm font-bold text-[#1E2E42] bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
                />
              </div>
              {matricValue && (
                <button
                  type="button"
                  onClick={() => setValue("matricNumber", "")}
                  className="text-slate-400 hover:text-slate-600 transition p-0.5 shrink-0"
                >
                  <XCircle className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
            {errors.matricNumber && (
              <p className="text-xs text-rose-600 font-semibold pl-2 mt-1">{errors.matricNumber.message}</p>
            )}
          </div>

          {/* Password Input Box */}
          <div className="space-y-1">
            <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
              <Lock className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
              <div className="flex-1 flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full text-sm font-bold text-[#1E2E42] bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition p-0.5 shrink-0 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 font-semibold pl-2 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#135A3D] focus:ring-[#135A3D]"
                {...register("remember")}
              />
              Remember me
            </label>
            <Link
              href="/register"
              className="text-[#135A3D] hover:text-[#0e4830] transition font-semibold"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 space-y-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#135A3D] py-4 text-center text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0e4830] transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? "Logging in..." : "Continue"}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/register"
              className="text-[#135A3D] hover:text-[#0e4830] transition font-extrabold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1 text-sm">
        <label className="font-medium text-slate-700">Matriculation Number</label>
        <div className="relative">
          <Input className="pl-11" placeholder="FT23CMP001" type="text" {...register("matricNumber")} />
          <Hash className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {errors.matricNumber && <p className="text-xs text-rose-600">{errors.matricNumber.message}</p>}
      </div>
      <div className="space-y-1 text-sm">
        <label className="font-medium text-slate-700">Password</label>
        <div className="relative">
          <Input className="pl-11" placeholder="********" type="password" {...register("password")} />
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#135A3D] focus:ring-[#135A3D]" {...register("remember")} />
          Remember me
        </label>
        <Link href="/register" className="font-medium text-[#135A3D] hover:text-[#0e4830]">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Login"}
      </Button>
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <span>New to SCSPAY?</span>
        <Link href="/register" className="font-semibold text-[#135A3D] hover:text-[#0e4830]">
          Create account
        </Link>
      </div>
    </form>
  );
}
