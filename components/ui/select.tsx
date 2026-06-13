import { cn } from "@/src/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
