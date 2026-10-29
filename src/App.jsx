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

export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

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

// M11: Categories for project deliverable links.
const ANCHOR_TYPES = ['PRD', 'Design', 'Repository', 'Live demo', 'Other'];
const INITIAL_ANCHORS = [];
const EMPTY_ANCHOR_FORM = {
  title: '',
  url: '',
  type: 'Other',
  note: '',
};

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
      // Ignore localStorage errors in this prototype.
    }
  }, [key, value]);

  return [value, setValue];
}

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

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

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

  if (task.status === 'done') {
    return {
      state: 'neutral',
      label: `Due ${formattedDate} · Completed`,
      color: colors.neutral,
    };
  }

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

// M12: Project Pulse metrics.
function getProjectPulse(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'done').length;
  const unfinished = tasks.filter((task) => task.status !== 'done');
  const today = getLocalDateString();

  const overdue = unfinished.filter(
      (task) => task.dueDate && task.dueDate < today
  );

  const dueSoon = unfinished.filter((task) => {
    if (!task.dueDate) return false;

    const daysUntilDue = Math.round(
        (Date.parse(`${task.dueDate}T00:00:00Z`) -
            Date.parse(`${today}T00:00:00Z`)) /
        (1000 * 60 * 60 * 24)
    );

    return daysUntilDue >= 0 && daysUntilDue <= 3;
  });

  const byStage = STAGES.map((stage) => ({
    ...stage,
    count: tasks.filter((task) => task.status === stage.id).length,
  }));

  return {
    total,
    completed,
    unfinished: unfinished.length,
    overdue: overdue.length,
    dueSoon: dueSoon.length,
    completionPercent:
        total === 0 ? 0 : Math.round((completed / total) * 100),
    byStage,
  };
}

// M12: Recommend an unfinished task using status and due-date priority.
function getSmartNextStep(tasks) {
  const today = getLocalDateString();
  const unfinished = tasks.filter((task) => task.status !== 'done');

  if (unfinished.length === 0) {
    return {
      task: null,
      title: tasks.length ? 'You’re all caught up' : 'Start your project',
      reason: tasks.length
          ? 'Every task is marked as done. Review your deliverables or add the next task.'
          : 'Add your first task to start building project momentum.',
    };
  }

  function priority(task) {
    if (task.dueDate && task.dueDate < today) return 0;

    if (task.dueDate) {
      const daysUntilDue = Math.round(
          (Date.parse(`${task.dueDate}T00:00:00Z`) -
              Date.parse(`${today}T00:00:00Z`)) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntilDue === 0) return 1;
      if (daysUntilDue <= 3) return 2;
    }

    if (task.status === 'in-progress') return 3;
    if (task.status === 'review') return 4;
    if (task.status === 'todo') return 5;

    return 6;
  }

  const sorted = [...unfinished].sort((a, b) => {
    const difference = priority(a) - priority(b);

    if (difference !== 0) return difference;

    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return (a.title || '').localeCompare(b.title || '');
  });

  const task = sorted[0];
  let reason = 'This is the next unfinished task in your workflow.';

  if (task.dueDate && task.dueDate < today) {
    reason = 'This task is overdue, so it is the most urgent item to review.';
  } else if (task.dueDate === today) {
    reason = 'This task is due today. Prioritise it before lower-priority work.';
  } else if (task.dueDate) {
    const daysUntilDue = Math.round(
        (Date.parse(`${task.dueDate}T00:00:00Z`) -
            Date.parse(`${today}T00:00:00Z`)) /
        (1000 * 60 * 60 * 24)
    );

    if (daysUntilDue <= 3) {
      reason = 'This task is due soon, so it is worth prioritising.';
    } else if (task.status === 'in-progress') {
      reason = 'This task is already in progress. Finishing it can keep work moving.';
    } else if (task.status === 'review') {
      reason = 'This task is waiting for review. Resolve feedback or move it forward.';
    }
  } else if (task.status === 'in-progress') {
    reason = 'This task is already in progress. Finishing it can keep work moving.';
  } else if (task.status === 'review') {
    reason = 'This task is waiting for review. Resolve feedback or move it forward.';
  } else if (!task.context?.trim()) {
    reason = 'Add a context briefing so the next AI handoff has useful background.';
  } else if (!task.description?.trim()) {
    reason = 'Add a short description so the task has a clear goal.';
  }

  return { task, title: task.title, reason };
}

