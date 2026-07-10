import { ReactNode } from "react"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import { useForm } from "@tanstack/react-form"
import {
  RankingSettingsFormState,
  isRankingSettingsFormComplete,
} from "../shared/rankingSettingsForm.ts"
import { OVERALL_SETTINGS_FIELDS } from "../shared/overallSettings.ts"
import { ROUND_PRECISION_OPTIONS } from "../shared/roundPrecision.ts"
import { SCORING_ALGORITHM_OPTIONS } from "../shared/scoringAlgorithm.ts"
import { STATUS_SCORE_FIELDS } from "../shared/statusScores.ts"
import { NC_SCORE_VALUES, STATUS_SCORE_VALUES } from "../shared/scoreOptions.ts"
import { competitionResultsPath } from "../shared/competitionLink.ts"
import FormSection from "./form/FormSection.tsx"
import NumberField from "./form/NumberField.tsx"
import ScoreSelectField from "./form/ScoreSelectField.tsx"
import SelectField from "./form/SelectField.tsx"
import TextField from "./form/TextField.tsx"

interface RankingSettingsFormProps {
  initialState: RankingSettingsFormState
  /** Source event/stage for the competition link (not editable). */
  eventId: string
  stageId: string
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (state: RankingSettingsFormState) => void
  /** Extra action shown next to the submit button (e.g. delete). */
  secondaryAction?: ReactNode
}

/** TanStack Form exposes one message per failed validator; join them for display. */
const errorMessage = (errors: (string | undefined)[]): string | undefined =>
  errors.filter(Boolean).join(" ") || undefined

// Presentational, action-agnostic form; the page wires `onSubmit` and labels.
// Validation lives in `<form.Field validators>`; `noValidate` keeps the browser
// from pre-empting our translated messages with its native bubbles.
export default function RankingSettingsForm({
  initialState,
  eventId,
  stageId,
  submitLabel,
  isSubmitting,
  onSubmit,
  secondaryAction,
}: RankingSettingsFormProps) {
  const { t } = useTranslationRanking()

  const form = useForm({
    defaultValues: initialState,
    onSubmit: ({ value }) => onSubmit(value),
  })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className="rk-ranking-settings-form flex flex-col gap-10"
    >
      <div className="flex flex-col gap-1">
        <form.Field
          name="title"
          validators={{
            onBlur: ({ value }) =>
              value.trim() ? undefined : t("translation:ThisFieldIsRequiredMsg"),
          }}
        >
          {(field) => (
            <TextField
              label={t("Settings.titleLabel")}
              required
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorMessage(field.state.meta.errors)}
            />
          )}
        </form.Field>
        <a
          href={competitionResultsPath(eventId, stageId)}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-sm text-primary hover:underline"
        >
          {t("Settings.competitionLink")}
        </a>
      </div>

      <FormSection title={t("Settings.generalSettings")}>
        <form.Field
          name="maxPoints"
          validators={{
            onBlur: ({ value }) =>
              value === null ? t("translation:ThisFieldIsRequiredMsg") : undefined,
            onChange: ({ value }) =>
              value !== null && value <= 0 ? t("Settings.maxPointsPositive") : undefined,
          }}
        >
          {(field) => (
            <NumberField
              label={t("Settings.maxPoints")}
              description={t("Settings.maxPointsHint")}
              required
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorMessage(field.state.meta.errors)}
              className="col-span-2"
            />
          )}
        </form.Field>

        <form.Field
          name="scoringAlgorithm"
          validators={{
            onBlur: ({ value }) => (value ? undefined : t("translation:ThisFieldIsRequiredMsg")),
          }}
        >
          {(field) => (
            <SelectField
              label={t("Settings.scoringAlgorithm")}
              required
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorMessage(field.state.meta.errors)}
              options={SCORING_ALGORITHM_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
              className="col-span-2"
            />
          )}
        </form.Field>

        <form.Field name="roundPrecision">
          {(field) => (
            <SelectField
              label={t("Settings.roundPrecision")}
              required
              value={String(field.state.value)}
              onChange={(value) => field.handleChange(Number(value))}
              onBlur={field.handleBlur}
              error={errorMessage(field.state.meta.errors)}
              options={ROUND_PRECISION_OPTIONS.map((option) => ({
                value: String(option.value),
                label: t(option.labelKey),
              }))}
              className="col-span-2"
            />
          )}
        </form.Field>
      </FormSection>

      <FormSection
        title={t("Settings.circuitSettings")}
        description={t("Settings.circuitSettingsHint")}
      >
        {OVERALL_SETTINGS_FIELDS.map((settingsField, index) => (
          <form.Field key={settingsField.key} name={`overallSettings[${index}]`}>
            {(field) => (
              <NumberField
                label={t(settingsField.labelKey)}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={errorMessage(field.state.meta.errors)}
              />
            )}
          </form.Field>
        ))}
      </FormSection>

      <FormSection
        title={t("Settings.nonCompetitive")}
        description={t("Settings.nonCompetitiveHint")}
      >
        <form.Field name="ncTrue">
          {(field) => (
            <ScoreSelectField
              label={t("Settings.ncTrue")}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorMessage(field.state.meta.errors)}
              values={NC_SCORE_VALUES}
              emptyLabel={t("Settings.scoreOptions.empty")}
            />
          )}
        </form.Field>
        <form.Field name="ncFalse">
          {(field) => (
            <ScoreSelectField
              label={t("Settings.ncFalse")}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={errorMessage(field.state.meta.errors)}
              values={NC_SCORE_VALUES}
              emptyLabel={t("Settings.scoreOptions.empty")}
            />
          )}
        </form.Field>
      </FormSection>

      <FormSection title={t("Settings.statusScores")} description={t("Settings.statusScoresHint")}>
        {STATUS_SCORE_FIELDS.map((statusField, index) => (
          <form.Field key={statusField.index} name={`statusScores[${index}]`}>
            {(field) => (
              <ScoreSelectField
                label={t(statusField.labelKey)}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={errorMessage(field.state.meta.errors)}
                values={STATUS_SCORE_VALUES}
                emptyLabel={t("Settings.scoreOptions.empty")}
              />
            )}
          </form.Field>
        ))}
      </FormSection>

      <div
        className={[
          "flex items-center gap-3",
          secondaryAction ? "justify-between" : "justify-end",
        ].join(" ")}
      >
        {secondaryAction}
        <form.Subscribe
          selector={(state) => ({ canSubmit: state.canSubmit, values: state.values })}
        >
          {({ canSubmit, values }) => (
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit || !isRankingSettingsFormComplete(values)}
              className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
              )}
              {submitLabel}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
