import { Event } from "../../../../../domain/types/v1api"
import { SearchableSelectOption } from "../../form/SearchableSelect.tsx"

export function toEventOptions(
  events: Event[],
  selectedEvent: Event | undefined,
): SearchableSelectOption[] {
  const options = events.map((event) => ({ value: event.id, label: event.description }))
  const isSelectedListed =
    !selectedEvent || options.some((option) => option.value === selectedEvent.id)
  if (isSelectedListed) return options
  return [{ value: selectedEvent.id, label: selectedEvent.description }, ...options]
}
