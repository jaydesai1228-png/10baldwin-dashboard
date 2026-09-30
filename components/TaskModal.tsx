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
  AlertTriangle,
  Zap,
  MapPin,
  Wrench,
  Layers,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
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
}: TaskModalProps) {
  if (!task) return null;

  const [noteText, setNoteText] = useState('');
  const [selectedBlockerToAdd, setSelectedBlockerToAdd] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // Editable task state
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [room, setRoom] = useState(task.room);
  const [trade, setTrade] = useState(task.trade);
  const [outcome, setOutcome] = useState(task.outcome);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || 'Joe');

  // Waiting on state
  const [isWaiting, setIsWaiting] = useState(task.waiting_on?.isWaiting || false);
  const [waitingOwner, setWaitingOwner] = useState<WaitingOnOwner>(task.waiting_on?.owner || 'Supplier');
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
      waiting_on: {
        isWaiting,
        owner: waitingOwner,
        description: waitingDesc,
        targetDate: waitingDate || undefined,
        urgency: waitingUrgency,
      },
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-end">
      {/* Slide-over Drawer / Modal Panel */}
      <div className="w-full max-w-2xl min-h-screen bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {task.id}
              </span>
              <StatusBadge
                status={task.effectiveStatus}
                isHardBlocked={isHardBlocked}
                blockedCount={task.unsatisfiedBlockers.length}
              />
              <span className="text-xs text-slate-400 capitalize">Priority: {task.priority}</span>
            </div>
            {isEditingMeta ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg font-bold bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">{task.title}</h2>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Status Switcher Bar */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Change Task Status</span>
              {isHardBlocked && (
                <span className="text-rose-400 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hard Locked by Blockers
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {(['ready', 'in_progress', 'pending_external', 'blocked', 'done'] as TaskStatus[]).map((s) => {
                const isSelected = task.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdateStatus(task.id, s)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? s === 'done'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                          : s === 'blocked'
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : s === 'in_progress'
                          ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                          : s === 'pending_external'
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                          : 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hard Blocker / Dependency Section */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-slate-200">Prerequisite Blockers (`blocked_by`)</h3>
              </div>
              <span className="text-xs text-slate-400">
                {task.blocked_by.length} prerequisite{task.blocked_by.length === 1 ? '' : 's'}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              This task is strictly locked until all prerequisite tasks below are marked &quot;Done&quot;.
            </p>

            {/* List of current blockers */}
            <div className="space-y-2">
              {task.blocked_by.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-dashed border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span>No prerequisites. This task can be worked on immediately.</span>
                </div>
              ) : (
                task.blocked_by.map((blockerId) => {
                  const blocker = allTasks.find((t) => t.id === blockerId);
                  const isBlockerDone = blocker?.effectiveStatus === 'done';

                  return (
                    <div
                      key={blockerId}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        isBlockerDone
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isBlockerDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <span className="font-mono">{blockerId}</span>
                            <span className="text-slate-400">•</span>
                            <span className="truncate">{blocker?.title || 'Unknown Task'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Status: <span className="font-semibold uppercase">{blocker?.status || 'Unknown'}</span> ({blocker?.room} • {blocker?.trade})
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBlocker(blockerId)}
                        title="Unlink blocker"
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                  className="flex-1 bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">+ Link a prerequisite task...</option>
                  {availableBlockers.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.id}] {b.title} ({b.room} - {b.status})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddBlocker}
                  disabled={!selectedBlockerToAdd}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Downstream Unlocks Section */}
          {task.dependentTasks.length > 0 && (
            <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-900/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold">Downstream Work Unlocked by this Task</h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Marking this task &quot;Done&quot; will immediately help unblock these {task.dependentTasks.length} tasks:
              </p>
              <div className="space-y-1.5 pt-1">
                {task.dependentTasks.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-2 rounded-xl bg-slate-900/80 border border-amber-800/20 text-xs flex items-center justify-between text-slate-200"
                  >
                    <span className="font-mono text-amber-400 font-semibold">{dep.id}:</span>
                    <span className="flex-1 px-2 truncate">{dep.title}</span>
                    <span className="text-[11px] text-slate-400">{dep.room}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waiting On Bottleneck Card */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-slate-200">Waiting On / External Bottleneck</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isWaiting}
                  onChange={(e) => setIsWaiting(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                Active Bottleneck
              </label>
            </div>

            {isWaiting && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Waiting On Owner</label>
                    <select
                      value={waitingOwner}
                      onChange={(e) => setWaitingOwner(e.target.value as WaitingOnOwner)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="Jay">Jay (Homeowner Decision / Selection)</option>
                      <option value="Joe">Joe (GC / Subcontractor Mobilization)</option>
                      <option value="Township">Township (Permit / Inspector)</option>
                      <option value="Supplier">Supplier (Delivery / Backorder)</option>
                      <option value="Trade">Trade (Specialty Subcontractor)</option>
                      <option value="Architect">Architect / Engineer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={waitingDate}
                      onChange={(e) => setWaitingDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Bottleneck Description / Action Needed</label>
                  <input
                    type="text"
                    placeholder="e.g. Waiting on slab delivery confirmation, callback from inspector..."
                    value={waitingDesc}
                    onChange={(e) => setWaitingDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details / Classification */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Room & Trade Classification</h3>
              <button
                type="button"
                onClick={() => {
                  if (isEditingMeta) {
                    handleSaveMeta();
                  } else {
                    setIsEditingMeta(true);
                  }
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                {isEditingMeta ? 'Save Changes' : 'Edit Info'}
              </button>
            </div>

            {isEditingMeta ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Room / Location</label>
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Trade</label>
                    <input
                      type="text"
                      value={trade}
                      onChange={(e) => setTrade(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Outcome Stage</label>
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Detailed Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Room</span>
                  <span className="font-semibold text-slate-200">{task.room}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Trade</span>
                  <span className="font-semibold text-slate-200">{task.trade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Outcome</span>
                  <span className="font-semibold text-slate-200">{task.outcome}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned</span>
                  <span className="font-semibold text-slate-200">{task.assigned_to || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Created</span>
                  <span className="font-semibold text-slate-200">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Field Notes & Activity Thread */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-200">Field Notes Thread</h3>
              </div>
              <span className="text-xs text-slate-400">
                {task.notes?.length || 0} note{task.notes?.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {!task.notes || task.notes.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No notes yet. Add on-site updates, measurements, or approvals below.
                </div>
              ) : (
                task.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          note.author === 'Joe'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {note.author} {note.author === 'Joe' ? '(GC)' : '(Homeowner)'}
                      </span>
                      <span className="text-slate-500">
                        {new Date(note.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Note Input */}
            <form onSubmit={handleSendNote} className="flex gap-2">
              <input
                type="text"
                placeholder={`Post note as ${activeRole}...`}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!noteText.trim()}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete punch list task ${task.id}?`)) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-xl hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Item</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
