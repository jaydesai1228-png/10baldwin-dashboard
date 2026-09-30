import React from 'react';
import { TaskWithDependencyState } from '@/types/punchlist';
import { calculateBurndownAnalytics, GroupProgress } from '@/lib/dependency-engine';
import {
  TrendingUp,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  Wrench,
  Clock,
  PlayCircle,
  Hourglass,
} from 'lucide-react';

interface BurndownViewProps {
  tasks: TaskWithDependencyState[];
}

export function BurndownView({ tasks }: BurndownViewProps) {
  const analytics = calculateBurndownAnalytics(tasks);
  const { overall, byOutcome, byRoom, byTrade } = analytics;

  return (
    <div className="space-y-6">
      {/* Header Banner & Primary Gauge */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Project Burndown & Velocity</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Burndown & Construction Progress
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Track project milestones, trade velocity, and closeout burndown across all 53 residential punch items at 10 Baldwin.
            </p>
          </div>

          {/* Progress Circular Gauge Card */}
          <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 shrink-0 shadow-xs">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-600 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overall.percentComplete}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900">{overall.percentComplete}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Done</span>
              </div>
            </div>

            <div>
              <div className="text-base font-bold text-slate-900">
                {overall.done} of {overall.total} Items Completed
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {overall.total - overall.done} active punch items remaining to close out
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
            {overall.done > 0 && (
              <div
                style={{ width: `${(overall.done / overall.total) * 100}%` }}
                className="bg-emerald-500 rounded-l-full transition-all duration-500"
                title={`Done: ${overall.done}`}
              />
            )}
            {overall.inProgress > 0 && (
              <div
                style={{ width: `${(overall.inProgress / overall.total) * 100}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`In Progress: ${overall.inProgress}`}
              />
            )}
            {overall.ready > 0 && (
              <div
                style={{ width: `${(overall.ready / overall.total) * 100}%` }}
                className="bg-sky-500 transition-all duration-500"
                title={`Ready to Work: ${overall.ready}`}
              />
            )}
            {overall.blocked > 0 && (
              <div
                style={{ width: `${(overall.blocked / overall.total) * 100}%` }}
                className="bg-rose-500 rounded-r-full transition-all duration-500"
                title={`Blocked: ${overall.blocked}`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
              <span>Done ({overall.done})</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
              <span>In Progress ({overall.inProgress})</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-xs" />
              <span>Ready to Work ({overall.ready})</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs" />
              <span>Blocked ({overall.blocked})</span>
            </span>
            {overall.pendingExternal > 0 && (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-xs" />
                <span>Waiting On ({overall.pendingExternal})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Breakdowns: By Room & By Trade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Room */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Burndown by Room</h3>
          </div>

          <div className="space-y-3">
            {byRoom.map((item) => (
              <ProgressBarRow key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* By Trade */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Burndown by Trade</h3>
          </div>

          <div className="space-y-3">
            {byTrade.map((item) => (
              <ProgressBarRow key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* By Construction Stage / Outcome */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Burndown by Construction Outcome</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {byOutcome.map((item) => (
            <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{item.name}</span>
                <span className="font-extrabold text-slate-700">{item.percentComplete}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.percentComplete}%` }}
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{item.done} / {item.total} Done</span>
                {item.blocked > 0 && <span className="text-rose-600 font-semibold">{item.blocked} Blocked</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressBarRow({ item }: { item: GroupProgress }) {
  return (
    <div className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800">{item.name}</span>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            {item.done} of {item.total}
          </span>
          <span className="font-bold text-slate-900 w-10 text-right">{item.percentComplete}%</span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          style={{ width: `${item.percentComplete}%` }}
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
        />
      </div>
    </div>
  );
}
