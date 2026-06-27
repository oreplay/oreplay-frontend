import { useState } from "react"
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
    // The PATCH body requires the full entity; we resend it with only
    // `max_points` changed. `overall_settings` is a string on the body but an
    // object on the entity, so it is serialised.
    mutate({
      rankingID: ranking.id,
      data: {
        id: ranking.id,
        event_id: ranking.event_id,
        stage_id: ranking.stage_id,
        excluded_class_names: ranking.excluded_class_names ?? "",
        nc_false: ranking.nc_false ?? 0,
        nc_true: ranking.nc_true ?? 0,
        overall_settings: JSON.stringify(ranking.overall_settings ?? {}),
        round_precision: ranking.round_precision,
        scoring_algorithm: ranking.scoring_algorithm,
        status_scores: ranking.status_scores ?? "",
        max_points: maxPoints,
      },
    })
  }

  return (
    <div className="rk-ranking-settings-form flex flex-col gap-4">
      <p className="text-sm text-neutral-500">{scoringAlgorithm}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral-600">
          {t("Ranking.Settings.maxPoints")}
        </span>
        <input
          type="number"
          value={maxPoints}
          onChange={(event) => setMaxPoints(Number(event.target.value))}
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>
      <button
        type="button"
        onClick={handleSave}
        disabled={isLoading}
        className="self-start rounded bg-primary px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {t("Ranking.Settings.save")}
      </button>
    </div>
  )
}
