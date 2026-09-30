'use client';

import React, { useState } from 'react';
import { usePunchList } from '@/lib/use-punchlist';
import { ViewTab, TaskWithDependencyState, TaskStatus } from '@/types/punchlist';
import { Navbar } from '@/components/Navbar';
import { ReadyTodayView } from '@/components/views/ReadyTodayView';
import { BurndownView } from '@/components/views/BurndownView';
import { WaitingOnView } from '@/components/views/WaitingOnView';
import { AllTasksView } from '@/components/views/AllTasksView';
import { TaskModal } from '@/components/TaskModal';
import { NewTaskModal } from '@/components/NewTaskModal';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ListTodo,
  Download,
  Upload,
  HardHat,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    tasks,
    activeRole,
    setActiveRole,
    isLoaded,
    isSaving,
    updateTask,
    updateTaskStatus,
    addFieldNote,
    createTask,
    deleteTask,
    resetToDefaults,
  } = usePunchList();

  const [activeTab, setActiveTab] = useState<ViewTab>('ready_today');
  const [selectedTask, setSelectedTask] = useState<TaskWithDependencyState | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // Keep selectedTask in sync when tasks update
  const currentSelectedTask = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || null
    : null;

  // Counts for tabs
  const readyTodayCount = tasks.filter(
    (t) => t.unsatisfiedBlockers.length === 0 && t.effectiveStatus !== 'done'
  ).length;

  const waitingOnCount = tasks.filter(
    (t) => (t.waiting_on?.isWaiting || t.status === 'pending_external') && t.effectiveStatus !== 'done'
  ).length;

  // Backup export / import
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `10baldwin-punchlist-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          if (confirm(`Import ${imported.length} tasks? This will overwrite your current list.`)) {
            fetch('/api/tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'setAll', tasks: imported }),
            }).then(() => {
              window.location.reload();
            });
          }
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Loading 10 Baldwin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky Header with Fast Role Switcher */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onReset={resetToDefaults}
        isSaving={isSaving}
      />

      {/* Primary Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          {/* Tab 1: Ready to Work Today */}
          <button
            type="button"
            onClick={() => setActiveTab('ready_today')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ready_today'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Ready to Work Today</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'ready_today' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {readyTodayCount}
            </span>
          </button>

          {/* Tab 2: Burn Down & Progress */}
          <button
            type="button"
            onClick={() => setActiveTab('burndown')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'burndown'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Burn Down & Progress</span>
          </button>

          {/* Tab 3: Waiting On / Chasing */}
          <button
            type="button"
            onClick={() => setActiveTab('waiting_on')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'waiting_on'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-md shadow-orange-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span>Waiting On / Chasing</span>
            {waitingOnCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'waiting_on' ? 'bg-orange-500 text-slate-950' : 'bg-orange-950/80 text-orange-300'
                }`}
              >
                {waitingOnCount}
              </span>
            )}
          </button>

          {/* Tab 4: All Tasks */}
          <button
            type="button"
            onClick={() => setActiveTab('all_tasks')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'all_tasks'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-md shadow-sky-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ListTodo className="w-4 h-4 text-sky-400" />
            <span>All Punch Items</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'all_tasks' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tasks.length}
            </span>
          </button>
        </div>

        {/* View Content */}
        {activeTab === 'ready_today' && (
          <ReadyTodayView
            tasks={tasks}
            onOpenDetails={setSelectedTask}
            onQuickStatusChange={updateTaskStatus}
            onSwitchToWaitingTab={() => setActiveTab('waiting_on')}
          />
        )}

        {activeTab === 'burndown' && <BurndownView tasks={tasks} />}

        {activeTab === 'waiting_on' && (
          <WaitingOnView
            tasks={tasks}
            onOpenDetails={setSelectedTask}
            onQuickStatusChange={updateTaskStatus}
          />
        )}

        {activeTab === 'all_tasks' && (
          <AllTasksView
            tasks={tasks}
            onOpenDetails={setSelectedTask}
            onQuickStatusChange={updateTaskStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>10 Baldwin Construction Punch List • Shared Access for Jay & Joe</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>
      </footer>

      {/* Task Details Drawer / Modal */}
      <TaskModal
        task={currentSelectedTask}
        allTasks={tasks}
        activeRole={activeRole}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={updateTask}
        onUpdateStatus={updateTaskStatus}
        onAddFieldNote={addFieldNote}
        onDeleteTask={deleteTask}
      />

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        allTasks={tasks}
        onCreateTask={createTask}
        activeRole={activeRole}
      />
    </div>
  );
}
