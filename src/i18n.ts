import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { supportedLanguages } from "./supportedLanguages.tsx"

const locales = [...new Set(supportedLanguages.map(({ code }) => code.split("-")[0]))]

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: {
      ca: ["es", "en"], // catalan
      eu: ["es", "en"], // basque
      gl: ["es", "en"], // galician
      default: ["en"],
    },
    supportedLngs: locales, // Explicitly list supported languages
    load: "languageOnly", // Ignore region-specific codes like es-ES
    ns: ["translation", "common"],
    defaultNS: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })

i18n.on("languageChanged", (lng) => (document.documentElement.lang = lng))

export default i18n
