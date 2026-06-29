# @oreplay/ranking

The O-Replay **ranking module** for managing ranking settings and generation based on o-replay 
published results.

It works as a `react-router` routes subtree the host results app
(`oreplay-frontend`) mounts at `/ranking/*`. It ships as an npm package so it can be developed,
reviewed, tested and styled in its own repo, while at runtime it is part of the host's single SPA
(one shared React / react-query / router / session runtime).

Its styles and translations travel with the package, so the host needs no Tailwind setup and no
ranking translations of its own — it just injects the API base URL and the bearer token.

## Quick start

```bash
nvm use          # Node 22 (from .nvmrc)
npm install
npm run dev      # standalone dev server → http://localhost:5173
npm test         # Vitest
npm run build    # library build → dist/ (ESM + index.d.ts)
```

- The **API client + types** are
  generated locally with orval (`npm run orval-build`) from the live OpenAPI spec, scoped to the
  ranking endpoints — see `CLAUDE.md` → API client.

- **Tailwind only** — no MUI/Emotion. Build UI from semantic HTML + Tailwind utilities (written
  plain, with **no `tw-` prefix**). Icons are small inline-SVG components under `src/components/icons/`.
  Preflight is disabled because the module mounts inside the host's DOM. See `CLAUDE.md` → Styling.

## Usage (in the host)

```tsx
import { RankingRoutes } from "@oreplay/ranking"

// inside the host's own <BrowserRouter>, behind its PrivateRoute.
// The host injects the API base URL and the current in-memory bearer token:
;<Route
  path="/ranking/*"
  element={<RankingRoutes apiBaseUrl={API_DOMAIN} authToken={token} />}
/>
```

## Further reading

- **`CLAUDE.md`** — architecture, conventions, the two dev modes, and the peer-dep / styling / i18n
  details (including how translations are bundled and registered into the host's i18next instance).
