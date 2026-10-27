# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · completed for design-done.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

Quiet productivity: My project should feel like a tidy developer workspace that makes tasks, deadlines and AI context easy to find without overwhelming the user.

References for the vibe:

Raycast — a compact interface with a clear visual hierarchy and a developer-focused feel.

Linear — a focused approach to task management, with restrained use of colour.

Visual Studio Code — a familiar working environment for developers, with dark surfaces and readable technical content.

Anti-references — what we are explicitly not trying to look like:

Overloaded project dashboards with competing colours, oversized widgets, decorative gradients and unnecessary visual effects. The board should prioritise useful task information over decoration.

The design will use a dark theme with charcoal backgrounds rather than pure black. Softer text colours, restrained accents and clearly separated surfaces should help keep the interface readable and comfortable.

The target audience is software development teams, including developers at different experience levels and project managers. The interface should make task status, ownership, deadlines and supporting development context easy to understand.

The initial workflow will focus on one team. The design should leave room for that team to use multiple boards in the future, without making advanced team management part of the initial implementation.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#7DD3A7` | Header, "+" button, focus rings |
| `brand-accent` | `#A5B4FC` | Highlights, hover states, links |
| `surface-page` | `#121820` | Page background |
| `surface-card` | `#1D2733` | Card background |
| `text-primary` | `#F1F5F9` | Body text |
| `text-muted` | `#B0BCCB` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#C4B5FD` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#FDA4AF` | Cards tagged `bug` (accent stripe + icon) |
### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#7DD3FC` | More than 2 days out |
| `due-warning` | `#FCD34D` | Less than 24 hours |
| `due-overdue` | `#FDA4AF` | Past due |
| `due-neutral` | `#A8B3C2` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Inter | Gives headings a clear hierarchy without making the interface feel heavy. |
| Body | Inter | Keeps task descriptions, labels and supporting information readable and easy to scan. |
| Monospace (tags, badges, code) | JetBrains Mono | Distinguishes technical content and AI prompt context from ordinary interface text. |
Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

- **Cards:** Use charcoal surfaces with a subtle 1px border, compact spacing and no heavy shadows.
- **Buttons:** Use solid brand-colour fills for primary actions, understated secondary styles and rounded corners.
- **Modal:** Centre the task form over a dimmed background, with clearly labelled fields and a charcoal surface.
- **Empty states:** Use a subtle dashed border, muted text and a clear next step for adding a task.
- **Drag affordance (if used):** Show a visible drag handle and movement feedback, with a status selector as an alternative.
## 5. Voice / microcopy

| Where | Text |
|---|---|
| "+" button label | `+ New task` |
| Empty column placeholder | `No tasks in this column yet.` |
| Toast after "Copy as Prompt Context" | `Task context copied. Ready to paste.` |
| Confirm-delete message | `Delete this task? You won't be able to restore it.` |
| Handoff toast (M7 `task-owner`) | `Owner updated to {name}.` |
## 6. Logo / wordmark

- **Product name:** My project
- **Wordmark style:** Use “My project” in Inter semibold, with a small brand-primary colour accent and no separate icon.
## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---
*DESIGN.md version: hackathon-starter v1*
