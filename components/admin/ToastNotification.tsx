"use client";

import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastNotificationProps {
  message: string;
  type?: ToastType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({
  message,
  type = "success",
  isOpen,
  onClose,
  duration = 4000,
}: ToastNotificationProps) {
  
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  // Configuration map with added semantic text definitions for complete safety
  const typeStyles = {
    success: {
      bg: "bg-emerald-800 border-emerald-700 text-white",
      icon: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 stroke-[2.5]" />,
      title: "Action Successful",
      textMuted: "text-emerald-100",
    },
    error: {
      bg: "bg-rose-950 border-rose-900 text-rose-100",
      icon: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 stroke-[2.5]" />,
      title: "An Error Occurred",
      textMuted: "text-rose-200/80",
    },
    info: {
      bg: "bg-blue-950 border-blue-900 text-blue-100",
      icon: <Info className="h-5 w-5 text-blue-400 shrink-0 stroke-[2.5]" />,
      title: "System Update",
      textMuted: "text-blue-200/80",
    },
  };

  const activeConfig = typeStyles[type];

  return (
    <div 
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-white pointer-events-auto select-none max-w-sm
        animate-in fade-in slide-in-from-top-4 duration-300 ${activeConfig.bg}`}
    >
      {activeConfig.icon}
      
      <div className="flex flex-col pr-2">
        <span className="text-xs font-bold tracking-wide">{activeConfig.title}</span>
        <span className={`text-[11px] font-medium leading-normal mt-0.5 ${activeConfig.textMuted}`}>
          {message}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="ml-auto p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition shrink-0 self-start"
      >
        <X className="h-3.5 w-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
}