export type TaskStatus = 'blocked' | 'ready' | 'in_progress' | 'pending_external' | 'done';
export type OwnerRole = 'Jay' | 'Joe' | 'Trade' | 'Supplier' | 'Township';

export interface TaskNote {
  id: string;
  author: 'Jay' | 'Joe';
  timestamp: string;
  text: string;
  createdAt?: string;
}

export interface WaitingOnMetadata {
  owner: OwnerRole | string;
  description: string;
  target_date?: string;
  // Optional backwards compatibility fields
  targetDate?: string;
  isWaiting?: boolean;
  urgency?: 'critical' | 'standard' | 'low';
}

export interface Task {
  id: string;
  title: string;
  room: string;
  trade: string;
  outcome: string;
  blocked_by: string[];
  unlocks: string[];
  status: TaskStatus;
  waiting_on?: WaitingOnMetadata;
  dismissed_until?: string;
  notes: TaskNote[];
  // Backwards compatibility for UI and metadata
  description?: string;
  priority?: Priority;
  assigned_to?: 'Jay' | 'Joe' | string;
  createdAt?: string;
  updatedAt?: string;
}

// Aliases for seamless codebase integration
export type PunchTask = Task;
export type FieldNote = TaskNote;
export type UserRole = 'Jay' | 'Joe';
export type WaitingOnOwner = OwnerRole | string;
export type Priority = 'high' | 'medium' | 'low';

export interface TaskWithDependencyState extends Task {
  effectiveStatus: TaskStatus; // If any blocker is incomplete, effectiveStatus is 'blocked' (unless already 'done')
  unsatisfiedBlockers: Task[];
  dependentTasks: Task[]; // Tasks that this task is currently blocking
}

export type ViewTab = 'ready_today' | 'burndown' | 'waiting_on' | 'all_tasks';

