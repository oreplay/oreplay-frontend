import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useForm } from "@tanstack/react-form"
import { useTranslation } from "react-i18next"
import TrailOResultsUrlInput from "./components/TrailOResultsUrlInput.tsx"
import TrailOResultsUrlHelp from "./components/TrailOResultsUrlHelp.tsx"
import {
  isValidTrailOResultsInput,
  toExternalUrl,
  TRAIL_O_RESULTS_URL_MAX_LENGTH,
} from "./shared/trailOResultsUrl.ts"
import { useSaveExternalUrl } from "./shared/useSaveExternalUrl.ts"

interface TrailOResultsUrlDialogProps {
  eventId: string
  stageId: string
  stageName: string
  externalUrl: string | null
  onClose: () => void
  onSaved: (externalUrl: string | null) => void
}

/**
 * Dialog opened from the settings menu of a Trail-O stage to set the link to its results on TOP or
 * Jaruori. Any other site is rejected, and leaving the field empty removes the link.
 *
 * @param props.eventId Event the stage belongs to.
 * @param props.stageId Stage whose results URL is edited.
 * @param props.stageName Name of the stage, shown in the title.
 * @param props.externalUrl URL saved so far, `null` when there is none.
 * @param props.onClose Closes the dialog, on cancel and after saving.
 * @param props.onSaved Called with the saved URL (`null` when removed) so the grid shows it.
 */
export default function TrailOResultsUrlDialog(props: TrailOResultsUrlDialogProps) {
  const { t } = useTranslation()
  const saveMutation = useSaveExternalUrl(props.eventId, props.stageId, (url) => {
    props.onSaved(url)
    props.onClose()
  })

  /**
   * Checks the field on every keystroke, so the save button follows the current value, while the
   * message waits until the field is left.
   *
   * @param value Raw text of the field.
   * @returns The translated reason it cannot be saved, or `undefined` when it can.
   */
  const validateResultsUrl = (value: string) => {
    if (value.length > TRAIL_O_RESULTS_URL_MAX_LENGTH) {
      return t("common:fieldTooLong", { count: TRAIL_O_RESULTS_URL_MAX_LENGTH })
    }
    return isValidTrailOResultsInput(value)
      ? undefined
      : t("EventAdmin.Stages.TrailOResultsUrl.InvalidUrl")
  }

  const form = useForm({
    defaultValues: { externalUrl: props.externalUrl ?? "" },
    onSubmit: ({ value }) => saveMutation.mutate(toExternalUrl(value.externalUrl)),
  })

  return (
    <Dialog open onClose={props.onClose} fullWidth maxWidth="sm">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <DialogTitle>
          {t("EventAdmin.Stages.TrailOResultsUrl.DialogTitle", { stageName: props.stageName })}
        </DialogTitle>
        <DialogContent>
          <TrailOResultsUrlHelp />
          <form.Field
            name="externalUrl"
            validators={{ onChange: ({ value }) => validateResultsUrl(value) }}
          >
            {(field) => {
              const shouldShowErrors =
                field.state.meta.isBlurred || field.form.state.submissionAttempts > 0
              const visibleErrors = shouldShowErrors ? field.state.meta.errors : []
              return (
                <TrailOResultsUrlInput
                  value={field.state.value}
                  errors={visibleErrors}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                />
              )
            }}
          </form.Field>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={props.onClose}>
            {t("Cancel")}
          </Button>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                loading={saveMutation.isLoading}
              >
                {t("common:save")}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
