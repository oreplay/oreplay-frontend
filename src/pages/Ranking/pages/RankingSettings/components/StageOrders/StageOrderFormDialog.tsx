import { useForm } from "@tanstack/react-form"
import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../../../infrastructure/notifications/useNotifyError.ts"
import {
  usePatchStageOrders,
  usePostListStageOrders,
} from "../../../../../../infrastructure/repositories/stage-orders/stage-orders.ts"
import { StageOrderManagement } from "../../../../../../domain/types/v1api"
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog.tsx"
import EventStageSelect from "../../../../components/EventStageSelect/EventStageSelect.tsx"
import CheckboxField from "../../../../components/form/CheckboxField.tsx"
import DateTimeField from "../../../../components/form/DateTimeField.tsx"
import NumberField from "../../../../components/form/NumberField.tsx"
import TextField from "../../../../components/form/TextField.tsx"
import {
  STAGE_ORDER_DEFAULT_START_TIME,
  StageOrderDialogMode,
  initStageOrderForm,
  isOriginalFieldEditable,
  isStageOrderFormComplete,
  toPatchBody,
  toPostBody,
} from "./shared/stageOrderForm.ts"

interface StageOrderFormDialogProps {
  open: boolean
  mode: StageOrderDialogMode
  stageOrder?: StageOrderManagement
  defaultStageOrder: number
  eventId: string
  stageId: string
  onClose: () => void
  onSaved: () => void
}

const errorMessage = (errors: (string | undefined)[]): string | undefined =>
  errors.filter(Boolean).join(" ") || undefined

export default function StageOrderFormDialog({
  open,
  mode,
  stageOrder,
  defaultStageOrder,
  eventId,
  stageId,
  onClose,
  onSaved,
}: StageOrderFormDialogProps) {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const create = usePostListStageOrders()
  const update = usePatchStageOrders()
  const isSaving = create.isLoading || update.isLoading

  const initialState = initStageOrderForm(stageOrder, defaultStageOrder)
  const linkEditable = isOriginalFieldEditable(initialState.originalEventId)

  const form = useForm({
    defaultValues: initialState,
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await create.mutateAsync({ eventID: eventId, stageID: stageId, data: toPostBody(value) })
        } else if (stageOrder) {
          await update.mutateAsync({
            eventID: eventId,
            stageID: stageId,
            stageOrderID: stageOrder.id,
            data: toPatchBody(value),
          })
        }
        onSaved()
      } catch (error) {
        notifyError(error)
      }
    },
  })

  return (
    <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, values: state.values })}>
      {({ canSubmit, values }) => (
        <ConfirmDialog
          open={open}
          title={mode === "create" ? t("StageOrders.createTitle") : t("StageOrders.editTitle")}
          confirmLabel={t("common:save")}
          closeLabel={t("common:close")}
          isConfirming={isSaving}
          confirmDisabled={!canSubmit || !isStageOrderFormComplete(values, mode)}
          onConfirm={() => void form.handleSubmit()}
          onClose={onClose}
        >
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
            className="rk-stage-order-form flex flex-col gap-4"
          >
            <form.Field
              name="description"
              validators={{
                onBlur: ({ value }) =>
                  value.trim() ? undefined : t("translation:ThisFieldIsRequiredMsg"),
              }}
            >
              {(field) => (
                <TextField
                  label={t("StageOrders.descriptionLabel")}
                  required
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  error={errorMessage(field.state.meta.errors)}
                />
              )}
            </form.Field>

            <form.Field name="start">
              {(field) => (
                <DateTimeField
                  label={t("StageOrders.start")}
                  required
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  error={errorMessage(field.state.meta.errors)}
                  defaultTime={STAGE_ORDER_DEFAULT_START_TIME}
                />
              )}
            </form.Field>

            {mode === "create" && (
              <form.Field name="stageOrder">
                {(field) => (
                  <NumberField
                    label={t("StageOrders.stageOrder")}
                    required
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={errorMessage(field.state.meta.errors)}
                  />
                )}
              </form.Field>
            )}

            <form.Field name="isOfficial">
              {(field) => (
                <CheckboxField
                  label={t("StageOrders.isOfficial")}
                  checked={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>

            <EventStageSelect
              eventLabel={t("translation:Event")}
              stageLabel={t("ProcessEvent.stage")}
              eventId={values.originalEventId}
              stageId={values.originalStageId}
              onEventChange={(value) => form.setFieldValue("originalEventId", value)}
              onStageChange={(value) => form.setFieldValue("originalStageId", value)}
              eventDisabled={!linkEditable}
              stageDisabled={!linkEditable}
            />
          </form>
        </ConfirmDialog>
      )}
    </form.Subscribe>
  )
}
