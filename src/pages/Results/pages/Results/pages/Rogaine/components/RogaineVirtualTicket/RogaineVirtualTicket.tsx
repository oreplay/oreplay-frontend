import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import RogaineVirtualTicketPointsBanner from "./components/RogaineVirtualTicketPointsBanner.tsx"
import { hasChipDownload } from "../../../../shared/functions.ts"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import { Grid2 as Grid, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import TimelineIcon from "@mui/icons-material/Timeline"
import TimerIcon from "@mui/icons-material/Timer"
import TabPanel from "../../../../../../../../components/TabPanel"
import RogaineVirtualTicketSplitsTab from "./components/RogaineVirtualTicketSplitsTab"
import RogaineVirtualTicketPointsTab from "./components/RogaineVirtualTicketPointsTab"

interface RogaineVirtualTicketProps extends VirtualTicketProps {
  controls: bigint[] | null
}

/**
 * This is the Virtual Ticket for Score results
 *
 * @param isTicketOpen
 * @param runner: ProcessedRunnerModel|RunnerResultModel
 * @param handleCloseTicket
 * @constructor
 */
export default function RogaineVirtualTicket({
  isTicketOpen,
  runner,
  handleCloseTicket,
  setClassClubId,
  controls,
}: RogaineVirtualTicketProps) {
  const [openTab, setOpenTab] = useState<number>(0)

  if (runner) {
    return (
      <VirtualTicketContainer
        isTicketOpen={isTicketOpen}
        runner={runner}
        handleCloseTicket={handleCloseTicket}
      >
        <VirtualTicketHeader>
          <VirtualTicketRunnerInfo
            runner={runner}
            setClassClubId={setClassClubId}
            displayTeamMemberNames
          />
          <RogaineVirtualTicketPointsBanner runnerResult={runner.stage} />
        </VirtualTicketHeader>
        <VirtualTicketSplits download={hasChipDownload(runner)} isDNS={runnerService.isDNS(runner)}>
          <Grid sx={{ marginTop: 2 }} size={12}>
            <Tabs value={openTab} onChange={(_, newValue: number) => setOpenTab(newValue)}>
              <Tab icon={<TimelineIcon />} />
              <Tab icon={<TimerIcon />} />
            </Tabs>
            <TabPanel value={openTab} index={0}>
              <RogaineVirtualTicketPointsTab controls={controls} splits={runner.stage.splits} />
            </TabPanel>
            <TabPanel
              index={1}
              value={openTab}
              slotProps={{ div: { width: "100%" }, box: { padding: 0 } }}
            >
              <Grid sx={{ marginTop: 1 }} container>
                <RogaineVirtualTicketSplitsTab splitList={runner.stage.splits} />
              </Grid>
            </TabPanel>
          </Grid>
        </VirtualTicketSplits>
      </VirtualTicketContainer>
    )
  } else {
    return <></>
  }
}
