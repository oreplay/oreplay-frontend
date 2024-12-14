import React from "react";
import {
  VirtualTicketContainer,
  VirtualTicketProps
} from "../../../../components/VirtualTicket/VirtualTicketContainer.tsx";
import {VirtualTicketHeader} from "../../../../components/VirtualTicket/VirtualTicketHeader.tsx";
import {VirtualTicketSplits} from "../../../../components/VirtualTicket/VirtualTicketSplits.tsx";
import VirtualTicketRunnerInfo
  from "../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx";
import FootOVirtualTicketTimesBanner from "./components/FootOVirtualTicketTimesBanner.tsx";
import FootOVirtualTicketSplit from "./components/FootOVirtualTicketSplit.tsx";
import {Grid, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

/**
 * This is the Virtual Ticket for Foot-O results
 *
 * @param isTicketOpen
 * @param runner
 * @param handleCloseTicket
 * @constructor
 */
const FootOVirtualTicket: React.FC<VirtualTicketProps> = ({isTicketOpen,runner,handleCloseTicket}) => {
  const {t} = useTranslation();

  if (runner) {
    return (
      <VirtualTicketContainer
        isTicketOpen={isTicketOpen}
        runner={runner}
        handleCloseTicket={handleCloseTicket}
      >
        <VirtualTicketHeader>
          <VirtualTicketRunnerInfo runner={runner} />
          <FootOVirtualTicketTimesBanner runnerResult={runner.runner_results[0]} />
        </VirtualTicketHeader>
        <VirtualTicketSplits>
          <Grid item xs={2.6}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('ResultsStage.VirtualTicket.Control')}</Typography></Grid>
          <Grid item xs={4.7}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('ResultsStage.VirtualTicket.Partial')}</Typography></Grid>
          <Grid item xs={4.7}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('ResultsStage.VirtualTicket.Cumulative')}</Typography></Grid>
          {
            runner.runner_results[0].splits.map((split) =>
              <FootOVirtualTicketSplit split={split} />
            )
          }
        </VirtualTicketSplits>
      </VirtualTicketContainer>
    )
  } else {
    return <></>
  }

}

export default FootOVirtualTicket;