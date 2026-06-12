import { Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useGetListRankingList } from "@oreplay/api-client"
import RankingSettingsForm from "./components/RankingSettingsForm.tsx"

export default function RankingSettings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetListRankingList()

  // No get-one endpoint exists yet, so the ranking is resolved from the list.
  const ranking = data?.data.find((item) => item.id === rankingId)

  return (
    <Box sx={{ minHeight: "100vh", flexGrow: 1, backgroundColor: "#f6f6f6", py: 6 }}>
      <Container maxWidth="sm">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => void navigate("/ranking")}
          sx={{ mb: 2 }}
        >
          {t("Ranking.Settings.back")}
        </Button>
        <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
          {t("Ranking.Settings.title")}
        </Typography>

        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : ranking ? (
          <RankingSettingsForm ranking={ranking} />
        ) : (
          <Typography color="text.secondary">{t("Ranking.Settings.notFound")}</Typography>
        )}
      </Container>
    </Box>
  )
}
