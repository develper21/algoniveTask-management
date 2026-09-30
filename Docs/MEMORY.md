# 🧠 Project Memory

# TaskFlow – Context, Progress & Important Notes

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions or for new contributors.

---

## 📅 Last Updated: Sep 29, 2026 · 🧭 Current Phase: Phase 5 – Hardening & Release

## 🎯 Current Status

- ✅ Project setup completed (React + Vite frontend, Express backend, MongoDB)
- ✅ Git repository initialized and pushed to GitHub
- ✅ Authentication (signup, login, OTP reset, protected routes) completed
- ✅ Teams & task management (CRUD, board, attachments, emails) completed
- ✅ Real-time notifications and E2E encrypted messaging completed
- 🔄 Working on documentation suite & production deployment polish

## ✅ Completed Tasks

| # | Task | Completed On |
|---|---|---|
| 1.1 | Initialize Vite + React frontend | Sep 30, 2026 |
| 1.2 | Configure Tailwind CSS | Sep 30, 2026 |
| 1.3 | Initialize Express server | Sep 30, 2026 |
| 1.4 | Connect MongoDB (Mongoose) | Sep 30, 2026 |
| 1.5 | Environment configs (.env) | Sep 30, 2026 |
| 2.1 | Signup & login APIs | Sep 30, 2026 |
| 2.2 | Login / Signup pages | Sep 30, 2026 |
| 2.3 | Protected & public routes | Sep 30, 2026 |
| 2.4 | Forgot password (OTP email) | Sep 30, 2026 |
| 2.5 | Verify OTP + reset password | Sep 30, 2026 |
| 2.6 | Profile page | Sep 30, 2026 |
| 3.1 | Team CRUD + member management | Sep 30, 2026 |
| 3.2 | Task CRUD with validation | Sep 30, 2026 |
| 3.3 | Task board (status columns) | Sep 30, 2026 |
| 3.4 | Dashboard stats & activity feed | Sep 30, 2026 |
| 3.5 | Task attachments | Sep 30, 2026 |
| 3.6 | Email notifications & reminders | Sep 30, 2026 |
| 4.1 | In-app notifications | Sep 30, 2026 |
| 4.2 | E2E encrypted messaging | Sep 30, 2026 |
| 4.3 | Direct & team conversations | Sep 30, 2026 |
| 5.1 | Rate limiting + security headers | Sep 30, 2026 |
| 5.2 | Audit logging + error handling | Sep 30, 2026 |
| 5.3 | Redis caching layer | Sep 30, 2026 |
| 5.4 | Postman collections (FE + Server) | Sep 30, 2026 |

## 🔄 In Progress

| # | Task | Notes |
|---|---|---|
| 5.5 | Documentation suite | PRD, ARCHITECTURE, RULES, DESIGN, TASKS, MEMORY |
| 5.6 | Production deployment | Netlify (FE) + Render (BE) — env vars ready |

## ⚠️ Important Notes & Decisions

- **API base URL:** `VITE_API_URL` (default `http://localhost:5000/api`). Server CORS reads `CLIENT_URL`.
- **Auth tokens** live in `localStorage.token` and are attached by an axios interceptor; a 401 clears storage and redirects to `/login`.
- **Admin accounts** require `ADMIN_INVITE_TOKEN` from the server env at signup.
- **Rate limits:** login locks for 15 min after 5 failed attempts; OTP requests limited to 1 per 5 min; uploads are separately throttled.
- **Redis is optional** — the app runs without it (cache layer degrades gracefully).
- **Messaging is E2E encrypted:** the server stores only `ciphertext/iv/authTag`; public keys are per-device via `/api/messaging/keys`.
- **Attachments** are capped at 25 MB/file, 10 files per upload, stored under `server/uploads/tasks/{taskId}/`.
- **Postman collections** (`server/postman/postman.json`, `Frontend/postman/postman.json`) auto-capture `token`, `teamId`, `taskId`, `conversationId`, etc. — run Login first.
- **Old Docs** (`SETUP_GUIDE`, `FEATURES_LIST`, etc.) were intentionally replaced by this 6-file suite.
