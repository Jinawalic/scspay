"use client";

import React from "react";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md select-none transition-all duration-500 animate-in fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer Elegant Spinning Ring */}
        <div className="h-28 w-28 rounded-full border-2 border-dotted border-slate-700/40 animate-[spin_8s_linear_infinite]" />

        {/* Core Quick Multi-Colored Glow Spin Ring */}
        <div className="absolute h-24 w-24 rounded-full border-4 border-emerald-800/10 border-t-emerald-600 border-r-emerald-500 animate-spin" />

        {/* Deep Solid Inner Circle for Logo Contrast Base */}
        <div className="absolute h-18 w-18 rounded-full bg-white flex items-center justify-center shadow-xl border border-slate-100 p-1 z-10 animate-in zoom-in duration-500">
          <img
            src="/images/logo.png"
            alt="MyPay Logo Loading"
            className="h-full w-full rounded-full object-contain animate-pulse"
          />
        </div>
      </div>

      {/* Modern Minimalistic Brand Progress Meta-Text */}
      <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
        <h3 className="text-[15px] font-bold text-white tracking-wider font-sans uppercase">
          MyPay Secure
        </h3>
        <p className="text-[11px] font-semibold text-emerald-400/80 tracking-widest uppercase animate-pulse">
          Initializing App Portals...
        </p>
      </div>
    </div>
  );
}