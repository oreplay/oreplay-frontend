import { Box, Tab, Tabs } from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useFetchEvents } from "../../shared/hooks.ts"
import TodayEvents from "./components/TodayEvents.tsx"
import NoTodayEvents from "./components/NoTodayEvents.tsx"
import GeneralSuspenseFallback from "../../../../components/GeneralSuspenseFallback.tsx"

export default function EventsList() {
  const { t } = useTranslation()

  // Future past tab management
  const [selectedTab, setSelectedTab] = useState(0)
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  // Events queries
  const [futureEventList, isFutureLoading, futurePage, setFuturePage, futureNumPages] =
    useFetchEvents("future", 6)
  const [pastEventList, isPastLoading, pastPage, setPastPage, pastNumPages] = useFetchEvents(
    "past",
    6,
  )
  const [todayEventList, isTodayLoading] = useFetchEvents("today", 100)

  // Loading page
  if (isFutureLoading && isPastLoading && isTodayLoading) {
    return <GeneralSuspenseFallback />
  } else
    // Component
    return (
      <Box sx={{ m: "50px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/** Today events **/}
        <TodayEvents eventList={todayEventList} />

        {/** Past/Future events **/}
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: "50px" }}>
          <Tabs value={selectedTab} indicatorColor="primary" onChange={handleChangeTab}>
            <Tab label={t("EventList.FutureEvents")} value={0} />
            <Tab label={t("EventList.PastEvents")} value={1} />
          </Tabs>
        </Box>
        {
          // Choose which events to display
          !selectedTab ? (
            <NoTodayEvents
              eventList={futureEventList}
              numPages={futureNumPages}
              page={futurePage}
              setPage={setFuturePage}
            />
          ) : (
            <NoTodayEvents
              eventList={pastEventList}
              numPages={pastNumPages}
              page={pastPage}
              setPage={setPastPage}
            />
          )
        }
      </Box>
    )
}
