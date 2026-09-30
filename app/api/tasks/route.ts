import { NextResponse } from 'next/server';
import { INITIAL_TASKS } from '@/lib/seed-data';
import { PunchTask } from '@/types/punchlist';

// Global in-memory cache for serverless invocation lifecycle
let memoryTasks: PunchTask[] = [...INITIAL_TASKS];

export async function GET() {
  return NextResponse.json({
    tasks: memoryTasks,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If an action is specified
    if (body.action === 'reset') {
      memoryTasks = [...INITIAL_TASKS];
      return NextResponse.json({ success: true, tasks: memoryTasks });
    }

    if (body.action === 'setAll' && Array.isArray(body.tasks)) {
      memoryTasks = body.tasks;
      return NextResponse.json({ success: true, tasks: memoryTasks });
    }

    if (body.action === 'upsert' && body.task) {
      const updatedTask: PunchTask = body.task;
      const index = memoryTasks.findIndex((t) => t.id === updatedTask.id);
      if (index >= 0) {
        memoryTasks[index] = updatedTask;
      } else {
        memoryTasks.unshift(updatedTask);
      }
      return NextResponse.json({ success: true, task: updatedTask, tasks: memoryTasks });
    }

    if (body.action === 'delete' && body.id) {
      memoryTasks = memoryTasks.filter((t) => t.id !== body.id);
      return NextResponse.json({ success: true, tasks: memoryTasks });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload', details: String(error) }, { status: 500 });
  }
}
