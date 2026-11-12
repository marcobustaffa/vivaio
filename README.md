# Vivaio

A minimal local foundation: React, strict TypeScript, Vite, Motion, and Supabase in Docker. No application tables, business features, or authentication screens are included yet. Hosted Supabase, Cloudflare, and deployment setup are deferred.

## Prerequisites

- Node **26.13.0**, pinned in `.nvmrc`, `.node-version`, and `package.json`. With nvm, run `nvm install` and `nvm use`.
- npm (bundled with Node).
- Docker Desktop or a compatible Docker engine, running with enough memory and disk for Supabase. First startup downloads images and can take several minutes.

Supabase CLI **3.1.0** is an exact development dependency. No global CLI, Supabase account, hosted project, or login is needed.

Dependency audit at bootstrap: runtime dependencies report no vulnerabilities. The ESLint/TypeScript-ESLint toolchain reports 10 moderate package findings from one transitive `minimatch` advisory (`GHSA-g3hv-75wg-m249`). The fix requires a major transitive upgrade; no unverified override is applied.

## Start developing

```sh
npm ci
npm run db:start
npm run db:env
npm run dev
```

Open <http://127.0.0.1:5173>. Vite updates the browser as source files change. `db:env` reads the local stack and writes only its API URL and browser-safe publishable key to the ignored `.env.local`, preserving unrelated settings. Restart Vite after changing environment variables.

The starter page itself has no database dependency. Future data features can import the typed `supabase` client from `src/lib/supabase.ts`; importing it validates the required environment variables. It accepts only Vivaio's local API, including when previewing a build.

| Service         | Local address                                        |
| --------------- | ---------------------------------------------------- |
| Vite            | <http://127.0.0.1:5173>                              |
| Supabase API    | <http://127.0.0.1:55421>                             |
| PostgreSQL      | `127.0.0.1:55422`, database/user/password `postgres` |
| Supabase Studio | <http://127.0.0.1:55423>                             |
| Mail viewer     | <http://127.0.0.1:55424>                             |
| Build preview   | <http://127.0.0.1:4173>                              |

Project ID `vivaio` isolates containers and volumes. Ports are separate from `sec-website` on `543xx`. Auxiliary reservations: shadow database `55420`, SMTP `55425` and POP3 `55426` (not exposed by default), analytics `55427` (disabled), Edge Function inspector `55428`, and pooler `55429` (disabled). Analytics and vector storage are disabled because this starter does not use them.

## How the pieces fit

- **React** renders the interface; **TypeScript** checks component and data contracts.
- **Vite** serves the app during development, updates the browser on edits, and creates production assets in `dist/` with `npm run build`. `npm run preview` serves that build locally.
- **Motion** handles the subtle entrance animation, disabled for reduced-motion preferences. Use ordinary CSS for simple hover/focus effects and Motion for entrances, exits, and layout changes.
- **Supabase** runs PostgreSQL, API, Auth, Storage, Studio, mail capture, and related services in Docker. The typed browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

Everything prefixed with `VITE_` can appear in browser assets. Never use secret/service-role keys there. Future browser-accessible tables must have RLS and appropriate policies.

## Commands

| Command                        | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `npm run dev`                  | Start Vite on port 5173                                   |
| `npm run build`                | Type-check and build production assets                    |
| `npm run preview`              | Serve `dist/` on port 4173                                |
| `npm run lint`                 | Run ESLint                                                |
| `npm run typecheck`            | Check application and tooling TypeScript                  |
| `npm test`                     | Run Vitest once; Docker is not required                   |
| `npm run format`               | Format supported files with Prettier                      |
| `npm run format:check`         | Check formatting                                          |
| `npm run db:start`             | Start Vivaio's local stack                                |
| `npm run db:stop`              | Stop Vivaio and preserve data                             |
| `npm run db:status`            | Show local services and credentials; avoid sharing output |
| `npm run db:env`               | Populate local browser configuration                      |
| `npm run db:reset`             | Rebuild the local database from migrations and seeds      |
| `npm run db:migration -- name` | Create a timestamped SQL migration                        |
| `npm run db:types`             | Regenerate and format database types                      |

## Database workflow

Migrations in `supabase/migrations/` are the source of truth. The directory starts empty; no application tables have been created. To add a schema change later:

```sh
npm run db:migration -- create_example
# Edit the SQL migration, including RLS policies and appropriate grants.
npm run db:reset
npm run db:types
```

Add deterministic local fixtures to `supabase/seed.sql` as tables become available. It is initially empty. Reset replays migrations in timestamp order, then runs the seed file. Studio is useful for inspection and experiments, but lasting schema changes belong in migrations. Commit migrations, seeds, and regenerated types together.

**Stopping preserves local data. Resetting destroys current local database data and rebuilds it from migrations and seeds.** Avoid resetting data you need to keep. Do not use `supabase stop --no-backup`, which deletes data volumes, or `--all`, which affects other projects.

CLI v3 targets local databases by default and uses `--remote` for hosted targets. Reset/type helpers accept no command-line arguments, invoke only local commands, and run from this repository. Type generation replaces the existing file only after generation and formatting succeed. No hosted project is linked.

See the official [Supabase local development guide](https://supabase.com/docs/guides/local-development) and [Motion accessibility guide](https://motion.dev/docs/react-accessibility) for background.

## Verification and Git workflow

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

GitHub Actions installs dependencies and runs application checks on PRs into `develop`/`main` and pushes to those branches. CI needs no Docker or database credentials; live stack checks run locally.

Use short-lived task branches from `develop`, targeting task PRs there with squash merges. Release PRs target `main`; preserve release and synchronization merge history. Synchronize hotfixes into `develop`. Use Conventional Commits with English imperative subjects. See [AGENTS.md](AGENTS.md).

## Troubleshooting

- **Docker cannot connect:** start Docker Desktop and wait for the engine, then rerun `npm run db:start`.
- **Slow first startup:** let image downloads finish. Check disk and memory if a service fails its health check; fix the reported cause before restarting.
- **Port already allocated:** inspect `docker ps` and local processes. Keep Vivaio's ports free; do not stop unrelated stacks. Vite uses `strictPort` to report conflicts instead of silently changing URLs.
- **Missing or incorrect Supabase configuration:** run `npm run db:start`, then `npm run db:env`, and restart Vite. `.env.example` documents names but contains no key. The client rejects hosted URLs, another stack's API port, and non-publishable keys.
- **Schema/types disagree:** capture the intended schema in migrations, reset if you can discard local data, then run `npm run db:types`.
- **Different Node version:** switch to `26.13.0` before `npm ci`.
- **Changed Supabase configuration:** stop/start Vivaio and regenerate `.env.local` if needed. Use this repository's CLI; v2 examples may contain flags removed in v3.
