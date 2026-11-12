# Working on Vivaio

## Scope and structure

Vivaio contains a local React + TypeScript + Vite starter and Docker-based Supabase. Business features, authentication screens, hosted services, Cloudflare, and deployment tooling are outside the bootstrap scope.

- `src/`: application code and colocated Vitest tests.
- `src/lib/supabase.ts`: typed browser client.
- `src/lib/database.types.ts`: generated database types; regenerate rather than edit.
- `scripts/`: local development helpers.
- `supabase/config.toml`: local services and dedicated ports.
- `supabase/migrations/`: versioned schema and policy changes.
- `supabase/seed.sql`: reproducible local sample data, initially empty.

## Branches and commits

- Keep `main` for releases and `develop` for integration.
- Start short-lived task branches from `develop`, using `feat/...`, `fix/...`, or `chore/...` names.
- Target task PRs at `develop`; squash them when merging.
- Target release PRs from `develop` to `main`; preserve release merge history.
- Branch urgent release hotfixes from `main` and synchronize them back to `develop`. Preserve synchronization merge history.
- Use Conventional Commits, for example `chore: bootstrap local development`.
- Write English imperative subjects of approximately 72 characters or fewer. Keep commits cohesive.
- Do not commit or push unless requested.

## Development

Use Node `26.13.0` (pinned in `.nvmrc`, `.node-version`, and `package.json`) and npm. Install with `npm ci`; include the lockfile with dependency changes. Use the pinned Supabase CLI through npm scripts.

```sh
npm run db:start
npm run db:env
npm run dev
```

Docker must be running. `npm run db:status` inspects Vivaio; `npm run db:stop` stops it while preserving data. Do not stop all projects or operate on another project's database during routine development.

Use CSS for hover/focus transitions and Motion for entrances, exits, and layout changes. Respect reduced-motion preferences. Keep TypeScript strict.

## Verification

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Use `npm run format` to fix formatting. Test meaningful behavior and failure modes. For UI changes, inspect desktop/mobile layouts, keyboard focus, and reduced motion where relevant. For database changes, rebuild locally from migrations and seeds, regenerate types, and check authorization. CI checks PRs into `develop`/`main` and pushes to those branches; it does not deploy.

## Database changes

- Migrations are the source of truth. Create one with `npm run db:migration -- descriptive_name` and edit its SQL.
- Include RLS enablement, appropriate policies, and deliberate grants alongside future browser-accessible tables. Verify anonymous and authenticated access as applicable.
- Capture Studio experiments in migrations before relying on them.
- `npm run db:reset` destroys Vivaio's current local database data and replays migrations and seeds.
- Put deterministic, non-sensitive sample data in `supabase/seed.sql`.
- Run `npm run db:types` and include generated types with schema changes.
- CLI v3 database commands default to local targeting. Reset/type helpers accept no arguments and never pass `--remote`.
- Do not link hosted projects, run remote database commands, or add deployment automation in this setup.
- Keep local environment files, credentials, CLI temporary state, dependencies, and build output out of Git. Only browser-safe publishable keys belong in `VITE_` variables; never expose secret/service-role keys.
