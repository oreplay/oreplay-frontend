import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { supportedLanguages } from "./supportedLanguages.tsx"

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: {
      ca: ["es"], // catalan
      eu: ["es"], // basque
      gl: ["es"], // galician
      default: ["en"],
    },
    supportedLngs: supportedLanguages.map((item) => item.code), // Explicitly list supported languages
    load: "languageOnly", // Ignore region-specific codes like es-ES
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })

i18n.on("languageChanged", (lng) => (document.documentElement.lang = lng))

export default i18n
