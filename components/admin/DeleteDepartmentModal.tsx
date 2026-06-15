"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { ModalShell } from "@/components/admin/ModalShell";

// Import your reusable atomic components
import { Button } from "@/components/admin/Button";

interface CreatedDepartmentItem {
  id: string;
  code: string;
  title: string;
  faculty: string; // 💡 Synced to match the updated system schema
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
        
        {/* Modal Action Footers */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          {/* Swapped for uniform workspace components */}
          <Button 
            variant="white" 
            type="button" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="rose" 
            type="button" 
            onClick={onConfirm}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}