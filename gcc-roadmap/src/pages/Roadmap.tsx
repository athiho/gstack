import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Initiative, TeamType } from '../types';
import { TEAMS } from '../types';

const YEAR = 2026;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUARTERS = [
  { label: 'Q1', months: [0, 1, 2] },
  { label: 'Q2', months: [3, 4, 5] },
  { label: 'Q3', months: [6, 7, 8] },
  { label: 'Q4', months: [9, 10, 11] },
];

const TEAM_COLORS: Record<TeamType, { bar: string; bg: string; text: string }> = {
  'Engineering': { bar: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-800' },
  'QA': { bar: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-800' },
  'Product Support': { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  'Cross-functional': { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-800' },
};

const STATUS_BAR_OPACITY: Record<string, string> = {
  not_started: 'opacity-40',
  in_progress: 'opacity-100',
  at_risk: 'opacity-100',
  completed: 'opacity-60',
};

const STATUS_BORDER: Record<string, string> = {
  not_started: 'border border-dashed border-slate-300',
  in_progress: '',
  at_risk: 'ring-1 ring-red-400',
  completed: '',
};

function dayOfYear(dateStr: string): number {
  const d = new Date(dateStr);
  const start = new Date(YEAR, 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const DAYS_IN_YEAR = 366;

function barStyle(startDate: string, endDate: string) {
  const s = Math.max(0, dayOfYear(startDate));
  const e = Math.min(DAYS_IN_YEAR, dayOfYear(endDate));
  const left = ((s - 1) / DAYS_IN_YEAR) * 100;
  const width = Math.max(0.5, ((e - s + 1) / DAYS_IN_YEAR) * 100);
  return { left: `${left}%`, width: `${width}%` };
}

interface TooltipInfo {
  initiative: Initiative;
  goalTitle?: string;
  x: number;
  y: number;
}

export function Roadmap() {
  const { initiatives, goals } = useApp();
  const [filterTeam, setFilterTeam] = useState<TeamType | ''>('');
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const goalMap = Object.fromEntries(goals.map(g => [g.id, g.title]));

  const filtered = initiatives.filter(i => {
    if (filterTeam && i.team !== filterTeam) return false;
    const startYear = new Date(i.startDate).getFullYear();
    const endYear = new Date(i.endDate).getFullYear();
    return startYear <= YEAR && endYear >= YEAR;
  });

  const teams = (filterTeam ? TEAMS.filter(t => t.team === filterTeam) : TEAMS.filter(t => t.team !== 'Cross-functional')).concat(
    TEAMS.filter(t => t.team === 'Cross-functional' && (!filterTeam || filterTeam === 'Cross-functional'))
  );

  const grouped = teams.map(t => ({
    ...t,
    initiatives: filtered.filter(i => i.team === t.team),
  })).filter(g => g.initiatives.length > 0 || !filterTeam);

  const handleMouseEnter = (e: React.MouseEvent, init: Initiative) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ initiative: init, goalTitle: init.goalId ? goalMap[init.goalId] : undefined, x: rect.left, y: rect.bottom + 8 });
  };

  return (
    <div className="p-8 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roadmap</h1>
          <p className="text-slate-500 mt-0.5 text-sm">FY {YEAR} — {filtered.length} initiatives across all teams</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterTeam}
            onChange={e => setFilterTeam(e.target.value as TeamType | '')}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Teams</option>
            {TEAMS.map(t => <option key={t.team} value={t.team}>{t.team}</option>)}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5 flex-wrap text-xs text-slate-500">
        <span className="font-medium">Status:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-400 opacity-40" /> Not Started</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> In Progress</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 ring-1 ring-red-400" /> At Risk</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 opacity-60" /> Completed</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
          {/* Quarters */}
          <div className="flex border-b border-slate-100">
            <div className="w-52 flex-shrink-0 border-r border-slate-100" />
            {QUARTERS.map(q => (
              <div key={q.label} className="flex-1 text-center text-xs font-semibold text-slate-500 py-1.5 border-r border-slate-100 last:border-r-0 uppercase tracking-wider">
                {q.label}
              </div>
            ))}
          </div>
          {/* Months */}
          <div className="flex">
            <div className="w-52 flex-shrink-0 border-r border-slate-100 px-4 py-2 text-xs font-medium text-slate-400">Team / Initiative</div>
            {MONTHS.map((m, idx) => (
              <div
                key={m}
                className={`flex-1 text-center text-xs text-slate-400 py-2 border-r border-slate-100 last:border-r-0 ${
                  idx % 3 === 2 ? 'border-r-slate-200' : ''
                }`}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div>
          {grouped.map(group => (
            <div key={group.team}>
              {/* Team header row */}
              <div className={`flex items-center border-b border-slate-100 ${group.bgColor} py-2`}>
                <div className="w-52 flex-shrink-0 border-r border-slate-100 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                    <span className={`text-xs font-semibold ${group.textColor}`}>{group.team}</span>
                    <span className={`text-xs ${group.textColor} opacity-60`}>({group.initiatives.length})</span>
                  </div>
                </div>
                <div className="flex-1 relative h-6">
                  {/* Quarter separators */}
                  {[3, 6, 9].map(m => (
                    <div key={m} className="absolute top-0 bottom-0 border-r border-slate-200" style={{ left: `${(m / 12) * 100}%` }} />
                  ))}
                </div>
              </div>

              {/* Initiative rows */}
              {group.initiatives.map(init => {
                const colors = TEAM_COLORS[init.team];
                const opacity = STATUS_BAR_OPACITY[init.status];
                const border = STATUS_BORDER[init.status];
                const style = barStyle(init.startDate, init.endDate);
                const isAtRisk = init.status === 'at_risk';

                return (
                  <div key={init.id} className="flex items-center border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    <div className="w-52 flex-shrink-0 border-r border-slate-100 px-4 py-2.5">
                      <div className="text-xs text-slate-700 font-medium leading-snug truncate" title={init.title}>{init.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{init.owner}</div>
                    </div>
                    <div className="flex-1 relative h-10">
                      {/* Month separators */}
                      {MONTHS.map((_, idx) => (
                        <div key={idx} className={`absolute top-0 bottom-0 border-r ${idx % 3 === 2 ? 'border-slate-200' : 'border-slate-100'}`} style={{ left: `${((idx + 1) / 12) * 100}%` }} />
                      ))}
                      {/* Bar */}
                      <div
                        className={`absolute top-2 bottom-2 rounded-md cursor-pointer transition-all ${colors.bar} ${opacity} ${border} ${isAtRisk ? 'animate-pulse' : ''}`}
                        style={style}
                        onMouseEnter={e => handleMouseEnter(e, init)}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <div className="px-2 h-full flex items-center overflow-hidden">
                          <span className="text-white text-xs font-medium truncate select-none">{init.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {grouped.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No initiatives for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-4 max-w-72 pointer-events-none"
          style={{ left: Math.min(tooltip.x, window.innerWidth - 300), top: tooltip.y }}
        >
          <div className="font-semibold text-sm mb-1">{tooltip.initiative.title}</div>
          {tooltip.goalTitle && <div className="text-xs text-blue-300 mb-2">↗ {tooltip.goalTitle}</div>}
          <div className="text-xs text-slate-300 space-y-0.5">
            <div>Team: {tooltip.initiative.team}</div>
            <div>Owner: {tooltip.initiative.owner}</div>
            <div>
              {new Date(tooltip.initiative.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
              {new Date(tooltip.initiative.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div>Progress: {tooltip.initiative.progress}%</div>
            <div className="capitalize">Status: {tooltip.initiative.status.replace('_', ' ')}</div>
          </div>
          {tooltip.initiative.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tooltip.initiative.tags.map(t => (
                <span key={t} className="bg-slate-700 text-slate-200 text-xs px-1.5 py-0.5 rounded">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
