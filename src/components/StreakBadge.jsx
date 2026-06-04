import { Flame } from 'lucide-react';

export default function StreakBadge({ streak, name }) {
  if (!streak || streak < 2) return null;

  let label;
  if (streak >= 30) label = `You're a CreatorFlow legend 🏆`;
  else if (streak >= 7) label = `One week strong${name ? `, ${name}` : ''}! 🔥`;
  else label = `${streak}-day streak!`;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
      <Flame className="w-3.5 h-3.5 text-orange-400" />
      <span className="text-xs font-semibold text-orange-400">{label}</span>
    </div>
  );
}