import i18n from "i18next"
import { initReactI18next } from "react-i18next"

/*
 * Dev-only i18n setup. In production the host app provides i18next (a peer
 * dependency / shared singleton) already initialised with these keys via
 * Weblate, so this file is NOT part of the published package.
 */
const ranking = {
  List: {
    title: "Rankings",
    description: "Manage your ranking lists and edit the settings of each one.",
    empty: "No rankings yet.",
    loadError: "We couldn't load the rankings.",
    editSettings: "Edit settings",
    scoringAlgorithm: "Scoring algorithm",
    maxPoints: "Max points",
  },
  Settings: {
    title: "Ranking settings",
    back: "Back to rankings",
    notFound: "Ranking not found.",
    save: "Save",
    scoringAlgorithm: "Scoring algorithm",
    maxPoints: "Max points",
    overall: {
      maxRacesCounted: "Max races counted",
      organizerScoringFraction: "Organizer scoring fraction",
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: { en: { translation: { Ranking: ranking } } },
  interpolation: { escapeValue: false },
})

export default i18n
