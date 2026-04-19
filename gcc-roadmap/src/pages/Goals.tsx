import { useState } from 'react';
import { Plus, Search, ChevronDown, ChevronUp, Trash2, Edit2, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Goal, TeamType, StatusType, QuarterType } from '../types';
import { TEAMS } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TeamBadge } from '../components/TeamBadge';
import { ProgressBar } from '../components/ProgressBar';
import { Modal } from '../components/Modal';
import { GoalForm } from '../components/GoalForm';

const TEAM_PROGRESS_COLOR: Record<TeamType, string> = {
  'Engineering': 'bg-blue-500',
  'QA': 'bg-purple-500',
  'Product Support': 'bg-emerald-500',
  'Cross-functional': 'bg-amber-500',
};

function GoalCard({ goal, onEdit, onDelete }: { goal: Goal; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const color = TEAM_PROGRESS_COLOR[goal.team];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <TeamBadge team={goal.team} size="sm" />
              <span className="text-xs text-slate-400">{goal.quarter} {goal.year}</span>
              <StatusBadge status={goal.status} size="sm" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base leading-snug">{goal.title}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{goal.description}</p>
            <div className="mt-3 text-xs text-slate-400">Owner: <span className="font-medium text-slate-600">{goal.owner}</span></div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
              <Edit2 size={15} />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
          </div>
          <ProgressBar value={goal.progress} color={color} />
        </div>
      </div>

      {goal.keyResults.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 border-t border-slate-100 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {goal.keyResults.length} Key Results
          </button>
          {expanded && (
            <div className="px-5 pb-4 space-y-3 bg-slate-50 border-t border-slate-100">
              {goal.keyResults.map(kr => (
                <div key={kr.id} className="pt-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm text-slate-700">{kr.description}</span>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {kr.current} / {kr.target}
                    </span>
                  </div>
                  <ProgressBar value={kr.progress} color={color} size="sm" />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState<TeamType | ''>('');
  const [filterStatus, setFilterStatus] = useState<StatusType | ''>('');
  const [filterQuarter, setFilterQuarter] = useState<QuarterType | ''>('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Goal | null>(null);

  const filtered = goals.filter(g => {
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) && !g.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTeam && g.team !== filterTeam) return false;
    if (filterStatus && g.status !== filterStatus) return false;
    if (filterQuarter && g.quarter !== filterQuarter) return false;
    return true;
  });

  const openEdit = (goal: Goal) => { setEditing(goal); setModal('edit'); };
  const handleDelete = (id: string) => { if (confirm('Delete this goal?')) deleteGoal(id); };

  const handleSave = (data: Goal) => {
    if (modal === 'edit') updateGoal(data);
    else addGoal(data);
    setModal(null);
    setEditing(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Goals</h1>
          <p className="text-slate-500 mt-0.5 text-sm">{goals.length} goals across all teams · FY 2026</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModal('add'); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search goals..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select value={filterTeam} onChange={e => setFilterTeam(e.target.value as TeamType | '')} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Teams</option>
          {TEAMS.map(t => <option key={t.team} value={t.team}>{t.team}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusType | '')} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="at_risk">At Risk</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filterQuarter} onChange={e => setFilterQuarter(e.target.value as QuarterType | '')} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Quarters</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
          <option value="All Year">All Year</option>
        </select>
        {(search || filterTeam || filterStatus || filterQuarter) && (
          <button onClick={() => { setSearch(''); setFilterTeam(''); setFilterStatus(''); setFilterQuarter(''); }} className="text-sm text-slate-500 hover:text-slate-700 px-2 py-2">
            Clear
          </button>
        )}
      </div>

      <div className="text-xs text-slate-400 mb-3">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>

      {/* Goals grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No goals found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => openEdit(goal)}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Goal' : 'New Goal'} onClose={() => { setModal(null); setEditing(null); }} size="xl">
          <GoalForm initial={editing} onSave={handleSave} onCancel={() => { setModal(null); setEditing(null); }} />
        </Modal>
      )}
    </div>
  );
}
