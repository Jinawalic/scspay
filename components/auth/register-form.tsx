"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Lock, Mail, User, FileText, Eye, EyeOff, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stepOneSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

const stepTwoSchema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  matricNumber: z.string().min(5, "Enter your matric number"),
});

type StepOneValues = z.infer<typeof stepOneSchema>;
type StepTwoValues = z.infer<typeof stepTwoSchema>;

type RegisterFormValues = StepOneValues & StepTwoValues;

export function RegisterForm({ layout = "desktop" }: { layout?: "desktop" | "mobile" }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resolver = (step === 1 ? zodResolver(stepOneSchema) : zodResolver(stepTwoSchema)) as any;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: "onTouched",
    resolver,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      matricNumber: "",
    },
  });

  const onSubmit = async (data: StepOneValues & StepTwoValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push("/dashboard");
  };

  if (layout === "mobile") {
    const emailValue = watch("email") ?? "";
    const fullNameValue = watch("fullName") ?? "";
    const matricNumberValue = watch("matricNumber") ?? "";

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-6">
          {/* Header & Step progress */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1E2E42] text-center mt-2">
              Create your account
            </h2>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
              <div className={`h-2 w-2 rounded-full ${step === 1 ? "bg-[#135A3D]" : "bg-slate-300"}`} />
              <span>Step {step} of 2</span>
              <div className="h-px flex-1 bg-slate-100" />
              <div className={`h-2 w-2 rounded-full ${step === 2 ? "bg-[#135A3D]" : "bg-slate-300"}`} />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4 text-left">
              {/* Email Address */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
                  <Mail className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </span>
                    <input
                      type="email"
                      placeholder="you@student.scspay.edu"
                      {...register("email")}
                      className="w-full text-sm font-bold text-[#1E2E42] bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
                    />
                  </div>
                  {emailValue && (
                    <button
                      type="button"
                      onClick={() => setValue("email", "")}
                      className="text-slate-400 hover:text-slate-600 transition p-0.5 shrink-0"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-600 font-semibold pl-2 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
                  <Lock className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Password
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
                  <Lock className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Confirm Password
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      {...register("confirmPassword")}
                      className="w-full text-sm font-bold text-[#1E2E42] bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition p-0.5 shrink-0 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-semibold pl-2 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {/* Full Name */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
                  <User className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Full Name
                    </span>
                    <input
                      type="text"
                      placeholder="Your full name"
                      {...register("fullName")}
                      className="w-full text-sm font-bold text-[#1E2E42] bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
                    />
                  </div>
                  {fullNameValue && (
                    <button
                      type="button"
                      onClick={() => setValue("fullName", "")}
                      className="text-slate-400 hover:text-slate-600 transition p-0.5 shrink-0"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-600 font-semibold pl-2 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Matric Number */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-2xl border border-slate-200/80 px-4 py-3 bg-[#F8FAFC] focus-within:border-[#135A3D] focus-within:ring-1 focus-within:ring-[#135A3D] transition-all">
                  <FileText className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Matric Number
                    </span>
                    <input
                      type="text"
                      placeholder="SCS/2023/079"
                      {...register("matricNumber")}
                      className="w-full text-sm font-bold text-[#1E2E42] bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
                    />
                  </div>
                  {matricNumberValue && (
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
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 space-y-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#135A3D] py-4 text-center text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0e4830] transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (step === 1 ? "Continuing..." : "Registering...") : (step === 1 ? "Continue" : "Complete Registration")}
          </Button>

          <div className="flex flex-col gap-3 items-center justify-center">
            {step === 2 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="px-0 text-xs font-bold text-slate-500 hover:text-[#135A3D] transition cursor-pointer"
              >
                Previous Step
              </Button>
            )}
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400">
              <span>Already have an account?</span>
              <Link
                href="/"
                className="text-[#135A3D] hover:text-[#0e4830] transition font-extrabold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <div className={step === 1 ? "h-2.5 w-2.5 rounded-full bg-emerald-600" : "h-2.5 w-2.5 rounded-full bg-slate-300"} />
        <span className="font-medium">Step 1</span>
        <div className="h-px flex-1 bg-slate-200" />
        <div className={step === 2 ? "h-2.5 w-2.5 rounded-full bg-emerald-600" : "h-2.5 w-2.5 rounded-full bg-slate-300"} />
        <span className="font-medium">Step 2</span>
      </div>
      {step === 1 ? (
        <>
          <div className="space-y-1 text-sm">
            <label className="font-medium text-slate-700">Email Address</label>
            <Input placeholder="you@student.scspay.edu" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-1 text-sm">
            <label className="font-medium text-slate-700">Password</label>
            <Input placeholder="Create a secure password" type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
          </div>
          <div className="space-y-1 text-sm">
            <label className="font-medium text-slate-700">Confirm Password</label>
            <Input placeholder="Repeat your password" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
            <Button type="submit" className="w-full">Continue</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/")}>Back to Login</Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1 text-sm">
            <label className="font-medium text-slate-700">Full Name</label>
            <Input placeholder="Your full name" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-rose-600">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1 text-sm">
            <label className="font-medium text-slate-700">Matric Number</label>
            <Input placeholder="SCS/2023/079" {...register("matricNumber")} />
            {errors.matricNumber && <p className="text-xs text-rose-600">{errors.matricNumber.message}</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="w-full">Complete Registration</Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
              Back to Login
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
