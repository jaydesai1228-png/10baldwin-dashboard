export type TaskStatus = 'ready' | 'in_progress' | 'pending_external' | 'blocked' | 'done';

export type UserRole = 'Jay' | 'Joe';

export type WaitingOnOwner =
  | 'Jay'
  | 'Joe'
  | 'Trade'
  | 'Supplier'
  | 'Township'
  | 'Architect'
  | 'Other';

export type Priority = 'high' | 'medium' | 'low';

export interface FieldNote {
  id: string;
  author: UserRole;
  text: string;
  createdAt?: string;
  timestamp?: string;
}

export interface WaitingOnMetadata {
  owner: WaitingOnOwner | string;
  description: string;
  isWaiting?: boolean;
  targetDate?: string;
  urgency?: 'critical' | 'standard' | 'low';
}

export interface PunchTask {
  id: string;
  title: string;
  description?: string;
  room: string;
  trade: string;
  outcome: string;
  status: TaskStatus;
  priority?: Priority;
  blocked_by: string[]; // List of task IDs that must be completed ('done') before this task can be worked on
  unlocks?: string[]; // Downstream tasks this task will unlock
  waiting_on?: WaitingOnMetadata;
  notes: FieldNote[];
  assigned_to?: 'Jay' | 'Joe' | string;
  createdAt?: string;
  updatedAt?: string;
}

export type Task = PunchTask;

export interface TaskWithDependencyState extends PunchTask {
  effectiveStatus: TaskStatus; // If any blocker is incomplete, effectiveStatus is 'blocked' (unless already 'done')
  unsatisfiedBlockers: PunchTask[];
  dependentTasks: PunchTask[]; // Tasks that this task is currently blocking
}

export type ViewTab = 'ready_today' | 'burndown' | 'waiting_on' | 'all_tasks';
