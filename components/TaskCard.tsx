import React from 'react';
import { TaskWithDependencyState, TaskStatus } from '@/types/punchlist';
import { StatusBadge } from './StatusBadge';
import {
  Lock,
  Zap,
  Clock,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Wrench,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface TaskCardProps {
  task: TaskWithDependencyState;
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onOpenDetails, onQuickStatusChange }: TaskCardProps) {
  const isHardBlocked = task.unsatisfiedBlockers.length > 0;
  const isDone = task.effectiveStatus === 'done';

  const priorityColors = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  const latestNote = task.notes && task.notes.length > 0 ? task.notes[task.notes.length - 1] : null;

  return (
    <div
      onClick={() => onOpenDetails(task)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col justify-between ${
        isDone
          ? 'bg-slate-900/40 border-slate-800/60 opacity-75 hover:opacity-100 hover:border-slate-700'
          : isHardBlocked
          ? 'bg-slate-900/60 border-rose-900/30 hover:border-rose-700/60 hover:shadow-lg hover:shadow-rose-950/20'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/50'
      }`}
    >
      <div>
        {/* Top Badges / Metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
              {task.id}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                priorityColors[task.priority || 'medium'] || priorityColors.medium
              }`}
            >
              {(task.priority || 'medium').toUpperCase()}
            </span>
          </div>

          <StatusBadge
            status={task.effectiveStatus}
            isHardBlocked={isHardBlocked}
            blockedCount={task.unsatisfiedBlockers.length}
          />
        </div>

        {/* Task Title */}
        <h3
          className={`text-base font-semibold leading-snug tracking-tight mb-2 group-hover:text-amber-300 transition-colors ${
            isDone ? 'line-through text-slate-400' : 'text-slate-100'
          }`}
        >
          {task.title}
        </h3>

        {/* Room, Trade, Outcome Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
            <MapPin className="w-3 h-3 text-amber-400" />
            {task.room}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
            <Wrench className="w-3 h-3 text-sky-400" />
            {task.trade}
          </span>
          {task.outcome && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-800">
              {task.outcome}
            </span>
          )}
        </div>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Blocker Alert Banner */}
        {isHardBlocked && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 mt-0.5 text-rose-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-rose-200">
                Blocked by {task.unsatisfiedBlockers.length} incomplete item{task.unsatisfiedBlockers.length > 1 ? 's' : ''}:
              </span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-300/90 truncate">
                {task.unsatisfiedBlockers.map((b) => (
                  <li key={b.id} className="truncate">
                    <span className="font-mono font-medium">{b.id}:</span> {b.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Downstream Unlock Banner */}
        {!isDone && task.dependentTasks.length > 0 && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-amber-950/30 border border-amber-800/30 text-amber-300 text-xs flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate text-[11px]">
              <span className="font-semibold text-amber-200">Unlocks {task.dependentTasks.length} downstream item{task.dependentTasks.length > 1 ? 's' : ''}</span>
              {task.dependentTasks.length === 1 ? ` (${task.dependentTasks[0].title})` : ''}
            </span>
          </div>
        )}

        {/* Waiting On Pill */}
        {task.waiting_on && task.waiting_on.isWaiting !== false && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-orange-950/40 border border-orange-700/40 text-orange-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 text-orange-400 shrink-0" />
            <div className="text-[11px]">
              <span className="font-semibold text-orange-200">Waiting on {task.waiting_on.owner}:</span>{' '}
              <span>{task.waiting_on.description}</span>
              {task.waiting_on.targetDate && (
                <span className="ml-1 text-orange-400 font-mono">
                  (Target: {task.waiting_on.targetDate})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Latest Field Note Preview */}
        {latestNote && (
          <div className="mb-3 px-2.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-slate-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                <span
                  className={`font-semibold px-1.5 py-0.2 rounded ${
                    latestNote.author === 'Joe' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                  }`}
                >
                  {latestNote.author}
                </span>
                <span>•</span>
                <span>
                  {new Date(
                    latestNote.timestamp || latestNote.createdAt || Date.now()
                  ).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">{latestNote.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Quick Actions */}
      <div
        className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px]">Assigned:</span>
          <span className="font-semibold text-slate-300">{task.assigned_to || 'GC'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Status Toggles */}
          {isDone ? (
            <button
              type="button"
              onClick={() => onQuickStatusChange(task.id, 'ready')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reopen
            </button>
          ) : isHardBlocked ? (
            <button
              type="button"
              onClick={() => onOpenDetails(task)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              <Lock className="w-3 h-3" />
              Locked
            </button>
          ) : task.effectiveStatus === 'in_progress' ? (
            <button
              type="button"
              onClick={() => onQuickStatusChange(task.id, 'done')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onQuickStatusChange(task.id, 'in_progress')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-sky-400" />
              Start
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(task)}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Open Details Drawer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
