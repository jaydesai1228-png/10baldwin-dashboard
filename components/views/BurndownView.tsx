import React from 'react';
import { TaskWithDependencyState } from '@/types/punchlist';
import { calculateBurndownAnalytics, GroupProgress } from '@/lib/dependency-engine';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  AlertTriangle,
  Layers,
  MapPin,
  Wrench,
} from 'lucide-react';

interface BurndownViewProps {
  tasks: TaskWithDependencyState[];
  onSelectFilterRoom?: (room: string) => void;
}

export function BurndownView({ tasks }: BurndownViewProps) {
  const analytics = calculateBurndownAnalytics(tasks);
  const { overall, byOutcome, byRoom, byTrade } = analytics;

  return (
    <div className="space-y-6">
      {/* Header Banner & Primary Gauge */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Burn Down & Construction Progress
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Real-time punch list velocity, trade completion metrics, and hard blocker distribution for 10 Baldwin.
            </p>
          </div>

          {/* Huge Progress % Indicator */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Circular meter background */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overall.percentComplete}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-white">{overall.percentComplete}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Done</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-200">
                {overall.done} of {overall.total} Punch Items Done
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {overall.total - overall.done} active items remaining to close out
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
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
                className="bg-sky-500 transition-all duration-500"
                title={`In Progress: ${overall.inProgress}`}
              />
            )}
            {overall.ready > 0 && (
              <div
                style={{ width: `${(overall.ready / overall.total) * 100}%` }}
                className="bg-teal-500 transition-all duration-500"
                title={`Ready: ${overall.ready}`}
              />
            )}
            {overall.blocked > 0 && (
              <div
                style={{ width: `${(overall.blocked / overall.total) * 100}%` }}
                className="bg-rose-500 rounded-r-full transition-all duration-500"
                title={`Locked / Blocked: ${overall.blocked}`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Done ({overall.done})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>In Progress ({overall.inProgress})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
              <span>Ready to Work ({overall.ready})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Hard Locked ({overall.blocked})</span>
            </span>
            {overall.pendingExternal > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Waiting On ({overall.pendingExternal})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Breakdowns: By Room, By Trade, By Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Room */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Burndown by Room</h3>
          </div>

          <div className="space-y-3">
            {byRoom.map((item) => (
              <ProgressBarRow key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* By Trade */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">Burndown by Trade</h3>
          </div>

          <div className="space-y-3">
            {byTrade.map((item) => (
              <ProgressBarRow key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* By Outcome Stage */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Burndown by Construction Stage / Outcome</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {byOutcome.map((item) => (
            <div key={item.name} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className="font-bold text-amber-400">{item.percentComplete}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.percentComplete}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.done} / {item.total} Done</span>
                {item.blocked > 0 && <span className="text-rose-400">{item.blocked} Locked</span>}
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
    <div className="space-y-1.5 p-2 rounded-xl hover:bg-slate-800/40 transition-colors">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-200">{item.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">
            {item.done}/{item.total} done
          </span>
          <span className="font-bold text-amber-400 w-9 text-right">{item.percentComplete}%</span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
        <div
          style={{ width: `${item.percentComplete}%` }}
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
        />
      </div>
    </div>
  );
}
