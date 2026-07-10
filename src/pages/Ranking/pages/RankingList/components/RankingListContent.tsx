import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { Ranking } from "../../../../../domain/types/v1api"
import Spinner from "../../../components/Spinner/Spinner.tsx"
import RankingListItem from "./RankingListItem.tsx"

interface RankingListContentProps {
  isError: boolean
  isLoading: boolean
  rankings: Ranking[]
}

export default function RankingListContent({
  isError,
  isLoading,
  rankings,
}: RankingListContentProps) {
  const { t } = useTranslationRanking()

  if (isLoading) {
    return <Spinner label={t("common:loading")} />
  }

  if (isError) {
    return <p className="rk-ranking-list-content text-red-600">{t("List.loadError")}</p>
  }

  if (rankings.length === 0) {
    return <p className="rk-ranking-list-content text-neutral-500">{t("List.empty")}</p>
  }

  return (
    <ul className="rk-ranking-list-content m-0 flex list-none flex-col gap-3 p-0">
      {rankings.map((ranking) => (
        <RankingListItem key={ranking.id} ranking={ranking} />
      ))}
    </ul>
  )
}
