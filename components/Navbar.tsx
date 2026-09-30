import React from 'react';
import { UserRole } from '@/types/punchlist';
import { HardHat, User, Plus, RefreshCw, Check, Hammer } from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewTask: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function Navbar({
  activeRole,
  onRoleChange,
  onOpenNewTask,
  onReset,
  isSaving,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Project Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/20">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                10 Baldwin
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Punch List & Burndown
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Residential Field Board</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-[11px]">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                    <span className="text-amber-400">Syncing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Auto-saved</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Controls: Role Switcher & New Task */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sticky Role Switcher */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
            <span className="hidden md:inline text-[11px] font-medium text-slate-400 px-2">
              Active:
            </span>
            <button
              type="button"
              onClick={() => onRoleChange('Jay')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'Jay'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Jay</span>
              <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
                (Homeowner)
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('Joe')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'Joe'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Joe</span>
              <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
                (GC)
              </span>
            </button>
          </div>

          {/* New Task Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Punch Item</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Reset button (small icon) */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset punch list back to 10 Baldwin initial seed tasks? Any custom changes will be reset.')) {
                onReset();
              }
            }}
            title="Reset to 10 Baldwin demo data"
            className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
