"use client";

import { Eye } from "lucide-react";
import type { Transaction } from "@/src/types";

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
    <div className="w-full border border-slate-200 rounded-xl p-6 hover:bg-white">
      {/* Header section with filter button */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        <button 
          type="button" 
          className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100/80">
              <th className="px-6 py-2 text-xs font-semibold text-gray-400 tracking-wide">Date</th>
              <th className="px-6 py-2 text-xs font-semibold text-gray-400 tracking-wide">Description</th>
              <th className="px-6 py-2 text-xs font-semibold text-gray-400 tracking-wide">Amount</th>
              <th className="px-6 py-2 text-xs font-semibold text-gray-400 tracking-wide flex items-center gap-1">
                Status 
                <span className="text-[10px] text-gray-400">↕</span>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {transactions.map((transaction) => {
              // Assuming your transaction object provides these or fallback text
              const flowType = transaction.type === "Income" ? "Credit" : "Expense"; 
              const amountColor = flowType === "Expense" ? "text-red-500" : "text-green-500";

              return (
                <tr key={transaction.id} className="hover:bg-gray-50/40 transition-colors">
                  {/* Date Column */}
                  <td className="px-6 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {transaction.date}
                  </td>
                  
                  {/* Description Column */}
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">
                    {transaction.description || transaction.type}
                  </td>
                  
                  {/* Amount Column */}
                  <td className={`px-6 py-3 text-sm font-bold ${amountColor}`}>
                    ₦{transaction.amount.toLocaleString()}
                  </td>
                  
                  {/* Status Column */}
                  <td className="px-6 py-3 ">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-full bg-emerald-700 text-white tracking-wide min-w-[95px]">
                      {transaction.status === "Successful" ? "success" : transaction.status}
                    </span>
                  </td>
                  
                  {/* Action Column */}
                  <td className="px-6 text-right">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                      onClick={() =>
                        window.open(
                          `/receipt/${transaction.receipt}?print=1`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <Eye className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination View Matching Image */}
      <div className="flex items-center justify-end gap-1.5 mt-5 pt-4 border-t border-gray-50 text-xs font-semibold text-gray-500">
        <button className="px-2 py-1.5 text-gray-300 cursor-not-allowed">Prev</button>
        <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#E27413] text-white">1</button>
        <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-50 transition">2</button>
        <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-50 transition">3</button>
        <span className="px-1 text-gray-400">...</span>
        <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-50 transition">10</button>
        <button className="px-2 py-1.5 hover:text-gray-900 transition">Next</button>
      </div>
    </div>
  );
}