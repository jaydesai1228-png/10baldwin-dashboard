import React, { useState } from 'react';
import {
  PunchTask,
  TaskStatus,
  UserRole,
  TaskWithDependencyState,
  WaitingOnOwner,
  Priority,
} from '@/types/punchlist';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Send,
  Calendar,
  Hourglass,
  Zap,
  MapPin,
  Wrench,
  Layers,
  MessageSquare,
  CheckCircle2,
  Clock,
  HardHat,
  User,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface TaskModalProps {
  task: TaskWithDependencyState | null;
  allTasks: TaskWithDependencyState[];
  activeRole: UserRole;
  onClose: () => void;
  onUpdateTask: (task: PunchTask) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onAddFieldNote: (taskId: string, noteText: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSnooze?: (taskId: string, days?: number) => void;
  onUnsnooze?: (taskId: string) => void;
}

export function TaskModal({
  task,
  allTasks,
  activeRole,
  onClose,
  onUpdateTask,
  onUpdateStatus,
  onAddFieldNote,
  onDeleteTask,
  onSnooze,
  onUnsnooze,
}: TaskModalProps) {
  if (!task) return null;

  const [noteText, setNoteText] = useState('');
  const [selectedBlockerToAdd, setSelectedBlockerToAdd] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // Editable task state
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [room, setRoom] = useState(task.room);
  const [trade, setTrade] = useState(task.trade);
  const [outcome, setOutcome] = useState(task.outcome);
  const [priority, setPriority] = useState<Priority>(task.priority || 'medium');
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || 'Joe');

  // Waiting on state
  const [isWaiting, setIsWaiting] = useState(Boolean(task.waiting_on && task.waiting_on.isWaiting !== false));
  const [waitingOwner, setWaitingOwner] = useState<WaitingOnOwner>((task.waiting_on?.owner as WaitingOnOwner) || 'Supplier');
  const [waitingDesc, setWaitingDesc] = useState(task.waiting_on?.description || '');
  const [waitingDate, setWaitingDate] = useState(task.waiting_on?.targetDate || '');
  const [waitingUrgency, setWaitingUrgency] = useState<'critical' | 'standard' | 'low'>(
    task.waiting_on?.urgency || 'standard'
  );

  const isHardBlocked = task.unsatisfiedBlockers.length > 0;

  // Potential blockers to add: any task except this task itself and tasks already in blocked_by
  const availableBlockers = allTasks.filter(
    (t) => t.id !== task.id && !task.blocked_by.includes(t.id)
  );

  const handleSaveMeta = () => {
    onUpdateTask({
      ...task,
      title,
      description,
      room,
      trade,
      outcome,
      priority,
      assigned_to: assignedTo,
      waiting_on: isWaiting
        ? {
            isWaiting: true,
            owner: waitingOwner,
            description: waitingDesc,
            targetDate: waitingDate || undefined,
            urgency: waitingUrgency,
          }
        : undefined,
      status: isWaiting ? 'pending_external' : task.status,
    });
    setIsEditingMeta(false);
  };

  const handleAddBlocker = () => {
    if (!selectedBlockerToAdd) return;
    const newBlockedBy = [...(task.blocked_by || []), selectedBlockerToAdd];
    onUpdateTask({
      ...task,
      blocked_by: newBlockedBy,
    });
    setSelectedBlockerToAdd('');
  };

  const handleRemoveBlocker = (blockerId: string) => {
    const newBlockedBy = (task.blocked_by || []).filter((id) => id !== blockerId);
    onUpdateTask({
      ...task,
      blocked_by: newBlockedBy,
    });
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddFieldNote(task.id, noteText.trim());
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex justify-end">
      {/* Slide-over Drawer / Modal Panel */}
      <div className="w-full max-w-2xl min-h-screen bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900">
        {/* Top Header */}
        <div className="p-5 md:p-6 border-b border-slate-200 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur z-10 shadow-xs">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {task.id}
              </span>
              <StatusBadge
                status={task.effectiveStatus}
                isHardBlocked={isHardBlocked}
                blockedCount={task.unsatisfiedBlockers.length}
              />
              <span className="text-xs font-medium text-slate-500 capitalize">
                Priority: <strong className="text-slate-700">{task.priority || 'Medium'}</strong>
              </span>
            </div>

            {isEditingMeta ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg md:text-xl font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            ) : (
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug break-words whitespace-normal font-sans">
                {task.title}
              </h2>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Status Switcher Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Update Status</span>
              {isHardBlocked && (
                <span className="text-rose-700 font-semibold flex items-center gap-1 text-xs">
                  <Lock className="w-3.5 h-3.5" /> Blocked by prerequisites
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['ready', 'in_progress', 'pending_external', 'blocked', 'done'] as TaskStatus[]).map((s) => {
                const isSelected = task.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdateStatus(task.id, s)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                      isSelected
                        ? s === 'done'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : s === 'blocked'
                          ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                          : s === 'in_progress'
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs'
                          : s === 'pending_external'
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {s === 'pending_external' ? 'Chasing' : s.replace('_', ' ')}
                  </button>
                );
              })}
            </div>

            {/* 3-Day Snooze Control */}
            <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold text-slate-700">Top 3 Critical Focus Queue:</span>
                {Boolean(task.dismissed_until && new Date(task.dismissed_until).getTime() > Date.now()) ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                    Snoozed until {new Date(task.dismissed_until!).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                ) : (
                  <span className="text-slate-500">Active in priority queue</span>
                )}
              </div>

              {Boolean(task.dismissed_until && new Date(task.dismissed_until).getTime() > Date.now()) ? (
                <button
                  type="button"
                  onClick={() => onUnsnooze && onUnsnooze(task.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Un-snooze Now</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSnooze && onSnooze(task.id, 3)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Snooze 3 Days</span>
                </button>
              )}
            </div>
          </div>

          {/* Hard Blocker / Dependency Section */}
          <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Prerequisite Dependencies (`blocked_by`)</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {task.blocked_by.length} prerequisite{task.blocked_by.length === 1 ? '' : 's'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This task cannot be worked on until all prerequisite tasks below are completed.
            </p>

            {/* List of current blockers */}
            <div className="space-y-2">
              {task.blocked_by.length === 0 ? (
                <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 text-xs text-slate-500 flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No prerequisites. Ready to execute on site immediately.</span>
                </div>
              ) : (
                task.blocked_by.map((blockerId) => {
                  const blocker = allTasks.find((t) => t.id === blockerId);
                  const isBlockerDone = blocker?.effectiveStatus === 'done';

                  return (
                    <div
                      key={blockerId}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        isBlockerDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        {isBlockerDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0 break-words whitespace-normal">
                          <div className="font-bold">
                            <span>{blocker?.title || blockerId}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            Status: <span className="font-bold uppercase">{blocker?.status || 'Unknown'}</span> ({blocker?.room} • {blocker?.trade})
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBlocker(blockerId)}
                        title="Unlink prerequisite"
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Blocker Dropdown */}
            {availableBlockers.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <select
                  value={selectedBlockerToAdd}
                  onChange={(e) => setSelectedBlockerToAdd(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                >
                  <option value="">+ Link a prerequisite task...</option>
                  {availableBlockers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.room} - {b.status})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddBlocker}
                  disabled={!selectedBlockerToAdd}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                >
                  Link
                </button>
              </div>
            )}
          </div>

          {/* Downstream Unlocks Section */}
          {task.dependentTasks.length > 0 && (
            <div className="bg-amber-50/80 p-4 md:p-5 rounded-2xl border border-amber-200 space-y-2 text-amber-950">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold">Downstream Tasks Unlocked by this Item</h3>
              </div>
              <p className="text-xs text-amber-900">
                Marking this item &ldquo;Done&rdquo; will release these {task.dependentTasks.length} downstream tasks:
              </p>
              <div className="space-y-1.5 pt-1">
                {task.dependentTasks.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-2.5 rounded-xl bg-white border border-amber-200/80 text-xs flex items-center justify-between text-slate-800 shadow-xs"
                  >
                    <span className="font-semibold">{dep.title}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{dep.room}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waiting On Bottleneck Card (Purple Callout) */}
          <div className="bg-purple-50/90 p-4 md:p-5 rounded-2xl border border-purple-200 space-y-3 text-purple-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold">Waiting On External / Chasing</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-purple-900">
                <input
                  type="checkbox"
                  checked={isWaiting}
                  onChange={(e) => setIsWaiting(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                />
                Active Bottleneck
              </label>
            </div>

            {isWaiting && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">Waiting On Owner</label>
                    <select
                      value={waitingOwner}
                      onChange={(e) => setWaitingOwner(e.target.value as WaitingOnOwner)}
                      className="w-full bg-white border border-purple-200 text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs"
                    >
                      <option value="Jay">Jay (Owner Decision / Selection)</option>
                      <option value="Joe">Joe (GC / Subcontractor Lead)</option>
                      <option value="Township">Township (Permit / Inspector)</option>
                      <option value="Supplier">Supplier (Delivery / Lead Time)</option>
                      <option value="Trade">Trade (Specialty Subcontractor)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={waitingDate}
                      onChange={(e) => setWaitingDate(e.target.value)}
                      className="w-full bg-white border border-purple-200 text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">Bottleneck Action / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Awaiting Home Depot alternate item, inspector callback..."
                    value={waitingDesc}
                    onChange={(e) => setWaitingDesc(e.target.value)}
                    className="w-full bg-white border border-purple-200 text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details / Classification Card */}
          <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Task Details & Classification</h3>
              <button
                type="button"
                onClick={() => {
                  if (isEditingMeta) {
                    handleSaveMeta();
                  } else {
                    setIsEditingMeta(true);
                  }
                }}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold cursor-pointer"
              >
                {isEditingMeta ? 'Save Changes' : 'Edit Information'}
              </button>
            </div>

            {isEditingMeta ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Room / Location</label>
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-900 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Trade</label>
                    <input
                      type="text"
                      value={trade}
                      onChange={(e) => setTrade(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-900 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Outcome Stage</label>
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-900 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-900 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-900 shadow-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {task.description && (
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed break-words whitespace-normal font-normal">
                    {task.description}
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-200/70">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Room</span>
                    <span className="font-bold text-slate-900">{task.room}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Trade</span>
                    <span className="font-bold text-slate-900">{task.trade}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Outcome</span>
                    <span className="font-bold text-slate-900">{task.outcome}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Field Notes & Activity Thread */}
          <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Jobsite Field Notes</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {task.notes?.length || 0} note{task.notes?.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Notes Thread */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {!task.notes || task.notes.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                  No notes yet. Add on-site updates, measurements, or approvals below.
                </div>
              ) : (
                task.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            note.author === 'Joe'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {note.author === 'Joe' ? 'J' : 'J'}
                        </div>
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            note.author === 'Joe'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-sky-50 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {note.author} {note.author === 'Joe' ? '(GC)' : '(Homeowner)'}
                        </span>
                      </div>
                      <span className="text-slate-400 font-medium">
                        {new Date(note.timestamp || note.createdAt || Date.now()).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-800 leading-relaxed break-words whitespace-normal font-normal pl-6">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Note Input */}
            <form onSubmit={handleSendNote} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder={`Post update as ${activeRole}...`}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 bg-white border border-slate-300 text-xs rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              <button
                type="submit"
                disabled={!noteText.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete punch list task ${task.id}?`)) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Item</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
