# CLAUDE.md

This file guides Claude Code (claude.ai/code) when working in this repository. It focuses on the
**ranking area** (`/rankings/*`) — a Tailwind-styled feature that lives natively inside the host
results app (`oreplay-frontend`).

## The ranking area

The ranking screens (list, settings, duplicate) are ordinary host pages under
`src/pages/RankingList/` and `src/pages/RankingSettings/`, mounted by the host router:

```tsx
// src/App.tsx, inside <PrivateRoute>
<Route path="/rankings/*" element={<RankingRoutes />} />
```

`RankingRoutes` (`src/RankingRoutes.tsx`) is a small routes subtree wrapped in a `.rk-root` element
that scopes the Tailwind styling. It was previously shipped as a separate `@oreplay/ranking` npm
package; it is now first-class host source — one build, one React / react-query / router / i18n /
axios runtime, no package boundary, no auth injection, no cross-boundary bridges.

## Commands

> Run `nvm use` first (`.nvmrc` → Node 22). The default shell Node may be too old and make
> `tsc`/`eslint` fail with confusing `Unexpected token` errors.

- `npm run dev` — Vite dev server
- `npm run build` — `tsc` type-check, then Vite build
- `npm run orval-build` — regenerate the API client/types from the OpenAPI spec (see API client)
- `npm test` — Vitest suite once
- `npm run lint` — ESLint, **fails on any warning** (`--max-warnings 0`)
- `npm run format` — Prettier write; `npm run format:check` to verify

## Styling — Tailwind (scoped), coexisting with MUI

The host is MUI; the ranking area is **Tailwind only**. They coexist because the styling is scoped:

- **Preflight is off** globally (`tailwind.config.js` → `corePlugins.preflight: false`), so Tailwind
  adds no global reset that would restyle the host's MUI tree.
- The base resets that Tailwind's border/button/box-sizing utilities rely on are re-added **scoped to
  `.rk-root`** via `:where(.rk-root)` in `src/styles/tailwind.css`. `:where()` contributes zero
  specificity, so single-class utilities (`.bg-primary`) still win over the resets. Every ranking
  screen renders inside the `.rk-root` wrapper (`RankingRoutes`), so the resets never leak out.
- `RankingRoutes` imports `src/styles/tokens.css` (palette CSS vars) and `src/styles/tailwind.css`
  (the `@tailwind` directives). Vite's PostCSS (`postcss.config.js` → `tailwindcss` + `autoprefixer`)
  compiles them at build time — there is **no** precompiled `compiled.css` and **no** `build:css`
  step; the compiled utilities land in a code-split CSS chunk loaded with the lazy `RankingRoutes`.
- In ranking code: **do not import `@mui/*` or `@emotion/*`.** Build UI from semantic HTML + Tailwind
  utilities written plain (`bg-primary`, `flex`, `text-sm` — **no `tw-` prefix**), inline-SVG icons
  under `src/components/icons/`, and the shared `src/components/Spinner/`.
- The palette lives in `src/styles/tokens.css` as **channel-format** CSS vars
  (`--color-primary: 255 113 10`) consumed by `tailwind.config.js`, so opacity utilities
  (`bg-primary/50`) work. `primary`, `secondary`, `surface` mirror the host's MUI palette.
- Tailwind's `content` glob is broad (`./src/**/*.{ts,tsx}`); with preflight off this is safe — it
  only emits utilities that are actually used, and the host's MUI code uses `sx`/emotion, not bare
  utility class names.

## API client — orval-generated (shared with the host)

One orval config (`orval.config.ts`) runs against the OpenAPI spec and generates a **single** client
into `src/infrastructure/repositories/` plus types into `src/domain/types/v1api`. Ranking endpoints
are included via `input.filters.tags` (`/Ranking/`, `/Events/`, `/Stages/`, `/StageOrders/`). Ranking
pages import the generated hooks/types with relative paths, like any host page:

```ts
import { useGetListRankingSettings } from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { Ranking } from "../../domain/types/v1api"
```

- Requests go through `src/infrastructure/orval/orval-axios-instance.ts` → the shared axios
  **singleton** in `src/infrastructure/orval/AxiosInstance.ts`, initialised once in `src/main.tsx`
  with the API base URL; the bearer token is attached automatically. Ranking authenticates exactly
  like every other host page — nothing ranking-specific to configure.
- **Never edit generated files** under `src/infrastructure/repositories/` or `src/domain/types/v1api`
  — change the backend OpenAPI spec and re-run `npm run orval-build`. These paths are ignored by
  ESLint/Prettier.
