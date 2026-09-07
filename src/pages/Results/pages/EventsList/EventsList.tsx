import SearchIcon from "@mui/icons-material/Search"
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"
import NoTodayEvents from "./components/NoTodayEvents.tsx"
import TimeRangeFilter, {
  DEFAULT_TIME_RANGE,
  TimeRangeValue,
  getDateBounds,
} from "./components/TimeRangeFilter/TimeRangeFilter.tsx"
import { GetListEventsParams } from "../../../../domain/types/v1api"
import { useGetListEvents } from "../../../../infrastructure/repositories/events/events.ts"
import { DateTime } from "luxon"
import TodayEvents from "./components/TodayEvents.tsx"
import { ClearIcon } from "@mui/x-date-pickers"
import Tooltip from "@mui/material/Tooltip"

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return debounced
}

const PAGE_SIZE = 10

export default function EventsList() {
  const { t } = useTranslation()

  // Search + time range filter
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search)
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(DEFAULT_TIME_RANGE)

  // Pagination
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever the search or filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, timeRange])

  // --- Today, in the user's own (client) timezone ---
  // DateTime.now() uses the browser's local zone by default, so this reflects
  // the client's "today" rather than the server's.
  const todayISO = DateTime.now().toISODate() ?? undefined

  // --- Build query params from the real GetListEventsParams shape ---
  const { after, before } = getDateBounds(timeRange)

  const params: GetListEventsParams = {
    page: page.toString(),
    limit: PAGE_SIZE.toString(),
    ...(debouncedSearch ? { description: debouncedSearch } : {}),
    ...(after ? { "final_date:gte": after } : {}),
    ...(before ? { "initial_date:lte": before } : {}),
  }

  // Today's events: those whose range overlaps the client's current date.
  const todayParams: GetListEventsParams = {
    page: "1",
    limit: "100",
    ...(todayISO ? { "final_date:gte": todayISO, "initial_date:lte": todayISO } : {}),
  }

  // --- Queries ---
  const { data, isLoading, isFetching } = useGetListEvents(params, {
    query: { keepPreviousData: true, staleTime: 24 * 3600 * 1000 },
  })

  const { data: todayData, isLoading: isTodayLoading } = useGetListEvents(todayParams, {
    query: { staleTime: 24 * 3600 * 1000 },
  })
  const eventList = data?.data ?? []
  const numPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

  const todayEventList = todayData?.data ?? []

  // True while waiting for the debounce to settle, or while the debounced
  // search/filter is actually in flight.
  const isSearching = search !== debouncedSearch || isFetching

  if (isLoading && !data && isTodayLoading) {
    return <GeneralSuspenseFallback />
  }

  return (
    <Box
      sx={{
        m: { xs: "24px", sm: "50px" },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/** Today events **/}
      <TodayEvents eventList={todayEventList} />

      {/** Search + filter bar **/}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: { sm: "center" },
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={t("common:search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {isSearching && (
                    <InputAdornment position="end">
                      <CircularProgress size={18} />
                    </InputAdornment>
                  )}
                  {!isSearching && search && (
                    <InputAdornment position="end">
                      <Tooltip title={t("common:clearSearch")}>
                        <IconButton
                          aria-label={t("common:clearSearch")}
                          size="small"
                          onClick={() => setSearch("")}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )}
                </>
              ),
            },
          }}
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            height: 40,
          }}
        />
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      </Box>

      {/** Events **/}
      <Box sx={{ marginTop: "0em" }}>
        {!isLoading && eventList.length === 0 ? (
          <Box sx={{ marginTop: "32px", textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {t("EventList.NoResults")}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ marginTop: { xs: "0px", sm: "24px" } }}>
            <NoTodayEvents
              eventList={eventList}
              numPages={numPages}
              page={page}
              setPage={setPage}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
