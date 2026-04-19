import type { TeamType } from '../types';
import { TEAMS } from '../types';

interface Props {
  team: TeamType;
  size?: 'sm' | 'md';
}

export function TeamBadge({ team, size = 'md' }: Props) {
  const t = TEAMS.find(t => t.team === team);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${t?.bgColor ?? 'bg-gray-100'} ${t?.textColor ?? 'text-gray-700'}`}>
      {team}
    </span>
  );
}
