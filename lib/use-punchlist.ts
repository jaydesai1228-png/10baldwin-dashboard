'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PunchTask, TaskStatus, UserRole, TaskWithDependencyState, FieldNote } from '@/types/punchlist';
import { INITIAL_TASKS } from '@/lib/seed-data';
import { computeDependencyGraph, calculateBurndownAnalytics } from '@/lib/dependency-engine';

const STORAGE_KEY = '10baldwin_tasks_v1';
const ROLE_KEY = '10baldwin_active_role_v1';

export function usePunchList() {
  const [tasks, setTasks] = useState<PunchTask[]>(INITIAL_TASKS);
  const [activeRole, setActiveRoleState] = useState<UserRole>('Jay');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from LocalStorage or API
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
      if (savedRole === 'Jay' || savedRole === 'Joe') {
        setActiveRoleState(savedRole);
      }

      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setIsLoaded(true);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Try fetching from API
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.tasks) && data.tasks.length > 0) {
          setTasks(data.tasks);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.tasks));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Use initial seed
        setTasks(INITIAL_TASKS);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Save tasks helper
  const persistTasks = useCallback((newTasks: PunchTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch {
      // ignore
    }

    // Sync to API asynchronously
    setIsSaving(true);
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setAll', tasks: newTasks }),
    })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => setIsSaving(false), 300);
      });
  }, []);

  const setActiveRole = useCallback((role: UserRole) => {
    setActiveRoleState(role);
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch {
      // ignore
    }
  }, []);

  // Compute dependency graph with automatic unlock calculation
  const computedTasks: TaskWithDependencyState[] = useMemo(() => {
    return computeDependencyGraph(tasks);
  }, [tasks]);

  const burndownAnalytics = useMemo(() => {
    return calculateBurndownAnalytics(computedTasks);
  }, [computedTasks]);

  // Update a task
  const updateTask = useCallback(
    (updatedTask: PunchTask) => {
      const newTasks = tasks.map((t) => (t.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : t));
      persistTasks(newTasks);
    },
    [tasks, persistTasks]
  );

  // Update a task's status
  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      const newTasks = tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      persistTasks(newTasks);
    },
    [tasks, persistTasks]
  );

  // Add a field note to a task
  const addFieldNote = useCallback(
    (taskId: string, noteText: string) => {
      if (!noteText.trim()) return;
      const note: FieldNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        author: activeRole,
        text: noteText.trim(),
        createdAt: new Date().toISOString(),
      };

      const newTasks = tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            notes: [...(t.notes || []), note],
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      persistTasks(newTasks);
    },
    [tasks, activeRole, persistTasks]
  );

  // Create new task
  const createTask = useCallback(
    (taskData: Partial<PunchTask>) => {
      const nextIdNum =
        tasks.reduce((max, t) => {
          const match = t.id.match(/\d+/);
          return match ? Math.max(max, parseInt(match[0], 10)) : max;
        }, 800) + 1;

      const newTask: PunchTask = {
        id: `TASK-${nextIdNum}`,
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        room: taskData.room || 'General',
        trade: taskData.trade || 'General GC',
        outcome: taskData.outcome || 'Trim & Finishes',
        status: taskData.status || 'ready',
        priority: taskData.priority || 'medium',
        blocked_by: taskData.blocked_by || [],
        waiting_on: taskData.waiting_on,
        notes: taskData.notes || [],
        assigned_to: taskData.assigned_to || activeRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      persistTasks([newTask, ...tasks]);
      return newTask;
    },
    [tasks, activeRole, persistTasks]
  );

  // Delete task
  const deleteTask = useCallback(
    (taskId: string) => {
      // Remove from tasks and also remove from blocked_by of any other tasks
      const newTasks = tasks
        .filter((t) => t.id !== taskId)
        .map((t) => ({
          ...t,
          blocked_by: (t.blocked_by || []).filter((id) => id !== taskId),
        }));
      persistTasks(newTasks);
    },
    [tasks, persistTasks]
  );

  // Reset to initial defaults
  const resetToDefaults = useCallback(() => {
    persistTasks(INITIAL_TASKS);
  }, [persistTasks]);

  return {
    tasks: computedTasks,
    rawTasks: tasks,
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
    burndownAnalytics,
  };
}
