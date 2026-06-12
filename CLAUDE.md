# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

O-Replay Frontend — a React SPA for live orienteering results. It is one of three repos in the
O-Replay project (this frontend, a CakePHP backend, and a Java desktop client). The app serves two
audiences: public results viewers (event/stage/results pages) and authenticated organizers
(event administration, uploads, ranking computation).

## Commands

- `npm run dev` — start Vite dev server (host 0.0.0.0, port 8080)
- `npm run build` — type-check (`tsc`) then `vite build`. The build fails on type errors.
- `npm test` — run the full Vitest suite once (`vitest run`)
- Run a single test file: `npx vitest run src/domain/services/RunnerService.test.ts`
- Watch a test: `npx vitest src/path/to/file.test.ts`
- `npm run lint` — ESLint, **fails on any warning** (`--max-warnings 0`)
- `npm run format` — Prettier write; `npm run format:check` to verify
- `npm run before-commit` — runs format + lint + build; run this before committing
- `npm run orval-build` — regenerate the API client/types from the OpenAPI spec (see below)

Node >= 20 required (`.nvmrc` pins the version).

## Environment

Config comes from `VITE_*` vars in `.env`. The key switch for local development is
`VITE_API_DOMAIN` — point it at `http://localhost/` to use a local backend or
`https://www.oreplay.es/` for the production API. `API_BASE_URL` is derived as
`${VITE_API_DOMAIN}api/v1/` (see `src/services/ApiConfig.ts`).

## Architecture

### Layered structure
The codebase mixes a feature-based layout (`src/pages/<Feature>/{pages,components,services,shared}`)
with a domain-driven layer (`src/domain`, `src/infrastructure`). Shared cross-cutting code lives in
`src/shared`, `src/components`, `src/services`, and `src/utils`.

- `src/domain` — framework-agnostic models (`domain/models`) and business logic (`domain/services`,
  e.g. `RunnerService`, `StageStatsService`). This is where pure logic and its unit tests live.
- `src/infrastructure` — HTTP/data access. Contains the orval-generated client and the axios setup.
- `src/pages` — route-level features, each with its own `services` (data fetching/transforms),
  `components`, and `shared` (context/types) subfolders.

### Two coexisting API layers — know which one to use
There are **two distinct ways** the app talks to the backend. New code generally uses the orval
layer, but much of the existing code uses the hand-written layer.

1. **Orval-generated layer (preferred for new endpoints).** `orval.config.ts` generates
   react-query hooks into `src/infrastructure/repositories/*` and types into
   `src/domain/types/v1api` from the live OpenAPI spec at
   `https://www.oreplay.es/api/v1/openapi/json`. Do **not** edit generated files — they are
   overwritten by `npm run orval-build`. All generated requests go through
   `src/infrastructure/orval/orval-axios-instance.ts`, which uses the singleton axios client in
   `src/infrastructure/orval/AxiosInstance.ts`.

2. **Hand-written layer (legacy, still widely used).** `src/services/ApiConfig.ts` exposes
   `get/post/patch/deleteRequest` helpers over a separate axios instance. Feature service files
   (e.g. `src/pages/Results/services/EventService.ts`) call these and are wrapped in
   custom react-query hooks (e.g. `src/pages/Results/services/FetchHooks.ts`). These hooks take a
   `token` argument explicitly from `useAuth()`.

Note these are **two separate axios instances** with separate header/auth handling. The orval
singleton's auth header is updated centrally; the legacy helpers receive the token per-call.

**Direction of travel:** the orval-generated layer is where we're heading; the hand-written layer
is legacy we're gradually retiring. New endpoints and new code should use the orval hooks/types.
When you touch existing legacy code for another reason, prefer migrating that piece to the orval
equivalent as you go. This is an opportunistic, incremental migration — don't launch sweeping
rewrites or mass find-and-replace just to convert untouched code; let it happen naturally as the
surrounding code evolves.

### Auth
OAuth PKCE flow. `src/shared/AuthProvider.tsx` provides `AuthContext`; consume it via the
`useAuth()` hook (`src/shared/hooks.ts`) to get `{ user, token, loginAction, logoutAction }`.
On token change, `AuthProvider` calls `updateAxiosClientHeaders` to inject the `Authorization`
bearer into the orval axios singleton. Authenticated routes are wrapped by `PrivateRoute` in
`App.tsx`.

### Routing & app shell
All routing is defined centrally in `src/App.tsx` using `react-router-dom`. Page components are
lazy-loaded via `lazyWithRetry` (`src/services/lazyLoad.ts`). Providers are nested in `main.tsx`
(QueryClient → AuthProvider) and `App.tsx` (Theme → Localization → Notifications → Countries).

### State / data fetching
TanStack Query (imported as `react-query` v3) is the data/cache layer. There is no separate global
state store — server state lives in react-query, auth/UI state in React context.

### i18n
Translations are in `public/locales/<lang>/` and managed via Weblate (do not hand-edit translation
JSON for non-English without coordinating). ESLint enforces `i18next/no-literal-string` in JSX
markup — **user-facing strings in markup must go through `t()`**, not be hardcoded. Luxon and MUI
date locales are synced to the active i18n language in `App.tsx`.

