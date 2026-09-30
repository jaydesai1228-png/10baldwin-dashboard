import React, { useState, useMemo } from 'react';
import { TaskWithDependencyState, TaskStatus } from '@/types/punchlist';
import { TaskCard } from '../TaskCard';
import {
  Sparkles,
  Lock,
  Hourglass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Wrench,
  LayoutGrid,
} from 'lucide-react';

interface ReadyTodayViewProps {
  tasks: TaskWithDependencyState[];
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
  onSwitchToWaitingTab: () => void;
}

type GroupByMode = 'room' | 'trade' | 'none';

export function ReadyTodayView({
  tasks,
  onOpenDetails,
  onQuickStatusChange,
  onSwitchToWaitingTab,
}: ReadyTodayViewProps) {
  const [groupBy, setGroupBy] = useState<GroupByMode>('room');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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
    return tasks.filter(
      (t) => (Boolean(t.waiting_on) && t.waiting_on?.isWaiting !== false) && t.effectiveStatus !== 'done'
    ).length;
  }, [tasks]);

  // Grouped tasks
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return [{ groupName: 'All Ready Tasks', items: readyTasks }];
    }

    const groups: Record<string, TaskWithDependencyState[]> = {};
    readyTasks.forEach((task) => {
      const key = groupBy === 'room' ? task.room || 'General' : task.trade || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });

    return Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([groupName, items]) => ({ groupName, items }));
  }, [readyTasks, groupBy]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Clear Metrics */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Prerequisite Blockers</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Ready to Work Today
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every prerequisite dependency for these tasks is satisfied. Trades and subs can mobilize and execute these items immediately on-site at 10 Baldwin.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Ready to Work Today */}
            <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[130px] shadow-xs">
              <div className="text-2xl md:text-3xl font-black text-emerald-700">{readyTasks.length}</div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide mt-0.5">Ready Now</div>
            </div>

            {/* Hard Locked */}
            <div className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-center min-w-[120px] shadow-xs">
              <div className="text-2xl md:text-3xl font-black text-rose-700">{lockedTasksCount}</div>
              <div className="text-xs font-bold text-rose-800 uppercase tracking-wide mt-0.5">Locked</div>
            </div>

            {/* Waiting On External */}
            {waitingOnCount > 0 && (
              <button
                type="button"
                onClick={onSwitchToWaitingTab}
                className="px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-center min-w-[130px] shadow-xs transition-colors cursor-pointer text-left"
              >
                <div className="text-2xl md:text-3xl font-black text-purple-700 flex items-center justify-between">
                  <span>{waitingOnCount}</span>
                  <Hourglass className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-xs font-bold text-purple-800 uppercase tracking-wide mt-0.5">Chasing</div>
              </button>
            )}
          </div>
        </div>

        {/* View Controls & Grouping Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Group by:</span>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setGroupBy('room')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  groupBy === 'room'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Room</span>
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('trade')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  groupBy === 'trade'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-sky-600" />
                <span>Trade</span>
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('none')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  groupBy === 'none'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                <span>Flat List</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span>Tip: </span>
            <strong className="text-slate-700">Double-click any card</strong> to view field notes & dependencies
          </div>
        </div>
      </div>

      {/* Grouped Tasks Lists with Collapsible Headers */}
      {readyTasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl p-8 space-y-3 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">All uncompleted tasks are currently locked</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The active items are either awaiting trade prerequisites or external material deliveries. Check the &ldquo;Waiting On / Chasing&rdquo; tab to unblock downstream work.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTasks.map(({ groupName, items }) => {
            const isCollapsed = collapsedGroups[groupName];

            return (
              <div key={groupName} className="space-y-3">
                {/* Group Header (Clickable to Collapse/Expand) */}
                {groupBy !== 'none' && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupName)}
                    className="w-full flex items-center justify-between p-3.5 px-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      {groupBy === 'room' ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                          <MapPin className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200">
                          <Wrench className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {groupName}
                        </h3>
                      </div>
                      <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {items.length} ready
                      </span>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-700">
                      {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </div>
                  </button>
                )}

                {/* Group Cards Grid */}
                {!isCollapsed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((task) => (
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
          })}
        </div>
      )}
    </div>
  );
}
