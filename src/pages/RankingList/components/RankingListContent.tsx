import { CircularProgress, List, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Ranking } from "../../../domain/types/v1api"
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
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Stack
        className="rk-ranking-list-content"
        alignItems="center"
        sx={{ py: 6 }}
      >
        <CircularProgress />
      </Stack>
    )
  }

  if (isError) {
    return (
      <Typography className="rk-ranking-list-content" color="error">
        {t("Ranking.List.loadError")}
      </Typography>
    )
  }

  if (rankings.length === 0) {
    return (
      <Typography className="rk-ranking-list-content" color="text.secondary">
        {t("Ranking.List.empty")}
      </Typography>
    )
  }

  return (
    <List className="rk-ranking-list-content" disablePadding>
      {rankings.map((ranking) => (
        <RankingListItem key={ranking.id} ranking={ranking} />
      ))}
    </List>
  )
}
