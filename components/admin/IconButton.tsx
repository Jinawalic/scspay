"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "default" | "emerald" | "rose";
}

export function IconButton({ 
  icon: Icon, 
  variant = "default", 
  className = "", 
  ...props 
}: IconButtonProps) {
  
  const variantStyles = {
    default: "text-slate-400 hover:text-slate-700 hover:border-slate-300 bg-white border-slate-100",
    emerald: "text-slate-400 hover:text-[#135A3D] hover:border-emerald-200 hover:bg-emerald-50 border-slate-100",
    rose: "text-rose-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 border-slate-100",
  };

  return (
    <button 
      {...props}
      className={`h-7 w-7 inline-flex items-center justify-center rounded-lg border transition active:scale-95 look-none ${variantStyles[variant]} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}