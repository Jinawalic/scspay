import { Card } from "@/components/ui/card";

export function PaymentSummary({ feeType, amount, serviceCharge, total }: { feeType: string; amount: number; serviceCharge: number; total: number }) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Payment Summary</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Review before checkout</h2>
      </div>
      <div className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Fee Type</span>
          <span>{feeType}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Amount</span>
          <span>₦{amount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Service Charge</span>
          <span>₦{serviceCharge.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-950">
        <span>Total</span>
        <span>₦{total.toLocaleString()}</span>
      </div>
    </Card>
  );
}
