
import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate ISO 'YYYY-MM-DD'
 * @property {string} createdDate ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// This is a solo project, as specified in PRD §8.
export const TEAM = ['Ben'];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota or private-mode error — silently ignore for this prototype.
    }
  }, [key, value]);

  return [value, setValue];
}

// M4: Seed the board with tasks so it isn't empty on first load.
const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Set up project structure',
    description: 'Review the starter files and organise the project.',
    type: 'feature',
    status: 'done',
    assignee: 'Ben',
    dueDate: null,
    createdDate: '2026-10-27',
  },
  {
    id: 'task-2',
    title: 'Build the Kanban board',
    description: 'Display tasks in four columns based on their status.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Ben',
    dueDate: null,
    createdDate: '2026-10-27',
  },
  {
    id: 'task-3',
    title: 'Review task layout',
    description: 'Check that task cards are easy to read and scan.',
    type: 'feature',
    status: 'review',
    assignee: 'Ben',
    dueDate: null,
    createdDate: '2026-10-27',
  },
  {
    id: 'task-4',
    title: 'Test board rendering',
    description: 'Check that all four columns display correctly.',
    type: 'bug',
    status: 'todo',
    assignee: 'Ben',
    dueDate: null,
    createdDate: '2026-10-27',
  },
];

export default function App() {
  // TODO M4 data-model:
  // Store tasks and render cards in the matching status column.
  const [tasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);

  // TODO M5 crud-modal:
  // const [editing, setEditing] = useState(null);

  // TODO M11 anchors:
  // const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', []);

  return (
      <div className="min-h-screen bg-[#121820] p-6 text-[#F1F5F9]">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">
            My project
          </h1>
          <p className="mt-2 text-sm text-[#B0BCCB]">
            Keep development tasks, AI context and project
            deliverables together in one workspace.
          </p>
        </header>

        {/* TODO M11 anchors: render the Anchor Board above the Kanban. */}

        <main>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Task board
            </h2>
            <span className="text-sm text-[#B0BCCB]">
            {tasks.length} tasks
          </span>
          </div>

          {/* TODO M4 data-model: render tasks in the four columns. */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((stage) => {
              const stageTasks = tasks.filter(
                  (task) => task.status === stage.id
              );

              return (
                  <section
                      key={stage.id}
                      className="min-h-64 rounded-lg border border-[#465568] bg-[#1D2733] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">
                        {stage.label}
                      </h3>
                      <span className="rounded-full bg-[#283545] px-2 py-1 text-xs text-[#B0BCCB]">
                    {stageTasks.length}
                  </span>
                    </div>

                    <div className="space-y-3">
                      {stageTasks.map((task) => (
                          <article
                              key={task.id}
                              className="rounded-md border border-[#465568] bg-[#283545] p-3"
                          >
                            <h4 className="text-sm font-medium">
                              {task.title}
                            </h4>
                            <p className="mt-2 text-sm leading-5 text-[#B0BCCB]">
                              {task.description}
                            </p>
                          </article>
                      ))}

                      {stageTasks.length === 0 && (
                          <p className="rounded-md border border-dashed border-[#465568] p-4 text-sm text-[#B0BCCB]">
                            No tasks in this column yet.
                          </p>
                      )}
                    </div>
                  </section>
              );
            })}
          </div>
        </main>
      </div>
  );
}
