export function PaymentStatus() {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-6 py-4 shadow-sm">
      {/* Payment Status Text */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Payment Status
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">Today</p>
      </div>

      {/* Pending Pill */}
      <div className="rounded-full bg-white px-6 py-2.5 shadow-md">
        <p className="text-sm font-semibold text-orange-500">Pending</p>
      </div>
    </div>
  );
}
