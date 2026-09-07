import EventCard from "./EventCard/EventCard.tsx"
import { Event } from "../../../../../domain/types/v1api"
import { parseDate } from "../../../../../shared/Functions.tsx"

interface Props {
  event: Event
}

export default function NoTodayEventButton({ event }: Props) {
  return <EventCard event={event} variant="default" formattedDate={parseDate(event.initial_date)} />
}
