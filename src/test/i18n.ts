import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import common from "../../public/locales/en/common.json"
import en from "../../public/locales/en/translation.json"

// Hermetic i18n for tests: jsdom has no server, so the English strings are
// loaded straight from the locale file (no http-backend) and rendering is
// synchronous (`useSuspense: false`) — no <Suspense> boundary needed in tests.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["translation", "common"],
  defaultNS: "translation",
  resources: { en: { translation: en, common } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
