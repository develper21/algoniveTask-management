# 📋 Development Rules

# TaskFlow – Project Guidelines for AI & Human Collaboration

This document defines the development rules, coding standards, and best practices for the TaskFlow application. These rules ensure consistency, maintainability, security and quality across the codebase. Both AI assistants and human contributors must follow these guidelines.

---

## 1. General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before making changes.
- ✅ Keep the code clean, readable and well-structured.
- ✅ Prioritize simplicity and maintainability.
- ✅ Do not duplicate logic. Reuse existing components, utilities or services.
- ✅ Make small, focused changes instead of large, risky edits.
- ✅ Do not modify unrelated files.
- ✅ Write self-explanatory code with meaningful variable and function names.

## 2. Technology & Coding Standards

Rules related to the tech stack and coding style:

| Area | Rule |
|---|---|
| 🟦 **Language** | Use modern JavaScript (ES Modules). No CommonJS `require` in source files. |
| ⚛️ **Framework** | React 18 with hooks; keep components small and state local. |
| 🎨 **Styling** | Use Tailwind CSS and follow the design system in DESIGN.md — no inline styles or new CSS files. |
| 🔀 **Routing** | Add pages under `src/pages/` and register them in `App.jsx` (protected routes go inside `ProtectedRoute`). |
| 🌐 **API Calls** | ALL HTTP requests must go through `src/services/api.js` service objects — never call axios/fetch directly in components. |
| 🛡️ **Validation** | Every backend write route validates input with the Joi schemas in `server/utils/validation.js`. |
| 🚨 **Errors** | Backend routes use `asyncHandler` + the centralized `errorHandler`; respond with `{ success, message, ... }`. |
| 🧪 **Testing** | Verify API changes with the Postman collections in `server/postman/` and `Frontend/postman/`. |
| 📦 **Dependencies** | Use stable, well-maintained packages. Avoid adding dependencies for small utilities. |
| 📁 **File Naming** | Components/pages use `PascalCase.jsx`; backend route files use `camelCaseRoutes.js`. |

## 3. Project Structure

Follow the defined folder structure in ARCHITECTURE.md to keep the codebase organized:

- ✅ Reusable UI components live in `Frontend/src/components/`.
- ✅ All HTTP logic lives in `Frontend/src/services/` (one service object per feature in `api.js`).
- ✅ Global state (auth, messaging, theme) lives in `Frontend/src/context/` providers.
- ✅ Database models live in `server/models/`; business services in `server/services/`.
- ✅ Cross-cutting backend helpers (auth, cache, email, security, rate limiting, logging) live in `server/utils/`.
- ✅ New API endpoints must be added to the matching `server/routes/*Routes.js` file **and** both Postman collections.
- ❌ Do not create new top-level folders without a clear reason documented in ARCHITECTURE.md.

## 4. Security & Privacy Rules

- 🔐 Never commit secrets — use `.env.local` (both apps provide `.env.example` templates).
- 🔐 Passwords are hashed with bcrypt (12 rounds); never log or return `passwordHash`.
- 🔐 OTPs are hashed at rest, expire in 10 minutes and allow max 3 verification attempts.
- 🛡️ Keep rate limiters enabled on auth and upload routes; do not weaken security middleware.
- 🧱 Messaging payloads must remain end-to-end encrypted — the server never stores plaintext message content.
- 📝 Log security-relevant actions through `AuditLogger`.

## 5. Git & Delivery Rules

- 🔀 Small, descriptive commits (`feat:`, `fix:`, `docs:`, `refactor:`).
- 🚫 Never commit `node_modules`, `.env*`, `uploads/` or `logs/` (already gitignored).
- ✅ Before handing off: run the frontend build (`npm run build`) and smoke-test the backend health endpoint (`GET /api/health`).
- 📚 Update the relevant Docs file when behavior, features or structure change.
