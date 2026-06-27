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
- `npm run dev:css` — watch + recompile Tailwind to `src/styles/compiled.css` (needed only for the
  host-integrated mode below; standalone `dev` compiles Tailwind live and doesn't need it)
- `npm run build:css` — one-shot minified compile of `src/styles/compiled.css` (runs inside `build`)
- `npm run build` — `build:css`, then `tsc` type-check, then Vite **library** build to `dist/`
- `npm run orval-build` — regenerate the API client/types from the OpenAPI spec (see API client below)
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

`react`, `react-dom`, `react-router-dom`, `react-query`, `react-i18next`, `i18next` and `axios` are
**peerDependencies** and are marked `external` in the Vite library build (`vite.config.ts`). The
host provides exactly one copy of each at runtime — that single-copy guarantee is what makes the
shared router/session/query-cache work. **Never** add `@tanstack/react-query` v5; the host is on the
v3 `react-query` package, and a second query client would break the shared cache. **Do not add MUI
or Emotion** — this module is styled with Tailwind only (see Styling).

### API client — orval-generated, per-repo (same as the host)

There is **no shared api-client package**. Like the host, this repo runs **orval** against the live
OpenAPI spec and commits its own copy of the generated client + types (`npm run orval-build`,
config in `orval.config.ts`). Generation is **scoped to the ranking endpoints** via
`input.filters.tags` so only a handful of files are produced (mostly types). Components import the
generated hooks/types with relative paths, exactly like the host:

```ts
import { useGetListRankingSettings } from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { Ranking } from "../../domain/types/v1api"
```

- Generated requests go through `src/infrastructure/orval/orval-axios-instance.ts` → the axios
  **singleton** in `src/infrastructure/orval/AxiosInstance.ts` (copied from the host). Whoever hosts
  the module must `initAxiosClientInstance(baseURL)` once (the dev shell does this; in the host, the
  host's bootstrap does). Auth: once the backend moves to the same-origin session **cookie** model,
  `withCredentials` carries it automatically — no shared bearer header needed.
- **Never edit generated files** — anything under `src/infrastructure/repositories/` or
  `src/domain/types/v1api`. Change the backend OpenAPI spec and re-run `npm run orval-build`. These
  paths are ignored by ESLint/Prettier (`repositories`) and git (`*.d.ts`).
- The ranking CRUD endpoints currently live only on the **local** backend, so `orval.config.ts`
  points its input at `http://localhost/api/v1/openapi/json`. Switch it to the deployed spec once
  they ship to production.

### Two development modes

- **Standalone (the daily loop).** `npm run dev` serves the dev shell in `src/dev/`, which provides
  what the host would — a single QueryClient, the Tailwind styles, i18n, and an initialised axios instance
  pointed at a **real backend** (`VITE_API_DOMAIN`, default `http://localhost/`). Mounts
  `RankingRoutes` at `/ranking/*`. Authenticated endpoints need a logged-in session, so the list may
  be empty until auth/cookies are wired.
- **Integrated.** The host consumes the built package (`file:`/`npm link` locally, or the published
  version) and provides its own configured axios singleton + session.

The dev shell (`src/dev/`) and `src/test/` are **not** part of the published package (excluded from
the dts build; `dist` only contains the library entry). Tests mock the generated hook with
`vi.mock` so they stay hermetic.

### Folder layout

- `src/index.ts` — package entry (exports `RankingRoutes`).
- `src/RankingRoutes.tsx` — the routes subtree.
- `src/pages/<Feature>/` — one folder per route screen, each with a `components/` subfolder.
- `src/components/` — shared presentational components (e.g. `Spinner/`, `icons/`).
- `src/infrastructure/repositories/` + `src/domain/types/v1api/` — orval-generated client + types.
- `src/infrastructure/orval/` — the axios singleton + mutator the generated client calls through.
- `src/i18n/` — bundles `public/locales` JSON and registers it into the shared i18next instance
  (`rankingResources.ts`, `registerRankingResources.ts`).
- `src/dev/` — standalone dev shell + dev-only i18n (verbatim copy of the host's, not shipped).
- `src/styles/` — `tokens.css` (shared palette) + `tailwind.css`; `compiled.css` is generated.
- `src/test/` — Vitest setup.

### Styling — Tailwind only (no MUI)

**This module uses Tailwind exclusively. Do not import `@mui/*` or `@emotion/*` anywhere** (no
`Box`/`Stack`/`Typography`/`Button`/`TextField`, no `@mui/icons-material`). Build UI from semantic
HTML + Tailwind utility classes; for icons use small inline-SVG components (see
`src/components/icons/`), and for shared widgets like the loading spinner reuse
`src/components/Spinner/`.

- **No `tw-` prefix.** Utilities are written plain (`bg-primary`, `flex`, `text-sm`) — the prefix was
  removed once MUI was dropped, so there are no class collisions to guard against.
- **Preflight is disabled** (`tailwind.config.js`): the module mounts inside the host SPA's DOM, and
  Tailwind's global reset would restyle the host's own elements. Reset only what a component needs
  (e.g. `list-none p-0 m-0` on a `<ul>`).
- The shared palette lives in `src/styles/tokens.css` as **channel-format** CSS variables
  (`--color-primary: 255 113 10`) consumed by `tailwind.config.js`, so opacity utilities
  (`bg-primary/50`) work. These are **our own** semantic vars (`primary`, `secondary`, `surface`).
  When `@oreplay/tokens` exists, generate `tokens.css` from it so host and module share values.
- **Styles travel with the module.** The host has no Tailwind pipeline, so the entry
  (`RankingRoutes.tsx`) imports `tokens.css` + `compiled.css` — the latter is the **precompiled**
  Tailwind output produced by `build:css`/`dev:css` (raw `@tailwind` directives can't be shipped:
  consumers without Tailwind would get literal directives, not CSS). `compiled.css` is a generated
  artifact (gitignored); the standalone dev shell imports raw `tailwind.css` instead and compiles it
  live. **When developing inside the host, run `npm run dev:css` so newly-added classes appear.**

### i18n

The module **owns its translations** and is self-contained — the host carries **no** `Ranking.*`
keys. User-facing strings go through `react-i18next` `t()` (ESLint `i18next/no-literal-string` is
enforced); keys live in `public/locales/<lng>/translation.json` under `Ranking.*` (default
`translation` namespace, Weblate-managed — same file shape as the host).

- **How they reach the shared instance:** `RankingRoutes` calls `registerRankingResources(i18n)` on
  mount, which `addResourceBundle`s the **bundled** `public/locales` JSON (imported via
  `src/i18n/rankingResources.ts`) into whichever i18next instance the host — or the dev shell —
  provides. So the keys resolve in production **without** the host defining them: change a ranking
  string in this repo only, no host edit. Add a language by dropping a
  `public/locales/<lng>/translation.json` and a line in `src/i18n/rankingResources.ts`.
- **Dev / test:** `src/dev/i18n.ts` is a **verbatim copy** of the host's `src/i18n.ts` (http-backend,
  `LanguageDetector`, same fallback map) so the module is exercised exactly as in the host. It imports
  a trimmed `src/dev/supportedLanguages.tsx` (codes/names only — no `CountryFlag` JSX, which would
  pull host UI into the shell). The dev shell wraps routes in `<Suspense>` to match the host, since
  that shared config suspends while http-backend loads. Nothing under `src/dev/` ships.

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
- **CSS Class Naming**: The root element of every component must have a first CSS class matching the component name in kebab-case prefixed with `rk-` (e.g., `SkeletonLoaderGroup` → `rk-skeleton-loader-group`).
