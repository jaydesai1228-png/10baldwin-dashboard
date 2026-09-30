import React from 'react';
import { TaskWithDependencyState, TaskStatus, UserRole } from '@/types/punchlist';
import { StatusBadge } from './StatusBadge';
import {
  Lock,
  Zap,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Wrench,
  Hourglass,
  Play,
  RotateCcw,
  Check,
  Calendar,
  Clock,
  Globe,
  HardHat,
  User,
} from 'lucide-react';

interface TaskCardProps {
  task: TaskWithDependencyState;
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
  onSnooze?: (taskId: string, days?: number) => void;
  onUnsnooze?: (taskId: string) => void;
  activeRole?: UserRole;
}

export function TaskCard({ task, onOpenDetails, onQuickStatusChange, onSnooze, onUnsnooze, activeRole = 'Jay' }: TaskCardProps) {
  const isHardBlocked = task.unsatisfiedBlockers.length > 0;
  const isDone = task.effectiveStatus === 'done';
  const isInProgress = task.effectiveStatus === 'in_progress';
  const isReady = task.effectiveStatus === 'ready';
  const isJay = activeRole === 'Jay';

  const isWaiting = Boolean(task.waiting_on && task.waiting_on.isWaiting !== false);

  const priorityBadge = {
    high: 'text-rose-700 bg-rose-50 border-rose-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    low: 'text-slate-600 bg-slate-100 border-slate-200',
  }[task.priority || 'medium'];

  const latestNote = task.notes && task.notes.length > 0 ? task.notes[task.notes.length - 1] : null;

  return (
    <div
      onClick={() => onOpenDetails(task)}
      onDoubleClick={() => onOpenDetails(task)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-5 flex flex-col justify-between ${
        isDone
          ? 'bg-slate-50/80 border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300 shadow-xs'
          : isHardBlocked
          ? 'bg-white border-rose-200/80 hover:border-rose-300 hover:ring-2 hover:ring-rose-50 hover:shadow-md'
          : isJay
          ? 'bg-white border-slate-200 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 hover:shadow-md'
          : 'bg-white border-slate-200 hover:border-amber-400 hover:ring-2 hover:ring-amber-100 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header Row: Room & Trade Tags + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {/* Task ID tag */}
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {task.id}
            </span>

            {/* Room Tag */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{task.room}</span>
            </span>

            {/* Trade Tag */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <Wrench className="w-3 h-3 text-sky-600 shrink-0" />
              <span>{task.trade}</span>
            </span>

            {/* Priority (if high) */}
            {task.priority === 'high' && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityBadge}`}>
                HIGH
              </span>
            )}

            {/* Snoozed Tag (if active) */}
            {Boolean(task.dismissed_until && new Date(task.dismissed_until).getTime() > Date.now()) && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Snoozed 3d</span>
              </span>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <StatusBadge
              status={task.effectiveStatus}
              isHardBlocked={isHardBlocked}
              blockedCount={task.unsatisfiedBlockers.length}
            />
          </div>
        </div>

        {/* Task Title with Quick-Complete Checkbox */}
        <div className="flex items-start gap-3 mb-2.5">
          {/* Quick Status Checkbox */}
          <button
            type="button"
            title={
              isDone
                ? 'Reopen task'
                : isHardBlocked
                ? 'Task locked by dependencies'
                : isInProgress
                ? 'Mark as completed'
                : 'Mark as in progress'
            }
            onClick={(e) => {
              e.stopPropagation();
              if (isDone) {
                onQuickStatusChange(task.id, 'ready');
              } else if (isHardBlocked) {
                onOpenDetails(task);
              } else if (isInProgress) {
                onQuickStatusChange(task.id, 'done');
              } else {
                onQuickStatusChange(task.id, 'in_progress');
              }
            }}
            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
              isDone
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : isHardBlocked
                ? 'bg-rose-50 border-rose-300 text-rose-400 cursor-not-allowed'
                : isInProgress
                ? isJay
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                  : 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs'
                : isJay
                ? 'bg-white border-slate-300 text-transparent hover:border-indigo-500 hover:text-indigo-500'
                : 'bg-white border-slate-300 text-transparent hover:border-amber-500 hover:text-amber-500'
            }`}
          >
            {isDone ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : isHardBlocked ? (
              <Lock className="w-3 h-3 stroke-[2.5]" />
            ) : isInProgress ? (
              <Play className="w-2.5 h-2.5 fill-white" />
            ) : (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            )}
          </button>

          {/* Title - Fully Wrapped & Legible */}
          <h3
            className={`text-base md:text-lg font-semibold leading-snug tracking-tight break-words whitespace-normal transition-colors ${
              isDone
                ? 'line-through text-slate-400'
                : isJay
                ? 'text-slate-900 group-hover:text-indigo-900'
                : 'text-slate-900 group-hover:text-amber-900'
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Task Description (if any) - fully wrapped without truncation */}
        {task.description && (
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3.5 break-words whitespace-normal pl-8">
            {task.description}
          </p>
        )}

        {/* Waiting On External Bottleneck Alert Banner (Purple Jobsite Callout) */}
        {isWaiting && task.waiting_on && (
          <div className="mb-3.5 p-3 rounded-xl bg-purple-50/90 border border-purple-200 text-purple-900 text-xs md:text-sm flex items-start gap-2.5 shadow-xs">
            <Hourglass className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 break-words whitespace-normal">
              <span className="font-bold text-purple-950">
                Waiting on {task.waiting_on.owner}:
              </span>{' '}
              <span className="text-purple-900 leading-relaxed">
                {task.waiting_on.description}
              </span>
              {task.waiting_on.targetDate && (
                <div className="flex items-center gap-1.5 text-purple-700 font-medium text-xs mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Date: {task.waiting_on.targetDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blocker Alert Banner (if locked by dependencies) */}
        {isHardBlocked && (
          <div className="mb-3.5 p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 text-xs md:text-sm flex items-start gap-2.5 shadow-xs">
            <Lock className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 break-words whitespace-normal">
              <span className="font-bold text-rose-950">
                Blocked by {task.unsatisfiedBlockers.length} incomplete item{task.unsatisfiedBlockers.length > 1 ? 's' : ''}:
              </span>
              <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-rose-800">
                {task.unsatisfiedBlockers.map((b) => (
                  <li key={b.id} className="break-words whitespace-normal">
                    <span className="font-semibold text-rose-900">{b.title}</span> ({b.room})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Downstream Unlocks Notice */}
        {!isDone && task.dependentTasks.length > 0 && (
          <div className="mb-3.5 px-3 py-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="break-words whitespace-normal text-xs text-amber-950">
              <strong className="font-bold">Unlocks {task.dependentTasks.length} downstream item{task.dependentTasks.length > 1 ? 's' : ''}:</strong>{' '}
              {task.dependentTasks.map((d) => d.title).join(', ')}
            </span>
          </div>
        )}

        {/* Latest Field Note Preview */}
        {latestNote && (
          <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
            <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1 break-words whitespace-normal">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                <span
                  className={`font-semibold px-2 py-0.2 rounded ${
                    latestNote.author === 'Joe'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {latestNote.author} {latestNote.author === 'Joe' ? '(GC)' : '(Homeowner)'}
                </span>
                <span>•</span>
                <span>
                  {new Date(
                    latestNote.timestamp || latestNote.createdAt || Date.now()
                  ).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-normal">{latestNote.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Bottom Bar & Quick Actions */}
      <div
        className="pt-3.5 mt-1 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {task.task_owner && (
            <span className="inline-flex items-center gap-1 font-bold text-[11px]">
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
          {task.outcome && (
            <span className="hidden sm:inline text-slate-400">
              • {task.outcome}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick status switch buttons */}
          {isDone ? (
            <button
              type="button"
              onClick={() => onQuickStatusChange(task.id, 'ready')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reopen</span>
            </button>
          ) : isHardBlocked ? (
            <button
              type="button"
              onClick={() => onOpenDetails(task)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>View Blockers</span>
            </button>
          ) : isInProgress ? (
            <button
              type="button"
              onClick={() => onQuickStatusChange(task.id, 'done')}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onQuickStatusChange(task.id, 'in_progress')}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg shadow-xs transition-colors ${
                isJay
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <Play className={`w-3 h-3 ${isJay ? 'fill-white' : 'fill-slate-950'}`} />
              <span>Start</span>
            </button>
          )}

          {/* Open Details button */}
          <button
            type="button"
            onClick={() => onOpenDetails(task)}
            title="Open task details drawer (or double-click card)"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
