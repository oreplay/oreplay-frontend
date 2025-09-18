import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import RelayVirtualTicketLegBanner from "./components/RelayVirtualTicketLegBanner"
import RelayVirtualTicketTeamResult from "./components/RelayVirtualTicketTeamResult"
import FootOVirtualTicketTimesBanner from "../../../../../FootO/components/FootOVirtualTicket/components/FootOVirtualTicketTimesBanner.tsx"
import GeneralErrorFallback from "../../../../../../../../../../components/GeneralErrorFallback.tsx"
import NotImplementedAlertBox from "../../../../../../../../../../components/NotImplementedAlertBox.tsx"
import { Divider, Grid, Typography } from "@mui/material"
import RogaineVirtualTicketSplit from "../../../../../Rogaine/components/RogaineVirtualTicket/components/RogaineVirtualTicketSplits.tsx"
import { useTranslation } from "react-i18next"
import { CSSProperties } from "react"

const headersStyles: CSSProperties = {
  fontWeight: "bold",
  fontSize: "medium",
  textAlign: "center",
}

interface RelayVirtualTicketProps extends VirtualTicketProps {
  leg?: number
}

export default function RelayVirtualTicket(props: RelayVirtualTicketProps) {
  const { t } = useTranslation()

  if (!props.runner || !props.leg) {
    return
  }

  const legRunner = props.runner.runners?.at(props.leg - 1)

  if (!legRunner) {
    console.error(`Runner ${props.runner.full_name} doesn't have leg ${props.leg}`)
    return <GeneralErrorFallback />
  }

  return (
    <VirtualTicketContainer
      isTicketOpen={props.isTicketOpen}
      runner={props.runner}
      handleCloseTicket={props.handleCloseTicket}
    >
      <VirtualTicketHeader>
        <NotImplementedAlertBox />
        <VirtualTicketRunnerInfo runner={props.runner} setClassClubId={props.setClassClubId} />
        <RelayVirtualTicketTeamResult result={props.runner.stage} />
        <Divider />
        <RelayVirtualTicketLegBanner runner={props.runner} leg={props.leg} />
        <FootOVirtualTicketTimesBanner runnerResult={legRunner.stage} />
      </VirtualTicketHeader>
      <VirtualTicketSplits download={true} isDNS={false}>
        <Grid item xs={3}>
          <Typography variant="subtitle2" sx={headersStyles}>
            {t("ResultsStage.VirtualTicket.Control")}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" sx={headersStyles}>
            {t("ResultsStage.VirtualTicket.Partial")}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="subtitle2" sx={headersStyles}>
            {t("ResultsStage.VirtualTicket.Cumulative")}
          </Typography>
        </Grid>
        {legRunner.stage.splits.map((split, index) => (
          <RogaineVirtualTicketSplit key={split.id} split={split} index={index} />
        ))}
      </VirtualTicketSplits>
    </VirtualTicketContainer>
  )
}
