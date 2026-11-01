# Ayra Hospital frontend deployment

## Vercel

The frontend and backend are separate Git repositories and Vercel projects. Deploy this frontend repository with the project's **Root Directory** set to the repository root (`.`). The Vercel configuration builds the Vite app, publishes `dist`, and rewrites client-side routes such as `/login` to the SPA entry point.

Production builds use the public API base URL in `.env.production`:

`https://portfolio-backend-yek8.vercel.app/api`

For local development, create `.env.local` with `VITE_API_BASE_URL=http://localhost:3001/api`. For a different backend deployment or a Vercel Preview environment, set `VITE_API_BASE_URL` in the frontend project's Vercel environment settings and redeploy. Vite environment variables are embedded at build time.
