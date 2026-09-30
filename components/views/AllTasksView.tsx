import React, { useState, useMemo } from 'react';
import { TaskWithDependencyState, TaskStatus, UserRole } from '@/types/punchlist';
import { TaskCard } from '../TaskCard';
import { Search, Filter, RotateCcw, CheckCircle2 } from 'lucide-react';

interface AllTasksViewProps {
  tasks: TaskWithDependencyState[];
  onOpenDetails: (task: TaskWithDependencyState) => void;
  onQuickStatusChange: (taskId: string, status: TaskStatus) => void;
  activeRole?: UserRole;
}

export function AllTasksView({
  tasks,
  onOpenDetails,
  onQuickStatusChange,
  activeRole = 'Jay',
}: AllTasksViewProps) {
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
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search punch list items by title, trade, room, notes, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              activeRole === 'Jay' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'
            }`}
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Room */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className={`w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 ${
                activeRole === 'Jay' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'
              }`}
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
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Trade</label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className={`w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 ${
                activeRole === 'Jay' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'
              }`}
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
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 ${
                activeRole === 'Jay' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="ready">Ready to Work</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_external">Waiting On / Chasing</option>
              <option value="blocked">Locked / Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Hard Blocker State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Dependencies</label>
            <select
              value={blockerFilter}
              onChange={(e) => setBlockerFilter(e.target.value as any)}
              className={`w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 ${
                activeRole === 'Jay' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'
              }`}
            >
              <option value="All">All Items</option>
              <option value="locked">🔒 Blocked Only</option>
              <option value="unlocked">🔓 Unblocked Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Clear Button */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
          <span>
            Showing <strong className="text-slate-900">{filteredTasks.length}</strong> of {tasks.length} items
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                activeRole === 'Jay' ? 'text-indigo-700 hover:text-indigo-800' : 'text-amber-700 hover:text-amber-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl p-8 space-y-3 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No punch list items match this filter</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or reset your filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpenDetails={onOpenDetails}
              onQuickStatusChange={onQuickStatusChange}
              activeRole={activeRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}
