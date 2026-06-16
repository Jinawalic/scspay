export function PaymentStatus({ hasPaid }: { hasPaid: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-6 py-4 hover:bg-white transition-colors">
      {/* Payment Status Text */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Payment Status
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">Today</p>
      </div>

      {/* Dynamic Status Pill */}
      <div className="rounded-full bg-white px-6 py-2.5 border border-slate-200">
        {hasPaid ? (
          <p className="text-sm font-semibold text-emerald-600">Paid</p>
        ) : (
          <p className="text-sm font-semibold text-rose-600">Not Paid</p>
        )}
      </div>
    </div>
  );
}

