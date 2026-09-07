import { Box, Pagination, useMediaQuery, useTheme } from "@mui/material"
import NoTodayEventButton from "./NoTodayEventButton.tsx"
import { Event } from "../../../../../domain/types/v1api"

interface Props {
  eventList: Event[]
  numPages: number
  page: number
  setPage: (page: number) => void
}

export default function NoTodayEvents(props: Props) {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <Box
        sx={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: "12px", sm: "16px" },
        }}
      >
        {props.eventList.map((event) => (
          <NoTodayEventButton key={event.id} event={event} />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "32px",
          marginBottom: "16px",
          px: 1,
        }}
      >
        <Pagination
          count={props.numPages}
          page={props.page}
          onChange={(_, page) => props.setPage(page)}
          color="primary"
          size={isSmall ? "small" : "medium"}
          siblingCount={isSmall ? 1 : 2}
          boundaryCount={isSmall ? 1 : 2}
          sx={{
            "& .MuiPagination-ul": {
              flexWrap: "wrap",
              rowGap: "8px",
              justifyContent: "center",
            },
          }}
        />
      </Box>
    </>
  )
}
