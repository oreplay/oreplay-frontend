import { useTranslation } from "react-i18next"

export const RANKING_NAMESPACE = "ranking"

export function useTranslationRanking() {
  return useTranslation(RANKING_NAMESPACE)
}
