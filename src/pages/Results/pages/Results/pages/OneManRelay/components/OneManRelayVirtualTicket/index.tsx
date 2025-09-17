import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import OneManRelayVirtualTicketSplit from "./components/OneManRelayVirtualTicketSplit"
import { CSSProperties } from "react"
import { Grid, Typography } from "@mui/material"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"
import { useTranslation } from "react-i18next"
import { hasChipDownload } from "../../../../shared/functions.ts"
import FootOVirtualTicketTimesBanner from "../../../FootO/components/FootOVirtualTicket/components/FootOVirtualTicketTimesBanner.tsx"

/**
 * This is the Virtual Ticket for Score results
 *
 * @param isTicketOpen
 * @param runner: ProcessedRunnerModel|RunnerResultModel
 * @param handleCloseTicket
 * @constructor
 */
export default function OneManRelayVirtualTicket({
  isTicketOpen,
  runner,
  handleCloseTicket,
  setClassClubId,
}: VirtualTicketProps) {
  const { t } = useTranslation()

  const headersStyles: CSSProperties = {
    fontWeight: "bold",
    fontSize: "medium",
    textAlign: "center",
  }

  if (runner) {
    return (
      <VirtualTicketContainer
        isTicketOpen={isTicketOpen}
        runner={runner}
        handleCloseTicket={handleCloseTicket}
      >
        <VirtualTicketHeader>
          <VirtualTicketRunnerInfo runner={runner} setClassClubId={setClassClubId} />
          <FootOVirtualTicketTimesBanner runnerResult={runner.stage} />
        </VirtualTicketHeader>
        <VirtualTicketSplits download={hasChipDownload(runner)} isDNS={runnerService.isDNS(runner)}>
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
          {runner.stage.splits.map((split, index) => (
            <OneManRelayVirtualTicketSplit key={split.id} split={split} index={index} />
          ))}
        </VirtualTicketSplits>
      </VirtualTicketContainer>
    )
  } else {
    return <></>
  }
}
