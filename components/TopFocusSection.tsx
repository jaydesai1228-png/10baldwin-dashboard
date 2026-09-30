'use client';

import React, { useState } from 'react';
import { TaskWithDependencyState, TaskStatus, UserRole } from '@/types/punchlist';
import {
  Calendar,
  Clock,
  Sparkles,
  User,
  HardHat,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Hourglass,
  Home,
  Globe,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface TopFocusSectionProps {
  activeRole: UserRole;
  focusQueues: {
    jayTop3: TaskWithDependencyState[];
    joeTop3: TaskWithDependencyState[];
    jayEligible: TaskWithDependencyState[];
    joeEligible: TaskWithDependencyState[];
    jaySnoozed: TaskWithDependencyState[];
    joeSnoozed: TaskWithDependencyState[];
    allSnoozed: TaskWithDependencyState[];
  };
  moveInCountdown: {
    daysLeft: number;
    targetFormatted: string;
    isPast: boolean;
  };
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
  onSnooze: (taskId: string, days?: number) => void;
  onUnsnooze: (taskId: string) => void;
  onOpenSequences?: () => void;
}

export function TopFocusSection({
  activeRole,
  focusQueues,
  moveInCountdown,
  onOpenDetails,
  onQuickStatusChange,
  onSnooze,
  onUnsnooze,
  onOpenSequences,
}: TopFocusSectionProps) {
  const isJay = activeRole === 'Jay';

  // Allow user to toggle between viewing Jay's Queue vs Joe's Queue, defaulting to activeRole
  const [selectedQueue, setSelectedQueue] = useState<UserRole>(activeRole);
  const [isSnoozedOpen, setIsSnoozedOpen] = useState(false);

  // Sync selected queue when activeRole changes externally
  React.useEffect(() => {
    setSelectedQueue(activeRole);
  }, [activeRole]);

  const currentTop3 = selectedQueue === 'Jay' ? focusQueues.jayTop3 : focusQueues.joeTop3;
  const currentSnoozed = selectedQueue === 'Jay' ? focusQueues.jaySnoozed : focusQueues.joeSnoozed;
  const totalEligible = selectedQueue === 'Jay' ? focusQueues.jayEligible.length : focusQueues.joeEligible.length;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 transition-all duration-200 bg-white border ${
        isJay
          ? 'border-indigo-200/90 shadow-indigo-100/40'
          : 'border-amber-400/90 shadow-amber-100/40'
      }`}
    >
      {/* Top Header Row: Persona Badge, Title & Move-In Milestone Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {/* Hero Persona Badge */}
            {isJay ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
                <Home className="w-3.5 h-3.5 text-indigo-600" />
                <span>Homeowner Mode (Jay)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-950 border border-amber-400 shadow-2xs">
                <HardHat className="w-3.5 h-3.5 text-amber-600" />
                <span>GC Field Mode (Joe)</span>
              </span>
            )}
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Top 3 Immediate Action Queue</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isJay ? 'text-slate-900' : 'text-zinc-950'}`}>
            Today&apos;s Critical 3
          </h2>
        </div>

        {/* Move-In Hard Milestone Display */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border shadow-2xs transition-all duration-200 ${
              isJay
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 text-indigo-950'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950'
            }`}
          >
            <Calendar className={`w-4 h-4 shrink-0 ${isJay ? 'text-indigo-600' : 'text-amber-600'}`} />
            <div>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isJay ? 'text-indigo-700' : 'text-amber-800'}`}>
                Target Move-In • Nov 15, 2026
              </div>
              <div className="text-sm font-extrabold flex items-center gap-1.5">
                <span className={isJay ? 'text-indigo-800' : 'text-amber-700'}>{moveInCountdown.daysLeft} Days</span>
                <span className="text-slate-400 font-normal text-xs">Remaining</span>
              </div>
            </div>
          </div>

          {onOpenSequences && (
            <button
              type="button"
              onClick={onOpenSequences}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-semibold transition-colors cursor-pointer ${
                isJay
                  ? 'bg-indigo-50/60 hover:bg-indigo-50 border-indigo-200 text-indigo-800'
                  : 'bg-amber-50/60 hover:bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <span>Sequences & Rules</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          )}
        </div>
      </div>

      {/* Queue Selection Tabs (Jay vs Joe) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedQueue('Jay')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedQueue === 'Jay'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Jay&apos;s Focus (Owner Queue)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedQueue === 'Jay' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {focusQueues.jayEligible.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedQueue('Joe')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedQueue === 'Joe'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Joe&apos;s Focus (GC Field Queue)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedQueue === 'Joe' ? 'bg-amber-400 text-zinc-950' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {focusQueues.joeEligible.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Snoozing an item removes it for 3 days and backfills the next task.</span>
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      {currentTop3.length === 0 ? (
        <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">
            {selectedQueue === 'Jay' ? 'Jay' : 'Joe'} has no active items in the focus queue!
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All assigned tasks for this queue are either completed or temporarily snoozed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentTop3.map((task, idx) => {
            const isDone = task.effectiveStatus === 'done';
            const isBlocked = task.unsatisfiedBlockers.length > 0;
            const hasUnlocks = (task.unlocks && task.unlocks.length > 0) || task.dependentTasks.length > 0;
            const isQueueJay = selectedQueue === 'Jay';

            return (
              <div
                key={task.id}
                onDoubleClick={() => onOpenDetails(task)}
                className={`group relative flex flex-col justify-between rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all duration-200 ${
                  isQueueJay
                    ? 'bg-slate-50/70 hover:bg-white border border-indigo-200/90 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100'
                    : 'bg-zinc-50/70 hover:bg-white border border-amber-300/90 hover:border-amber-400 hover:ring-2 hover:ring-amber-100'
                }`}
              >
                {/* Priority Rank Badge & Status Row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shadow-xs font-bold ${
                          isQueueJay ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-zinc-950 font-black'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        {task.id}
                      </span>
                    </div>

                    <StatusBadge status={task.effectiveStatus} />
                  </div>

                  {/* Room, Trade & Accountability Lead Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {task.task_owner && (
                      <span className="inline-flex items-center gap-1 font-bold text-[10px]">
                        {task.task_owner === 'Joe' ? (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                            <HardHat className="w-3 h-3 text-amber-600" /> Joe
                          </span>
                        ) : task.task_owner === 'Jay' ? (
                          <span className="text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                            <User className="w-3 h-3 text-indigo-600" /> Jay
                          </span>
                        ) : task.task_owner === 'Purvi' ? (
                          <span className="text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                            <User className="w-3 h-3 text-rose-600" /> Purvi
                          </span>
                        ) : (
                          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-slate-500" /> External
                          </span>
                        )}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                      {task.room}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                      {task.trade}
                    </span>
                  </div>

                  {/* Title & Description with Full Wrapping */}
                  <div className="space-y-1">
                    <h3
                      className={`text-sm font-bold leading-snug break-words whitespace-normal transition-colors ${
                        isQueueJay ? 'text-slate-900 group-hover:text-indigo-900' : 'text-slate-900 group-hover:text-amber-900'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-normal line-clamp-3">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Waiting On Pill if present */}
                  {task.waiting_on && task.waiting_on.isWaiting !== false && (
                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-900 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1 text-[11px]">
                        <Hourglass className="w-3 h-3 text-purple-600" />
                        <span>Waiting On: {task.waiting_on.owner}</span>
                      </div>
                      <p className="text-[11px] text-purple-800 leading-tight break-words whitespace-normal">
                        {task.waiting_on.description}
                      </p>
                    </div>
                  )}

                  {/* Downstream Unlocks Callout */}
                  {hasUnlocks && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <Zap className="w-3 h-3 text-emerald-600" />
                      <span>
                        Unblocks {(task.unlocks?.length || 0) + (task.dependentTasks?.length || 0)} downstream tasks
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons on Card */}
                <div className="pt-4 mt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  {/* Quick Done / Start Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDone) {
                        onQuickStatusChange(task.id, 'ready');
                      } else {
                        onQuickStatusChange(task.id, 'done');
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isDone
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : isQueueJay
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Snooze 3 Days Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(task.id, 3);
                      }}
                      title="Snooze for 3 days (removes from Top 3 and backfills next item)"
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer ${
                        isQueueJay ? 'hover:border-indigo-300 hover:text-indigo-900' : 'hover:border-amber-300 hover:text-amber-900'
                      }`}
                    >
                      <Clock className={`w-3 h-3 ${isQueueJay ? 'text-indigo-600' : 'text-amber-600'}`} />
                      <span>Snooze 3d</span>
                    </button>

                    {/* Inspect Details Button */}
                    <button
                      type="button"
                      onClick={() => onOpenDetails(task)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collapsed "Snoozed Items" Section */}
      {currentSnoozed.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsSnoozedOpen(!isSnoozedOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">
                Snoozed Items ({currentSnoozed.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Temporarily removed from the Top 3 focus queue
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold group-hover:text-slate-900">
              <span>{isSnoozedOpen ? 'Hide' : 'Show'}</span>
              {isSnoozedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isSnoozedOpen && (
            <div className="mt-3 divide-y divide-slate-100 bg-white border border-slate-200 rounded-2xl p-2 space-y-2">
              {currentSnoozed.map((snoozedTask) => {
                const dismissDate = snoozedTask.dismissed_until
                  ? new Date(snoozedTask.dismissed_until)
                  : null;
                const hoursLeft = dismissDate
                  ? Math.max(0, Math.ceil((dismissDate.getTime() - Date.now()) / (1000 * 60 * 60)))
                  : 0;

                return (
                  <div
                    key={snoozedTask.id}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">
                          {snoozedTask.id}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Snoozed ({hoursLeft}h remaining)
                        </span>
                        <span className="text-[11px] text-slate-500">{snoozedTask.room}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 break-words whitespace-normal">
                        {snoozedTask.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUnsnooze(snoozedTask.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Un-snooze Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenDetails(snoozedTask)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
