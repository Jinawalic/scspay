"use client";

import React from "react";
import { Eye } from "lucide-react";
import type { Transaction } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Update this mapping based on the categories/types present in your actual DB data
const typeColors: Record<string, string> = {
  Expense: "text-red-500",
  Credit: "text-green-500",
};

export function RecentTransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-4">
      {/* Section Content Filter Utilities Header Line Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            Recent Transactions
          </h2>
        </div>

        {/* Filter Group Alignment Box */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shrink-0 h-auto shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </Button>
        </div>
      </div>

      {/* The Unified Structuring Data Matrix Core Framework */}
      <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[12px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6 flex items-center gap-1">
                  Status 
                  <span className="text-[11px] text-slate-400">↕</span>
                </th>
                <th className="py-3.5 px-6 text-right w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-[13px] font-semibold text-slate-700">
              {transactions.map((transaction) => {
                // Assuming your transaction object provides these or fallback text
                const flowType = transaction.type === "Income" ? "Credit" : "Expense"; 
                const amountColor = flowType === "Expense" ? "text-red-500" : "text-green-500";

                return (
                  <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Date Column */}
                    <td className="px-6 py-4 font-medium text-slate-400 whitespace-nowrap">
                      {transaction.date}
                    </td>
                    
                    {/* Description Column */}
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {transaction.description || transaction.type}
                    </td>
                    
                    {/* Amount Column */}
                    <td className={`px-6 py-4 font-bold ${amountColor}`}>
                      ₦{transaction.amount.toLocaleString()}
                    </td>
                    
                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <Badge className="inline-flex items-center justify-center px-2.5 py-0.5 text-[11px] font-bold leading-normal rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/60 shadow-none hover:bg-emerald-50 tracking-normal min-w-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        {transaction.status === "Successful" ? "success" : transaction.status}
                      </Badge>
                    </td>
                    
                    {/* Action Column */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="h-6 w-6 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                        onClick={() =>
                          window.open(
                            `/receipt/${transaction.receipt}?print=1`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Clean Balanced Pagination Footer Component */}
        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-3.5 bg-white select-none">
          <div className="flex items-center gap-1.5">
            <button className="h-8 px-2 text-slate-300 font-bold text-[13px] cursor-not-allowed">
              Prev
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-400 text-white text-[13px] font-bold transition">
              1
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition">
              2
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition">
              3
            </button>
            <span className="px-1 text-slate-400 text-[13px] font-bold">...</span>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition">
              10
            </button>
            <button className="h-8 px-2 text-slate-500 hover:text-slate-900 font-bold text-[13px] transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}