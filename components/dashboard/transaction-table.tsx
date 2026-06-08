import { Download, Eye, MoreHorizontal } from "lucide-react";
import type { Transaction } from "@/src/types";
import { Badge } from "@/components/ui/badge";

const statusStyle = {
  Successful: "success",
  Pending: "warning",
  Failed: "neutral",
} as const;

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Receipt</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="odd:bg-slate-50/80 even:bg-white">
                <td className="px-6 py-5 font-semibold text-slate-900">{transaction.receipt}</td>
                <td className="px-6 py-5 text-slate-600">{transaction.type}</td>
                <td className="px-6 py-5 text-slate-900">₦{transaction.amount.toLocaleString()}</td>
                <td className="px-6 py-5 text-slate-600">{transaction.date}</td>
                <td className="px-6 py-5">
                  <Badge variant={statusStyle[transaction.status]}>{transaction.status}</Badge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-slate-500">
                    <button className="rounded-2xl p-2 hover:bg-slate-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-2xl p-2 hover:bg-slate-100">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded-2xl p-2 hover:bg-slate-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
