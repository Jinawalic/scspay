import { cn } from "@/src/lib/utils";
import { Card } from "@/components/ui/card";

interface PaymentSummaryProps {
  title: string;
  subtitle?: string;
  selectedItem: string;
  method?: string;
  total: number;
  className?: string;
}

export function PaymentSummary({
  title,
  subtitle = "Review the payment details before submitting.",
  selectedItem,
  method = "Paystack",
  total,
  className
}: PaymentSummaryProps) {
  return (
    <Card className={cn("rounded-xl bg-[#F5F8FA] p-6 text-left space-y-4 shadow-none", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-400">Selected Items</span>
        <span className="font-bold text-[#1E2E42]">{selectedItem}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-400">Method</span>
        <span className="font-bold text-[#1E2E42]">{method}</span>
      </div>
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-sm">
        <span className="font-bold text-[#1E2E42]">Total</span>
        <span className="text-xl font-extrabold text-[#135A3D]">₦{total.toLocaleString()}</span>
      </div>
    </Card>
  );
}
