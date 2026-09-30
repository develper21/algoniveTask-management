# 🏛️ System Architecture

# TaskFlow – Team Productivity Platform

This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the **TaskFlow** application.

---

## 1. High-Level Architecture

TaskFlow follows a full-stack architecture using **React** on the client and **Node.js/Express** on the server, with MongoDB as the database and Socket.IO for realtime features.

```
┌───────────────┐   HTTPS / JSON   ┌──────────────────┐   REST + WebSocket   ┌──────────────────┐
│     User      │◄────────────────►│  React Frontend  │◄────────────────────►│  Express Backend │
│ (Web Browser) │                  │    (Vite SPA)    │    Socket.IO realtime│   (Node.js API)  │
└───────────────┘                  └──────────────────┘                      └────────┬─────────┘
                                                                                     │
                                                              ┌──────────────┬───────┴──────┬──────────────┐
                                                              ▼              ▼              ▼              ▼
                                                       ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
                                                       │  MongoDB   │ │    Redis   │ │  Socket.IO │ │    SMTP    │
                                                       │   Atlas    │ │   Cache    │ │ (Realtime) │ │   Email    │
                                                       │ (Data)     │ │ (Optional) │ │            │ │ (OTP etc.) │
                                                       └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

**Request flow:** Browser → Axios (`services/api.js`) → Express middleware chain (CORS → security headers → rate limiter → JWT auth → Joi validation) → Route handler → Service/Model → MongoDB → Response. Side effects (notifications, emails, activity, cache invalidation) fire inside the route handlers.

## 2. Technology Stack

Technologies used in the project and their purpose:

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 (Vite) | UI framework |
| Language | JavaScript (ES Modules) | Modern JS across client & server |
| Routing | React Router v6 | Client-side routing & protected routes |
| Styling | Tailwind CSS | Utility-first styling (see DESIGN.md) |
| Backend | Node.js + Express | REST API & middleware |
| Database | MongoDB + Mongoose | Data models, indexes & queries |
| Authentication | JWT + bcrypt | Stateless auth & password hashing |
| Realtime | Socket.IO | Messaging, presence & live notifications |
| Cache | Redis (optional) | Hot-data caching & login counters |
| Email | Nodemailer + node-cron | OTP emails, task alerts & reminders |
| File Storage | Multer (local disk) | Task attachments (≤ 25 MB) |
| Validation | Joi | Request body/query validation |
| Encryption | @noble/curves (client) | E2E key exchange for messaging |
| Deployment | Netlify (FE) + Render (BE) | Hosting & deployment |
| Version Control | Git + GitHub | Source code management |

## 3. Folder Structure

The project follows a client/server split to keep code organized and scalable:

```text
TaskFlow/
├── Frontend/                  # React client (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, Sidebar, TaskCard...)
│   │   ├── context/           # Auth, Messaging & Theme providers
│   │   ├── pages/             # Route pages (Login, Dashboard, TaskBoard, Messaging...)
│   │   ├── services/          # API layer — ALL HTTP calls live here (api.js)
│   │   ├── utils/             # Client helpers
│   │   ├── App.jsx            # Router + protected/public route wrappers
│   │   └── main.jsx           # Entry point
│   └── postman/               # Frontend Postman collection
├── server/                    # Express API
│   ├── routes/                # authRoutes, teamRoutes, taskRoutes,
│   │                          # notificationRoutes, messagingRoutes
│   ├── models/                # Mongoose schemas (User, Team, Task, Message...)
│   ├── services/              # Business logic (messaging service)
│   ├── utils/                 # Middleware & helpers (auth, cache, email, security,
│   │                          # rateLimiter, errorHandler, auditLogger, socket...)
│   ├── uploads/tasks/         # Task attachment files on disk
│   ├── server.js              # Entry point (Express + Socket.IO + startup)
│   └── postman/               # Server Postman collection
└── Docs/                      # Project documentation (PRD, ARCHITECTURE, RULES...)
```

## 4. Data & Realtime Design

- **Auth:** JWT (7-day expiry) issued at signup/login; sent as `Authorization: Bearer <token>`; socket connections authenticate with the same token in the handshake.
- **Caching:** Redis caches user profiles, task details, attachment lists and the activity feed; every write operation invalidates the affected keys. The app degrades gracefully when Redis is unavailable.
- **Realtime rooms:** `user:{id}` (notifications & presence), `team:{id}` (dashboard activity), `conversation:{id}` (chat).
- **Messaging privacy:** the server stores only ciphertext (`ciphertext` + `iv` + `authTag` + per-recipient payloads). Keys are registered per device via `/api/messaging/keys`.
- **Files:** attachments are written to `server/uploads/tasks/{taskId}/` and indexed in the `TaskAttachment` collection; deleting a task removes its files from disk.
