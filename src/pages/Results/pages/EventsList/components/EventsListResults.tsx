import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import GeneralErrorFallback from "../../../../../components/GeneralErrorFallback.tsx"
import { Event } from "../../../../../domain/types/v1api"
import NoTodayEvents from "./NoTodayEvents.tsx"

interface Props {
  eventList: Event[]
  isError: boolean
  isLoading: boolean
  numPages: number
  page: number
  setPage: (page: number) => void
}

/**
 * Shows the page of events matching the search and time range, an error when the events could not
 * be fetched, or a message when nothing matches.
 *
 * @param props.eventList Events of the current page; empty while loading or after a failed request.
 * @param props.isError Whether the events request failed, which takes precedence over the list.
 * @param props.isLoading Whether the first page is still loading, so no empty message is shown yet.
 * @param props.numPages Number of pages of matching events.
 * @param props.page Current page, starting at 1.
 * @param props.setPage Called with the page the user moves to.
 */
export default function EventsListResults(props: Props) {
  const { t } = useTranslation()
  const hasNoEvents = !props.isLoading && props.eventList.length === 0

  if (props.isError) return <GeneralErrorFallback displayMsg />

  if (hasNoEvents)
    return (
      <Box sx={{ marginTop: "32px", textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {t("EventList.NoResults")}
        </Typography>
      </Box>
    )

  return (
    <Box sx={{ marginTop: { xs: "0px", sm: "24px" } }}>
      <NoTodayEvents
        eventList={props.eventList}
        numPages={props.numPages}
        page={props.page}
        setPage={props.setPage}
      />
    </Box>
  )
}
