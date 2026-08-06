import { useGetListRunnerSearch } from "../../../../../infrastructure/repositories/runner-search/runner-search.ts"
import { useDebouncedValue } from "../../../shared/useDebouncedValue.ts"

const RUNNER_SEARCH_DEBOUNCE_MS = 300
const MIN_RUNNER_SEARCH_LENGTH = 2

/** Searches runners by name. Omit `eventId` to search across all events. */
export function useRunnerSearch(text: string, eventId?: string) {
  const debounced = useDebouncedValue(text.trim(), RUNNER_SEARCH_DEBOUNCE_MS)
  const enabled = debounced.length >= MIN_RUNNER_SEARCH_LENGTH

  const query = useGetListRunnerSearch(
    { text: debounced, event_id: eventId || undefined },
    { query: { enabled } },
  )

  return {
    runners: enabled ? (query.data?.data ?? []) : [],
    isLoading: enabled && query.isLoading,
  }
}
