# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@oreplay/ranking` — the O-Replay **ranking module**. It is developed in its own repo but ships as
an npm package that the host results app (`oreplay-frontend`) mounts at `/ranking/*`. At runtime it
is **not** a separate app: the host imports it and renders it inside its own `<BrowserRouter>`, so
there is a single React / react-query / router / session runtime (one SPA). The point of the split
is dev-time independence — own review, CI, tests and styling — not independent deploy.

The full architecture rationale (why npm package over module federation / iframe / multi-SPA, the
auth/session model, the shared `@oreplay/api-client` and `@oreplay/tokens` plan) lives in
`claude-ranking-module-plan.md` in this repo. Read it before making structural changes.

## Commands

> Run `nvm use` first (`.nvmrc` → Node 22). The default shell Node may be too old and make
> `tsc`/`eslint` fail with confusing `Unexpected token` errors.

- `npm run dev` — standalone Vite dev server (the dev shell in `src/dev/`) → **http://localhost:5173**
- `npm run build` — `tsc` type-check, then Vite **library** build to `dist/` (ESM bundle + `index.d.ts`)
- `npm test` — run the Vitest suite once; `npm run test:watch` to watch
- `npm run lint` — ESLint, **fails on any warning** (`--max-warnings 0`)
- `npm run format` — Prettier write; `npm run format:check` to verify
- `npm run before-commit` — format + lint + build + test (run before committing)

CI (`.github/workflows/ci.yml`) runs format:check + lint + test + build on every push and PR.

## Architecture

### What this package is

The package entry (`src/index.ts`) exports a single component, **`RankingRoutes`** — a
`react-router` routes subtree. The host mounts it once:

```tsx
<Route path="/ranking/*" element={<RankingRoutes />} />
```

inside its own router, behind its own `PrivateRoute`. `RankingRoutes` owns everything under
`/ranking/*` (the list at the index, `:rankingId/settings`, etc.).

### Shared singletons (peer dependencies)

`react`, `react-dom`, `react-router-dom`, `react-query`, `@mui/material`, `@mui/icons-material`,
`@emotion/*`, `react-i18next` and `i18next` are **peerDependencies** and are marked `external` in
the Vite library build (`vite.config.ts`). The host provides exactly one copy of each at runtime —
that single-copy guarantee is what makes the shared router/session/query-cache work. **Never** add
`@tanstack/react-query` v5; the host is on the v3 `react-query` package, and a second query client
would break the shared cache.

### API client — the `@oreplay/api-client` alias

Components import the ranking API by name:

```ts
import { useGetListRankingList, RankingsNsRanking } from "@oreplay/api-client"
```

That backend-owned, orval-generated package does **not exist yet**, so a local stand-in lives in
`src/api/` and is wired through a Vite + tsconfig **alias** (`@oreplay/api-client` →
`src/api/index.ts`). It returns typed mock data. When the real package ships:

1. Remove the alias from `vite.config.ts` and `tsconfig.json`.
2. Add `@oreplay/api-client` as a dependency (and mark it `external` in the lib build).
3. Delete `src/api/`.

Import statements in components stay identical. Treat `src/api/` as throwaway scaffolding — do not
build real logic on top of it; the generated types are the contract.

### Two development modes

- **Standalone (the daily loop).** `npm run dev` serves the dev shell in `src/dev/`, which fakes
  what the host provides — a single QueryClient, the MUI theme, a minimal i18n instance, and the
  **mock** `@oreplay/api-client`. Mounts `RankingRoutes` at `/ranking/*` so links behave exactly as
  in the host. No host, no backend needed. ~90% of work happens here.
- **Integrated.** The host consumes the built package (`file:`/`npm link` locally, or the published
  version). It shows **real** data only once `@oreplay/api-client` is the real shared package; until
  then an integrated mount still shows mock data.

The dev shell (`src/dev/`) and `src/test/` are **not** part of the published package (excluded from
the dts build; `dist` only contains the library entry).

### Folder layout

