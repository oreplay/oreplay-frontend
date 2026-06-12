import { Box, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useGetListRankingSettings } from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import RankingListContent from "./components/RankingListContent.tsx"

export default function RankingList() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useGetListRankingSettings()

  return (
    <Box
      className="rk-ranking-list"
      sx={{
        minHeight: "100vh",
        flexGrow: 1,
        backgroundColor: "#f6f6f6",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
          {t("Ranking.List.title")}
        </Typography>
        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {t("Ranking.List.description")}
        </Typography>
        <RankingListContent
          isError={isError}
          isLoading={isLoading}
          rankings={data?.data ?? []}
        />
      </Container>
    </Box>
  )
}
