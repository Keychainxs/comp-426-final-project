# COMP 426 Final Project

Blank starting point for the team project (COMP 426, Fall 2026). It has the same setup and configuration as A05 Oriole, with the social app removed:

- [Next.js](https://nextjs.org) App Router, Tailwind 4 and [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com) auth with working login, sign-up and sign-out
- [tRPC](https://trpc.io) API with public and protected procedures
- [Drizzle ORM](https://orm.drizzle.team) with one table, `profiles`

No Docker is needed; the database and auth are a hosted Supabase project.

## Setup checklist

Every step has a check. Don't move on until the check passes.

### 0. Tools (everyone)

```bash
node -v    # check: v20.9 or newer
npm -v     # check: prints a version
git --version
```

### 1. Get the code (everyone except the person who created the repo)

```bash
git clone <REPO_URL>
cd comp-426-final-project
```

Check: `ls` shows `app/`, `server/`, `utils/` and `package.json`.

### 2. Install dependencies (everyone)

```bash
npm install
```

Check: it ends with `added ... packages` and no `npm error` lines. A deprecation warning for eslint is expected.

### 3. Environment variables (everyone)

```bash
cp .env.example .env
```

Fill in the three values. The whole team uses the **same** values, from the one shared Supabase project. Share them privately (never commit `.env`; it is gitignored).

| Variable | Where it comes from in the Supabase dashboard |
| --- | --- |
| `DATABASE_URL` | **Connect** button → **Session pooler** connection string (host ends in `pooler.supabase.com`, port `5432`), with `[YOUR-PASSWORD]` replaced by the database password. Do not use the transaction pooler (port `6543`): `npx drizzle-kit push` hangs on it. |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API Keys → publishable key |

If the database password has special characters (`@ # / :` and so on), URL-encode them in `DATABASE_URL`.

Check: `git status` does **not** list `.env`.

### 4. Create the table (ONE person, once, and again after each schema change)

```bash
npx drizzle-kit push
```

Check: Supabase dashboard → Table Editor shows a `profiles` table with `id`, `name` and `handle`.

### 5. Supabase auth setting (ONE person, once)

Authentication → Sign In / Providers → Email → turn **Confirm email** off, then save. Sign-up creates the profile row right after `signUp`, which only works when sign-up returns a live session.

### 6. Run it (everyone)

```bash
npm run lint     # check: no errors or warnings
npm run build    # check: a route table listing /, /login, /signup and /api/trpc/[trpc]
npm run dev      # check: http://localhost:3000 redirects to /login
```

### 7. End-to-end check (everyone)

1. Go to `/signup` and create an account. Check: you land on a page saying "Welcome, <your name>!".
2. Supabase → Authentication → Users shows the new user, and Table Editor → `profiles` has a row for it.
3. Use the menu in the top right to sign out. Check: you are back on `/login`.
4. Log in again. Check: the welcome page shows your name and handle.

## Project structure

| Path | What it is |
| --- | --- |
| `utils/config.ts` | `APP_NAME`: change the app's name in one place |
| `app/layout.tsx` | Root layout (theme, tRPC provider, header) |
| `app/page.tsx` → `app/home-page.tsx` | Protected home page (`/`), currently a welcome placeholder |
| `app/login/page.tsx`, `app/signup/page.tsx` | Authentication pages |
| `app/api/trpc/[trpc]/route.ts` | tRPC API endpoint |
| `server/api/trpc.ts` | tRPC setup, `publicProcedure` and `protectedProcedure` |
| `server/api/root.ts` | Root router: register new routers here |
| `server/api/routers/profiles.ts` | Example procedures (`getAuthedUserProfile`, `handleNewUser`) |
| `server/db/schema.ts` | Drizzle table definitions |
| `server/db/relations.ts` | Drizzle relations (`defineRelations`) |
| `server/models/` | Zod input and output models |
| `utils/supabase/` | Supabase clients, `requireUser()` page guard, session refresh |
| `components/header.tsx` | Top bar with theme toggle and sign-out |
| `components/ui/` | shadcn/ui components |
| `proxy.ts` | Refreshes the Supabase session on each request |

## Adding a feature

1. Add the table to `server/db/schema.ts` and its relations to `server/db/relations.ts`, then run `npx drizzle-kit push`.
2. Add Zod models to `server/models/inputs.ts` and `server/models/responses.ts`.
3. Create `server/api/routers/<feature>.ts` (copy the pattern in `profiles.ts`) and register it in `server/api/root.ts`.
4. Add `app/<route>/page.tsx` as a Server Component that calls `requireUser()` and renders a `"use client"` component.
5. In the client component, call the API with `api.<router>.<procedure>.useQuery()` or `.useMutation()`.

## Team workflow

- Never push straight to `main`: make a branch, open a pull request.
- After pulling, run `npm install` if `package.json` changed.
- Schema changes: edit `server/db/schema.ts`, tell the team, and one person runs `npx drizzle-kit push` (everyone shares one database).
