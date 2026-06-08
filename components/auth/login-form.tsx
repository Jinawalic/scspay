"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1 text-sm">
        <label className="font-medium text-slate-700">Email Address</label>
        <div className="relative">
          <Input placeholder="you@student.scspay.edu" type="email" {...register("email")} />
          <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-1 text-sm">
        <label className="font-medium text-slate-700">Password</label>
        <div className="relative">
          <Input placeholder="••••••••" type="password" {...register("password")} />
          <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" {...register("remember")} />
          Remember me
        </label>
        <Link href="/register" className="font-medium text-emerald-700 hover:text-emerald-800">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Login"}
      </Button>
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <span>New to SCSPAY?</span>
        <Link href="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Create account
        </Link>
      </div>
    </form>
  );
}
