import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Goal, Initiative } from '../types';
import { SEED_GOALS, SEED_INITIATIVES } from '../data/seed';

interface AppState {
  goals: Goal[];
  initiatives: Initiative[];
}

interface AppContextValue extends AppState {
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addInitiative: (initiative: Initiative) => void;
  updateInitiative: (initiative: Initiative) => void;
  deleteInitiative: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'gcc-roadmap-state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // ignore
  }
  return { goals: SEED_GOALS, initiatives: SEED_INITIATIVES };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addGoal = useCallback((goal: Goal) => {
    setState(s => ({ ...s, goals: [...s.goals, goal] }));
  }, []);

  const updateGoal = useCallback((goal: Goal) => {
    setState(s => ({ ...s, goals: s.goals.map(g => g.id === goal.id ? goal : g) }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setState(s => ({
      ...s,
      goals: s.goals.filter(g => g.id !== id),
      initiatives: s.initiatives.map(i => i.goalId === id ? { ...i, goalId: '' } : i),
    }));
  }, []);

  const addInitiative = useCallback((initiative: Initiative) => {
    setState(s => ({ ...s, initiatives: [...s.initiatives, initiative] }));
  }, []);

  const updateInitiative = useCallback((initiative: Initiative) => {
    setState(s => ({ ...s, initiatives: s.initiatives.map(i => i.id === initiative.id ? initiative : i) }));
  }, []);

  const deleteInitiative = useCallback((id: string) => {
    setState(s => ({ ...s, initiatives: s.initiatives.filter(i => i.id !== id) }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      addGoal, updateGoal, deleteGoal,
      addInitiative, updateInitiative, deleteInitiative,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
