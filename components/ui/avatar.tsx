import { cn } from "@/src/lib/utils";

export function Avatar({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm", className)}>
      {children}
    </div>
  );
}
