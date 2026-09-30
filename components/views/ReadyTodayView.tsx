import React, { useState, useMemo } from 'react';
import { TaskWithDependencyState, TaskStatus } from '@/types/punchlist';
import { TaskCard } from '../TaskCard';
import { Sparkles, Lock, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReadyTodayViewProps {
  tasks: TaskWithDependencyState[];
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
  onSwitchToWaitingTab: () => void;
}

export function ReadyTodayView({
  tasks,
  onOpenDetails,
  onQuickStatusChange,
  onSwitchToWaitingTab,
}: ReadyTodayViewProps) {
  const [selectedTrade, setSelectedTrade] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');

  // Filter tasks that are ready to work today:
  // Must NOT have unsatisfied blockers, and must NOT be 'done'
  const readyTasks = useMemo(() => {
    return tasks.filter((t) => {
      const hasBlockers = t.unsatisfiedBlockers.length > 0;
      const isDone = t.effectiveStatus === 'done';
      return !hasBlockers && !isDone;
    });
  }, [tasks]);

  const lockedTasksCount = useMemo(() => {
    return tasks.filter((t) => t.unsatisfiedBlockers.length > 0 && t.effectiveStatus !== 'done').length;
  }, [tasks]);

  const waitingOnCount = useMemo(() => {
    return tasks.filter((t) => t.waiting_on?.isWaiting && t.effectiveStatus !== 'done').length;
  }, [tasks]);

  // Unique Trades and Rooms among ready tasks
  const trades = useMemo(() => {
    const set = new Set<string>();
    readyTasks.forEach((t) => set.add(t.trade));
    return ['All', ...Array.from(set)];
  }, [readyTasks]);

  const rooms = useMemo(() => {
    const set = new Set<string>();
    readyTasks.forEach((t) => set.add(t.room));
    return ['All', ...Array.from(set)];
  }, [readyTasks]);

  const filteredTasks = useMemo(() => {
    return readyTasks.filter((t) => {
      if (selectedTrade !== 'All' && t.trade !== selectedTrade) return false;
      if (selectedRoom !== 'All' && t.room !== selectedRoom) return false;
      return true;
    });
  }, [readyTasks, selectedTrade, selectedRoom]);

  return (
    <div className="space-y-6">
      {/* Banner / Overview Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Ready to Work Today
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Zero blockers. All prerequisite dependencies are satisfied. Trades can mobilize and execute these tasks on-site right now.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-center">
              <div className="text-lg sm:text-xl font-extrabold text-teal-300">{readyTasks.length}</div>
              <div className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">Unblocked & Ready</div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-rose-950/30 border border-rose-900/30 text-center">
              <div className="text-lg sm:text-xl font-extrabold text-rose-300">{lockedTasksCount}</div>
              <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">Hard Locked</div>
            </div>

            {waitingOnCount > 0 && (
              <button
                type="button"
                onClick={onSwitchToWaitingTab}
                className="px-3.5 py-2 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-900/40 text-center transition-colors cursor-pointer"
              >
                <div className="text-lg sm:text-xl font-extrabold text-amber-300">{waitingOnCount}</div>
                <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Waiting On</div>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Trade:
            </span>
            {trades.map((trade) => (
              <button
                key={trade}
                type="button"
                onClick={() => setSelectedTrade(trade)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTrade === trade
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>

          {rooms.length > 2 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Room:</span>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No tasks currently ready in this filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {readyTasks.length === 0
              ? 'All uncompleted tasks are either locked by prerequisites or awaiting external materials. Check the Burndown or Waiting On tab.'
              : 'Try clearing the trade or room filter above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpenDetails={onOpenDetails}
              onQuickStatusChange={onQuickStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
