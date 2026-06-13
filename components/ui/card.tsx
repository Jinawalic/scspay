import { cn } from "@/src/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 p-6 backdrop-blur-md hover:bg-white transition",
        className
      )}
      {...props}
    />
  );
}
