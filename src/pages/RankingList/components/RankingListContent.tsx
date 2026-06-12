import { CircularProgress, List, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { RankingsNsRanking } from "@oreplay/api-client"
import RankingListItem from "./RankingListItem.tsx"

interface RankingListContentProps {
  isError: boolean
  isLoading: boolean
  rankings: RankingsNsRanking[]
}

export default function RankingListContent({
  isError,
  isLoading,
  rankings,
}: RankingListContentProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    )
  }

  if (isError) {
    return <Typography color="error">{t("Ranking.List.loadError")}</Typography>
  }

  if (rankings.length === 0) {
    return <Typography color="text.secondary">{t("Ranking.List.empty")}</Typography>
  }

  return (
    <List disablePadding>
      {rankings.map((ranking) => (
        <RankingListItem key={ranking.id} ranking={ranking} />
      ))}
    </List>
  )
}
