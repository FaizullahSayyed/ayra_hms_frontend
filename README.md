# Ayra Hospital frontend deployment

## Vercel

The frontend and backend are separate Git repositories and Vercel projects. Deploy this frontend repository with the project's **Root Directory** set to the repository root (`.`). The Vercel configuration builds the Vite app, publishes `dist`, and rewrites client-side routes such as `/login` to the SPA entry point.

Production builds use the public API base URL in `.env.production`:

`https://ayra-hms-backend.vercel.app/api`

Set `VITE_API_BASE_URL` to one or more comma-separated backend API base URLs, with no quotes, for example `VITE_API_BASE_URL=http://localhost:3001/api,https://ayra-hms-backend.vercel.app/api`. The `/api` mount is followed by the client's `/v1/...` routes. URLs are tried in listed order and the next URL is used only when the previous fetch fails at the network level; HTTP responses such as validation, authentication, and server errors are returned directly without failover. Trailing slashes and duplicate URLs are normalized. The production environment uses the deployed backend first (and currently only).

After login or session restoration succeeds, the selected backend is kept in memory and preferred for subsequent requests. Logout is sent only to that same backend so its session cookie and CSRF token stay paired. This selection is not persisted to browser storage. Local Vite development uses `.env.development`; for a different backend deployment or a Vercel Preview environment, set the same comma-separated `VITE_API_BASE_URL` value in the frontend project's Vercel environment settings and redeploy. Vite environment variables are embedded at build time.

Public account registration sends `POST {VITE_API_BASE_URL}/v1/auth/register` with `username`, `email`, `firstName`, `lastName`, `password`, `phone` (optional), `gender`, and `role` (default `patient`). The admin Add Patient form sends these fields to `POST {VITE_API_BASE_URL}/v1/admin/users` and always fixes `role` to `patient`; it includes the admin session cookie and `X-CSRF-Token` header. The dashboard loads patient accounts from `GET {VITE_API_BASE_URL}/v1/admin/patients` with the admin session cookie and refreshes the list on return after successful creation. Patient account profiles are not clinical records. Both forms generate a random temporary password using the Web Crypto API; it is sent only in the HTTPS request and held only in page memory so the user can copy it after successful creation. It is never stored in local/session storage. The backend must hash it with a suitable password hashing algorithm and must never persist the plaintext. The backend must enforce session and role authorization server-side. Public registration does not sign the user in.

The admin dashboard's Create user quick action opens the shared account form at `/admin/users/new`, protected by the backend-verified admin session. Cancel returns to the originating dashboard location. After the backend confirms creation, the app returns to that location and displays an accessible success toast. Failed requests stay on the form and show the backend error.

Sign-in at `/login` sends `POST {VITE_API_BASE_URL}/v1/auth/login` with `email` and `password`, includes browser credentials, and reads the session-bound CSRF value from the `X-CSRF-Token` response header. The CSRF value stays in JavaScript memory only; the HttpOnly session cookie is handled by the browser. Sign out sends `POST {VITE_API_BASE_URL}/v1/auth/logout` with credentials and the `X-CSRF-Token` request header. Passwords, session identifiers, and CSRF tokens are never written to browser storage. The UI shows backend errors, including the generic invalid-credentials message, and displays the returned name and role after a valid response.

For cross-origin deployments, the backend must allow credentialed requests from the exact frontend origin, allow the `X-CSRF-Token` request header, and expose `X-CSRF-Token` to browser JavaScript. Keep the cookie's security attributes configured by the backend; do not broaden CORS to `*` to work around cookie or CSRF failures.

## Admin dashboard

The admin dashboard requires a backend-verified admin session. Its patient-account list is live account data; it is not clinical data. Metrics, appointments, activity, schedule, and administrative actions are marked as preview/sample data and do not represent connected clinical records or live hospital operations. Search filters the sample appointments and the live patient-account list.
