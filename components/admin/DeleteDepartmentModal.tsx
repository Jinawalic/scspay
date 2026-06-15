"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { ModalShell } from "@/components/admin/ModalShell";

interface CreatedDepartmentItem {
  id: string;
  code: string;
  title: string;
}

interface DeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetDept: CreatedDepartmentItem | null;
}

export function DeleteDepartmentModal({ isOpen, onClose, onConfirm, targetDept }: DeleteDepartmentModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Decommission Unit Record" icon={AlertCircle}>
      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-600 leading-relaxed">
          Are you sure you want to remove <span className="font-extrabold text-slate-900">"{targetDept?.title}" ({targetDept?.code})</span>? 
          This structural unit deconfiguration cannot be reverted and will sever tracking metrics across student registries.
        </p>
        
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </ModalShell>
  );
}