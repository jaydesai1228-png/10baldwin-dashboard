import React from 'react';
import { UserRole } from '@/types/punchlist';
import { HardHat, User, Plus, RefreshCw, Check, Hammer, Calendar, Layers } from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewTask: () => void;
  onReset: () => void;
  isSaving: boolean;
  daysLeft?: number;
  onOpenSequences?: () => void;
}

export function Navbar({
  activeRole,
  onRoleChange,
  onOpenNewTask,
  onReset,
  isSaving,
  daysLeft,
  onOpenSequences,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Project Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-sm shadow-amber-500/20">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
                10 Baldwin
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Jobsite Board
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Residential Construction</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-[11px]">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                    <span className="text-amber-600 font-medium">Syncing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Auto-saved</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Controls: Role Switcher & New Task */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dynamic Move-In Countdown Badge */}
          {daysLeft !== undefined && (
            <button
              type="button"
              onClick={onOpenSequences}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 text-amber-900 transition-colors cursor-pointer"
              title="Move-In Target: Nov 15, 2026. Click to view Key Construction Sequences & Rules."
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold">
                Move-In: <span className="text-amber-700 font-extrabold">{daysLeft}d</span>
              </span>
            </button>
          )}

          {onOpenSequences && (
            <button
              type="button"
              onClick={onOpenSequences}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Sequences & Rules</span>
            </button>
          )}

          {/* Sticky Role Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/90 flex items-center">
            <span className="hidden md:inline text-[11px] font-semibold text-slate-500 px-2 uppercase tracking-wider">
              Role:
            </span>
            <button
              type="button"
              onClick={() => onRoleChange('Jay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'Jay'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Jay</span>
              <span className="hidden lg:inline text-[10px] opacity-85 font-normal">
                (Owner)
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('Joe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'Joe'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Joe</span>
              <span className="hidden lg:inline text-[10px] opacity-85 font-normal">
                (GC)
              </span>
            </button>
          </div>

          {/* New Task Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Item</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Reset button (small icon) */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset punch list back to 10 Baldwin master seed tasks? Any unsaved local edits will be reset.')) {
                onReset();
              }
            }}
            title="Reset to 10 Baldwin master tasks"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
