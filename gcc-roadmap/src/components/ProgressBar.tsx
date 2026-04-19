interface Props {
  value: number;
  color?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ProgressBar({ value, color = 'bg-blue-500', size = 'md', showLabel = true }: Props) {
  const h = size === 'sm' ? 'h-1.5' : 'h-2';
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${h}`}>
        <div
          className={`${h} rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 w-8 text-right">{value}%</span>
      )}
    </div>
  );
}
