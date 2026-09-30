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
import { TopFocusSection } from '@/components/TopFocusSection';
import { ConstructionSequencesModal } from '@/components/ConstructionSequencesModal';
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
  Layers,
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
    focusQueues,
    moveInCountdown,
    snoozeTask,
    unsnoozeTask,
  } = usePunchList();

  const [activeTab, setActiveTab] = useState<ViewTab>('ready_today');
  const [selectedTask, setSelectedTask] = useState<TaskWithDependencyState | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSequencesOpen, setIsSequencesOpen] = useState(false);

  // Keep selectedTask in sync when tasks update
  const currentSelectedTask = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || null
    : null;

  // Counts for tabs
  const readyTodayCount = tasks.filter(
    (t) => t.unsatisfiedBlockers.length === 0 && t.effectiveStatus !== 'done'
  ).length;

  const waitingOnCount = tasks.filter(
    (t) => ((Boolean(t.waiting_on) && t.waiting_on?.isWaiting !== false) || t.status === 'pending_external') && t.effectiveStatus !== 'done'
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-700">Loading 10 Baldwin Dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        activeRole === 'Jay'
          ? 'theme-jay bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white'
          : 'theme-joe bg-zinc-50 text-zinc-900 selection:bg-amber-500 selection:text-slate-950'
      }`}
    >
      {/* Sticky Header with Fast Role Switcher & Move-In Milestone */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onReset={resetToDefaults}
        isSaving={isSaving}
        daysLeft={moveInCountdown.daysLeft}
        onOpenSequences={() => setIsSequencesOpen(true)}
      />

      {/* Primary Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
        {/* Top 3 Critical Focus Queue & 3-Day Snooze Engine */}
        <TopFocusSection
          activeRole={activeRole}
          focusQueues={focusQueues}
          moveInCountdown={moveInCountdown}
          onOpenDetails={setSelectedTask}
          onQuickStatusChange={updateTaskStatus}
          onSnooze={snoozeTask}
          onUnsnooze={unsnoozeTask}
          onOpenSequences={() => setIsSequencesOpen(true)}
        />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          {/* Tab 1: Ready to Work Today */}
          <button
            type="button"
            onClick={() => setActiveTab('ready_today')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ready_today'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ready to Work Today</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'ready_today' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {readyTodayCount}
            </span>
          </button>

          {/* Tab 2: Burn Down & Progress */}
          <button
            type="button"
            onClick={() => setActiveTab('burndown')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'burndown'
                ? activeRole === 'Jay'
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeRole === 'Jay' ? 'text-indigo-600' : 'text-amber-600'}`} />
            <span>Burn Down & Progress</span>
          </button>

          {/* Tab 3: Waiting On / Chasing */}
          <button
            type="button"
            onClick={() => setActiveTab('waiting_on')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'waiting_on'
                ? 'bg-purple-50 text-purple-900 border border-purple-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-purple-600" />
            <span>Waiting On / Chasing</span>
            {waitingOnCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'waiting_on' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
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
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'all_tasks'
                ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent'
            }`}
          >
            <ListTodo className="w-4 h-4 text-blue-600" />
            <span>All Punch Items</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'all_tasks' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
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
            onSnooze={snoozeTask}
            onUnsnooze={unsnoozeTask}
            activeRole={activeRole}
          />
        )}

        {activeTab === 'burndown' && <BurndownView tasks={tasks} activeRole={activeRole} />}

        {activeTab === 'waiting_on' && (
          <WaitingOnView
            tasks={tasks}
            onOpenDetails={setSelectedTask}
            onQuickStatusChange={updateTaskStatus}
            activeRole={activeRole}
          />
        )}

        {activeTab === 'all_tasks' && (
          <AllTasksView
            tasks={tasks}
            onOpenDetails={setSelectedTask}
            onQuickStatusChange={updateTaskStatus}
            activeRole={activeRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>10 Baldwin Construction Punch List • Shared Access for Jay & Joe</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Backup JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
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
        onSnooze={snoozeTask}
        onUnsnooze={unsnoozeTask}
      />

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        allTasks={tasks}
        onCreateTask={createTask}
        activeRole={activeRole}
      />

      {/* Key Construction Sequences & Rules Modal */}
      <ConstructionSequencesModal
        isOpen={isSequencesOpen}
        onClose={() => setIsSequencesOpen(false)}
        daysLeft={moveInCountdown.daysLeft}
      />
    </div>
  );
}
