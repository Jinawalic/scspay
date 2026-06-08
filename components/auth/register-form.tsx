"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const resolver = (step === 1 ? zodResolver(stepOneSchema) : zodResolver(stepTwoSchema)) as any;
  const {
    register,
    handleSubmit,
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
