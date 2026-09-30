import React from 'react';
import { UserRole } from '@/types/punchlist';
import { HardHat, User, Plus, RefreshCw, Check, Hammer, Calendar, Layers, Home } from 'lucide-react';

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
  const isJay = activeRole === 'Jay';

  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-200 px-4 py-3 sm:px-6 shadow-md ${
        isJay
          ? 'bg-slate-900 text-slate-100 border-b border-indigo-900/40'
          : 'bg-zinc-950 text-zinc-100 border-b border-amber-900/40'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Project Brand & Persona Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md transition-all duration-200 ${
              isJay
                ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-indigo-500/25'
                : 'bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/25'
            }`}
          >
            {isJay ? <Home className="w-5 h-5" /> : <Hammer className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                10 Baldwin
              </h1>
              {/* Persona Mode Badge */}
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-lg border transition-all duration-200 ${
                  isJay
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/35'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/35'
                }`}
              >
                {isJay ? <Home className="w-3 h-3 text-indigo-400" /> : <HardHat className="w-3 h-3 text-amber-400" />}
                <span>{isJay ? 'Homeowner Mode (Jay)' : 'GC Field Mode (Joe)'}</span>
              </span>
            </div>
            <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${isJay ? 'text-slate-400' : 'text-zinc-400'}`}>
              <span>Residential Construction</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-[11px]">
                {isSaving ? (
                  <>
                    <RefreshCw className={`w-3 h-3 animate-spin ${isJay ? 'text-indigo-400' : 'text-amber-400'}`} />
                    <span className={isJay ? 'text-indigo-300 font-medium' : 'text-amber-300 font-medium'}>Syncing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Auto-saved</span>
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
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                isJay
                  ? 'bg-slate-800 hover:bg-slate-700/80 border-indigo-500/30 text-indigo-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-amber-500/30 text-amber-400'
              }`}
              title="Move-In Target: Nov 15, 2026. Click to view Key Construction Sequences & Rules."
            >
              <Calendar className={`w-3.5 h-3.5 ${isJay ? 'text-indigo-400' : 'text-amber-400'}`} />
              <span>
                Move-In: <span className={isJay ? 'text-indigo-200 font-extrabold' : 'text-amber-300 font-extrabold'}>{daysLeft}d</span>
              </span>
            </button>
          )}

          {onOpenSequences && (
            <button
              type="button"
              onClick={onOpenSequences}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                isJay
                  ? 'bg-slate-800 hover:bg-slate-700 text-indigo-200 border-slate-700'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sequences & Rules</span>
            </button>
          )}

          {/* Sticky Role Switcher */}
          <div
            className={`p-1 rounded-xl border flex items-center transition-colors duration-200 ${
              isJay ? 'bg-slate-800/90 border-slate-700/80' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <span
              className={`hidden md:inline text-[10px] font-bold px-2 uppercase tracking-wider ${
                isJay ? 'text-slate-400' : 'text-zinc-500'
              }`}
            >
              Mode:
            </span>
            <button
              type="button"
              onClick={() => onRoleChange('Jay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeRole === 'Jay'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : isJay
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Jay</span>
              <span className="hidden lg:inline text-[10px] opacity-80 font-normal">
                (Owner)
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('Joe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeRole === 'Joe'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30'
                  : isJay
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Joe</span>
              <span className="hidden lg:inline text-[10px] opacity-80 font-normal">
                (GC)
              </span>
            </button>
          </div>

          {/* New Task Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all duration-200 cursor-pointer ${
              isJay
                ? 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-600/25'
                : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 shadow-amber-500/25'
            }`}
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
            className={`p-2 rounded-lg transition-colors duration-200 text-xs cursor-pointer ${
              isJay ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
