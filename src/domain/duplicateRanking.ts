import { PostListEventsBody } from "./types/v1api"

// A duplicated ranking gets its own non-public event and a "Ranking" stage.

// The "Totals" / "overall" stage type (its host-side constant). There's no
// listing endpoint to resolve it by name, so the UUID is fixed here.
export const RANKING_TOTALS_STAGE_TYPE_ID = "3d4cf037-64d6-442c-969d-35452048daf9"
export const RANKING_STAGE_DESCRIPTION = "Ranking"
// `is_hidden` is a number on the event; 1 = not public.
export const EVENT_NOT_PUBLIC = 1

function firstOfCurrentYear(): string {
  return `${new Date().getFullYear()}-01-01`
}

// Events have no title/visibility fields: the name is `description`, non-public
// is set afterwards via PATCH (`is_hidden`), and federation/organizer are
// omitted. Dates default to the first of the current year.
export function buildDuplicateEventBody(title: string): PostListEventsBody {
  const date = firstOfCurrentYear()
  return { description: title, initial_date: date, final_date: date }
}
