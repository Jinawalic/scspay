"use client";

import type { Transaction } from "@/src/types";
import { Receipt, Calendar, Trash2, Download, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export function TransactionCard({
  transaction,
  onDelete,
  onDownload,
}: {
  transaction: Transaction;
  onDelete: () => void;
  onDownload: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-white"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Icon and Details */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Icon Container */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF5F0]">
            <CreditCard className="h-6 w-6 text-[#135A3D]" />
          </div>

          {/* Details */}
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-base font-bold text-[#1E2E42] sm:text-lg">
              {transaction.type}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-[#135A3D]" />
              <span className="text-[#135A3D] uppercase">{transaction.date}</span>
              <span className="text-slate-300">•</span>
            </div>
          </div>
        </div>

        {/* Right Section: Amount and Action Buttons */}
        <div className="flex flex-col items-end justify-between self-stretch min-h-[5.5rem] shrink-0">
          <p className="text-lg font-extrabold text-[#9B2C2C] sm:text-xl mt-1">
            -₦{transaction.amount.toLocaleString()}
          </p>

          {/* Action Button */}
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF4F1] text-[#2C6E52] transition-colors hover:bg-[#E2EFEB] hover:text-[#135A3D] active:scale-95 cursor-pointer"
              title="Download receipt"
            >
              <Download className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
