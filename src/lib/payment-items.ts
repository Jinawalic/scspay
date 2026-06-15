import type { PaymentCategory } from "@/src/types";

export const DEFAULT_PAYMENT_COLOR = "from-emerald-600 to-green-400";

export function formatNaira(amount: number) {
  return `₦${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function toPaymentCategory(item: {
  id: string;
  name: string;
  description?: string | null;
  amount: number;
}): PaymentCategory {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "Configured by admin",
    amount: item.amount,
    color: DEFAULT_PAYMENT_COLOR,
  };
}

export function toAdminPaymentRow(item: {
  id: string;
  name: string;
  amount: number;
}) {
  return {
    id: item.id,
    title: item.name,
    amount: formatNaira(item.amount),
    action: "",
  };
}
