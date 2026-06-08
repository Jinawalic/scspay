export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={className ?? "animate-pulse rounded-3xl bg-slate-200/80"}>
      <div className="h-full w-full" />
    </div>
  );
}
