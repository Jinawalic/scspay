"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: "default" | "white" | "emerald";
}

export function Button({ 
  children, 
  icon: Icon, 
  variant = "white", 
  className = "", 
  ...props 
}: ButtonProps) {
  
  const variants = {
    default: "text-white bg-emerald-800 border border-slate-200 hover:bg-emerald-900",
    white: "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50",
    emerald: "text-white bg-emerald-800 hover:bg-emerald-900 border border-transparent",
  };

  return (
    <button
      {...props}
      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition active:scale-95 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 stroke-[2.5]" />}
      {children}
    </button>
  );
}
