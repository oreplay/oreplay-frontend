import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { RunnerSearch } from "../../../../../domain/types/v1api"
import TextField from "../../../components/form/TextField.tsx"
import AutocompleteTextField from "../../../components/form/AutocompleteTextField.tsx"
import PrimaryButton from "../../../components/PrimaryButton.tsx"
import { joinFieldErrors } from "../../../components/form/fieldErrors.ts"
import {
  EMPTY_RANKING_ORGANIZER_FORM,
  RankingOrganizerFormState,
  isRankingOrganizerFormComplete,
} from "../shared/rankingOrganizerForm.ts"
import { toRunnerOptions } from "../shared/runnerOptions.ts"
import { useRunnerSearch } from "../shared/useRunnerSearch.ts"

interface RankingOrganizerFormProps {
  eventId: string
  isSubmitting: boolean
  /** Resolves `true` when the organizer was added, so the form clears itself. */
  onSubmit: (state: RankingOrganizerFormState) => Promise<boolean>
}

export default function RankingOrganizerForm({
  eventId,
  isSubmitting,
  onSubmit,
}: RankingOrganizerFormProps) {
  const { t } = useTranslationRanking()
  const [eventSearch, setEventSearch] = useState("")
  const [globalSearch, setGlobalSearch] = useState("")
  const eventResults = useRunnerSearch(eventSearch, eventId)
  const globalResults = useRunnerSearch(globalSearch)

  const form = useForm({
    defaultValues: EMPTY_RANKING_ORGANIZER_FORM,
    onSubmit: async ({ value, formApi }) => {
      if (await onSubmit(value)) {
        formApi.reset()
        clearSearches()
      }
    },
  })

  const clearSearches = () => {
    setEventSearch("")
    setGlobalSearch("")
  }

  const requiredValidator = ({ value }: { value: string }) =>
    value.trim() ? undefined : t("common:fieldRequired")

  // Only runners found within the ranking's event are a real runner link; a
  // match from the all-events search just prefills the name, runner_id stays empty.
  const selectRunner = (runners: RunnerSearch[], id: string, linkRunner: boolean) => {
    const runner = runners.find((candidate) => candidate.id === id)
    if (!runner) return
    form.setFieldValue("firstName", runner.first_name)
    form.setFieldValue("lastName", runner.last_name)
    form.setFieldValue("runnerId", linkRunner ? runner.id : "")
    clearSearches()
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className="rk-ranking-organizer-form flex flex-col gap-4"
    >
      <AutocompleteTextField
        label={t("RankingOrganizers.searchRunnerEvent")}
        value={eventSearch}
        onChange={setEventSearch}
        onSelect={(id) => selectRunner(eventResults.runners, id, true)}
        options={toRunnerOptions(eventResults.runners)}
        loading={eventResults.isLoading}
      />

      <AutocompleteTextField
        label={t("RankingOrganizers.searchRunnerAll")}
        value={globalSearch}
        onChange={setGlobalSearch}
        onSelect={(id) => selectRunner(globalResults.runners, id, false)}
        options={toRunnerOptions(globalResults.runners)}
        loading={globalResults.isLoading}
      />

      <form.Subscribe selector={(state) => state.values.runnerId !== ""}>
        {(runnerSelected) => (
          <>
            <form.Field name="firstName" validators={{ onBlur: requiredValidator }}>
              {(field) => (
                <TextField
                  label={t("RankingOrganizers.firstName")}
                  required
                  readOnly={runnerSelected}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  error={joinFieldErrors(field.state.meta.errors)}
                />
              )}
            </form.Field>

            <form.Field name="lastName" validators={{ onBlur: requiredValidator }}>
              {(field) => (
                <TextField
                  label={t("RankingOrganizers.lastName")}
                  required
                  readOnly={runnerSelected}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  error={joinFieldErrors(field.state.meta.errors)}
                />
              )}
            </form.Field>
          </>
        )}
      </form.Subscribe>

      <form.Field name="description">
        {(field) => (
          <TextField
            label={t("RankingOrganizers.description")}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, values: state.values })}>
        {({ canSubmit, values }) => (
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            disabled={!canSubmit || !isRankingOrganizerFormComplete(values)}
            className="self-end"
          >
            {t("RankingOrganizers.add")}
          </PrimaryButton>
        )}
      </form.Subscribe>
    </form>
  )
}
