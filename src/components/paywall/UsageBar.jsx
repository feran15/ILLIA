export default function UsageBar({ dailyCount }) {
  const FREE_LIMIT = 5;
  const used = Math.min(dailyCount, FREE_LIMIT);
  const remaining = FREE_LIMIT - used;
  const pct = (used / FREE_LIMIT) * 100;

  const textColor = remaining === 0 ? 'text-red-400' : remaining === 1 ? 'text-amber-400' : 'text-muted-foreground';

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs ${textColor}`}>
          {used} of {FREE_LIMIT} captions used today
        </span>
        {remaining === 0 && <span className="text-xs text-red-400 font-medium">Daily limit reached</span>}
        {remaining === 1 && <span className="text-xs text-amber-400">1 left today</span>}
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            remaining === 0 ? 'bg-red-500' : remaining === 1 ? 'bg-amber-400' : 'bg-green-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}