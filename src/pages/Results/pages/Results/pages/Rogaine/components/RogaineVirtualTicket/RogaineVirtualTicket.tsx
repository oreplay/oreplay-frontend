import React, { CSSProperties } from "react"
import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import RogaineVirtualTicketPointsBanner from "./components/RogaineVirtualTicketPointsBanner.tsx"
import RogaineVirtualTicketSplit from "./components/RogaineVirtualTicketSplits.tsx"
import { Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { hasChipDownload } from "../../../../shared/functions.ts"
import { runnerService } from "../../../../../../../../domain/services/RunnerService.ts"

/**
 * This is the Virtual Ticket for Foot-O results
 *
 * @param isTicketOpen
 * @param runner: ProcessedRunnerModel|RunnerResultModel
 * @param handleCloseTicket
 * @constructor
 */
const RogaineVirtualTicket: React.FC<VirtualTicketProps> = ({
  isTicketOpen,
  runner,
  handleCloseTicket,
}) => {
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
          <VirtualTicketRunnerInfo runner={runner} />
          <RogaineVirtualTicketPointsBanner runnerResult={runner.stage} />
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
            <RogaineVirtualTicketSplit key={split.id} split={split} index={index} />
          ))}
        </VirtualTicketSplits>
      </VirtualTicketContainer>
    )
  } else {
    return <></>
  }
}

export default RogaineVirtualTicket
