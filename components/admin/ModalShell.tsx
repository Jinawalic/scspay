"use client";

import React, { useEffect } from "react";
import { X, LucideIcon } from "lucide-react";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function ModalShell({ isOpen, onClose, title, icon: Icon, children }: ModalShellProps) {
  // Prevent background scrolling when a modal overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop container targets this area to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card content element */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col z-10">
        
        {/* Shared Layout Top Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50 select-none">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-emerald-800 stroke-[2.5]" />}
            <h3 className="text-sm font-extrabold text-slate-900">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Nested Content Element slots safely injected below */}
        <div className="p-5">
          {children}
        </div>

      </div>
    </div>
  );
}