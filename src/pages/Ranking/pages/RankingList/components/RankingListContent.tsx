import { useNavigate } from "react-router-dom"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { rankingCreatePath } from "../../../../../shared/routes.ts"
import { Ranking } from "../../../../../domain/types/v1api"
import PrimaryButton from "../../../components/PrimaryButton.tsx"
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
  const navigate = useNavigate()

  if (isLoading) {
    return <Spinner label={t("common:loading")} />
  }

  if (isError) {
    return <p className="rk-ranking-list-content text-red-600">{t("List.loadError")}</p>
  }

  if (rankings.length === 0) {
    return (
      <div className="rk-ranking-list-content">
        <PrimaryButton onClick={() => void navigate(rankingCreatePath())}>
          {t("Create.title")}
        </PrimaryButton>
      </div>
    )
  }

  return (
    <ul className="rk-ranking-list-content m-0 flex list-none flex-col gap-3 p-0">
      {rankings.map((ranking) => (
        <RankingListItem key={ranking.id} ranking={ranking} />
      ))}
    </ul>
  )
}
