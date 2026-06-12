import { useState } from "react"
import { Button, Stack, TextField, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Ranking } from "../../../domain/types/v1api"
import { usePatchRankingSettings } from "../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"

interface RankingSettingsFormProps {
  ranking: Ranking
}

export default function RankingSettingsForm({
  ranking,
}: RankingSettingsFormProps) {
  const { t } = useTranslation()
  const [maxPoints, setMaxPoints] = useState(ranking.max_points)
  const { mutate, isLoading } = usePatchRankingSettings()

  const scoringAlgorithm = `${t("Ranking.Settings.scoringAlgorithm")}: ${ranking.scoring_algorithm}`

  const handleSave = () => {
    mutate({
      rankingID: ranking.id,
      data: { id: ranking.id, max_points: maxPoints },
    })
  }

  return (
    <Stack className="rk-ranking-settings-form" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {scoringAlgorithm}
      </Typography>
      <TextField
        type="number"
        label={t("Ranking.Settings.maxPoints")}
        value={maxPoints}
        onChange={(event) => setMaxPoints(Number(event.target.value))}
      />
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isLoading}
        sx={{ alignSelf: "flex-start" }}
      >
        {t("Ranking.Settings.save")}
      </Button>
    </Stack>
  )
}
