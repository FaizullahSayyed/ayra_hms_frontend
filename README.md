# Ayra Hospital frontend deployment

## Vercel

The frontend and backend are separate Git repositories and Vercel projects. Deploy this frontend repository with the project's **Root Directory** set to the repository root (`.`). The Vercel configuration builds the Vite app, publishes `dist`, and rewrites client-side routes such as `/login` to the SPA entry point.

Production builds use the public API base URL in `.env.production`:

`https://portfolio-backend-yek8.vercel.app/api`

Local Vite development uses `.env.development` with `VITE_API_BASE_URL=http://localhost:3001/api`. For a different backend deployment or a Vercel Preview environment, set `VITE_API_BASE_URL` in the frontend project's Vercel environment settings and redeploy. Vite environment variables are embedded at build time.

Patient registration sends `POST {VITE_API_BASE_URL}/v1/auth/register` with `name`, `email`, `password`, and the selected `role` (`patient` by default). For local development this resolves to `http://localhost:3001/api/v1/auth/register`. Confirm-password is validated in the browser and is never sent. The role selection is untrusted input; the backend must authorize staff roles and must never grant admin access solely because a public registration request asks for it. Registration does not sign the patient in.

Sign-in at `/login` sends `POST {VITE_API_BASE_URL}/v1/auth/login` with `email` and `password`, and includes browser credentials so the backend can set an HttpOnly session cookie. The frontend does not persist passwords or tokens. The login endpoint/session is not confirmed to exist on the backend yet; until it is deployed, the form will show an explicit unavailable/error message rather than a success state. A protected role-specific dashboard and client-side session restoration/logout are not implemented.

## Admin dashboard preview

Open `/admin/dashboard` (or `/admin`, which redirects there) to view the responsive admin dashboard shell. Its appointment, patient, activity, and statistic values are mock data; the dashboard is not authenticated, does not connect to live hospital records, and must not be used as a production admin workspace. Search filters the preview appointments and patient list only.
