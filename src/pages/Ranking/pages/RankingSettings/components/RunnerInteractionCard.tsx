import { useEffect, useState } from "react"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { useQuery } from "react-query"
import { usePostListRankingRunnerManagement } from "../../../../../infrastructure/repositories/ranking-runner-management/ranking-runner-management.ts"
import { getListStageOrders } from "../../../../../infrastructure/repositories/stage-orders/stage-orders.ts"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import SearchableSelect from "../../../components/form/SearchableSelect.tsx"
import {
  RunnerInteraction,
  runnerLabel,
  toRunnerInteraction,
  USER_INTERACTION_CHANNEL,
  UserInteraction,
} from "../shared/runnerInteraction.ts"

interface RunnerInteractionCardProps {
  rankingId: string
}

export default function RunnerInteractionCard({ rankingId }: RunnerInteractionCardProps) {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const [interaction, setInteraction] = useState<RunnerInteraction | null>(null)
  const [stageOrderId, setStageOrderId] = useState<string | null>(null)
  const sendOrganizer = usePostListRankingRunnerManagement()

  const eventId = interaction?.eventId ?? ""
  const stageId = interaction?.stageId ?? ""
  const { data: stageOrdersData } = useQuery(
    ["stageOrders", eventId, stageId],
    () => getListStageOrders(eventId, stageId),
    { enabled: Boolean(eventId && stageId) },
  )
  const stageOrders = stageOrdersData?.data ?? []
  const selectedOrder = stageOrders.find((o) => o.id === stageOrderId)

  useEffect(() => {
    const channel = new BroadcastChannel(USER_INTERACTION_CHANNEL)
    const handler = (event: MessageEvent) => {
      const next = toRunnerInteraction(event.data as UserInteraction | null)
      if (!next) return
      setInteraction(next)
      setStageOrderId(null)
    }
    channel.addEventListener("message", handler)
    return () => {
      channel.removeEventListener("message", handler)
      channel.close()
    }
  }, [])

  const runner = interaction?.runner

  const send = async () => {
    if (!interaction || !runner || !selectedOrder) return
    try {
      await sendOrganizer.mutateAsync({
        rankingID: rankingId,
        eventID: interaction.eventId,
        stageID: interaction.stageId,
        data: {
          upload_type: "computable_org",
          runner_id: runner.id,
          stage_order: selectedOrder.stage_order,
        },
      })
      setInteraction({ ...interaction, runner: null })
      setStageOrderId(null)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <div className="rk-runner-interaction-card rounded-xl bg-white p-6 shadow-sm">
      <h2 className="m-0 mb-4 text-lg font-semibold text-neutral-900">
        {t("RunnerInteraction.title")}
      </h2>
      {runner ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="m-0 font-medium">{runnerLabel(runner)}</p>
            <p className="m-0 text-sm text-neutral-500">{runner.id}</p>
          </div>
          <SearchableSelect
            label={t("RunnerInteraction.stageOrder")}
            value={stageOrderId}
            onChange={setStageOrderId}
            options={stageOrders.map((o) => ({
              value: o.id,
              label: o.description,
            }))}
            noResultsLabel={t("common:noResults")}
            placeholder={t("common:search")}
          />
          <button
            type="button"
            disabled={sendOrganizer.isLoading || !selectedOrder}
            onClick={() => void send()}
            className="mt-2 inline-flex items-center justify-center gap-2 self-end rounded bg-primary px-4 py-2 font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendOrganizer.isLoading && (
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            )}
            {t("RunnerInteraction.sendOrganizer")}
          </button>
        </div>
      ) : (
        <p className="m-0 text-sm text-neutral-500">{t("RunnerInteraction.empty")}</p>
      )}
    </div>
  )
}
