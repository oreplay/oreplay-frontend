# @oreplay/ranking

The O-Replay **ranking module** — a routes subtree the host results app mounts at `/ranking/*`.
It ships as an npm package so this module can be developed, reviewed, tested and styled in its own
repo, while at runtime it is part of the host's single SPA (shared React / react-query / router /
session). See `claude-ranking-module-plan.md` in the host repo for the full architecture rationale.

## Scripts

> Run `nvm use` first (`.nvmrc` → Node 22). The default shell Node may be too old and break tooling.

- `npm run dev` — standalone dev server with HMR (uses the dev shell in `src/dev/`)
- `npm run build` — type-check + build the library to `dist/` (ESM + `index.d.ts`)
- `npm test` / `npm run test:watch` — Vitest
- `npm run lint` — ESLint (fails on warnings)
- `npm run before-commit` — format + lint + build + test

## What the package exports

```ts
import { RankingRoutes } from "@oreplay/ranking"
// host mounts it inside its own <BrowserRouter>, behind its auth/private route:
<Route path="/ranking/*" element={<RankingRoutes />} />
```

## Shared singletons (peer dependencies)

`react`, `react-dom`, `react-router-dom`, `react-query`, `@mui/material`, `@mui/icons-material`,
`@emotion/*`, `react-i18next`, `i18next` are **peer dependencies** — the host provides exactly one
copy at runtime. That singleton guarantee is what makes the shared router/session work. Do **not**
add `@tanstack/react-query` v5 here; the host is on `react-query` v3.

## API client

Components import the ranking API from `@oreplay/api-client`:

```ts
import { useGetListRankingList, RankingsNsRanking } from "@oreplay/api-client"
```

That package does not exist yet, so a **local stand-in** lives in `src/api/` and is wired via a
Vite + tsconfig **alias** (`@oreplay/api-client` → `src/api/index.ts`). It returns typed mock data.
When the real, backend-owned `@oreplay/api-client` is published:

1. Remove the alias from `vite.config.ts` and `tsconfig.json`.
2. Add `@oreplay/api-client` as a dependency.
3. Delete `src/api/`.

Consumer import statements stay identical.

## Styling

MUI today (matching the host), with a **Tailwind setup ready** for new components: preflight is
disabled and utilities are prefixed `tw-` so Tailwind and MUI coexist. The shared palette lives in
`src/styles/tokens.css` as channel-format CSS variables (`--color-primary: 255 113 10`) consumed by
`tailwind.config.js`. These are our own semantic vars — never bind Tailwind to MUI's internal
`--mui-palette-*` names (the long-term plan is to drop MUI for Tailwind).

## Current scaffold status

- `/ranking` lists rankings; each row links to `/ranking/:rankingId/settings`.
- Settings is resolved from the list (no get-one endpoint yet) and **Save is a stub** (no
  `PATCH /rankings/{id}` endpoint yet) — both marked with `TODO`s.
