import React, { useState, useMemo } from 'react';
import { TaskWithDependencyState, TaskStatus, WaitingOnOwner } from '@/types/punchlist';
import {
  AlertTriangle,
  Clock,
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

  const ownerIconMap: Record<string, React.ReactNode> = {
    Jay: <User className="w-4 h-4 text-sky-400" />,
    Joe: <HardHat className="w-4 h-4 text-amber-400" />,
    Supplier: <Truck className="w-4 h-4 text-emerald-400" />,
    Township: <Building2 className="w-4 h-4 text-purple-400" />,
    Trade: <Wrench className="w-4 h-4 text-orange-400" />,
  };

  const ownersList = useMemo(() => {
    const set = new Set<string>();
    waitingTasks.forEach((t) => {
      const owner = t.waiting_on?.owner || 'Unassigned';
      set.add(owner);
    });
    return ['All', ...Array.from(set)];
  }, [waitingTasks]);

  const filteredTasks = useMemo(() => {
    if (selectedOwner === 'All') return waitingTasks;
    return waitingTasks.filter((t) => (t.waiting_on?.owner || 'Unassigned') === selectedOwner);
  }, [waitingTasks, selectedOwner]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Waiting On / Bottleneck Chasing Board
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Proactively tracks critical path items waiting on homeowner decisions, supplier deliveries, GC subcontractor confirmations, or township inspections.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-orange-950/40 border border-orange-800/40 text-center shrink-0">
            <div className="text-2xl font-extrabold text-orange-300">{waitingTasks.length}</div>
            <div className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">Active Bottlenecks</div>
          </div>
        </div>

        {/* Owner Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Filter Owner:
          </span>
          {ownersList.map((owner) => (
            <button
              key={owner}
              type="button"
              onClick={() => setSelectedOwner(owner)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedOwner === owner
                  ? 'bg-orange-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {owner !== 'All' && ownerIconMap[owner]}
              <span>{owner}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottlenecks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No active external bottlenecks</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Zero tasks are currently flagged as waiting on external decisions, permits, or deliveries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const waitingOwner = task.waiting_on?.owner || 'External';
            const urgency = task.waiting_on?.urgency || 'standard';

            return (
              <div
                key={task.id}
                onClick={() => onOpenDetails(task)}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-950/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Owner & Urgency Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200">
                        {ownerIconMap[waitingOwner]}
                        Waiting on: {waitingOwner}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          urgency === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {urgency}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-amber-300 transition-colors mb-2">
                    {task.title}
                  </h3>

                  {/* Room & Trade */}
                  <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                    <span className="text-slate-300 font-medium">{task.room}</span>
                    <span>•</span>
                    <span>{task.trade}</span>
                  </div>

                  {/* Bottleneck Description Box */}
                  <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-800/30 text-orange-200 text-xs mb-3 space-y-1">
                    <div className="font-semibold text-orange-300 text-[11px] uppercase tracking-wider">
                      Bottleneck Action:
                    </div>
                    <p className="leading-relaxed">
                      {task.waiting_on?.description || task.description || 'Action required to proceed.'}
                    </p>
                    {task.waiting_on?.targetDate && (
                      <div className="flex items-center gap-1.5 text-orange-400 font-mono text-[11px] pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Target Resolution Date: {task.waiting_on.targetDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Downstream Impact Alert */}
                  {task.dependentTasks.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-[11px]">
                        Holding up <strong className="text-amber-300">{task.dependentTasks.length} downstream task{task.dependentTasks.length > 1 ? 's' : ''}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div
                  className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-slate-400 text-[11px]">
                    Assigned: <strong className="text-slate-200">{task.assigned_to || 'Joe'}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenDetails(task)}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                  >
                    <span>Update & Post Notes</span>
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
