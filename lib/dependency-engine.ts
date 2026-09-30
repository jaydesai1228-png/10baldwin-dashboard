import { PunchTask, TaskStatus, TaskWithDependencyState } from '@/types/punchlist';

/**
 * Computes the live dependency graph for all punch list tasks.
 * Hard Blocker / Unlock Engine:
 * - If any task in `blocked_by` is NOT 'done', this task is strictly locked as 'blocked'.
 * - When all prerequisites are 'done', tasks that were blocked by dependencies unlock to 'ready'.
 * - Supports both `blocked_by` and explicit `unlocks` mappings.
 */
export function computeDependencyGraph(tasks: PunchTask[]): TaskWithDependencyState[] {
  const taskMap = new Map<string, PunchTask>();
  tasks.forEach((t) => taskMap.set(t.id, t));

  // Build reverse downstream dependency lookup: blockerId -> list of dependent tasks
  const downstreamMap = new Map<string, Map<string, PunchTask>>();

  tasks.forEach((t) => {
    // 1. From blocked_by: this task `t` is downstream of blockerId
    (t.blocked_by || []).forEach((blockerId) => {
      const map = downstreamMap.get(blockerId) || new Map<string, PunchTask>();
      map.set(t.id, t);
      downstreamMap.set(blockerId, map);
    });

    // 2. From unlocks: tasks listed in t.unlocks are downstream of `t`
    (t.unlocks || []).forEach((unlockId) => {
      const target = taskMap.get(unlockId);
      if (target) {
        const map = downstreamMap.get(t.id) || new Map<string, PunchTask>();
        map.set(target.id, target);
        downstreamMap.set(t.id, map);
      }
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
      if (task.status === 'blocked' && (task.blocked_by || []).length > 0) {
        // Automatically unlock tasks whose prerequisites have now completed
        effectiveStatus = 'ready';
      } else {
        effectiveStatus = task.status;
      }
    }

    const dependentMap = downstreamMap.get(task.id);
    const dependentTasks = dependentMap ? Array.from(dependentMap.values()) : [];

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

/**
 * Checks whether an item is actively snoozed.
 * Filter criteria: item is not actively snoozed (!task.dismissed_until || new Date(task.dismissed_until) <= new Date()).
 */
export function isActivelySnoozed(task: PunchTask | TaskWithDependencyState): boolean {
  if (!task.dismissed_until) return false;
  const dismissTime = new Date(task.dismissed_until).getTime();
  return !isNaN(dismissTime) && dismissTime > Date.now();
}

/**
 * Move-In Milestone: Hard deadline is November 15, 2026.
 * Dynamic countdown: Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24))
 */
export function calculateMoveInCountdown(targetDate: Date = new Date('2026-11-15T00:00:00')): {
  daysLeft: number;
  targetFormatted: string;
  isPast: boolean;
} {
  const now = Date.now();
  const diffTime = targetDate.getTime() - now;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    daysLeft,
    targetFormatted: 'Nov 15, 2026',
    isPast: daysLeft < 0,
  };
}

/**
 * Top 3 Critical Focus Queues for Jay and Joe.
 * Criteria:
 * - Status is not 'done'
 * - Item is not actively snoozed (!task.dismissed_until || new Date(task.dismissed_until) <= new Date())
 *
 * Allocation:
 * - Jay's Queue: task.waiting_on?.owner === 'Jay' or trade is procurement/selection.
 * - Joe's Queue: task.waiting_on?.owner === 'Joe' or physical on-site gating blocker.
 */
export function getTopFocusQueues(tasks: TaskWithDependencyState[]) {
  const notDone = tasks.filter((t) => t.effectiveStatus !== 'done');

  const activeTasks = notDone.filter((t) => !isActivelySnoozed(t));
  const snoozedTasks = notDone.filter((t) => isActivelySnoozed(t));

  const isJayItem = (t: TaskWithDependencyState): boolean => {
    if (t.task_owner === 'Jay' || t.task_owner === 'Purvi') return true;
    if (t.waiting_on?.owner === 'Jay' || t.waiting_on?.owner === 'Purvi') return true;
    if (t.assigned_to === 'Jay') return true;
    const trade = (t.trade || '').toLowerCase();
    const title = (t.title || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    return (
      trade.includes('procurement') ||
      trade.includes('selection') ||
      trade.includes('design') ||
      title.includes('select') ||
      title.includes('order') ||
      title.includes('finalize') ||
      title.includes('decide') ||
      desc.includes('select') ||
      desc.includes('order')
    );
  };

  const isJoeItem = (t: TaskWithDependencyState): boolean => {
    if (t.task_owner === 'Joe') return true;
    if (t.waiting_on?.owner === 'Joe') return true;
    if (t.assigned_to === 'Joe') return true;
    // Physical on-site gating blocker: unblocks other tasks or has dependent downstream tasks
    const isGating = (t.unlocks && t.unlocks.length > 0) || t.dependentTasks.length > 0;
    const trade = (t.trade || '').toLowerCase();
    const isOnSite = /stucco|framing|plumbing|hvac|drywall|tile|carpentry|electrical|excavation|septic|gutters|waterproofing|flooring|stone/i.test(trade);
    return isGating || isOnSite;
  };

  // Ranking function:
  // 1. Ready tasks (ready or in_progress) come before blocked tasks
  // 2. High downstream blocker impact (more dependent tasks or unlocks) comes first
  const rankComparator = (a: TaskWithDependencyState, b: TaskWithDependencyState) => {
    const aReady = a.effectiveStatus === 'ready' || a.effectiveStatus === 'in_progress';
    const bReady = b.effectiveStatus === 'ready' || b.effectiveStatus === 'in_progress';
    if (aReady && !bReady) return -1;
    if (!aReady && bReady) return 1;

    const aDownstream = (a.dependentTasks?.length || 0) + (a.unlocks?.length || 0);
    const bDownstream = (b.dependentTasks?.length || 0) + (b.unlocks?.length || 0);
    if (bDownstream !== aDownstream) return bDownstream - aDownstream;

    return a.id.localeCompare(b.id);
  };

  const sortedActive = [...activeTasks].sort(rankComparator);

  const jayEligible = sortedActive.filter(isJayItem);
  const joeEligible = sortedActive.filter(isJoeItem);

  const jayTop3 = jayEligible.slice(0, 3);
  const joeTop3 = joeEligible.slice(0, 3);

  const jaySnoozed = snoozedTasks.filter(isJayItem);
  const joeSnoozed = snoozedTasks.filter(isJoeItem);

  return {
    jayTop3,
    joeTop3,
    jayEligible,
    joeEligible,
    jaySnoozed,
    joeSnoozed,
    allSnoozed: snoozedTasks,
  };
}
