# Ayra Hospital frontend deployment

## Vercel

The frontend and backend are separate Git repositories and Vercel projects. Deploy this frontend repository with the project's **Root Directory** set to the repository root (`.`). The Vercel configuration builds the Vite app, publishes `dist`, and rewrites client-side routes such as `/login` to the SPA entry point.

Production builds use the public API base URL in `.env.production`:

`https://portfolio-backend-yek8.vercel.app/api`

Local Vite development uses `.env.development` with `VITE_API_BASE_URL=http://localhost:3001/api`. For a different backend deployment or a Vercel Preview environment, set `VITE_API_BASE_URL` in the frontend project's Vercel environment settings and redeploy. Vite environment variables are embedded at build time.

Patient registration sends `POST {VITE_API_BASE_URL}/v1/auth/register` with `name`, `email`, `password`, and the selected `role` (`patient` by default). For local development this resolves to `http://localhost:3001/api/v1/auth/register`. Confirm-password is validated in the browser and is never sent. The role selection is untrusted input; the backend must authorize staff roles and must never grant admin access solely because a public registration request asks for it. Registration does not sign the patient in.

Sign-in at `/login` sends `POST {VITE_API_BASE_URL}/v1/auth/login` with `email` and `password`, includes browser credentials, and reads the session-bound CSRF value from the `X-CSRF-Token` response header. The CSRF value stays in JavaScript memory only; the HttpOnly session cookie is handled by the browser. Sign out sends `POST {VITE_API_BASE_URL}/v1/auth/logout` with credentials and the `X-CSRF-Token` request header. Passwords, session identifiers, and CSRF tokens are never written to browser storage. The UI shows backend errors, including the generic invalid-credentials message, and displays the returned name and role after a valid response.

For cross-origin deployments, the backend must allow credentialed requests from the exact frontend origin, allow the `X-CSRF-Token` request header, and expose `X-CSRF-Token` to browser JavaScript. Keep the cookie's security attributes configured by the backend; do not broaden CORS to `*` to work around cookie or CSRF failures.

There is no `GET /me` endpoint or protected dashboard API in the current frontend contract. Consequently, a page reload cannot safely restore/display an authenticated user, and the admin dashboard is still mock data with no authorization. The dashboard remains explicitly labeled as unauthenticated preview data; the client-side role returned at login is informational only and never grants dashboard access.

## Admin dashboard preview

Open `/admin/dashboard` (or `/admin`, which redirects there) to view the responsive admin dashboard shell. Its appointment, patient, activity, and statistic values are mock data; the dashboard is not authenticated, does not connect to live hospital records, and must not be used as a production admin workspace. Search filters the preview appointments and patient list only.
