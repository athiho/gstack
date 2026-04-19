import { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Initiative, TeamType, StatusType, PriorityType } from '../types';
import { TEAMS, PRIORITY_LABELS } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TeamBadge } from '../components/TeamBadge';
import { ProgressBar } from '../components/ProgressBar';
import { Modal } from '../components/Modal';
import { InitiativeForm } from '../components/InitiativeForm';

const PRIORITY_COLORS: Record<PriorityType, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-slate-100 text-slate-600',
};

const TEAM_PROGRESS_COLOR: Record<TeamType, string> = {
  'Engineering': 'bg-blue-500',
  'QA': 'bg-purple-500',
  'Product Support': 'bg-emerald-500',
  'Cross-functional': 'bg-amber-500',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface CardProps {
  initiative: Initiative;
  goalTitle?: string;
  onEdit: () => void;
  onDelete: () => void;
}

function InitiativeCard({ initiative: i, goalTitle, onEdit, onDelete }: CardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <TeamBadge team={i.team} size="sm" />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[i.priority]}`}>
              {PRIORITY_LABELS[i.priority]}
            </span>
            <StatusBadge status={i.status} size="sm" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug">{i.title}</h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{i.description}</p>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
            <span>Owner: <span className="font-medium text-slate-600">{i.owner}</span></span>
            <span>{formatDate(i.startDate)} → {formatDate(i.endDate)}</span>
            {goalTitle && <span className="text-blue-600">↗ {goalTitle}</span>}
          </div>

          {i.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {i.tags.map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
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
        <ProgressBar value={i.progress} color={TEAM_PROGRESS_COLOR[i.team]} />
      </div>
    </div>
  );
}

export function Initiatives() {
  const { goals, initiatives, addInitiative, updateInitiative, deleteInitiative } = useApp();
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState<TeamType | ''>('');
  const [filterStatus, setFilterStatus] = useState<StatusType | ''>('');
  const [filterPriority, setFilterPriority] = useState<PriorityType | ''>('');
  const [filterGoal, setFilterGoal] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Initiative | null>(null);

  const filtered = initiatives.filter(i => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTeam && i.team !== filterTeam) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    if (filterPriority && i.priority !== filterPriority) return false;
    if (filterGoal && i.goalId !== filterGoal) return false;
    return true;
  });

  const openEdit = (i: Initiative) => { setEditing(i); setModal('edit'); };
  const handleDelete = (id: string) => { if (confirm('Delete this initiative?')) deleteInitiative(id); };

  const handleSave = (data: Initiative) => {
    if (modal === 'edit') updateInitiative(data);
    else addInitiative(data);
    setModal(null);
    setEditing(null);
  };

  const goalMap = Object.fromEntries(goals.map(g => [g.id, g.title]));
  const clearFilters = () => { setSearch(''); setFilterTeam(''); setFilterStatus(''); setFilterPriority(''); setFilterGoal(''); };
  const hasFilters = !!(search || filterTeam || filterStatus || filterPriority || filterGoal);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Initiatives</h1>
          <p className="text-slate-500 mt-0.5 text-sm">{initiatives.length} initiatives · FY 2026</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModal('add'); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Initiative
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search initiatives..."
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
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as PriorityType | '')} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={filterGoal} onChange={e => setFilterGoal(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-48 truncate">
          <option value="">All Goals</option>
          {goals.map(g => <option key={g.id} value={g.id}>{g.title.slice(0, 35)}{g.title.length > 35 ? '…' : ''}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-700 px-2 py-2">Clear</button>
        )}
      </div>

      <div className="text-xs text-slate-400 mb-3">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Rocket size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No initiatives found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(i => (
            <InitiativeCard
              key={i.id}
              initiative={i}
              goalTitle={i.goalId ? goalMap[i.goalId] : undefined}
              onEdit={() => openEdit(i)}
              onDelete={() => handleDelete(i.id)}
            />
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Initiative' : 'New Initiative'} onClose={() => { setModal(null); setEditing(null); }} size="xl">
          <InitiativeForm initial={editing} goals={goals} onSave={handleSave} onCancel={() => { setModal(null); setEditing(null); }} />
        </Modal>
      )}
    </div>
  );
}
