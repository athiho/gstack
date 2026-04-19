import { Link } from 'react-router-dom';
import { Target, Rocket, CheckCircle, AlertTriangle, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TEAMS } from '../types';
import type { StatusType, TeamType } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';

const TEAM_PROGRESS_COLOR: Record<TeamType, string> = {
  'Engineering': 'bg-blue-500',
  'QA': 'bg-purple-500',
  'Product Support': 'bg-emerald-500',
  'Cross-functional': 'bg-amber-500',
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: number | string; sub: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { goals, initiatives } = useApp();

  const byStatus = (items: { status: StatusType }[]) => ({
    not_started: items.filter(i => i.status === 'not_started').length,
    in_progress: items.filter(i => i.status === 'in_progress').length,
    at_risk: items.filter(i => i.status === 'at_risk').length,
    completed: items.filter(i => i.status === 'completed').length,
  });

  const goalStats = byStatus(goals);
  const initStats = byStatus(initiatives);
  const avgGoalProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
    : 0;

  const teamGoals = TEAMS.slice(0, 3).map(t => {
    const tGoals = goals.filter(g => g.team === t.team);
    const avg = tGoals.length
      ? Math.round(tGoals.reduce((s, g) => s + g.progress, 0) / tGoals.length)
      : 0;
    return { ...t, goalCount: tGoals.length, avg };
  });

  const recentInitiatives = [...initiatives]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const atRiskItems = [
    ...goals.filter(g => g.status === 'at_risk').map(g => ({ type: 'Goal' as const, title: g.title, team: g.team, owner: g.owner })),
    ...initiatives.filter(i => i.status === 'at_risk').map(i => ({ type: 'Initiative' as const, title: i.title, team: i.team, owner: i.owner })),
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">GCC Dashboard</h1>
        <p className="text-slate-500 mt-1">130 headcount · 60 Engineering · 60 QA · 10 Product Support · FY 2026</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Goals" value={goals.length} sub={`${goalStats.completed} completed`} icon={Target} color="bg-blue-500" />
        <StatCard label="Initiatives" value={initiatives.length} sub={`${initStats.in_progress} in progress`} icon={Rocket} color="bg-purple-500" />
        <StatCard label="Goals Completed" value={goalStats.completed} sub={`${Math.round(goalStats.completed / goals.length * 100)}% of total`} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard label="At Risk" value={goalStats.at_risk + initStats.at_risk} sub="goals + initiatives" icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Team progress */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Team Goal Progress</h2>
            <span className="text-sm text-slate-400">FY 2026</span>
          </div>
          <div className="space-y-5">
            {teamGoals.map(t => (
              <div key={t.team}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: t.color }} />
                    <span className="text-sm font-medium text-slate-700">{t.team}</span>
                    <span className="text-xs text-slate-400">{t.headcount} people · {t.goalCount} goals</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{t.avg}%</span>
                </div>
                <ProgressBar value={t.avg} color={TEAM_PROGRESS_COLOR[t.team]} showLabel={false} />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <TrendingUp size={16} className="text-blue-500" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32">
                <ProgressBar value={avgGoalProgress} color="bg-blue-500" showLabel={false} />
              </div>
              <span className="text-lg font-bold text-slate-900">{avgGoalProgress}%</span>
            </div>
          </div>
        </div>

        {/* Goal status breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Goal Status</h2>
          <div className="space-y-3">
            {([
              ['in_progress', 'In Progress', 'bg-blue-500'],
              ['completed', 'Completed', 'bg-emerald-500'],
              ['at_risk', 'At Risk', 'bg-red-500'],
              ['not_started', 'Not Started', 'bg-slate-300'],
            ] as [StatusType, string, string][]).map(([s, label, color]) => (
              <div key={s} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{goalStats[s]}</span>
                  <div className="w-16 bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${goals.length ? goalStats[s] / goals.length * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-400 mb-2">Headcount by Team</div>
            {TEAMS.slice(0, 3).map(t => (
              <div key={t.team} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-600">{t.team}</span>
                </div>
                <span className="text-xs font-semibold text-slate-900">{t.headcount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* At Risk */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              At Risk Items
            </h2>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">{atRiskItems.length}</span>
          </div>
          {atRiskItems.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No at-risk items</p>
          ) : (
            <div className="space-y-2">
              {atRiskItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                  <span className="text-xs font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded mt-0.5">{item.type}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.team} · {item.owner}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Initiatives */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Initiatives</h2>
            <Link to="/initiatives" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentInitiatives.map(init => (
              <div key={init.id} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{init.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={init.status} size="sm" />
                    <span className="text-xs text-slate-400">{init.team}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg flex-shrink-0">
                  {init.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
