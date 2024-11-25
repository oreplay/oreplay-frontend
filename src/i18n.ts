import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: {
      'ca':['es'], // catalan
      'eu':['es'], // basque
      'gl':['es'], // galician
      'default':['en']
    },
    supportedLngs: ['en', 'es', 'fr'], // Explicitly list supported languages
    load: 'languageOnly', // Ignore region-specific codes like es-ES
  });
export default i18n;
