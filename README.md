# Ayra Hospital frontend deployment

## Vercel

The frontend and backend are separate Git repositories and Vercel projects. Deploy this frontend repository with the project's **Root Directory** set to the repository root (`.`). The Vercel configuration builds the Vite app, publishes `dist`, and rewrites client-side routes such as `/login` to the SPA entry point.

All browser API requests use the same-origin `/api` path with `credentials: "include"`. In production, the rewrite in `vercel.json` forwards those requests to the backend, keeping the HttpOnly `ayra_token` cookie on the frontend origin:

`VITE_API_BASE_URL=/api`

Ensure the frontend Vercel project's `VITE_API_BASE_URL` environment variable is `/api` in every deployed environment, then redeploy the frontend. A Vercel environment variable overrides `.env.production`. The client always sends requests through `/api`; it never reads `document.cookie` or relies on a cookie-change event.

Local Vite development uses `/api` and proxies it to `VITE_API_PROXY_TARGET` (default `http://localhost:3001`). For a different production backend deployment, update the API rewrite destination in `vercel.json`.

Public account registration sends `POST /api/v1/auth/register` with `username`, `email`, `firstName`, `lastName`, a user-chosen `password`, optional `phone`, `gender`, and `role`. Public registration does not sign the user in. Patient registration from the admin user form is deferred; staff accounts are managed through the admin-only endpoints. The backend must hash passwords and enforce session and role authorization server-side.

The admin dashboard's Create user quick action opens the account form at `/admin/users/new`, protected by the backend-verified admin session. Staff management lists, filters, sorts, and edits staff using `GET /api/v1/admin/users` and `PATCH /api/v1/admin/users/:id`.

On startup, refresh, and when a hidden tab becomes visible, the app calls `GET /api/v1/auth/me`. A successful response restores the verified user and the CSRF token from the `X-CSRF-Token` header; a 401 clears in-memory auth state; network and server errors remain an explicit session-check error. Login uses `POST /api/v1/auth/login`, updates auth state from its response, and retains the returned CSRF token in memory only. Logout uses `POST /api/v1/auth/logout`; success or a 401 clears auth state. Passwords, session identifiers, and CSRF tokens are never written to browser storage, and the HttpOnly cookie is never read by JavaScript.

## Admin dashboard

The admin dashboard requires a backend-verified admin session. Its patient-account list is live account data; it is not clinical data. Metrics, appointments, activity, schedule, and administrative actions are marked as preview/sample data and do not represent connected clinical records or live hospital operations. Search filters the sample appointments and the live patient-account list.
