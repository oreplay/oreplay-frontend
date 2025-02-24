import { Box, Pagination } from "@mui/material"
import NoTodayEventButton from "./NoTodayEventButton.tsx"
import { EventModel } from "../../../../../shared/EntityTypes.ts"

interface Props {
  eventList: EventModel[]
  numPages: number
  page: number
  setPage: (page: number) => void
}

export default function NoTodayEvents(props: Props) {
  return (
    <>
      <Box
        sx={{
          marginTop: "24px",
          display: "flex",
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {props.eventList.map((event) => (
          <NoTodayEventButton key={event.id} event={event} />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Pagination
          count={props.numPages}
          page={props.page}
          onChange={(_, page) => props.setPage(page)}
        />
      </Box>
    </>
  )
}
