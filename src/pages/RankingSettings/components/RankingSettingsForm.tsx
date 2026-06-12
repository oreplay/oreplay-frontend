import { useState } from "react"
import { Button, Stack, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { RankingsNsRanking } from "@oreplay/api-client"

interface RankingSettingsFormProps {
  ranking: RankingsNsRanking
}

export default function RankingSettingsForm({ ranking }: RankingSettingsFormProps) {
  const { t } = useTranslation()
  const [scoringAlgorithm, setScoringAlgorithm] = useState(ranking.scoring_algorithm)
  const [maxPoints, setMaxPoints] = useState(ranking.max_points)
  const [maxRacesCounted, setMaxRacesCounted] = useState(
    ranking.overall_settings.maxRacesCounted ?? 0,
  )
  const [organizerScoringFraction, setOrganizerScoringFraction] = useState(
    ranking.overall_settings.organizerScoringFraction ?? 0,
  )

  const handleSave = () => {
    // TODO: wire up to the PATCH /rankings/{id} endpoint once it exists in the
    // backend OpenAPI spec and is generated into `@oreplay/api-client`.
    console.debug("Save ranking settings", {
      id: ranking.id,
      scoringAlgorithm,
      maxPoints,
      maxRacesCounted,
      organizerScoringFraction,
    })
  }

  return (
    <Stack spacing={2}>
      <TextField
        label={t("Ranking.Settings.scoringAlgorithm")}
        value={scoringAlgorithm}
        onChange={(event) => setScoringAlgorithm(event.target.value)}
      />
      <TextField
        type="number"
        label={t("Ranking.Settings.maxPoints")}
        value={maxPoints}
        onChange={(event) => setMaxPoints(Number(event.target.value))}
      />
      <TextField
        type="number"
        label={t("Ranking.Settings.overall.maxRacesCounted")}
        value={maxRacesCounted}
        onChange={(event) => setMaxRacesCounted(Number(event.target.value))}
      />
      <TextField
        type="number"
        label={t("Ranking.Settings.overall.organizerScoringFraction")}
        value={organizerScoringFraction}
        onChange={(event) => setOrganizerScoringFraction(Number(event.target.value))}
      />
      <Button variant="contained" onClick={handleSave} sx={{ alignSelf: "flex-start" }}>
        {t("Ranking.Settings.save")}
      </Button>
    </Stack>
  )
}
