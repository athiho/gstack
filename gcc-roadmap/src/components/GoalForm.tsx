import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Goal, KeyResult, TeamType, StatusType, QuarterType } from '../types';
import { TEAMS } from '../types';

function uid() { return Math.random().toString(36).slice(2, 10); }

const EMPTY_GOAL: Omit<Goal, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  team: 'Engineering',
  year: 2026,
  quarter: 'Q1',
  status: 'not_started',
  owner: '',
  progress: 0,
  keyResults: [],
};

interface Props {
  initial: Goal | null;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

export function GoalForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Goal, 'id' | 'createdAt'>>(initial ?? EMPTY_GOAL);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const addKR = () => set('keyResults', [...form.keyResults, { id: uid(), description: '', target: '', current: '', progress: 0 }]);

  const updateKR = (id: string, field: keyof KeyResult, value: string | number) =>
    set('keyResults', form.keyResults.map(kr => kr.id === id ? { ...kr, [field]: value } : kr));

  const removeKR = (id: string) => set('keyResults', form.keyResults.filter(kr => kr.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: initial?.id ?? uid(),
      createdAt: initial?.createdAt ?? new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input required value={form.title} onChange={e => set('title', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Goal title" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="What does success look like?" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Team *</label>
          <select value={form.team} onChange={e => set('team', e.target.value as TeamType)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {TEAMS.map(t => <option key={t.team} value={t.team}>{t.team}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Owner *</label>
          <input required value={form.owner} onChange={e => set('owner', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Owner name" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quarter</label>
          <select value={form.quarter} onChange={e => set('quarter', e.target.value as QuarterType)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {(['Q1','Q2','Q3','Q4','All Year'] as QuarterType[]).map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value as StatusType)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="at_risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Progress (%)</label>
          <input type="number" min={0} max={100} value={form.progress} onChange={e => set('progress', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Key Results */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Key Results</label>
          <button type="button" onClick={addKR} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={13} /> Add KR
          </button>
        </div>
        <div className="space-y-3">
          {form.keyResults.map(kr => (
            <div key={kr.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="flex items-start gap-2 mb-2">
                <input
                  value={kr.description}
                  onChange={e => updateKR(kr.id, 'description', e.target.value)}
                  placeholder="Describe the key result..."
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button type="button" onClick={() => removeKR(kr.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={kr.target} onChange={e => updateKR(kr.id, 'target', e.target.value)} placeholder="Target" className="px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                <input value={kr.current} onChange={e => updateKR(kr.id, 'current', e.target.value)} placeholder="Current" className="px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                <input type="number" min={0} max={100} value={kr.progress} onChange={e => updateKR(kr.id, 'progress', Number(e.target.value))} placeholder="%" className="px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>
          ))}
          {form.keyResults.length === 0 && (
            <div className="text-xs text-slate-400 text-center py-3 border border-dashed border-slate-200 rounded-lg">
              No key results yet — click "Add KR" to add one
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Save Goal
        </button>
      </div>
    </form>
  );
}
