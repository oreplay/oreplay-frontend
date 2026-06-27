// The ranking module's translations are Weblate-managed in `public/locales`
// (the same workflow and file shape as the host) and bundled here so the module
// is self-contained: it registers them into the shared i18next instance at
// runtime (see `registerRankingResources`). The host therefore carries NO
// `Ranking.*` keys — change a string in this repo only.
//
// Add a language by dropping `public/locales/<lng>/translation.json` and a line
// below.
import en from "../../public/locales/en/translation.json"

export const rankingResources: Record<string, Record<string, unknown>> = {
  en,
}
