import { useState } from "react"
import { useQuery } from "react-query"
import {
  getListEvents,
  useGetEvents,
} from "../../../../infrastructure/repositories/events/events.ts"
import { getListStages } from "../../../../infrastructure/repositories/stages/stages.ts"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import SearchableSelect from "../form/SearchableSelect.tsx"
import { useDebouncedValue } from "../../shared/useDebouncedValue.ts"
import { toEventOptions } from "./shared/eventOptions.ts"

interface EventStageSelectProps {
  eventLabel: string
  stageLabel: string
  eventId: string | null
  stageId: string | null
  onEventChange: (id: string | null) => void
  onStageChange: (id: string | null) => void
  eventDisabled?: boolean
  stageDisabled?: boolean
}

const EVENT_SEARCH_DEBOUNCE_MS = 300
const EVENT_LIST_LIMIT = "50"

export default function EventStageSelect({
  eventLabel,
  stageLabel,
  eventId,
  stageId,
  onEventChange,
  onStageChange,
  eventDisabled,
  stageDisabled,
}: EventStageSelectProps) {
  const { t } = useTranslationRanking()
  const [eventSearch, setEventSearch] = useState("")
  const description = useDebouncedValue(eventSearch, EVENT_SEARCH_DEBOUNCE_MS)

  const events = useQuery(["events", description], () =>
    getListEvents({ limit: EVENT_LIST_LIMIT, show_hidden: "1", description }),
  )
  const selectedEvent = useGetEvents(eventId ?? "")
  const stages = useQuery(["stages", eventId], () => getListStages(eventId ?? ""), {
    enabled: eventId !== null,
  })

  const eventOptions = toEventOptions(events.data?.data ?? [], selectedEvent.data?.data)
  const stageOptions = (stages.data?.data ?? []).map((stage) => ({
    value: stage.id,
    label: stage.description,
  }))

  const changeEvent = (value: string | null) => {
    onEventChange(value)
    onStageChange(null)
  }

  return (
    <div className="rk-event-stage-select flex flex-col gap-4">
      <SearchableSelect
        label={eventLabel}
        value={eventId}
        onChange={changeEvent}
        onSearch={setEventSearch}
        options={eventOptions}
        noResultsLabel={t("common:noResults")}
        placeholder={t("common:search")}
        disabled={eventDisabled}
      />
      <SearchableSelect
        label={stageLabel}
        value={stageId}
        onChange={onStageChange}
        options={stageOptions}
        noResultsLabel={t("common:noResults")}
        placeholder={t("common:search")}
        disabled={stageDisabled || eventId === null}
        loading={stages.isLoading && eventId !== null}
      />
    </div>
  )
}
