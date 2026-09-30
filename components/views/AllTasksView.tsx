import React, { useState, useMemo } from 'react';
import { TaskWithDependencyState, TaskStatus } from '@/types/punchlist';
import { TaskCard } from '../TaskCard';
import { Search, Filter, Lock, Unlock, CheckCircle2, RotateCcw } from 'lucide-react';

interface AllTasksViewProps {
  tasks: TaskWithDependencyState[];
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function AllTasksView({ tasks, onOpenDetails, onQuickStatusChange }: AllTasksViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [blockerFilter, setBlockerFilter] = useState<'All' | 'locked' | 'unlocked'>('All');

  // Compute filter options
  const rooms = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.room));
    return ['All', ...Array.from(set)];
  }, [tasks]);

  const trades = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.trade));
    return ['All', ...Array.from(set)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        const matchesId = task.id.toLowerCase().includes(query);
        const matchesRoom = task.room.toLowerCase().includes(query);
        const matchesTrade = task.trade.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesId && !matchesRoom && !matchesTrade) {
          return false;
        }
      }

      // Room
      if (selectedRoom !== 'All' && task.room !== selectedRoom) return false;

      // Trade
      if (selectedTrade !== 'All' && task.trade !== selectedTrade) return false;

      // Status
      if (selectedStatus !== 'All' && task.effectiveStatus !== selectedStatus) return false;

      // Blocker filter
      if (blockerFilter === 'locked' && task.unsatisfiedBlockers.length === 0) return false;
      if (blockerFilter === 'unlocked' && task.unsatisfiedBlockers.length > 0) return false;

      return true;
    });
  }, [tasks, searchQuery, selectedRoom, selectedTrade, selectedStatus, blockerFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRoom('All');
    setSelectedTrade('All');
    setSelectedStatus('All');
    setBlockerFilter('All');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedRoom !== 'All' ||
    selectedTrade !== 'All' ||
    selectedStatus !== 'All' ||
    blockerFilter !== 'All';

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Panel */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search punch list items by title, trade, room, notes, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Room */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Trade */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Trade</label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {trades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="ready">Ready to Work</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_external">Waiting On</option>
              <option value="blocked">Locked / Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Hard Blocker State */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Blocker State</label>
            <select
              value={blockerFilter}
              onChange={(e) => setBlockerFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Tasks</option>
              <option value="locked">🔒 Hard Locked Only</option>
              <option value="unlocked">🔓 Unblocked Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Clear Button */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>
            Showing <strong className="text-white">{filteredTasks.length}</strong> of {tasks.length} items
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No punch list items match this filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or reset your filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpenDetails={onOpenDetails}
              onQuickStatusChange={onQuickStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
