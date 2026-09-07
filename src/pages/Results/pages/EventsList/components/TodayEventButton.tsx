import EventCard from "./EventCard/EventCard.tsx"
import { Event } from "../../../../../domain/types/v1api"

interface TodayEventButtonProps {
  event: Event
  index: number
}

export default function TodayEventButton({ event, index }: TodayEventButtonProps) {
  return <EventCard event={event} variant="highlight" colorIndex={index} />
}
