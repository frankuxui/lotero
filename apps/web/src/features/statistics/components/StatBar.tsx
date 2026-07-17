export function StatBar({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs font-medium ">
          {value} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-foreground/10">
        <div className="h-full bg-indigo-600" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
