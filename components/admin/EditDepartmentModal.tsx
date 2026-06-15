"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { ModalShell } from "@/components/admin/ModalShell";

// Import your reusable atomic components
import { Button } from "@/components/admin/Button";

interface CreatedDepartmentItem {
  id: string;
  code: string;
  title: string;
}

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDept: CreatedDepartmentItem) => void;
  initialData: CreatedDepartmentItem | null;
}

export function EditDepartmentModal({ isOpen, onClose, onSave, initialData }: EditDepartmentModalProps) {
  const [editFormData, setEditFormData] = useState({ title: "", code: "" });

  // Sync state data whenever a new department instance target is opened
  useEffect(() => {
    if (initialData) {
      setEditFormData({
        title: initialData.title,
        code: initialData.code,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData || !editFormData.title || !editFormData.code) return;

    onSave({
      ...initialData,
      title: editFormData.title.trim(),
      code: editFormData.code.trim().toUpperCase(),
    });
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Modify Department Settings" icon={ShieldCheck}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          
          {/* Code Configuration */}
          <div className="space-y-1.5 col-span-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Dept Code
            </label>
            <input
              type="text"
              required
              value={editFormData.code}
              onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition uppercase"
            />
          </div>

          {/* Title Configuration */}
          <div className="space-y-1.5 col-span-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Full Department Name
            </label>
            <input
              type="text"
              required
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Modal Action Footers */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          {/* Swapped custom raw tags for atomic platform workspace components */}
          <Button 
            variant="white" 
            type="button" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}