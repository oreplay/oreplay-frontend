import { DateTime } from "luxon"
import { PostListEventsBody } from "../../../../../domain/types/v1api"

// The "Totals" / "overall" stage type (its host-side constant). There's no
// listing endpoint to resolve it by name, so the UUID is fixed here.
export const RANKING_TOTALS_STAGE_TYPE_ID = "3d4cf037-64d6-442c-969d-35452048daf9"
export const RANKING_STAGE_DESCRIPTION = "Ranking"
// `is_hidden` is a number on the event; 1 = not public.
export const EVENT_NOT_PUBLIC = 1

function firstOfCurrentYear(): string {
  return DateTime.now().startOf("year").toISODate()
}

export function buildDuplicateEventBody(title: string): PostListEventsBody {
  const date = firstOfCurrentYear()
  return {
    description: title,
    initial_date: date,
    final_date: date,
    is_hidden: EVENT_NOT_PUBLIC,
  }
}
