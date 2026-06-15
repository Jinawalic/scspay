"use client";

import React, { useState, useEffect } from "react";
import { Wallet, AlertCircle } from "lucide-react";
import { ModalShell } from "./ModalShell";

// Import your reusable atomic workspace components
import { Button } from "@/components/admin/Button";

interface CreatedPaymentItem {
  id: string;
  title: string;
  amount: string;
  action: string;
}

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: CreatedPaymentItem | null;
  onUpdate: (updatedPayment: CreatedPaymentItem) => void;
}

export function EditPaymentModal({ isOpen, onClose, payment, onUpdate }: EditPaymentModalProps) {
  const [formData, setFormData] = useState({ title: "", amount: "" });

  // Sync internal state whenever a new payment row context is loaded
  useEffect(() => {
    if (payment) {
      // Strip out currency marks safely to keep numeric standard inputs happy
      const cleanAmount = payment.amount.replace(/[^\d.]/g, "");
      setFormData({
        title: payment.title,
        amount: cleanAmount,
      });
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment || !formData.title || !formData.amount) return;

    const parsedNum = parseFloat(formData.amount.replace(/,/g, ""));
    if (isNaN(parsedNum)) return;

    // Convert flat numbers back into consistent visual currency notation strings
    const formattedAmount = `₦${parsedNum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    onUpdate({
      ...payment,
      title: formData.title.trim(),
      amount: formattedAmount,
    });
  };

  return (
    <ModalShell 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Modify Payment Configuration" 
      icon={Wallet}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Payment Title / Purpose
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
          />
        </div>

        {/* Amount Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Amount Required (NGN)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₦</span>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Info Callout */}
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Modifying this target profile alters live transaction configurations across pending student accounts immediately.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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