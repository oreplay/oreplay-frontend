import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
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
    supportedLngs: ["en", "es", "fr", "uk", "ca", "gl", "pt"], // Explicitly list supported languages
    load: "languageOnly", // Ignore region-specific codes like es-ES
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })
export default i18n
