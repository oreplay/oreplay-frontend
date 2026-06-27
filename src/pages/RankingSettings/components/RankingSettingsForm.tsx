import { FormEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { Ranking } from "../../../domain/types/v1api"
import { usePatchRankingSettings } from "../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import {
  RankingSettingsFormState,
  initRankingSettingsForm,
  toRankingPatchBody,
} from "../../../domain/rankingSettingsForm.ts"
import { OVERALL_SETTINGS_FIELDS } from "../../../domain/overallSettings.ts"
import { ROUND_PRECISION_OPTIONS } from "../../../domain/roundPrecision.ts"
import { SCORING_ALGORITHM_OPTIONS } from "../../../domain/scoringAlgorithm.ts"
import { STATUS_SCORE_FIELDS } from "../../../domain/statusScores.ts"
import {
  NC_SCORE_VALUES,
  STATUS_SCORE_VALUES,
} from "../../../domain/scoreOptions.ts"
import { competitionResultsPath } from "../../../domain/competitionLink.ts"
import FormSection from "../../../components/form/FormSection.tsx"
import NumberField from "../../../components/form/NumberField.tsx"
import ScoreSelectField from "../../../components/form/ScoreSelectField.tsx"
import SelectField from "../../../components/form/SelectField.tsx"
import TextField from "../../../components/form/TextField.tsx"

interface RankingSettingsFormProps {
  ranking: Ranking
}

export default function RankingSettingsForm({
  ranking,
}: RankingSettingsFormProps) {
  const { t } = useTranslation()
  const { mutate, isLoading } = usePatchRankingSettings()
  const [state, setState] = useState(() => initRankingSettingsForm(ranking))

  const update = <K extends keyof RankingSettingsFormState>(
    key: K,
    value: RankingSettingsFormState[K],
  ) => setState((prev) => ({ ...prev, [key]: value }))

  const updateArray = (
    key: "statusScores" | "overallSettings",
    index: number,
    value: number | null,
  ) =>
    setState((prev) => {
      const next = [...prev[key]]
      next[index] = value
      return { ...prev, [key]: next }
    })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate({ rankingID: ranking.id, data: toRankingPatchBody(ranking, state) })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rk-ranking-settings-form flex flex-col gap-10"
    >
      <div className="flex flex-col gap-1">
        <TextField
          label={t("Ranking.Settings.titleLabel")}
          required
          value={state.title}
          onChange={(value) => update("title", value)}
        />
        <a
          href={competitionResultsPath(ranking.event_id, ranking.stage_id)}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-sm text-primary hover:underline"
        >
          {t("Ranking.Settings.competitionLink")}
        </a>
      </div>

      <FormSection title={t("Ranking.Settings.generalSettings")}>
        <NumberField
          label={t("Ranking.Settings.maxPoints")}
          description={t("Ranking.Settings.maxPointsHint")}
          required
          value={state.maxPoints}
          onChange={(value) => update("maxPoints", value)}
          className="col-span-2"
        />
        <SelectField
          label={t("Ranking.Settings.scoringAlgorithm")}
          required
          className="col-span-2"
          value={state.scoringAlgorithm}
          onChange={(value) => update("scoringAlgorithm", value)}
          options={SCORING_ALGORITHM_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
        />
        <SelectField
          label={t("Ranking.Settings.roundPrecision")}
          required
          className="col-span-2"
          value={String(state.roundPrecision)}
          onChange={(value) => update("roundPrecision", Number(value))}
          options={ROUND_PRECISION_OPTIONS.map((option) => ({
            value: String(option.value),
            label: t(option.labelKey),
          }))}
        />
      </FormSection>

      <FormSection
        title={t("Ranking.Settings.circuitSettings")}
        description={t("Ranking.Settings.circuitSettingsHint")}
      >
        {OVERALL_SETTINGS_FIELDS.map((field, index) => (
          <NumberField
            key={field.key}
            label={t(field.labelKey)}
            value={state.overallSettings[index]}
            onChange={(value) => updateArray("overallSettings", index, value)}
          />
        ))}
      </FormSection>

      <FormSection
        title={t("Ranking.Settings.nonCompetitive")}
        description={t("Ranking.Settings.nonCompetitiveHint")}
      >
        <ScoreSelectField
          label={t("Ranking.Settings.ncTrue")}
          value={state.ncTrue}
          onChange={(value) => update("ncTrue", value)}
          values={NC_SCORE_VALUES}
          emptyLabel={t("Ranking.Settings.scoreOptions.empty")}
        />
        <ScoreSelectField
          label={t("Ranking.Settings.ncFalse")}
          value={state.ncFalse}
          onChange={(value) => update("ncFalse", value)}
          values={NC_SCORE_VALUES}
          emptyLabel={t("Ranking.Settings.scoreOptions.empty")}
        />
      </FormSection>

      <FormSection
        title={t("Ranking.Settings.statusScores")}
        description={t("Ranking.Settings.statusScoresHint")}
      >
        {STATUS_SCORE_FIELDS.map((field, index) => (
          <ScoreSelectField
            key={field.index}
            label={t(field.labelKey)}
            value={state.statusScores[index]}
            onChange={(value) => updateArray("statusScores", index, value)}
            values={STATUS_SCORE_VALUES}
            emptyLabel={t("Ranking.Settings.scoreOptions.empty")}
          />
        ))}
      </FormSection>

      <button
        type="submit"
        disabled={isLoading}
        className="self-end rounded bg-primary px-4 py-2 font-medium text-neutral-900 disabled:opacity-50"
      >
        {t("Ranking.gui.save")}
      </button>
    </form>
  )
}
