import type { StatusType } from '../types';
import { STATUS_LABELS } from '../types';

const STATUS_STYLES: Record<StatusType, string> = {
  not_started: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  at_risk: 'bg-red-100 text-red-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

interface Props {
  status: StatusType;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${STATUS_STYLES[status]}`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}
