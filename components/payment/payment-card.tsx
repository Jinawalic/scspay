import { PaymentCategory } from "@/src/types";
import { ArrowRight, CircleDollarSign } from "lucide-react";

export function PaymentCard({ category, selected, onSelect }: { category: PaymentCategory; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-[2rem] border p-6 text-left transition ${
        selected ? "border-emerald-400 bg-emerald-50 shadow-lg" : "border-slate-200 bg-white hover:border-emerald-200"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{category.name}</p>
          <p className="mt-2 text-sm text-slate-500">{category.description}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-emerald-600">
          <CircleDollarSign className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-2xl font-semibold text-slate-950">₦{category.amount.toLocaleString()}</span>
        <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-emerald-600" />
      </div>
    </button>
  );
}