- **Surface type/OpenAPI inconsistencies, don't work around them** — if a generated type looks wrong
  or forces an awkward cast/extra request, flag it so it's fixed in the OpenAPI spec and regenerated,
  rather than patched over in app code.
- The ranking CRUD endpoints currently live only on the **local** backend, so `orval.config.ts`
  points its input at `http://localhost/api/v1/openapi/json`. Switch it to the deployed spec once
  they ship to production.

## i18n

Ranking strings live in the host's `public/locales/<lng>/translation.json` under `Ranking.*` and are
served by the host's i18next http-backend like every other key — there is no separate registration
step. Strings go through `react-i18next` `t()` (ESLint `i18next/no-literal-string` is enforced).

- **Reuse common labels from `Ranking.gui.*`** rather than redefining `save`/`cancel`/… per feature;
  add a new common label to `gui` as a component first needs it. Only use a feature-scoped key when
  the wording is genuinely specific.
- Only `en` currently has ranking keys; other locales fall back to English until translated.

## Notifications

Ranking request failures are shown through the host's snackbar: call `useNotifyError()`
(`src/infrastructure/notifications/useNotifyError.ts`) and pass the error — it maps the HTTP status to
a translated `Ranking.gui.error.*` message via the pure, tested `httpErrorMessageKey` and shows it
with `@toolpad/core`'s `useNotifications`. There is no `window`-event bridge.

## Tests

Vitest is configured in `vite.config.ts` (`test` block: `globals`, `environment: "jsdom"`,
`setupFiles: "./src/test/setup.ts"`; `@toolpad/core` is inlined so Vite resolves its ESM directory
import). Domain logic has pure unit tests next to the source; component smoke tests mock the generated
hook with `vi.mock` to stay hermetic (`src/test/i18n.ts` loads the English locale synchronously).

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
- **Thin & logic-free**: components render UI and wire props/hooks together — nothing more. Push
  **all** non-trivial logic (calculations, formatting, data shaping, conditional/branching rules,
  validation) out into the domain layer (`src/domain/`) and import it. A component should be
  understandable at a glance; if you'd need a comment to explain _what_ a piece of inline logic
  computes, that logic belongs in `src/domain/` as a named, tested function instead.
- **One component per file**: each `.tsx` exports exactly one component. When a component splits into
  parts, group them in a `components/` subfolder named after the public component.
- **Stateless first**: prefer presentational components; add state only when essential and keep it
  encapsulated (don't leak it to parents).
- **Clear interfaces**: define an explicit props interface per component. If a component accepts
  `className`, it is the **last** prop in both the type and the destructuring.
- **Composition over inheritance**: favor `children`, render props, and composition.

### Loading & async feedback

Never leave the user waiting on a silent UI — every asynchronous action shows a loading affordance:

- **Page / list / data loads:** render the shared `Spinner` while the query is loading (gate on
  react-query's `isLoading`, e.g. `RankingListContent`). Note `isLoading` is true only when there is
  no cached data, so the spinner shows on a cold load and not on background refetches — intended.
- **Buttons that trigger a save or any HTTP request:** show the pending state **inside the button** —
  disable it (prevents double-submit) and render an inline spinner in place of / beside the label,
  driven by the mutation's `isLoading` (e.g. `usePatchRankingSettings().isLoading` for the
  `RankingSettings` save button). Keep the feedback at the point of action, not a full-page overlay.
- Reuse `Spinner` (or a small inline variant) over ad-hoc markup, so the animation and a11y
  attributes (`role="status"`, `aria-live`, `sr-only` label) stay consistent.

### Domain & data

- **Domain-first logic**: all business and presentation logic lives in `src/domain/` as pure,
  unit-testable functions — **never** inline in components or hooks. Components (and the generated
  repositories) delegate to it. This is what keeps components thin and the logic testable in
  isolation; tests live next to the source. Create the relevant `src/domain/` file as soon as a
  component grows any logic worth naming — don't wait for a "big enough" reason.
- **The generated types are the contract**: build on the orval-generated types in
  `src/domain/types/v1api`, and never hand-edit generated output (regenerate with
  `npm run orval-build`).
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
- **No noise comments**: comment sparingly — only genuinely non-obvious _why_ (a workaround, a
  constraint, counter-intuitive API behavior). Don't add a comment for every small change; rely on
  clear names.
- **Tests**: add tests for new logic and features.
- **Before considering a task done**: run `npm run format`, `npm run lint`, `npm test`, `npm run build`.
- **CSS class naming (ranking area)**: the root element of every ranking component has a first CSS
  class matching the component name in kebab-case prefixed with `rk-` (e.g. `SkeletonLoaderGroup` →
  `rk-skeleton-loader-group`).
