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

  // Configurations based on type choice
  const typeStyles = {
    success: {
      bg: "bg-emerald-800 border-emerald-800",
      icon: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
      title: "Action Successful",
    },
    error: {
      bg: "bg-rose-950 border-rose-900 text-rose-100",
      icon: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
      title: "An Error Occurred",
    },
    info: {
      bg: "bg-blue-950 border-blue-900 text-blue-100",
      icon: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
      title: "System Update",
    },
  };

  const activeConfig = typeStyles[type];

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 text-white ${activeConfig.bg}`}>
      {activeConfig.icon}
      <div className="flex flex-col">
        <span className="text-xs font-bold">{activeConfig.title}</span>
        <span className="text-[11px] text-slate-300 font-medium">{message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 p-0.5 rounded-lg text-slate-400 hover:text-white transition"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}