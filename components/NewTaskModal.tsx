import React, { useState } from 'react';
import { PunchTask, TaskWithDependencyState, Priority, WaitingOnOwner } from '@/types/punchlist';
import { X, Plus, Lock } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTasks: TaskWithDependencyState[];
  onCreateTask: (task: Partial<PunchTask>) => void;
  activeRole: 'Jay' | 'Joe';
}

const COMMON_ROOMS = [
  'Kitchen',
  'Master Bath',
  'Powder Room',
  'Living Room',
  'Dining Room',
  'Basement',
  'Exterior',
  'Entire House',
];

const COMMON_TRADES = [
  'Plumbing',
  'Electrical',
  'Carpentry & Trim',
  'Tile & Stone',
  'Countertops',
  'Drywall & Paint',
  'HVAC',
  'Township Inspection',
  'Hardware & Glazing',
  'General GC',
];

const COMMON_OUTCOMES = [
  'Rough-in & Prep',
  'Inspections & Permits',
  'Cabinetry & Surfaces',
  'Trim & Finishes',
  'Fixtures & Trim-out',
  'Punch List Closeout',
];

export function NewTaskModal({
  isOpen,
  onClose,
  allTasks,
  onCreateTask,
  activeRole,
}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState(COMMON_ROOMS[0]);
  const [trade, setTrade] = useState(COMMON_TRADES[0]);
  const [outcome, setOutcome] = useState(COMMON_OUTCOMES[3]);
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignedTo, setAssignedTo] = useState<'Jay' | 'Joe'>(activeRole);
  const [selectedBlockers, setSelectedBlockers] = useState<string[]>([]);

  // Waiting on
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingOwner, setWaitingOwner] = useState<WaitingOnOwner>('Supplier');
  const [waitingDesc, setWaitingDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      room,
      trade,
      outcome,
      priority,
      status: selectedBlockers.length > 0 ? 'blocked' : 'ready',
      blocked_by: selectedBlockers,
      assigned_to: assignedTo,
      waiting_on: isWaiting
        ? {
            isWaiting: true,
            owner: waitingOwner,
            description: waitingDesc,
          }
        : undefined,
    });

    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedBlockers([]);
    setIsWaiting(false);
    setWaitingDesc('');
  };

  const toggleBlocker = (taskId: string) => {
    if (selectedBlockers.includes(taskId)) {
      setSelectedBlockers(selectedBlockers.filter((id) => id !== taskId));
    } else {
      setSelectedBlockers([...selectedBlockers, taskId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add 10 Baldwin Punch Item</h2>
              <p className="text-xs text-slate-400">Add an on-site punch item, task, or trade action.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master bathroom vanity mirror sconces rough-in"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Scope Notes</label>
            <textarea
              rows={2}
              placeholder="Provide context, measurements, trade specs, or delivery notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Room, Trade, Outcome Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200"
              >
                {COMMON_ROOMS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Trade</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200"
              >
                {COMMON_TRADES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Outcome Stage</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200"
              >
                {COMMON_OUTCOMES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-slate-700 text-slate-200 border-slate-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAssignedTo('Jay')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    assignedTo === 'Jay'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Jay (Homeowner)
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedTo('Joe')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    assignedTo === 'Joe'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Joe (GC)
                </button>
              </div>
            </div>
          </div>

          {/* Hard Blocker Selection */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Link Prerequisite Blockers (Optional)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              If selected, this task will remain locked until the chosen prerequisites are done.
            </p>

            <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
              {allTasks.map((t) => {
                const isChecked = selectedBlockers.includes(t.id);
                return (
                  <label
                    key={t.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-rose-950/30 text-rose-200' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBlocker(t.id)}
                      className="rounded text-rose-500"
                    />
                    <span className="font-mono text-[11px] text-slate-400">{t.id}</span>
                    <span className="truncate flex-1">{t.title}</span>
                    <span className="text-[10px] text-slate-500">{t.room}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Create Punch Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