- `src/index.ts` — package entry (exports `RankingRoutes`).
- `src/RankingRoutes.tsx` — the routes subtree.
- `src/pages/<Feature>/` — one folder per route screen, each with a `components/` subfolder.
- `src/api/` — temporary local stand-in for `@oreplay/api-client` (alias target).
- `src/dev/` — standalone dev shell + dev-only i18n (not shipped).
- `src/styles/` — `tokens.css` (shared palette) + `tailwind.css`.
- `src/test/` — Vitest setup.

### Styling

MUI today (matching the host), with a **Tailwind setup ready** for new components: preflight is
disabled and utilities are prefixed `tw-` so Tailwind and MUI coexist in one DOM. The shared palette
lives in `src/styles/tokens.css` as **channel-format** CSS variables (`--color-primary: 255 113 10`)
consumed by `tailwind.config.js`, so opacity utilities (`tw-bg-primary/50`) work. These are **our
own** semantic vars — never bind Tailwind to MUI's internal `--mui-palette-*` names. The long-term
direction is to drop MUI for Tailwind, so keep MUI a thin, replaceable consumer of the same tokens.

### i18n

User-facing strings in markup go through `react-i18next` `t()` (ESLint `i18next/no-literal-string`
is enforced). In production the host provides the `i18next` instance with Weblate-managed keys; for
standalone dev/test, `src/dev/i18n.ts` initialises a minimal English instance (not shipped).

## Conventions

- Prettier: **no semicolons**, LF line endings (`.prettierrc`). Let `npm run format` handle style.
- TypeScript strict, with `noUnusedLocals`/`noUnusedParameters` — unused vars fail the build.
- ESLint runs with type-checking and treats `@typescript-eslint/no-unsafe-*` as errors; avoid `any`.
  Non-source TS like `vite.config.ts` is in `.eslintignore` (it is not in the `tsconfig` project).
- `react-router` v7: `navigate()` returns a promise, so in event handlers use `void navigate(...)`
  (otherwise `no-misused-promises` / `no-floating-promises` fire).

## Development Principles

Write code following SOLID principles and the guidelines below.

### Component design

- **Single Responsibility**: each component does one thing.
- **Aggressively small components**: extract every visually or logically distinct section into its
  own component. A parent should read as a list of child components, not large blocks of markup.
- **One component per file**: each `.tsx` exports exactly one component. When a component splits into
  parts, group them in a `components/` subfolder named after the public component.
- **Stateless first**: prefer presentational components; add state only when essential and keep it
  encapsulated (don't leak it to parents).
- **Clear interfaces**: define an explicit props interface per component. If a component accepts
  `className`, it is the **last** prop in both the type and the destructuring.
- **Composition over inheritance**: favor `children`, render props, and composition.

### Domain & data

- **Domain-first logic**: keep business logic out of components — put pure, unit-testable logic in a
  domain layer (`src/domain` when introduced) and have components delegate to it. Tests live next to
  the source.
- **The generated types are the contract**: build on `@oreplay/api-client` types, never hand-edit
  generated output. Don't grow logic on the temporary `src/api/` mock.
- **No magic strings — use constants**: any finite set of string values (statuses, modes, types) is
  defined once as a `const … as const` with the union type derived from it
  (`export const FOO = ["a","b"] as const; export type Foo = (typeof FOO)[number]`), referenced by
  name everywhere (including test fixtures) so usages stay greppable and value/type stay in sync.
- **Alphabetical ordering**: add new constants/types/functions to shared files alphabetically to
  reduce merge conflicts.

### When writing code

- **Refactor over hack**: restructure surrounding code to fit a change cleanly rather than adding a
  case-specific workaround.
- **Readability**: don't inline long ternaries/conditions in JSX props — extract named variables.
- **DRY**: extract duplicated logic into reusable functions.
- **i18n**: user-facing markup strings go through `t()`.
- **Accessibility**: prefer semantic HTML and appropriate ARIA attributes.
- **No noise comments**: rely on descriptive names; comment only genuinely non-obvious _why_
  (a workaround, a hack, counter-intuitive API behavior).
- **Tests**: add tests for new logic and features.
- **Before considering a task done**: run `npm run before-commit`.
