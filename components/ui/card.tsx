import { cn } from "@/src/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.25)] backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
