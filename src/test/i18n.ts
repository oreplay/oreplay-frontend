import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { rankingResources } from "../i18n/rankingResources.ts"

// Hermetic i18n for tests. Unlike `src/dev/i18n.ts` (a verbatim copy of the host
// that loads strings over http-backend), jsdom has no server — so here the
// strings come straight from the module's bundled resources, and rendering is
// synchronous (`useSuspense: false`), no <Suspense> boundary needed in tests.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: Object.fromEntries(
    Object.entries(rankingResources).map(([lng, translation]) => [
      lng,
      { translation },
    ]),
  ),
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
