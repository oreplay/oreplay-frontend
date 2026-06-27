import type { i18n as I18n } from "i18next"
import { rankingResources } from "./rankingResources.ts"

/**
 * Merge the module's bundled translations into whichever i18next instance the
 * host (or the standalone dev shell) provides. Deep-merge + overwrite so the
 * module's keys win and the host needs no `Ranking.*` entries of its own.
 *
 * Called once on mount in `RankingRoutes`, synchronously before any child reads
 * a `Ranking.*` key.
 */
export function registerRankingResources(i18n: I18n): void {
  for (const [lng, resources] of Object.entries(rankingResources)) {
    i18n.addResourceBundle(lng, "translation", resources, true, true)
  }
}