## Conventions

- Prettier: **no semicolons**, LF line endings (`.prettierrc`). Let `npm run format` handle style.
- TypeScript is strict, with `noUnusedLocals`/`noUnusedParameters` on — unused vars fail the build.
- ESLint runs with type-checking and treats `@typescript-eslint/no-unsafe-*` as errors; avoid `any`
  and untyped data flowing from API responses.
- UI is Material UI v6 (`@mui/material`, `@mui/x-data-grid`, `@mui/x-date-pickers`) with a custom
  theme (orange `#ff710a` primary) defined in `App.tsx`. Charts use `@nivo/*`.
- Sentry is initialized in `main.tsx`; source maps are uploaded at build time.

## Development Principles

Write code following SOLID principles and the guidelines below. These are the target for new and
refactored code; not all existing code conforms yet, so prefer these patterns over copying older
code that violates them.

### Component design

- **Single Responsibility**: each component does one thing.
- **Aggressively small components**: extract every visually or logically distinct section into its
  own component, even small ones. A parent should read as a list of child components, not large
  blocks of markup. Prefer many small, composable components over a few large ones.
- **One component per file**: each `.tsx` exports exactly one component. When a component splits
  into parts, group them in a subfolder named after the public component (this repo already does
  this, e.g. `components/ListSkeleton/`, `pages/.../StagesDataGrid/components/`) rather than
  multiple components in one file or flat prefixed siblings.
- **Stateless first**: prefer presentational/stateless components; add state only when essential,
  and keep internal logic and state encapsulated (don't leak it to parents).
- **Clear interfaces**: define an explicit props interface for each component. If a component
  accepts `className`, it is the **last** prop in both the type and the destructuring.
- **Composition over inheritance**: favor `children`, render props, and composition.
- **Predictable & testable**: components should be declarative, self-contained, and easy to reason
  about and test.

### Domain layer

- **Domain-first logic**: business logic belongs in `src/domain` (`domain/models`,
  `domain/services`), not in components. Components render UI and delegate to domain functions,
  keeping them thin and the logic unit-testable (tests live next to the source, e.g.
  `domain/services/RunnerService.test.ts`).
- **Isolate third-party deps**: domain code should avoid importing third-party libraries directly.
  Prefer the shared wrappers (e.g. date/timezone helpers in `src/shared/timezoneFunctions.ts`) so
  logic stays portable and testable. (Some existing domain code imports `luxon` directly — new code
  should not add to that.)
- **Types in `domain/types/`**: shared/API types live in `src/domain/types` (the orval-generated
  ones under `domain/types/v1api`). When a model file would carry several type definitions
  alongside its logic, extract the types to `domain/types/` and import them back; 1–2 inline types
  are fine.
- **Alphabetical ordering**: add new constants, types, and functions to domain files in
  alphabetical order to reduce merge conflicts.
- **No magic strings — use constants**: any finite set of string values (gender codes, statuses,
  modes, types) is defined once as a `const` with `as const`, and the union type is derived from
  it — never written out separately or repeated as raw literals. Follow the existing pattern in
  `src/domain/models/Gender.ts`
  (`export const GENDERS = ["M", "F"] as const; export type Gender = (typeof GENDERS)[number]`).
  Reference by name everywhere (including test fixtures) so usages stay greppable and value/type
  stay in sync.

### Working in this codebase (for AI agents)

Before writing code:

1. Use the Node version in `.nvmrc` (`nvm use`) before running commands.
2. Search for similar existing implementations and follow their patterns; check `src/shared`,
   `src/components`, `src/utils`, and `src/domain` for reusable code first.
3. Know which API layer applies (orval-generated vs. hand-written `ApiConfig.ts` — see Architecture).
4. **Never edit auto-generated files** — anything under `src/infrastructure/repositories/` or
   `src/domain/types/v1api`. Change the OpenAPI spec / orval config and run `npm run orval-build`.

When writing code:

- **Refactor over hack**: if a change needs the surrounding code restructured to fit cleanly,
  refactor first rather than adding a case-specific workaround.
- **Type safety**: lean on TypeScript strict mode; avoid `any` (the `no-unsafe-*` ESLint rules are
  errors).
- **Readability**: don't inline long ternaries or complex conditions in JSX props — extract them
  into named variables. Use clear names.
- **DRY**: extract duplicated logic into reusable domain functions instead of repeating it inline.
- **i18n**: user-facing strings in markup go through `t()` (enforced by ESLint).
- **Accessibility**: prefer semantic HTML and appropriate ARIA attributes.
- **No noise comments**: rely on descriptive names. Don't add JSDoc restating the signature,
  section-divider comments, or inline comments describing *what* the code does. Comment only
  genuinely non-obvious *why* (a workaround, a hack, counter-intuitive API behavior).
- **Tests**: add tests for new domain logic and features.
- **Before considering a task done**: run `npm run before-commit` (format + lint + build) so the
  change is Prettier-formatted, lint-clean, and type-checks.