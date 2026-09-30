import React, { useState, useMemo } from 'react';
import { TaskWithDependencyState, TaskStatus } from '@/types/punchlist';
import {
  Hourglass,
  User,
  HardHat,
  Truck,
  Building2,
  Wrench,
  Zap,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Filter,
  Check,
  ShoppingBag,
} from 'lucide-react';

interface WaitingOnViewProps {
  tasks: TaskWithDependencyState[];
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function WaitingOnView({ tasks, onOpenDetails, onQuickStatusChange }: WaitingOnViewProps) {
  const [selectedOwner, setSelectedOwner] = useState<string>('All');

  // Filter tasks that have active waiting_on metadata or pending_external status
  const waitingTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isDone = t.effectiveStatus === 'done';
      if (isDone) return false;
      return (Boolean(t.waiting_on) && t.waiting_on?.isWaiting !== false) || t.status === 'pending_external';
    });
  }, [tasks]);

  const ownerConfig: Record<string, { label: string; icon: React.ReactNode; color: string; badge: string }> = {
    Jay: {
      label: 'Jay (Homeowner)',
      icon: <User className="w-4 h-4 text-sky-700" />,
      color: 'bg-sky-50 text-sky-800 border-sky-200',
      badge: 'Owner Decision / Purchase',
    },
    Joe: {
      label: 'Joe (GC)',
      icon: <HardHat className="w-4 h-4 text-amber-700" />,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'Subcontractor / Trade Lead',
    },
    Township: {
      label: 'Township / Municipal',
      icon: <Building2 className="w-4 h-4 text-purple-700" />,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      badge: 'Permits & Inspections',
    },
    Supplier: {
      label: 'Suppliers & Vendors',
      icon: <Truck className="w-4 h-4 text-emerald-700" />,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'Shipments & Lead Times',
    },
    Trade: {
      label: 'Specialty Trades',
      icon: <Wrench className="w-4 h-4 text-orange-700" />,
      color: 'bg-orange-50 text-orange-800 border-orange-200',
      badge: 'Subcontractor Callbacks',
    },
  };

  const ownersList = useMemo(() => {
    const set = new Set<string>();
    waitingTasks.forEach((t) => {
      const owner = t.waiting_on?.owner || 'Unassigned';
      set.add(owner);
    });
    return ['All', ...Array.from(set)];
  }, [waitingTasks]);

  // Group by owner
  const groupedByOwner = useMemo(() => {
    const map: Record<string, TaskWithDependencyState[]> = {};
    waitingTasks.forEach((t) => {
      const owner = t.waiting_on?.owner || 'Other';
      if (!map[owner]) map[owner] = [];
      map[owner].push(t);
    });
    return map;
  }, [waitingTasks]);

  const filteredTasks = useMemo(() => {
    if (selectedOwner === 'All') return waitingTasks;
    return waitingTasks.filter((t) => (t.waiting_on?.owner || 'Unassigned') === selectedOwner);
  }, [waitingTasks, selectedOwner]);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
              <Hourglass className="w-3.5 h-3.5 text-purple-600" />
              <span>Critical Path Bottlenecks</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Waiting On / Chasing Board
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Track decisions, vendor material lead times, and municipal sign-offs holding up work. Clear these bottlenecks to release downstream construction tasks.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-purple-50 border border-purple-200 text-center min-w-[130px] shadow-xs shrink-0">
            <div className="text-2xl md:text-3xl font-black text-purple-700">{waitingTasks.length}</div>
            <div className="text-xs font-bold text-purple-800 uppercase tracking-wide mt-0.5">Active Items</div>
          </div>
        </div>

        {/* Owner Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 uppercase tracking-wider">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {ownersList.map((owner) => (
            <button
              key={owner}
              type="button"
              onClick={() => setSelectedOwner(owner)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedOwner === owner
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{owner}</span>
              {owner !== 'All' && (
                <span className="text-[10px] opacity-80">
                  ({(groupedByOwner[owner] || []).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottlenecks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl p-8 space-y-3 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No active external bottlenecks in this view</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Zero tasks are currently flagged as awaiting external materials, permits, or homeowner decisions under this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTasks.map((task) => {
            const waitingOwner = task.waiting_on?.owner || 'External';
            const ownerInfo = ownerConfig[waitingOwner] || {
              label: waitingOwner,
              icon: <Hourglass className="w-4 h-4 text-purple-700" />,
              color: 'bg-purple-50 text-purple-800 border-purple-200',
              badge: 'Follow-up Required',
            };
            const urgency = task.waiting_on?.urgency || 'standard';

            return (
              <div
                key={task.id}
                onClick={() => onOpenDetails(task)}
                onDoubleClick={() => onOpenDetails(task)}
                className="group p-5 md:p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:ring-2 hover:ring-purple-100 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Owner & Urgency Row */}
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${ownerInfo.color}`}>
                        {ownerInfo.icon}
                        <span>{ownerInfo.label}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {task.room}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                        urgency === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {urgency}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-purple-900 transition-colors mb-2.5 leading-snug break-words whitespace-normal">
                    {task.title}
                  </h3>

                  {/* Bottleneck Description Box (High-Contrast Purple Callout) */}
                  <div className="p-3.5 rounded-xl bg-purple-50/90 border border-purple-200/90 text-purple-950 text-xs md:text-sm mb-3.5 space-y-1.5">
                    <div className="font-bold text-purple-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Hourglass className="w-3.5 h-3.5 text-purple-600" />
                      <span>Action / Chasing Details:</span>
                    </div>
                    <p className="leading-relaxed text-purple-950 break-words whitespace-normal font-normal">
                      {task.waiting_on?.description || task.description || 'Action required to proceed.'}
                    </p>
                    {task.waiting_on?.targetDate && (
                      <div className="flex items-center gap-1.5 text-purple-800 font-semibold text-xs pt-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>Target Resolution Date: {task.waiting_on.targetDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Downstream Impact Alert */}
                  {task.dependentTasks.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2 mb-3.5">
                      <Zap className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="break-words whitespace-normal">
                        <strong className="font-bold">Holding up {task.dependentTasks.length} downstream item{task.dependentTasks.length > 1 ? 's' : ''}:</strong>{' '}
                        <span>{task.dependentTasks.map((d) => d.title).join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div
                  className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-slate-600 font-medium">
                    Owner: <strong className="text-slate-900 font-bold">{waitingOwner}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenDetails(task)}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold transition-colors cursor-pointer"
                  >
                    <span>View & Add Notes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
