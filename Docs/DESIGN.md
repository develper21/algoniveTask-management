# 🎨 Design System

# TaskFlow – Clean. Focused. Productive.

This document defines the visual design system, UI components, and user experience guidelines for the TaskFlow application. The goal is to create a modern, minimal and team-friendly interface with a consistent look and feel.

---

## 1. Design Principles

| Principle | Meaning |
|---|---|
| 👥 **User-Centered** | Simple and intuitive for busy teams — zero training needed. |
| 🍃 **Minimal & Clean** | Reduce clutter and focus on tasks and content. |
| 🧩 **Consistent** | Follow a unified design system across every page. |
| ⚡ **Responsive** | Works on laptops, tablets and phones. |
| ♿ **Accessible** | Clear contrast, focus rings and keyboard-friendly controls. |

## 2. Color Palette

Primary colors used across the application (defined in `Frontend/tailwind.config.js`):

| Swatch | Name | Hex | Usage |
|---|---|---|---|
| 🟦 | **Primary** | `#6366F1` (primary-500) | Main brand color — buttons, links, active states |
| 🟪 | **Primary Dark** | `#4F46E5` (primary-600) | Hover states, emphasis |
| 🟩 | **Success** | `#10B981` | Completed tasks, success toasts |
| 🟨 | **Warning** | `#F59E0B` | Due-soon tasks, caution states |
| 🟥 | **Error** | `#EF4444` | Errors, overdue tasks, destructive actions |
| ⬜ | **Background** | `#F9FAFB` (gray-50) | App background |
| ⬛ | **Surface** | `#FFFFFF` | Cards, modals, sidebar |
| 🔲 | **Border** | `#E5E7EB` (gray-200) | Card borders, dividers, inputs |

Task priority colors: **High** → red · **Medium** → amber · **Low** → green.
Task status: **Pending** → gray · **In Progress** → indigo · **Completed** → emerald.

## 3. Typography

We use **Inter** as the primary font for a clean, modern and highly readable interface:

| Element | Style |
|---|---|
| Page titles | `text-2xl font-bold text-gray-900` |
| Section headings | `text-lg font-semibold text-gray-900` |
| Body text | `text-sm text-gray-700` |
| Secondary text | `text-sm text-gray-500` |
| Badges / labels | `text-xs font-medium` (`.badge` class) |

Font stack: `'Inter', -apple-system, 'Segoe UI', 'Roboto', sans-serif` (set in `index.css`).

## 4. UI Components

Standard components to be used throughout the app (implemented as utility classes in `index.css`):

**Buttons** — use the `.btn` base plus a variant:

| Variant | Class | Example |
|---|---|---|
| Primary | `.btn .btn-primary` | Create Task, Login |
| Secondary | `.btn .btn-secondary` | Cancel, Filter |
| Destructive | `.btn .btn-danger` | Delete Task |

**Other building blocks:**

- **Inputs** — `.input`: full-width, rounded-lg, indigo focus ring.
- **Cards** — `.card`: white surface, rounded-xl, soft shadow, `p-6`.
- **Badges** — `.badge`: rounded-full pill for status/priority/role chips.
- **Toasts** — `react-hot-toast`, top-right; success green, error red.
- **Skeletons** — `.skeleton` shimmer while data loads.
- **Modals / Dropdowns** — rounded-xl white panels with `animate-slide-in` / `animate-fade-in`.

## 5. Layout & UX Guidelines

- **App shell:** left `Sidebar` (dashboard, board, teams, messaging, notifications, settings, profile) + top `Navbar` (search, theme toggle, notifications bell with unread badge, avatar menu) — composed in `Layout.jsx`.
- **Spacing:** sections separated by `gap-6`/`space-y-6`; consistent `p-6` card padding.
- **States:** every list view implements loading (skeleton), empty (icon + CTA) and error (retry) states.
- **Feedback:** every mutating action shows a success/error toast; destructive actions always confirm first.
- **Motion:** subtle only — 200–300 ms fades/slides; no attention-seeking animations.
