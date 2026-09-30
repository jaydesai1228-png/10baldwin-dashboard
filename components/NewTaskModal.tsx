import React, { useState } from 'react';
import { PunchTask, TaskWithDependencyState, Priority, WaitingOnOwner } from '@/types/punchlist';
import { X, Plus, Lock, User, HardHat } from 'lucide-react';

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
      status: isWaiting ? 'pending_external' : selectedBlockers.length > 0 ? 'blocked' : 'ready',
      blocked_by: selectedBlockers,
      unlocks: [],
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-8">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              activeRole === 'Jay' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-500/10 text-amber-600'
            }`}>
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Add 10 Baldwin Punch Item</h2>
              <p className="text-xs text-slate-500">Record a punch item, room task, or trade action.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master bathroom vanity mirror sconces rough-in"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-white border border-slate-300 text-sm rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                activeRole === 'Jay'
                  ? 'focus:ring-indigo-500 focus:border-indigo-500'
                  : 'focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Scope Notes</label>
            <textarea
              rows={2}
              placeholder="Provide context, measurements, trade specs, or delivery notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                activeRole === 'Jay'
                  ? 'focus:ring-indigo-500 focus:border-indigo-500'
                  : 'focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
          </div>

          {/* Room, Trade, Outcome Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {COMMON_ROOMS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trade</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {COMMON_TRADES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Outcome Stage</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300'
                          : p === 'medium'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300 ring-1 ring-slate-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAssignedTo('Jay')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    assignedTo === 'Jay'
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-300 ring-1 ring-indigo-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jay (Homeowner)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedTo('Joe')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    assignedTo === 'Joe'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <HardHat className="w-3.5 h-3.5 text-amber-600" />
                  <span>Joe (GC)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Waiting on External Bottleneck */}
          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isWaiting}
                onChange={(e) => setIsWaiting(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500"
              />
              <span className="text-xs font-semibold text-purple-900">Flag as Waiting On / External Bottleneck</span>
            </label>
            {isWaiting && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-purple-100">
                <div>
                  <label className="block text-[11px] font-medium text-purple-900 mb-1">Waiting On Who?</label>
                  <select
                    value={waitingOwner}
                    onChange={(e) => setWaitingOwner(e.target.value as WaitingOnOwner)}
                    className="w-full bg-white border border-purple-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Township">Township / Inspector</option>
                    <option value="Supplier">Supplier / Material Delivery</option>
                    <option value="Jay">Jay (Homeowner Selection)</option>
                    <option value="Joe">Joe (Subcontractor / Trade)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-purple-900 mb-1">Reason / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Rough plumbing inspection date"
                    value={waitingDesc}
                    onChange={(e) => setWaitingDesc(e.target.value)}
                    className="w-full bg-white border border-purple-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hard Blocker Selection */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span>Link Prerequisite Blockers (Optional)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              If selected, this task will remain locked until the chosen prerequisites are done.
            </p>

            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
              {allTasks.map((t) => {
                const isChecked = selectedBlockers.includes(t.id);
                return (
                  <label
                    key={t.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-rose-50 text-rose-900 font-medium' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBlocker(t.id)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-mono text-[10px] text-slate-400">{t.id}</span>
                    <span className="break-words line-clamp-1 flex-1">{t.title}</span>
                    <span className="text-[10px] text-slate-400">{t.room}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer ${
                activeRole === 'Jay'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              Create Punch Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
