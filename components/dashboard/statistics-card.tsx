import { Badge } from "@/components/ui/badge";

type StatsCardProps = {
  title: string;
  value: string;
  meta: string;
};

export function StatisticsCard({ title, value, meta }: StatsCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <Badge variant="success">Live</Badge>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{meta}</p>
    </div>
  );
}
