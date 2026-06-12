# @oreplay/ranking

The O-Replay **ranking module** — a `react-router` routes subtree the host results app
(`oreplay-frontend`) mounts at `/ranking/*`. It ships as an npm package so it can be developed,
reviewed, tested and styled in its own repo, while at runtime it is part of the host's single SPA
(one shared React / react-query / router / session runtime).

## Quick start

```bash
nvm use          # Node 22 (from .nvmrc)
npm install
npm run dev      # standalone dev server → http://localhost:5173
npm test         # Vitest
npm run build    # library build → dist/ (ESM + index.d.ts)
```

## Usage (in the host)

```tsx
import { RankingRoutes } from "@oreplay/ranking"

// inside the host's own <BrowserRouter>, behind its PrivateRoute:
;<Route path="/ranking/*" element={<RankingRoutes />} />
```

## Status

Scaffold: `/ranking` lists rankings; each row links to `/ranking/:rankingId/settings`. Settings is
resolved from the list (no get-one endpoint yet) and **Save is a stub** (no `PATCH /rankings/{id}`
yet) — both marked with `TODO`s. The API layer is a local mock behind the `@oreplay/api-client`
alias until that package exists.

## Further reading

- **`CLAUDE.md`** — architecture, conventions, the two dev modes, peer-dep/styling/i18n details, and
  how the `@oreplay/api-client` alias is swapped for the real package.
- **`claude-ranking-module-plan.md`** — the design rationale behind the whole module.
