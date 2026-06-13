"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  changeText: string;
  isNegative?: boolean;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  isNegative = false
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between transition-all duration-200 hover:bg-slate-100">
      {/* Title String and Icon Alignment Header Line */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-sans font-bold text-slate-700">
          {title}
        </span>
        <div className="p-1 rounded-lg text-slate-800 shrink-0">
          <Icon className="h-5 w-5 stroke-[1.75]" />
        </div>
      </div>

      {/* Primary Mathematical Display Metrics Section */}
      <div className="mt-2 space-y-1">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
          {value}
        </h3>
        <p className="text-[10px] font-bold tracking-normal pt-1 flex items-center gap-1">
          <span className="text-emerald-400 font-medium">Platform registered students</span>
        </p>
      </div>
    </div>
  );
}