import { useForm } from "@tanstack/react-form"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import TextField from "../../../components/form/TextField.tsx"
import PrimaryButton from "../../../components/PrimaryButton.tsx"
import { joinFieldErrors } from "../../../components/form/fieldErrors.ts"
import {
  EMPTY_RANKING_ORGANIZER_FORM,
  RankingOrganizerFormState,
  isRankingOrganizerFormComplete,
} from "../shared/rankingOrganizerForm.ts"

interface RankingOrganizerFormProps {
  isSubmitting: boolean
  /** Resolves `true` when the organizer was added, so the form clears itself. */
  onSubmit: (state: RankingOrganizerFormState) => Promise<boolean>
}

export default function RankingOrganizerForm({
  isSubmitting,
  onSubmit,
}: RankingOrganizerFormProps) {
  const { t } = useTranslationRanking()

  const form = useForm({
    defaultValues: EMPTY_RANKING_ORGANIZER_FORM,
    onSubmit: async ({ value, formApi }) => {
      if (await onSubmit(value)) formApi.reset()
    },
  })

  const requiredValidator = ({ value }: { value: string }) =>
    value.trim() ? undefined : t("common:fieldRequired")

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
      <form.Field name="firstName" validators={{ onBlur: requiredValidator }}>
        {(field) => (
          <TextField
            label={t("RankingOrganizers.firstName")}
            required
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
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            error={joinFieldErrors(field.state.meta.errors)}
          />
        )}
      </form.Field>

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
