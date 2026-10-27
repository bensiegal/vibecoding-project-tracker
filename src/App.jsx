
import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker
 *
 * Milestones:
 * M4  data-model
 * M5  crud-modal
 * M6  tag-style
 * M7  task-owner
 * M8  due-tint
 * M9  context
 * M10 copy-prompt
 * M11 anchors
 * M12 secret-sauce
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate
 * @property {string} createdDate
 * @property {string} context
 * @property {string} contextTool
 * @property {string|null} contextUpdatedAt
 */

// The four columns of the board, in render order.
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// This is a solo project, as specified in PRD §8.
export const TEAM = ['Ben'];

const AI_TOOLS = [
  'Claude',
  'ChatGPT',
  'Cursor',
  'Lovable',
  'Replit',
  'Other',
];

const CONTEXT_TEMPLATE = `## Background
What is this task about?

## Constraints
What requirements or limitations should the AI know about?

## Tried so far
What have you already tried? What worked or failed?

## Pick up
What should the AI do next?`;

/**
 * A localStorage hook that persists data across reloads.
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

// Seed the board with tasks so it isn't empty on first load.
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
    context: '',
    contextTool: '',
    contextUpdatedAt: null,
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
    context: '',
    contextTool: '',
    contextUpdatedAt: null,
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
    context: '',
    contextTool: '',
    contextUpdatedAt: null,
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
    context: '',
    contextTool: '',
    contextUpdatedAt: null,
  },
];

// Return today's date using the local calendar.
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Calculate the deadline state and its visual treatment.
function getDueDateInfo(task) {
  const colors = {
    safe: '#7DD3FC',
    warning: '#FCD34D',
    overdue: '#FDA4AF',
    neutral: '#A8B3C2',
  };

  if (!task.dueDate) {
    return {
      state: 'neutral',
      label: 'No due date',
      color: colors.neutral,
    };
  }

  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  const formattedDate = dueDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Completed tasks should not be shown as overdue.
  if (task.status === 'done') {
    return {
      state: 'neutral',
      label: `Due ${formattedDate} · Completed`,
      color: colors.neutral,
    };
  }

  // Compare calendar dates rather than hours.
  const dueTimestamp = Date.parse(`${task.dueDate}T00:00:00Z`);
  const todayTimestamp = Date.parse(
      `${getLocalDateString()}T00:00:00Z`
  );

  const daysUntilDue = Math.round(
      (dueTimestamp - todayTimestamp) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) {
    const daysOverdue = Math.abs(daysUntilDue);

    return {
      state: 'overdue',
      label: `Overdue by ${daysOverdue} day${daysOverdue === 1 ? '' : 's'}`,
      color: colors.overdue,
    };
  }

  if (daysUntilDue === 0) {
    return {
      state: 'warning',
      label: 'Due today',
      color: colors.warning,
    };
  }

  if (daysUntilDue <= 3) {
    return {
      state: 'warning',
      label: `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`,
      color: colors.warning,
    };
  }

  return {
    state: 'safe',
    label: `Due ${formattedDate}`,
    color: colors.safe,
  };
}

// M9: Format the last-updated timestamp as a relative time.
function getRelativeTime(timestamp) {
  if (!timestamp) {
    return 'Not updated yet';
  }

  const updatedAt = new Date(timestamp);

  if (Number.isNaN(updatedAt.getTime())) {
    return 'Not updated yet';
  }

  const elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - updatedAt.getTime()) / 1000)
  );

  if (elapsedSeconds < 60) {
    return 'just now';
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays < 30) {
    return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
  }

  return updatedAt.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function App() {
  // M4: Persist tasks in localStorage.
  // Keep this key unchanged so existing tasks are preserved.
  const [tasks, setTasks] = useLocalStorage(
      'vibetracker.tasks',
      INITIAL_TASKS
  );

  // M5: null means the modal is closed.
  // An object with id: null means we're creating a task.
  const [editing, setEditing] = useState(null);

  // M9: New tasks start with a context briefing template.
  const emptyForm = {
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '',
    context: CONTEXT_TEMPLATE,
    contextTool: '',
    contextUpdatedAt: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  function openNewTask() {
    setFormData({ ...emptyForm });
    setEditing({ id: null });
  }

  function openEditTask(task) {
    setFormData({
      title: task.title || '',
      description: task.description || '',
      type: task.type || 'feature',
      status: task.status || 'todo',
      assignee: task.assignee || TEAM[0],
      dueDate: task.dueDate || '',
      context: task.context || '',
      contextTool: task.contextTool || '',
      contextUpdatedAt: task.contextUpdatedAt || null,
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
        createdDate: getLocalDateString(),
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

  // M9: Editing the Context field automatically updates its timestamp.
  function updateField(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === 'context'
          ? { contextUpdatedAt: new Date().toISOString() }
          : {}),
    }));
  }

  // M7: Hand off a task without opening the edit modal.
  function handleAssigneeChange(taskId, newAssignee) {
    setTasks((currentTasks) =>
        currentTasks.map((task) =>
            task.id === taskId
                ? { ...task, assignee: newAssignee }
                : task
        )
    );
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
                      {stageTasks.map((task) => {
                        // M8: Calculate the deadline styling for this card.
                        const dueInfo = getDueDateInfo(task);

                        return (
                            <article
                                key={task.id}
                                className="rounded-md border border-[#465568] bg-[#283545] p-3 transition-colors hover:border-[#7DD3A7]"
                                style={{
                                  borderLeftWidth: '4px',
                                  borderLeftColor: dueInfo.color,
                                }}
                            >
                              {/* M5: Click task details to edit the task. */}
                              <button
                                  type="button"
                                  onClick={() => openEditTask(task)}
                                  className="block w-full text-left"
                                  aria-label={`Edit task: ${task.title}`}
                              >
                          <span className="block text-sm font-medium">
                            {task.title}
                          </span>

                                <span className="mt-2 block text-sm leading-5 text-[#B0BCCB]">
                            {task.description ||
                                'No description provided.'}
                          </span>

                                {/* M6: Feature and Bug badges. */}
                                <span className="mt-3 flex items-center justify-between gap-2">
                            <span
                                className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                                    task.type === 'bug'
                                        ? 'bg-[#FDA4AF] text-[#3A1820]'
                                        : 'bg-[#C4B5FD] text-[#25203A]'
                                }`}
                            >
                              {task.type === 'bug' ? 'BUG' : 'FEATURE'}
                            </span>

                                  {/* M7: Assignee badge. */}
                                  <span className="inline-flex items-center gap-1 rounded-md border border-[#465568] bg-[#1D2733] px-2 py-1 text-xs text-[#F1F5F9]">
                              <span aria-hidden="true">👤</span>
                                    {task.assignee || 'Unassigned'}
                            </span>
                          </span>
                              </button>

                              {/* M8: Due-date label with state colour. */}
                              <div className="mt-3">
                          <span
                              className="inline-flex max-w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold"
                              style={{
                                backgroundColor: dueInfo.color,
                                color: '#121820',
                              }}
                          >
                            <span aria-hidden="true">
                              {dueInfo.state === 'overdue'
                                  ? '!'
                                  : dueInfo.state === 'warning'
                                      ? '◷'
                                      : dueInfo.state === 'safe'
                                          ? '✓'
                                          : '—'}
                            </span>
                            {dueInfo.label}
                          </span>
                              </div>

                              {/* M9: Show whether the task has a context briefing. */}
                              {task.context?.trim() && (
                                  <div className="mt-3">
                            <span className="inline-flex items-center gap-1 rounded-md border border-[#A5B4FC]/40 bg-[#A5B4FC]/10 px-2 py-1 text-xs text-[#C7D2FE]">
                              <span aria-hidden="true">✦</span>
                              Context added
                            </span>
                                  </div>
                              )}

                              {/* M7: Hand off to another team member. */}
                              <div className="mt-3 border-t border-[#465568] pt-3">
                                <label
                                    htmlFor={`assignee-${task.id}`}
                                    className="mb-1 block text-xs font-medium text-[#B0BCCB]"
                                >
                                  Hand off to...
                                </label>

                                <select
                                    id={`assignee-${task.id}`}
                                    value={task.assignee || ''}
                                    onChange={(event) =>
                                        handleAssigneeChange(
                                            task.id,
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-md border border-[#465568] bg-[#121820] px-2 py-2 text-sm text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                                >
                                  {TEAM.map((person) => (
                                      <option key={person} value={person}>
                                        {person}
                                      </option>
                                  ))}
                                </select>
                              </div>
                            </article>
                        );
                      })}

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
                  className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#465568] bg-[#1D2733] p-6 shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2
                      id="task-modal-title"
                      className="text-xl font-semibold"
                  >
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                        htmlFor="task-title"
                        className="mb-1 block text-sm font-medium"
                    >
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
                    <label
                        htmlFor="task-description"
                        className="mb-1 block text-sm font-medium"
                    >
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
                      <label
                          htmlFor="task-type"
                          className="mb-1 block text-sm font-medium"
                      >
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
                      <label
                          htmlFor="task-status"
                          className="mb-1 block text-sm font-medium"
                      >
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
                      <label
                          htmlFor="task-assignee"
                          className="mb-1 block text-sm font-medium"
                      >
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
                      <label
                          htmlFor="task-due-date"
                          className="mb-1 block text-sm font-medium"
                      >
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

                  {/* M9: Task Context briefing. */}
                  <section className="rounded-lg border border-[#465568] bg-[#121820]/60 p-4">
                    <div className="mb-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold">
                            Context briefing
                          </h3>
                          <p className="mt-1 text-sm text-[#B0BCCB]">
                            Give your AI the background it needs to continue
                            this task.
                          </p>
                        </div>

                        <span className="rounded-md border border-[#A5B4FC]/40 bg-[#A5B4FC]/10 px-2 py-1 text-xs font-medium text-[#C7D2FE]">
                      Markdown
                    </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                          htmlFor="task-context-tool"
                          className="mb-1 block text-sm font-medium"
                      >
                        AI tool
                        <span className="ml-2 font-normal text-[#B0BCCB]">
                      Optional
                    </span>
                      </label>

                      <select
                          id="task-context-tool"
                          name="contextTool"
                          value={formData.contextTool}
                          onChange={updateField}
                          className="w-full rounded-md border border-[#465568] bg-[#121820] px-3 py-2 text-[#F1F5F9] outline-none focus:border-[#A5B4FC]"
                      >
                        <option value="">Select an AI tool...</option>
                        {AI_TOOLS.map((tool) => (
                            <option key={tool} value={tool}>
                              {tool}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <label
                            htmlFor="task-context"
                            className="block text-sm font-medium"
                        >
                          Context
                        </label>

                        <span
                            className="text-xs text-[#B0BCCB]"
                            aria-live="polite"
                        >
                      Last updated{' '}
                          {getRelativeTime(formData.contextUpdatedAt)}
                    </span>
                      </div>

                      <textarea
                          id="task-context"
                          name="context"
                          value={formData.context}
                          onChange={updateField}
                          rows={9}
                          spellCheck
                          className="w-full resize-y rounded-md border border-[#465568] bg-[#121820] px-3 py-3 font-mono text-sm leading-6 text-[#F1F5F9] outline-none placeholder:text-[#7C8A9B] focus:border-[#A5B4FC]"
                          placeholder={CONTEXT_TEMPLATE}
                      />

                      <p className="mt-2 text-xs leading-5 text-[#B0BCCB]">
                        Include background, constraints, what you have tried,
                        and what the AI should do next. Your context is saved
                        when you save the task.
                      </p>
                    </div>
                  </section>

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