/**
 * M10: Build a complete, portable prompt from a task.
 * This text can be pasted into an AI coding assistant.
 */
function buildTaskPrompt(task) {
  const stageLabel =
      STAGES.find((stage) => stage.id === task.status)?.label ||
      task.status ||
      'To Do';

  const dueDate = task.dueDate || 'Not set';
  const aiTool = task.contextTool || 'Not specified';

  return `# Task: ${task.title || 'Untitled task'}

## Task details
- Type: ${task.type === 'bug' ? 'Bug' : 'Feature'}
- Status: ${stageLabel}
- Owner: ${task.assignee || 'Unassigned'}
- Due date: ${dueDate}
- Preferred AI tool: ${aiTool}

## Description
${task.description?.trim() || 'No description provided.'}

## Context briefing
${task.context?.trim() || 'No context briefing has been added yet.'}

## Instructions
Use the task details and context above to help with this task.
Respect the stated constraints and review what has already been tried before suggesting changes.
If important information is missing, ask clarifying questions rather than inventing project details.
Explain your proposed changes and identify any relevant files before making broad changes.`;
}

/**
 * Copy text using the Clipboard API where available, with a fallback.
 */
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.select();

  let copied = false;

  try {
    copied = document.execCommand('copy');
  } finally {
    document.body.removeChild(textArea);
  }

  if (!copied) {
    throw new Error('Clipboard access was unavailable.');
  }
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(email.trim() || 'Guest');
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-[#121820] px-4 py-10 text-[#F1F5F9]">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#465568] bg-[#1D2733] shadow-2xl md:grid-cols-2">
          <div className="flex flex-col justify-between bg-[#17212B] p-8 md:p-10">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7DD3A7] text-2xl font-black text-[#121820]">
                V
              </div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7DD3A7]">
                Vibecoding Project Tracker
              </p>
              <h1 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                Turn your next idea into progress.
              </h1>
              <p className="mt-4 max-w-sm leading-7 text-[#B0BCCB]">
                Keep tasks, AI context and project deliverables together in one workspace.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-[#465568] bg-[#1D2733] p-3">
                <div className="mb-2 h-2 w-8 rounded-full bg-[#7DD3A7]" />
                <p className="text-xs text-[#B0BCCB]">Track work</p>
              </div>
              <div className="rounded-lg border border-[#465568] bg-[#1D2733] p-3">
                <div className="mb-2 h-2 w-8 rounded-full bg-[#A5B4FC]" />
                <p className="text-xs text-[#B0BCCB]">Keep context</p>
              </div>
              <div className="rounded-lg border border-[#465568] bg-[#1D2733] p-3">
                <div className="mb-2 h-2 w-8 rounded-full bg-[#7DD3FC]" />
                <p className="text-xs text-[#B0BCCB]">Ship work</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="mt-2 text-sm text-[#B0BCCB]">
                Sign in to open your project workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="demo-email" className="mb-2 block text-sm font-medium text-[#F1F5F9]">
                Email address
              </label>
              <input
                  id="demo-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mb-5 w-full rounded-lg border border-[#465568] bg-[#121820] px-4 py-3 text-[#F1F5F9] outline-none transition placeholder:text-[#718096] focus:border-[#7DD3A7] focus:ring-2 focus:ring-[#7DD3A7]/20"
              />

              <label htmlFor="demo-password" className="mb-2 block text-sm font-medium text-[#F1F5F9]">
                Password
              </label>
              <input
                  id="demo-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter any password"
                  className="w-full rounded-lg border border-[#465568] bg-[#121820] px-4 py-3 text-[#F1F5F9] outline-none transition placeholder:text-[#718096] focus:border-[#7DD3A7] focus:ring-2 focus:ring-[#7DD3A7]/20"
              />

              <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-[#7DD3A7] px-4 py-3 font-semibold text-[#121820] transition hover:bg-[#9AE2BC] focus:outline-none focus:ring-2 focus:ring-[#7DD3A7] focus:ring-offset-2 focus:ring-offset-[#1D2733]"
              >
                Sign in to tracker <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-[#718096]">
              <div className="h-px flex-1 bg-[#465568]" />
              OR
              <div className="h-px flex-1 bg-[#465568]" />
            </div>

            <button
                type="button"
                onClick={() => onLogin('Guest')}
                className="w-full rounded-lg border border-[#465568] px-4 py-3 font-medium text-[#F1F5F9] transition hover:border-[#7DD3A7] hover:bg-[#283545]"
            >
              Continue as guest
            </button>

            <p className="mt-6 text-center text-xs leading-5 text-[#718096]">
              Demo sign-in only. No account, password or server validation is used.
            </p>
          </div>
        </div>
      </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  // Keep the existing storage key to preserve saved tasks.
  const [tasks, setTasks] = useLocalStorage(
      'vibetracker.tasks',
      INITIAL_TASKS
  );

  // M11: Deliverables use their own storage key, separate from tasks.
  const [anchors, setAnchors] = useLocalStorage(
      'vibetracker.anchors',
      INITIAL_ANCHORS
  );
  const [anchorFormOpen, setAnchorFormOpen] = useState(false);
  const [editingAnchorId, setEditingAnchorId] = useState(null);
  const [anchorForm, setAnchorForm] = useState({ ...EMPTY_ANCHOR_FORM });
  const [anchorError, setAnchorError] = useState('');

  const [editing, setEditing] = useState(null);

  // M10: Feedback for copy actions.
  const [copiedTaskId, setCopiedTaskId] = useState(null);
  const [copyErrorTaskId, setCopyErrorTaskId] = useState(null);
  const [modalCopyMessage, setModalCopyMessage] = useState('');

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

  // M12: Live dashboard metrics and task recommendation.
  const projectPulse = getProjectPulse(tasks);
  const smartNextStep = getSmartNextStep(tasks);

  function openNewTask() {
    setFormData({ ...emptyForm });
    setModalCopyMessage('');
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

    setModalCopyMessage('');
    setEditing(task);
  }

  function closeModal() {
    setEditing(null);
    setModalCopyMessage('');
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

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === 'context'
          ? { contextUpdatedAt: new Date().toISOString() }
          : {}),
    }));

    setModalCopyMessage('');
  }

  function handleAssigneeChange(taskId, newAssignee) {
    setTasks((currentTasks) =>
        currentTasks.map((task) =>
            task.id === taskId
                ? { ...task, assignee: newAssignee }
                : task
        )
    );
  }

  // M11: Create, edit and delete project deliverable anchors.
  function openNewAnchor() {
    setAnchorForm({ ...EMPTY_ANCHOR_FORM });
    setEditingAnchorId(null);
    setAnchorError('');
    setAnchorFormOpen(true);
  }

  function openEditAnchor(anchor) {
    setAnchorForm({
      title: anchor.title || '',
      url: anchor.url || '',
      type: anchor.type || 'Other',
      note: anchor.note || '',
    });
    setEditingAnchorId(anchor.id);
    setAnchorError('');
    setAnchorFormOpen(true);
  }

  function closeAnchorForm() {
    setAnchorFormOpen(false);
    setEditingAnchorId(null);
    setAnchorForm({ ...EMPTY_ANCHOR_FORM });
    setAnchorError('');
  }

  function handleAnchorSubmit(event) {
    event.preventDefault();

    const title = anchorForm.title.trim();
    const rawUrl = anchorForm.url.trim();

    if (!title || !rawUrl) {
      setAnchorError('Add both a title and a URL.');
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      setAnchorError('Enter a valid URL, including https:// or http://.');
      return;
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      setAnchorError('Only http:// and https:// links are supported.');
      return;
    }

    const savedAnchor = {
      id: editingAnchorId || `anchor-${Date.now()}`,
      title,
      url: parsedUrl.href,
      type: ANCHOR_TYPES.includes(anchorForm.type)
          ? anchorForm.type
          : 'Other',
      note: anchorForm.note.trim(),
    };

    setAnchors((currentAnchors) =>
        editingAnchorId
            ? currentAnchors.map((anchor) =>
                anchor.id === editingAnchorId ? savedAnchor : anchor
            )
            : [...currentAnchors, savedAnchor]
    );

    closeAnchorForm();
  }

  function deleteAnchor(anchorId) {
    const confirmed = window.confirm(
        'Delete this deliverable link? This cannot be undone.'
    );

    if (!confirmed) return;

    setAnchors((currentAnchors) =>
        currentAnchors.filter((anchor) => anchor.id !== anchorId)
    );

    if (editingAnchorId === anchorId) closeAnchorForm();
  }

  // M10: Copy a saved task's complete briefing.
  async function handleCopyTaskContext(task) {
    setCopiedTaskId(null);
    setCopyErrorTaskId(null);

    try {
      await copyToClipboard(buildTaskPrompt(task));
      setCopiedTaskId(task.id);
    } catch (error) {
      console.error('Unable to copy task context:', error);
      setCopyErrorTaskId(task.id);
    }
  }

  // M10: Copy the current editor contents, including unsaved changes.
  async function handleCopyEditorContext() {
    setModalCopyMessage('');

    const taskForPrompt = {
      ...formData,
      id: editing?.id ?? null,
      title: formData.title.trim() || 'Untitled task',
      dueDate: formData.dueDate || null,
    };

    try {
      await copyToClipboard(buildTaskPrompt(taskForPrompt));
      setModalCopyMessage('Copied! Paste it into your AI tool.');
    } catch (error) {
      console.error('Unable to copy editor context:', error);
      setModalCopyMessage(
          'Copy failed. Check your browser clipboard permissions.'
      );
    }
  }

  if (!isLoggedIn) {
    return (
        <LoginScreen
            onLogin={(email) => {
              setLoginEmail(email || 'Guest');
              setIsLoggedIn(true);
            }}
        />
    );
  }

  return (
      <div className="min-h-screen bg-[#121820] p-6 text-[#F1F5F9]">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My project</h1>
            <p className="mt-2 text-sm text-[#B0BCCB]">
              Keep development tasks, AI context and project deliverables together
              in one workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#B0BCCB]">
              Signed in as <span className="font-medium text-[#F1F5F9]">{loginEmail || 'Guest'}</span>
            </span>
            <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                className="rounded-lg border border-[#465568] px-3 py-2 text-sm font-medium text-[#F1F5F9] transition hover:bg-[#283545]"
            >
              Sign out
            </button>
          </div>
        </header>

        <main>
          {/* M12: Project Pulse and Smart Next Step */}
          <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Project Pulse */}
            <div className="rounded-xl border border-[#465568] bg-[#1D2733] p-5 xl:col-span-2">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Project pulse</h2>
                  <p className="mt-1 text-sm text-[#B0BCCB]">
                    A quick overview of progress and work that needs attention.
                  </p>
                </div>

                <span className="rounded-full border border-[#7DD3A7]/40 bg-[#7DD3A7]/10 px-3 py-1 text-sm font-semibold text-[#7DD3A7]">
                  {projectPulse.completionPercent}% complete
                </span>
              </div>

              <div
                  className="mb-5 h-2 overflow-hidden rounded-full bg-[#283545]"
                  role="progressbar"
                  aria-label="Project completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={projectPulse.completionPercent}
              >
                <div
                    className="h-full rounded-full bg-[#7DD3A7] transition-all"
                    style={{ width: `${projectPulse.completionPercent}%` }}
                />
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-[#283545] p-3">
                  <p className="text-xs text-[#B0BCCB]">Total tasks</p>
                  <p className="mt-1 text-2xl font-semibold">{projectPulse.total}</p>
                </div>
                <div className="rounded-lg bg-[#283545] p-3">
                  <p className="text-xs text-[#B0BCCB]">Completed</p>
                  <p className="mt-1 text-2xl font-semibold text-[#7DD3A7]">{projectPulse.completed}</p>
                </div>
                <div className="rounded-lg bg-[#283545] p-3">
                  <p className="text-xs text-[#B0BCCB]">Still open</p>
                  <p className="mt-1 text-2xl font-semibold">{projectPulse.unfinished}</p>
                </div>
                <div className="rounded-lg bg-[#283545] p-3">
                  <p className="text-xs text-[#B0BCCB]">Overdue</p>
                  <p className={`mt-1 text-2xl font-semibold ${projectPulse.overdue > 0 ? 'text-[#FDA4AF]' : 'text-[#F1F5F9]'}`}>
                    {projectPulse.overdue}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Tasks by stage</h3>
                  <span className="text-xs text-[#B0BCCB]">
                    {projectPulse.dueSoon} due in the next 3 days
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {projectPulse.byStage.map((stage) => (
                      <div key={stage.id} className="rounded-md border border-[#465568] px-3 py-2">
                        <p className="text-xs text-[#B0BCCB]">{stage.label}</p>
                        <p className="mt-1 text-lg font-semibold">{stage.count}</p>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Next Step */}
            <div className="flex flex-col rounded-xl border border-[#A5B4FC]/40 bg-[#1D2733] p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A5B4FC]/15 text-lg text-[#C7D2FE]" aria-hidden="true">✦</span>
                <div>
                  <h2 className="text-lg font-semibold">Smart next step</h2>
                  <p className="text-xs text-[#B0BCCB]">A suggested task to focus on next</p>
                </div>
              </div>

              {smartNextStep.task ? (
                  <>
                    <p className="mt-2 break-words text-base font-semibold">{smartNextStep.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#B0BCCB]">{smartNextStep.reason}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#283545] px-2 py-1 text-xs text-[#F1F5F9]">
                      {STAGES.find((stage) => stage.id === smartNextStep.task.status)?.label || smartNextStep.task.status}
                    </span>
                      {smartNextStep.task.dueDate && (
                          <span className="rounded-md bg-[#283545] px-2 py-1 text-xs text-[#B0BCCB]">
                        Due {new Date(`${smartNextStep.task.dueDate}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </span>
                      )}
                    </div>
                    <button type="button" onClick={() => openEditTask(smartNextStep.task)} className="mt-auto pt-5 text-left text-sm font-semibold text-[#C7D2FE] underline underline-offset-4 hover:text-[#F1F5F9]">
                      Review this task →
                    </button>
                  </>
              ) : (
                  <>
                    <p className="mt-2 text-base font-semibold">{smartNextStep.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#B0BCCB]">{smartNextStep.reason}</p>
                    <button type="button" onClick={openNewTask} className="mt-auto pt-5 text-left text-sm font-semibold text-[#C7D2FE] underline underline-offset-4 hover:text-[#F1F5F9]">
                      + Add a task
                    </button>
                  </>
              )}

              <p className="mt-4 border-t border-[#465568] pt-3 text-xs leading-5 text-[#B0BCCB]">
                Suggestions use task status and due dates first, then highlight work that may need more detail.
              </p>
            </div>
          </section>

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

          {/* M11: Project deliverables */}
          <section className="mb-8 rounded-xl border border-[#465568] bg-[#1D2733] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Project deliverables</h2>
                <p className="mt-1 max-w-2xl text-sm leading-5 text-[#B0BCCB]">
                  Keep important project links in one place — your PRD, design,
                  repository and live demo.
                </p>
              </div>

              <button
                  type="button"
                  onClick={anchorFormOpen ? closeAnchorForm : openNewAnchor}
                  className="rounded-md bg-[#7DD3A7] px-3 py-2 text-sm font-semibold text-[#121820] hover:opacity-90"
              >
                {anchorFormOpen ? 'Cancel' : '+ Add deliverable'}
              </button>
            </div>

            {anchorFormOpen && (
                <form
                    onSubmit={handleAnchorSubmit}
                    className="mb-4 space-y-4 rounded-lg border border-[#465568] bg-[#121820] p-4"
                >
                  <h3 className="font-semibold">
                    {editingAnchorId ? 'Edit deliverable' : 'Add a deliverable'}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                          htmlFor="anchor-title"
                          className="mb-1 block text-sm font-medium"
                      >
                        Title *
                      </label>
                      <input
                          id="anchor-title"
                          value={anchorForm.title}
                          onChange={(event) =>
                              setAnchorForm((current) => ({
                                ...current,
                                title: event.target.value,
                              }))
                          }
                          required
                          maxLength={100}
                          placeholder="e.g. Project requirements"
                          className="w-full rounded-md border border-[#465568] bg-[#1D2733] px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                      />
                    </div>

                    <div>
                      <label
                          htmlFor="anchor-type"
                          className="mb-1 block text-sm font-medium"
                      >
                        Type
                      </label>
                      <select
                          id="anchor-type"
                          value={anchorForm.type}
                          onChange={(event) =>
                              setAnchorForm((current) => ({
                                ...current,
                                type: event.target.value,
                              }))
                          }
                          className="w-full rounded-md border border-[#465568] bg-[#1D2733] px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                      >
                        {ANCHOR_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="anchor-url"
                        className="mb-1 block text-sm font-medium"
                    >
                      URL *
                    </label>
                    <input
                        id="anchor-url"
                        type="url"
                        value={anchorForm.url}
                        onChange={(event) =>
                            setAnchorForm((current) => ({
                              ...current,
                              url: event.target.value,
                            }))
                        }
                        required
                        placeholder="https://..."
                        className="w-full rounded-md border border-[#465568] bg-[#1D2733] px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="anchor-note"
                        className="mb-1 block text-sm font-medium"
                    >
                      Note{' '}
                      <span className="font-normal text-[#B0BCCB]">
                    (optional)
                  </span>
                    </label>
                    <input
                        id="anchor-note"
                        value={anchorForm.note}
                        onChange={(event) =>
                            setAnchorForm((current) => ({
                              ...current,
                              note: event.target.value,
                            }))
                        }
                        maxLength={200}
                        placeholder="What is this deliverable for?"
                        className="w-full rounded-md border border-[#465568] bg-[#1D2733] px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-[#7DD3A7]"
                    />
                  </div>

                  {anchorError && (
                      <p className="text-sm text-[#FDA4AF]" role="alert">
                        {anchorError}
                      </p>
                  )}

                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={closeAnchorForm}
                        className="rounded-md border border-[#465568] px-3 py-2 text-sm hover:bg-[#283545]"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-[#7DD3A7] px-4 py-2 text-sm font-semibold text-[#121820] hover:opacity-90"
                    >
                      {editingAnchorId ? 'Save changes' : 'Save deliverable'}
                    </button>
                  </div>
                </form>
            )}

            {anchors.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#465568] px-4 py-6 text-center">
                  <p className="text-sm font-medium text-[#F1F5F9]">
                    No deliverables pinned yet
                  </p>
                  <p className="mt-1 text-sm text-[#B0BCCB]">
                    Add a link to your PRD, design, GitHub repository or deployed
                    app.
                  </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {anchors.map((anchor) => (
                      <article
                          key={anchor.id}
                          className="flex min-w-0 flex-col rounded-lg border border-[#465568] bg-[#283545] p-4"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="rounded-md border border-[#A5B4FC]/40 bg-[#A5B4FC]/10 px-2 py-1 text-xs font-medium text-[#C7D2FE]">
                      {anchor.type}
                    </span>

                          <div className="flex shrink-0 gap-3">
                            <button
                                type="button"
                                onClick={() => openEditAnchor(anchor)}
                                className="text-xs text-[#B0BCCB] underline underline-offset-2 hover:text-[#7DD3A7]"
                            >
                              Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteAnchor(anchor.id)}
                                className="text-xs text-[#FDA4AF] underline underline-offset-2 hover:opacity-80"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <h3 className="break-words font-semibold">{anchor.title}</h3>

                        {anchor.note && (
                            <p className="mt-1 break-words text-sm leading-5 text-[#B0BCCB]">
                              {anchor.note}
                            </p>
                        )}

                        <a
                            href={anchor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm font-medium text-[#7DD3A7] underline underline-offset-2 hover:opacity-80"
                        >
                          <span className="break-all">{anchor.url}</span>
                          <span aria-hidden="true" className="shrink-0">
                      ↗
                    </span>
                        </a>
                      </article>
                  ))}
                </div>
            )}
          </section>

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
                              {/* Click the task details to edit it. */}
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
                                  {task.description || 'No description provided.'}
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

                              {/* M8: Due-date label. */}
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

                              {/* M9: Context indicator. */}
                              {task.context?.trim() && (
                                  <div className="mt-3">
                                    <span className="inline-flex items-center gap-1 rounded-md border border-[#A5B4FC]/40 bg-[#A5B4FC]/10 px-2 py-1 text-xs text-[#C7D2FE]">
                                      <span aria-hidden="true">✦</span>
                                      Context added
                                    </span>
                                  </div>
                              )}

                              {/* M10: Copy the complete task prompt. */}
                              <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={() => handleCopyTaskContext(task)}
                                    className="w-full rounded-md border border-[#A5B4FC]/60 px-3 py-2 text-sm font-medium text-[#C7D2FE] hover:bg-[#A5B4FC]/10"
                                >
                                  {copiedTaskId === task.id
                                      ? '✓ Copied!'
                                      : copyErrorTaskId === task.id
                                          ? 'Copy failed — try again'
                                          : 'Copy context'}
                                </button>

                                {copiedTaskId === task.id && (
                                    <p
                                        className="mt-1 text-xs text-[#7DD3A7]"
                                        role="status"
                                    >
                                      Ready to paste into your AI tool.
                                    </p>
                                )}

                                {copyErrorTaskId === task.id && (
                                    <p
                                        className="mt-1 text-xs text-[#FDA4AF]"
                                        role="status"
                                    >
                                      Clipboard access failed. Check browser
                                      permissions and try again.
                                    </p>
                                )}
                              </div>

                              {/* M7: Hand off to a team member. */}
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
                                        handleAssigneeChange(task.id, event.target.value)
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
                            Give your AI the background it needs to continue this
                            task.
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
                      Last updated {getRelativeTime(formData.contextUpdatedAt)}
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
                        Include background, constraints, what you have tried, and
                        what the AI should do next. Your context is saved when you
                        save the task.
                      </p>
                    </div>
                  </section>

                  {/* M10: Copy the current form, even before saving. */}
                  <div className="rounded-lg border border-[#A5B4FC]/30 bg-[#A5B4FC]/5 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Ready to work with AI?</p>
                        <p className="mt-1 text-xs text-[#B0BCCB]">
                          Copy the task details and context into your AI tool.
                        </p>
                      </div>

                      <button
                          type="button"
                          onClick={handleCopyEditorContext}
                          className="rounded-md border border-[#A5B4FC]/60 px-3 py-2 text-sm font-medium text-[#C7D2FE] hover:bg-[#A5B4FC]/10"
                      >
                        Copy context
                      </button>
                    </div>

                    {modalCopyMessage && (
                        <p
                            className={`mt-2 text-sm ${
                                modalCopyMessage.startsWith('Copied')
                                    ? 'text-[#7DD3A7]'
                                    : 'text-[#FDA4AF]'
                            }`}
                            role="status"
                        >
                          {modalCopyMessage}
                        </p>
                    )}
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
