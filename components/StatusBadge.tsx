import React from 'react';
import { TaskStatus } from '@/types/punchlist';
import { CheckCircle2, Lock, PlayCircle, Hourglass, ArrowRightCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  isHardBlocked?: boolean;
  blockedCount?: number;
  className?: string;
}

export function StatusBadge({
  status,
  isHardBlocked,
  blockedCount = 0,
  className = '',
}: StatusBadgeProps) {
  if (status === 'done') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
        <span>Done</span>
      </span>
    );
  }

  if (isHardBlocked || status === 'blocked') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
      >
        <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>Blocked {blockedCount > 0 ? `(${blockedCount})` : ''}</span>
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
      >
        <PlayCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>In Progress</span>
      </span>
    );
  }

  if (status === 'pending_external') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 ${className}`}
      >
        <Hourglass className="w-3.5 h-3.5 text-purple-600 shrink-0" />
        <span>Chasing / External</span>
      </span>
    );
  }

  // Default: ready
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
    >
      <ArrowRightCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>Ready to Work</span>
    </span>
  );
}
