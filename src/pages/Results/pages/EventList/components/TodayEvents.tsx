import { EventModel } from "../../../../../shared/EntityTypes.ts"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@mui/material"
import TodayEventButton from "./TodayEventButton.tsx"

interface TodayEventsProps {
  eventList: EventModel[]
}

export default function TodayEvents(props: TodayEventsProps) {
  const { t } = useTranslation()

  if (props.eventList.length > 0) {
    return (
      <>
        {/** Live today message **/}
        <Box width={"100%"} display={"flex"} alignItems={"center"}>
          <Box height={"16px"} width={"16px"} borderRadius={"50%"} bgcolor={"orange"}></Box>
          <Box marginLeft={"12px"}>
            <Typography>{t("EventList.LiveToday")}</Typography>
          </Box>
        </Box>

        {/** Event list **/}
        <Box
          sx={{
            overflowX: "auto",
            padding: "12px",
          }}
          width={"100%"}
          minHeight={"160px"}
          marginTop={"24px"}
          marginBottom={"24px"}
          display={"flex"}
        >
          {props.eventList.map((event, index) => (
            <TodayEventButton key={event.id} event={event} index={index} />
          ))}
        </Box>
      </>
    )
  } else {
    return (
      <Box width={"100%"} display={"flex"} alignItems={"center"}>
        <Box height={"16px"} width={"16px"} borderRadius={"50%"} bgcolor={"gray"}></Box>
        <Box marginLeft={"12px"}>
          <Typography sx={{ color: "text.secondary" }}>
            {t("EventList.NoLiveEventsToday")}
          </Typography>
        </Box>
      </Box>
    )
  }
}
