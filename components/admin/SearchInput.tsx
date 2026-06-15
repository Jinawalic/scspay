"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange: (value: string) => void;
}

export function SearchInput({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className = "", 
  ...props 
}: SearchInputProps) {
  return (
    <div className={`relative w-full sm:w-64 ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <input 
        {...props}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none placeholder-slate-400 focus:border-slate-300 focus:bg-white transition-colors"
      />
    </div>
  );
}