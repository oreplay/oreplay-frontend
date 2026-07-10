# CLAUDE.md

This file guides AI agents (especially Claude Code) working in this repository. Most sections —
directory structure, i18n, notifications, tests, conventions, principles — describe the **whole
project**. A few focus on the **ranking area**, a Tailwind-styled feature that lives
natively inside this results app; the practices established there are meant to be
applied across the whole project over time.

## Directory & file structure

One preferred layout applies to the **whole codebase**:

- **Pages** live in a dir named after them: `Foo/Foo.tsx`. **Never** a bare `Foo.tsx` under `pages/`,
  and **never** `Foo/index.tsx`. (Much of the older host code still uses `Foo/index.tsx` — that's the
  legacy style, don't copy it into new code.)
- **Components** go in a `components/` dir at the **tightest directory that contains every user** of
  the component. Used by one page → that page's `components/`; shared by several → their nearest
  common ancestor's `components/`. A simple component is just `components/Foo.tsx`; one that has its
  own sub-parts gets its own dir `components/Foo/Foo.tsx`.
- **Reusable non-component code** (functions, hooks, constants, types) goes in a `shared/` dir at the
  same tightest-common-ancestor rule, with the **`.test.ts` next to the source**.
- A **multi-page feature** therefore looks like:
  `Feature/{Feature.tsx (entry), pages/<SubPage>/…, components/…, shared/…}`.
- Top-level globals (`src/components`, `src/domain`, `src/shared`, `src/utils`, `src/services`,
  `src/styles`, `src/types`, `src/infrastructure`) are reserved for genuinely **app-wide** code. Prefer
  colocation over adding to a global. **Orval-generated dirs** (`src/infrastructure/repositories`,
  `src/domain/types/v1api`) are left exactly as generated.
- When relocating files, use **`git mv`** so history is preserved, and update every relative import.

## Commands

> **Node version is defined in `.nvmrc`** Run `nvm use` first. The default shell Node may be too old and make
> `tsc`/`eslint` fail with confusing `Unexpected token` errors.

- `npm run dev` — Vite dev server
- `npm run build` — `tsc` type-check, then Vite build
- `npm run orval-build` — regenerate the API client/types from the OpenAPI spec (see API client)
- `npm test` — Vitest suite once
- `npm run lint` — ESLint, **fails on any warning** (`--max-warnings 0`)
- `npm run format` — Prettier write; `npm run format:check` to verify

## Styling — Tailwind (scoped), coexisting with MUI

**Tailwind** is preferred for new code (especially in the ranking area). It coexists with the app's
MUI because the styling is scoped:

- **Preflight is off** globally (`tailwind.config.js` → `corePlugins.preflight: false`), so Tailwind
  adds no global reset that would restyle the host's MUI tree.
- The base resets that Tailwind's border/button/box-sizing utilities rely on are re-added **scoped to
  `.rk-root`** via `:where(.rk-root)` in `src/styles/tailwind.css`. `:where()` contributes zero
  specificity, so single-class utilities (`.bg-primary`) still win over the resets. Every ranking
  screen renders inside the `.rk-root` wrapper set by the ranking entry
  (`src/pages/Ranking/Ranking.tsx`), so the resets never leak out.
- That same entry imports `src/styles/tokens.css` (palette CSS vars) and `src/styles/tailwind.css`
  (the `@tailwind` directives). Vite's PostCSS (`postcss.config.js` → `tailwindcss` + `autoprefixer`)
  compiles them at build time — there is **no** precompiled `compiled.css` and **no** `build:css`
  step; the compiled utilities land in a code-split CSS chunk loaded with the lazily-imported entry.
- In ranking code: **do not import `@mui/*` or `@emotion/*`.** Build UI from semantic HTML + Tailwind
  utilities written plain (`bg-primary`, `flex`, `text-sm` — **no `tw-` prefix**), inline-SVG icons
  (`src/pages/Ranking/components/icons/`), and the shared `src/pages/Ranking/components/Spinner/`.
- The palette lives in `src/styles/tokens.css` as **channel-format** CSS vars
  (`--color-primary: 255 113 10`) consumed by `tailwind.config.js`, so opacity utilities
  (`bg-primary/50`) work. `primary`, `secondary`, `surface` mirror the host's MUI palette.
- Tailwind's `content` glob is broad (`./src/**/*.{ts,tsx}`); with preflight off this is safe — it
  only emits utilities that are actually used, and the host's MUI code uses `sx`/emotion, not bare
  utility class names.

## API client — orval-generated

One orval config (`orval.config.ts`) runs against the OpenAPI spec and generates a **single** client
into `src/infrastructure/repositories/` plus types into `src/domain/types/v1api`. Ranking endpoints
are included via `input.filters.tags` (`/Ranking/`, `/Events/`, `/Stages/`, `/StageOrders/`). Anywhere
in the project, import the generated hooks/types with relative paths:

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

Every user-facing string goes through `react-i18next`'s `t()` — ESLint's `i18next/no-literal-string`
enforces it. Translations live in `public/locales/<lng>/<namespace>.json` (**19 locales**,
Weblate-managed) and are fetched at runtime by `i18next-http-backend`
(`loadPath: "/locales/{{lng}}/{{ns}}.json"`), together with `LanguageDetector` and a per-language
`fallbackLng` map — see `src/i18n.ts`.

### Namespaces

A namespace is one JSON file per locale, loaded independently. Today: `translation` (the default —
core results/event functionality), `common`, `ranking`, `organizers`, `about-us`, etc.

- **New functionality that isn't deeply tied to the core results feature gets its own namespace**,
  rather than growing `translation.json`. A namespace keeps a feature's wording self-contained,
  keeps it out of the bundle for users who never open it, and lets Weblate track it separately.
- **Declare the namespace, then use bare keys**: `const { t } = useTranslation("organizers")` →
  `t("title")`. This is how every feature namespace is consumed — never `t("organizers:title")`.
- **Wrap the namespace in a hook rather than repeating the string**: the ranking area calls
  `useTranslationRanking()` (`src/pages/Ranking/shared/useTranslationRanking.ts` instead of using `useTranslation("ranking")`), which owns the one
  `RANKING_NAMESPACE` constant. Follow this for every new namespace — no magic strings at call sites.
- **`common` is the exception that is always available**: it is preloaded next to `translation`
  (`ns` in `src/i18n.ts`), so `t("common:save")` works from any `t`, including a plain
  `useTranslation()`. That way a component mixes its own feature keys with generic labels without
  declaring two namespaces, and a Suspense fallback like `GeneralSuspenseFallback` never suspends
  waiting for a namespace. Every other namespace loads lazily, on first `useTranslation("<ns>")`.
- **Register every new namespace in `usedNamespaces`** (`src/supportedLanguages.tsx`).
  `src/supportedLanguages.test.ts` then asserts `public/locales/<lng>/<ns>.json` exists for **every**
  locale, so create the file in all 19 — an empty `{}` is acceptable for a locale that is not
  translated yet (see `public/locales/bg/organizers.json`). Nothing else to register: tests that need
  the strings build their own i18next instance from `usedNamespaces`.

### Key placement

- **Generic UI labels live exactly once, in the `common` namespace** (`common:save`, `common:delete`,
  `common:edit`, `common:loading`, `common:search`, `common:clearSearch`, `common:close`,
  `common:confirm`, `common:ok`, `common:noResults`, `common:deleteConfirm`, `common:duplicate`,
  `common:error.*`). Reuse them **across the whole app** instead of redefining `save`/`delete`/… per
  feature; add a new common label as soon as a second place needs it.
- **Feature-scoped keys** go under their own top-level group inside their namespace (`Ranking.*`,
  `EventAdmin.*`, `ResultsStage.*`, `Dashboard.*`, …). Only introduce one when the wording is
  genuinely specific to that feature — otherwise reach for `common:`.
- **Keys are ordered alphabetically** within every group, and every locale carries the same key set.

## Notifications

Snackbars come from `@toolpad/core`'s `useNotifications()`; its `NotificationsProvider` is mounted
once in `src/App.tsx`. Features call it directly for success/info messages (event admin, sign-up, QR
code, …).

For **failed HTTP requests**, use the shared `useNotifyError()` hook
(`src/infrastructure/notifications/useNotifyError.ts`) — pass it the error and it maps the HTTP status
to a translated `common:error.*` message via the pure, tested `httpErrorMessageKey`, then shows it with
`severity: "error"`. This is app-wide infrastructure available to any feature (today the ranking pages
use it).

## Forms

**Every form is built with TanStack Form** (`@tanstack/react-form`). Never hand-roll per-field
`useState` + manual error flags — a bespoke `WebsiteField` doing exactly that was deleted when
`EventAdminForm` moved to TanStack Form. Reference implementations:
`src/pages/Administration/pages/EventAdmin/components/EventAdminForm/` (MUI) and
`src/pages/Ranking/components/RankingSettingsForm.tsx` (Tailwind).

- **Shape**: `const form = useForm({ defaultValues, onSubmit: ({ value }) => props.onSubmit(value) })`,
  then one `<form.Field name="…" validators={{ … }}>{(field) => …}</form.Field>` per input.
- **Submit**: put `noValidate` on the `<form>` so the browser's native bubbles don't pre-empt our
  translated messages, and submit with
  `onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }}`.
- **Validation** goes in `validators` — `onChange` for as-you-type rules, `onBlur` for
  required/format, `onSubmit` for cross-field rules, and `onChangeListenTo: ["otherField"]` when a
  field depends on another (e.g. start/end dates). Every message is produced with `t()`; reuse the
  existing `ThisFieldIsRequiredMsg` key for "required".
- **Non-trivial predicates are pure functions** in the feature's `shared/` dir, unit-tested next to
  the source (e.g. `validateURL`). Keep the `t()` call in the component, the predicate pure.
- **Errors render through reusable field components**, never ad-hoc markup: pass
  `field.state.meta.errors` into the component's `error` prop. The component then turns the control
  and label red, sets `aria-invalid`, and renders the message (`FieldError`, `role="alert"`). Ranking
  fields live in `src/pages/Ranking/components/form/`; MUI forms use `error` + `helperText`.
- **Extend, don't fork**: if a field can't show an error, add an `error` prop to the existing shared
  component rather than creating a one-off field that owns its own error state.
- **Gate the submit button** with `<form.Subscribe>` (`canSubmit`) and show the pending state from the
  mutation's `isLoading` — see Loading & async feedback.

## Tests

Vitest is configured in `vite.config.ts` (`test` block: `globals: true`, `environment: "jsdom"`,
`setupFiles: "./src/test/setup.ts"`, `env: { TZ: "UTC" }`, and `server.deps.inline: ["@toolpad/core"]`
so Vite resolves its ESM directory import). `src/test/setup.ts` only pulls in
`@testing-library/jest-dom`.

- **Tests live next to the source they cover** (`foo.ts` → `foo.test.ts`). A legacy `__tests__/` folder
  still exists under `src/domain/services/` — don't copy that pattern into new code.
- **No global i18next instance is initialised for tests.** A test that needs real strings builds its own
  with `createInstance()`, loading `public/locales/en/<ns>.json` for each entry of `usedNamespaces` —
  see `src/pages/Ranking/shared/useTranslationRanking.test.ts`. Components rendered without one fall
  back to showing key names, so assert on data, not labels, unless you set an instance up.
- Pure logic (domain / `shared/` functions) is unit-tested directly; component smoke tests mock the
  orval-generated hook with `vi.mock` to stay hermetic.
- `vi.mock()` takes a path **relative to the test file** and is _not_ an import statement — remember to
  update it by hand when moving files.

## Conventions

- Prettier: **no semicolons**, LF line endings (`.prettierrc`). Let `npm run format` handle style.
- TypeScript strict, with `noUnusedLocals`/`noUnusedParameters` — unused vars fail the build.
- ESLint runs with type-checking and treats `@typescript-eslint/no-unsafe-*` as errors; avoid `any`.
  Non-source TS like `vite.config.ts` is in `.eslintignore` (it is not in the `tsconfig` project).
- `react-router` v7: `navigate()` returns a promise, so in event handlers use `void navigate(...)`
  (otherwise `no-misused-promises` / `no-floating-promises` fire).
- **Dates & times go through Luxon** (`DateTime`, `Duration`) — parsing, formatting, arithmetic,
  timezones, and "now". The native `Date` is banned by ESLint's `no-restricted-globals`, in source
  and tests alike (`vi.setSystemTime(DateTime.fromISO(…).toMillis())`). `TimeZoneAutocomplete`'s
  `getOffset`/`getLocalizedName` still format through `Intl` because Luxon can't reproduce them
  (`shortOffset` has no equivalent, and `"UTC"` resolves to a `FixedOffsetZone`), but they format a
  Luxon instant, not a `Date` — `functions.test.ts` pins that behavior.

### Component design

- **Single Responsibility**: each component does one thing.
- **Aggressively small components**: extract every visually or logically distinct section into its
  own component. A parent should read as a list of child components, not large blocks of markup.
- **Thin & logic-free**: components render UI and wire props/hooks together — nothing more. Push
  **all** non-trivial logic (calculations, formatting, data shaping, conditional/branching rules,
  validation) out into a `shared/` module and import it. A component should be understandable at a
  glance; if you'd need a comment to explain _what_ a piece of inline logic computes, that logic
  belongs in `shared/` as a named, tested function instead.
- **One component per file**: each `.tsx` exports exactly one component. When a component grows its own
  sub-parts, give it a dir (`components/Foo/Foo.tsx`) and put those parts in
  `components/Foo/components/` — see Directory & file structure.
- **Stateless first**: prefer presentational components; add state only when essential and keep it
  encapsulated (don't leak it to parents).
- **Clear interfaces**: define an explicit props interface per component. If a component accepts
  `className`, it is the **last** prop in both the type and the destructuring.
- **Composition over inheritance**: favor `children`, render props, and composition.

### Loading & async feedback

Never leave the user waiting on a silent UI — every asynchronous action shows a loading affordance:

- **Page / list / data loads:** render a spinner while the query is loading — in the ranking area, the
  shared `src/pages/Ranking/components/Spinner/` (gate on react-query's `isLoading`, e.g.
  `RankingListContent`). Note `isLoading` is true only when there is no cached data, so the spinner
  shows on a cold load and not on background refetches — intended.
- **Buttons that trigger a save or any HTTP request:** show the pending state **inside the button** —
  disable it (prevents double-submit) and render an inline spinner in place of / beside the label,
  driven by the mutation's `isLoading` (e.g. `usePatchRankingSettings().isLoading` for the
  `RankingSettings` save button). Keep the feedback at the point of action, not a full-page overlay.
- Reuse `Spinner` (or a small inline variant) over ad-hoc markup, so the animation and a11y
  attributes (`role="status"`, `aria-live`, `sr-only` label) stay consistent.

### Domain & data

- **Domain-first logic**: all business and presentation logic lives in pure, unit-testable functions —
  **never** inline in components or hooks. They belong in the feature's `shared/` dir (placed by the
  tightest-common-ancestor rule); `src/domain/` is reserved for genuinely app-wide domain code.
  Components (and the generated repositories) delegate to them. This is what keeps components thin and
  the logic testable in isolation; tests live next to the source. Create the `shared/` file as soon as
  a component grows any logic worth naming — don't wait for a "big enough" reason.
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

