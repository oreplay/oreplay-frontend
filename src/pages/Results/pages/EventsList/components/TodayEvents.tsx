import { useTranslation } from "react-i18next"
import { Box, Typography } from "@mui/material"
import TodayEventButton from "./TodayEventButton.tsx"
import { Event } from "../../../../../domain/types/v1api"

interface TodayEventsProps {
  eventList: Event[]
}

export default function TodayEvents(props: TodayEventsProps) {
  const { t } = useTranslation()

  if (props.eventList.length > 0) {
    return (
      <>
        {/** Live today message **/}
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", paddingLeft: "16px" }}>
          <Box
            sx={{
              height: "10px",
              width: "10px",
              borderRadius: "50%",
              bgcolor: "orange",
              flexShrink: 0,
            }}
          ></Box>
          <Typography sx={{ marginLeft: "8px", lineHeight: 1 }}>
            {t("EventList.LiveToday")}
          </Typography>
        </Box>

        {/** Event list **/}
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "visible",
            padding: "12px 12px 32px",
            width: "100%",
            minHeight: "160px",
            marginTop: "24px",
            marginBottom: "12px",
            display: "flex",
            gap: "8px",
          }}
        >
          {props.eventList.map((event, index) => (
            <TodayEventButton key={event.id} event={event} index={index} />
          ))}
        </Box>
      </>
    )
  } else {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          marginBottom: "32px",
        }}
      >
        <Box
          sx={{
            height: "10px",
            width: "10px",
            borderRadius: "50%",
            bgcolor: "gray",
            flexShrink: 0,
          }}
        ></Box>
        <Typography sx={{ marginLeft: "8px", color: "text.secondary", lineHeight: 1 }}>
          {t("EventList.NoLiveEventsToday")}
        </Typography>
      </Box>
    )
  }
}
