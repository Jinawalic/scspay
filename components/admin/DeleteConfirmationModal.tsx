"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { ModalShell } from "./ModalShell";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  loading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading = false,
}: DeleteConfirmationModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Permanent Deletion"
      icon={AlertTriangle}
    >
      <div className="space-y-4">
        {/* Warning Content Text Frame */}
        <div className="space-y-2 select-none">
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-slate-900">"{itemName}"</span>? This action cannot be reversed.
          </p>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Removing this active configuration breaks linked historical client invoice references and drops corresponding student ledger targets.
          </p>
        </div>

        {/* Modal Controls Actions Line */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete Item"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}