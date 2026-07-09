import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { usePostListRankingRunnerManagement } from "../../../../../infrastructure/repositories/ranking-runner-management/ranking-runner-management.ts"
import { getListStageOrders } from "../../../../../infrastructure/repositories/stage-orders/stage-orders.ts"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import SearchableSelect from "../../../components/form/SearchableSelect.tsx"

interface Runner {
  id: string
  full_name?: string
  bib_number?: string | number
}

interface UserInteraction {
  type?: string
  path?: string
  payload?: Runner
}

interface RunnerInteractionCardProps {
  rankingId: string
}

export default function RunnerInteractionCard({ rankingId }: RunnerInteractionCardProps) {
  const { t } = useTranslation()
  const notifyError = useNotifyError()
  const [eventId, setEventId] = useState("")
  const [stageId, setStageId] = useState("")
  const [runner, setRunner] = useState<Runner | null>(null)
  const [stageOrderId, setStageOrderId] = useState<string | null>(null)
  const sendOrganizer = usePostListRankingRunnerManagement()

  const { data: stageOrdersData } = useQuery(
    ["stageOrders", eventId, stageId],
    () => getListStageOrders(eventId, stageId),
    { enabled: Boolean(eventId && stageId) },
  )
  const stageOrders = stageOrdersData?.data ?? []

  useEffect(() => {
    const channel = new BroadcastChannel("user_interaction")
    const handler = (event: MessageEvent) => {
      const data = event.data as UserInteraction | null
      if (data?.type !== "RUNNER_EXPANDED" || !data.path) return
      const [pathEventId, pathStageId] = data.path.split("/competitions/")[1]?.split("/") ?? []
      if (pathEventId) setEventId(pathEventId)
      if (pathStageId) setStageId(pathStageId)
      if (data.payload?.full_name) {
        setRunner(data.payload)
        setStageOrderId(null)
      }
    }
    channel.addEventListener("message", handler)
    return () => {
      channel.removeEventListener("message", handler)
      channel.close()
    }
  }, [])

  const send = async () => {
    if (!runner) return
    const selectedOrder = stageOrders.find((o) => o.id === stageOrderId)
    try {
      await sendOrganizer.mutateAsync({
        rankingID: rankingId,
        eventID: eventId,
        stageID: stageId,
        data: {
          upload_type: "computable_org",
          runner_id: runner.id,
          stage_order: selectedOrder?.stage_order,
        },
      })
      setRunner(null)
    } catch (error) {
      notifyError(error)
    }
  }

  const runnerLabel = runner ? `${runner.bib_number}: ${runner.full_name}` : ""

  return (
    <div className="rk-runner-interaction-card rounded-xl bg-white p-6 shadow-sm">
      <h2 className="m-0 mb-4 text-lg font-semibold text-neutral-900">
        {t("Ranking.RunnerInteraction.title")}
      </h2>
      {runner ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="m-0 font-medium">{runnerLabel}</p>
            <p className="m-0 text-sm text-neutral-500">{runner.id}</p>
          </div>
          <SearchableSelect
            label={t("Ranking.RunnerInteraction.stageOrder")}
            value={stageOrderId}
            onChange={setStageOrderId}
            options={stageOrders.map((o) => ({
              value: o.id,
              label: o.description,
            }))}
            noResultsLabel={t("Ranking.gui.noResults")}
            placeholder={t("Search.Search")}
          />
          <button
            type="button"
            disabled={sendOrganizer.isLoading || !stageOrderId}
            onClick={() => void send()}
            className="mt-2 inline-flex items-center justify-center gap-2 self-end rounded bg-primary px-4 py-2 font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendOrganizer.isLoading && (
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            )}
            {t("Ranking.RunnerInteraction.sendOrganizer")}
          </button>
        </div>
      ) : (
        <p className="m-0 text-sm text-neutral-500">{t("Ranking.RunnerInteraction.empty")}</p>
      )}
    </div>
  )
}
