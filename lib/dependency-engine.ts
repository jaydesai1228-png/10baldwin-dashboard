import { PunchTask, TaskStatus, TaskWithDependencyState } from '@/types/punchlist';

/**
 * Computes the live dependency graph for all punch list tasks.
 * Hard Blocker / Unlock Engine:
 * - If any task in `blocked_by` is NOT 'done', this task is strictly locked as 'blocked'.
 * - When all prerequisites are 'done', the task unlocks to 'ready' (unless already 'in_progress' or 'pending_external').
 * - Also computes downstream dependents (tasks waiting on this task).
 */
export function computeDependencyGraph(tasks: PunchTask[]): TaskWithDependencyState[] {
  const taskMap = new Map<string, PunchTask>();
  tasks.forEach((t) => taskMap.set(t.id, t));

  // Build reverse dependency lookup: blockerId -> list of dependent tasks
  const downstreamMap = new Map<string, PunchTask[]>();
  tasks.forEach((t) => {
    (t.blocked_by || []).forEach((blockerId) => {
      const existing = downstreamMap.get(blockerId) || [];
      existing.push(t);
      downstreamMap.set(blockerId, existing);
    });
  });

  return tasks.map((task) => {
    const blockers = (task.blocked_by || [])
      .map((id) => taskMap.get(id))
      .filter((b): b is PunchTask => b !== undefined);

    const unsatisfiedBlockers = blockers.filter((b) => b.status !== 'done');
    const isHardBlocked = unsatisfiedBlockers.length > 0;

    let effectiveStatus: TaskStatus = task.status;

    if (task.status === 'done') {
      effectiveStatus = 'done';
    } else if (isHardBlocked) {
      effectiveStatus = 'blocked';
    } else {
      // All blockers are satisfied (or no blockers)
      if (task.status === 'blocked') {
        // Automatically unlock previously blocked tasks to 'ready'
        effectiveStatus = 'ready';
      } else {
        effectiveStatus = task.status;
      }
    }

    const dependentTasks = downstreamMap.get(task.id) || [];

    return {
      ...task,
      status: effectiveStatus,
      effectiveStatus,
      unsatisfiedBlockers,
      dependentTasks,
    };
  });
}

export interface ProgressSummary {
  total: number;
  done: number;
  inProgress: number;
  ready: number;
  blocked: number;
  pendingExternal: number;
  percentComplete: number;
}

export interface GroupProgress {
  name: string;
  total: number;
  done: number;
  inProgress: number;
  blocked: number;
  percentComplete: number;
}

export function calculateBurndownAnalytics(tasks: TaskWithDependencyState[]) {
  const total = tasks.length;
  if (total === 0) {
    return {
      overall: {
        total: 0,
        done: 0,
        inProgress: 0,
        ready: 0,
        blocked: 0,
        pendingExternal: 0,
        percentComplete: 0,
      },
      byOutcome: [],
      byRoom: [],
      byTrade: [],
    };
  }

  let done = 0;
  let inProgress = 0;
  let ready = 0;
  let blocked = 0;
  let pendingExternal = 0;

  const outcomeMap = new Map<string, { total: number; done: number; inProgress: number; blocked: number }>();
  const roomMap = new Map<string, { total: number; done: number; inProgress: number; blocked: number }>();
  const tradeMap = new Map<string, { total: number; done: number; inProgress: number; blocked: number }>();

  tasks.forEach((task) => {
    if (task.effectiveStatus === 'done') done++;
    else if (task.effectiveStatus === 'in_progress') inProgress++;
    else if (task.effectiveStatus === 'ready') ready++;
    else if (task.effectiveStatus === 'blocked') blocked++;
    else if (task.effectiveStatus === 'pending_external') pendingExternal++;

    // Helper for groupings
    const bump = (map: Map<string, { total: number; done: number; inProgress: number; blocked: number }>, key: string) => {
      const curr = map.get(key) || { total: 0, done: 0, inProgress: 0, blocked: 0 };
      curr.total++;
      if (task.effectiveStatus === 'done') curr.done++;
      else if (task.effectiveStatus === 'in_progress') curr.inProgress++;
      else if (task.effectiveStatus === 'blocked') curr.blocked++;
      map.set(key, curr);
    };

    bump(outcomeMap, task.outcome || 'General');
    bump(roomMap, task.room || 'General');
    bump(tradeMap, task.trade || 'General');
  });

  const toSortedGroup = (map: Map<string, { total: number; done: number; inProgress: number; blocked: number }>): GroupProgress[] => {
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        total: data.total,
        done: data.done,
        inProgress: data.inProgress,
        blocked: data.blocked,
        percentComplete: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  };

  return {
    overall: {
      total,
      done,
      inProgress,
      ready,
      blocked,
      pendingExternal,
      percentComplete: Math.round((done / total) * 100),
    },
    byOutcome: toSortedGroup(outcomeMap),
    byRoom: toSortedGroup(roomMap),
    byTrade: toSortedGroup(tradeMap),
  };
}