- **Clean code**: always consider SOLID and clean code principles (Robert C. Martin).
- **Refactor over hack**: restructure surrounding code to fit a change cleanly rather than adding a
  case-specific workaround.
- **Readability**: don't inline long ternaries/conditions in JSX props — extract named variables.
- **DRY**: extract duplicated logic into reusable functions.
- **i18n**: user-facing markup strings go through `t()`.
- **Accessibility**: prefer semantic HTML and appropriate ARIA attributes.
- **Do not write any comments at all**: If you feel the need to write a comment explaining something, extract a variable or a function with a meaningful name, following SOLID and Clean Code (Robert C. Martin). A magic number becomes a named constant; a condition becomes a named predicate; a block becomes a named function. This includes JSDoc, section dividers (`// ─── Section ───`), inline notes, and per-section UI comments. Compiler and tooling directives (`eslint-disable`, `@ts-expect-error`, `#!/usr/bin/env`) are not comments and are exempt.
- **Tests**: add tests for new logic and features.
- **Before considering a task done**: run `npm run format`, `npm run lint`, `npm test`, `npm run build`.
- **CSS class naming (ranking area)**: the root element of every ranking component has a first CSS
  class matching the component name in kebab-case prefixed with `rk-` (e.g. `SkeletonLoaderGroup` →
  `rk-skeleton-loader-group`).
