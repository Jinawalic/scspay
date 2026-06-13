import { cn } from "@/src/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
}
