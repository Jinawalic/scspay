"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => void;
  initialData: any | null;
}

// Pre-defined structural department listings 
const DEPARTMENTS = [
  "Administration",
  "Engineering",
  "Housekeeping",
  "Reception",
  "Purchasing",
  "Accounting",
  "Marketing"
];

export function EditUserModal({ isOpen, onClose, onSave, initialData }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    department: "",
    password: "",
  });

  // Hydrate form states whenever targeted record switches context
  useEffect(() => {
    if (initialData) {
      setFormData({
        department: initialData.department || "",
        password: initialData.password || "",
      });
    }
  }, [initialData]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...initialData, ...formData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Dimmed backdrop barrier layer */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Surface Box */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 md:text-base">
              Edit User Profile
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Modify operational variables for this record.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition active:scale-95"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Interactive Data Entry Fields */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          {/* Department Selection Matrix Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Department
            </label>
            <div className="relative w-full">
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none pr-10 focus:border-slate-300 focus:bg-white transition cursor-pointer"
              >
                <option value="" disabled className="text-slate-400">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="text-slate-800 font-semibold">
                    {dept}
                  </option>
                ))}
              </select>
              {/* Custom micro icon arrow element layer */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Enter Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none placeholder-slate-400 focus:border-slate-300 focus:bg-white font-mono tracking-tight transition"
            />
          </div>

          {/* Action Execution Footer Layout */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition active:scale-95 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}