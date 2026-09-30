import React from 'react';
import { TaskStatus } from '@/types/punchlist';
import { CheckCircle2, Clock, Lock, AlertCircle, PlayCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  isHardBlocked?: boolean;
  blockedCount?: number;
  className?: string;
}

export function StatusBadge({ status, isHardBlocked, blockedCount = 0, className = '' }: StatusBadgeProps) {
  if (status === 'done') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Done
      </span>
    );
  }

  if (isHardBlocked || status === 'blocked') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 ${className}`}
      >
        <Lock className="w-3.5 h-3.5" />
        Locked {blockedCount > 0 ? `(${blockedCount})` : ''}
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 ${className}`}
      >
        <PlayCircle className="w-3.5 h-3.5" />
        In Progress
      </span>
    );
  }

  if (status === 'pending_external') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        Waiting On
      </span>
    );
  }

  // Default: ready
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 ${className}`}
    >
      <Clock className="w-3.5 h-3.5" />
      Ready to Work
    </span>
  );
}
