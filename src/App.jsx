
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
  // TODO M4 data-model: persist tasks in localStorage.
  const [tasks, setTasks] = useLocalStorage(
      'vibetracker.tasks',
      INITIAL_TASKS
  );

  // TODO M5 crud-modal: null means the modal is closed.
  // An object with id: null means we're creating a task.
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  function openNewTask() {
    setFormData({ ...emptyForm });
    setEditing({ id: null });
  }

  function openEditTask(task) {
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      assignee: task.assignee,
      dueDate: task.dueDate || '',
    });
    setEditing(task);
  }

  function closeModal() {
    setEditing(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) return;

    if (editing.id === null) {
      const newTask = {
        id: `task-${Date.now()}`,
        ...formData,
        title,
        dueDate: formData.dueDate || null,
        createdDate: new Date().toISOString().slice(0, 10),
      };

      setTasks((currentTasks) => [...currentTasks, newTask]);
    } else {
      setTasks((currentTasks) =>
          currentTasks.map((task) =>
              task.id === editing.id
                  ? {
                    ...task,
                    ...formData,
                    title,
                    dueDate: formData.dueDate || null,
                  }
                  : task
          )
      );
    }

    closeModal();
  }

  function deleteTask() {
    if (editing.id === null) {
      closeModal();
      return;
    }

    const confirmed = window.confirm(
        "Delete this task? You won't be able to restore it."
    );

    if (!confirmed) return;

    setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== editing.id)
    );

    closeModal();
  }

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
      <div className="min-h-screen bg-[#121820] p-6 text-[#F1F5F9]">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">My project</h1>
          <p className="mt-2 text-sm text-[#B0BCCB]">
            Keep development tasks, AI context and project
            deliverables together in one workspace.
          </p>
        </header>

        <main>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Task board</h2>
              <p className="mt-1 text-sm text-[#B0BCCB]">
                {tasks.length} tasks
              </p>
            </div>

            <button
                type="button"
                onClick={openNewTask}
                className="rounded-md bg-[#7DD3A7] px-4 py-2 text-sm font-semibold text-[#121820] hover:opacity-90"
            >
              + New task
            </button>
          </div>

          {/* TODO M11 anchors: render the Anchor Board above the Kanban. */}

          {/* M4: Render the four task columns. */}
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
                      <h3 className="font-semibold">{stage.label}</h3>
                      <span className="rounded-full bg-[#283545] px-2 py-1 text-xs text-[#B0BCCB]">
                    {stageTasks.length}
                  </span>
                    </div>

                    <div className="space-y-3">
                      {stageTasks.map((task) => (
                          <button
                              type="button"
                              key={task.id}
                              onClick={() => openEditTask(task)}
                              className="block w-full rounded-md border border-[#465568] bg-[#283545] p-3 text-left hover:border-[#7DD3A7]"
                          >
                      <span className="block text-sm font-medium">
                        {task.title}
                      </span>
                            <span className="mt-2 block text-sm leading-5 text-[#B0BCCB]">
                        {task.description || 'No description provided.'}
                      </span>
                            <span className="mt-3 block text-xs text-[#A5B4FC]">
                        {task.type === 'bug' ? 'Bug' : 'Feature'}
                              {' · '}
                              {task.assignee}
                      </span>
                          </button>
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

        {/* M5: Create and edit modal. */}
        {editing !== null && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeModal();
                }}
            >
              <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="task-modal-title"
                  className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#465568] bg-[#1D2733] p-6 shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 id="task-modal-title" className="text-xl font-semibold">
                    {editing.id === null ? 'New task' : 'Edit task'}
                  </h2>
                  <button
                      type="button"
                      onClick={closeModal}
                      aria-label="Close modal"
                      className="rounded px-2 py-1 text-xl text-[#B0BCCB] hover:bg-[#283545]"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="task-title" className="mb-1 block text-sm font-medium">
                      Title *
                    </label>
                    <input
                        id="task-title"
                        name="title"
                        value={formData.title}
                        onChange={updateField}
                        required
                        autoFocus
                        className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                        placeholder="e.g. Build the login page"
                    />
                  </div>

                  <div>
                    <label htmlFor="task-description" className="mb-1 block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                        id="task-description"
                        name="description"
                        value={formData.description}
                        onChange={updateField}
                        rows={3}
                        className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                        placeholder="What needs to be done?"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="task-type" className="mb-1 block text-sm font-medium">
                        Type
                      </label>
                      <select
                          id="task-type"
                          name="type"
                          value={formData.type}
                          onChange={updateField}
                          className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9]"
                      >
                        <option value="feature">Feature</option>
                        <option value="bug">Bug</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="task-status" className="mb-1 block text-sm font-medium">
                        Status
                      </label>
                      <select
                          id="task-status"
                          name="status"
                          value={formData.status}
                          onChange={updateField}
                          className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9]"
                      >
                        {STAGES.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              {stage.label}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="task-assignee" className="mb-1 block text-sm font-medium">
                        Owner
                      </label>
                      <select
                          id="task-assignee"
                          name="assignee"
                          value={formData.assignee}
                          onChange={updateField}
                          className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9]"
                      >
                        {TEAM.map((person) => (
                            <option key={person} value={person}>
                              {person}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="task-due-date" className="mb-1 block text-sm font-medium">
                        Due date
                      </label>
                      <input
                          id="task-due-date"
                          name="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={updateField}
                          className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 border-t border-[#465568] pt-4">
                    <div>
                      {editing.id !== null && (
                          <button
                              type="button"
                              onClick={deleteTask}
                              className="rounded-md border border-[#FDA4AF] px-3 py-2 text-sm text-[#FDA4AF] hover:bg-[#FDA4AF]/10"
                          >
                            Delete task
                          </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                          type="button"
                          onClick={closeModal}
                          className="rounded-md border border-[#465568] px-3 py-2 text-sm hover:bg-[#283545]"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          className="rounded-md bg-[#7DD3A7] px-4 py-2 text-sm font-semibold text-[#121820] hover:opacity-90"
                      >
                        Save task
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
        )}
      </div>
  );
}
