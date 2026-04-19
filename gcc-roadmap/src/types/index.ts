export type TeamType = 'Engineering' | 'QA' | 'Product Support' | 'Cross-functional';
export type StatusType = 'not_started' | 'in_progress' | 'at_risk' | 'completed';
export type PriorityType = 'critical' | 'high' | 'medium' | 'low';
export type QuarterType = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'All Year';

export interface KeyResult {
  id: string;
  description: string;
  target: string;
  current: string;
  progress: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  team: TeamType;
  year: number;
  quarter: QuarterType;
  status: StatusType;
  owner: string;
  progress: number;
  keyResults: KeyResult[];
  createdAt: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  goalId: string;
  team: TeamType;
  owner: string;
  status: StatusType;
  priority: PriorityType;
  startDate: string;
  endDate: string;
  progress: number;
  tags: string[];
}

export interface TeamStat {
  team: TeamType;
  headcount: number;
  color: string;
  bgColor: string;
  textColor: string;
}

export const TEAMS: TeamStat[] = [
  { team: 'Engineering', headcount: 60, color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { team: 'QA', headcount: 60, color: '#8B5CF6', textColor: 'text-purple-700', bgColor: 'bg-purple-100' },
  { team: 'Product Support', headcount: 10, color: '#10B981', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { team: 'Cross-functional', headcount: 0, color: '#F59E0B', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
];

export const STATUS_LABELS: Record<StatusType, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  at_risk: 'At Risk',
  completed: 'Completed',
};

export const PRIORITY_LABELS: Record<PriorityType, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
