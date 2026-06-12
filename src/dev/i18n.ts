import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

/*
 * Dev/test-only i18n setup — mirrors the host's `src/i18n.ts`. Translations are
 * loaded at runtime via i18next-http-backend from
 * `public/locales/{{lng}}/{{ns}}.json` (default `translation` namespace,
 * Weblate-managed, same file structure as the host). Vite serves `public/` at
 * the root, so the files resolve in `npm run dev`.
 *
 * In production the host provides the shared, already-initialised i18next
 * instance, so this file is NOT part of the published package.
 */
// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    load: "languageOnly",
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    // The host wraps its app in <Suspense>; this minimal dev shell does not, so
    // render synchronously instead of suspending while the backend loads.
    react: { useSuspense: false },
  })

i18n.on("languageChanged", (lng) => (document.documentElement.lang = lng))

export default i18n
