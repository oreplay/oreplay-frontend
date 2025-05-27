import { CSSProperties } from "react"
import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import { VirtualTicketHeader } from "../../../../../../components/VirtualTicket/VirtualTicketHeader.tsx"
import { VirtualTicketSplits } from "../../../../../../components/VirtualTicket/VirtualTicketSplits/VirtualTicketSplits.tsx"
import VirtualTicketRunnerInfo from "../../../../../../components/VirtualTicket/VirtualTicketRunnerInfo.tsx"
import FootOVirtualTicketTimesBanner from "./components/FootOVirtualTicketTimesBanner.tsx"
import FootOVirtualTicketSplit from "./components/FootOVirtualTicketSplit.tsx"
import { Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { hasChipDownload } from "../../../../shared/functions.ts"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import ListSkeleton from "../../../../../../../../components/ListSkeleton/ListSkeleton.tsx"
import FootOVirtualTicketSplitSkeletonItem from "./components/FootOVirtualTicketSplitSkeletonItem.tsx"
import { useFillClubRunner } from "./shared/hooks.ts"

interface FootOVirtualTicketProps extends VirtualTicketProps {
  isClass?: boolean
}

/**
 * This is the Virtual Ticket for Foot-O results
 */
export default function FootOVirtualTicket({
  isTicketOpen,
  runner,
  handleCloseTicket,
  isClass,
}: FootOVirtualTicketProps) {
  const { t } = useTranslation()

  const headersStyles: CSSProperties = {
    fontWeight: "bold",
    fontSize: "medium",
    textAlign: "center",
  }

  const {
    runner: displayedRunner,
    isLoading,
    isError,
  } = useFillClubRunner(runner, !isClass && runner != null)

  if (displayedRunner) {
    return (
      <VirtualTicketContainer
        isTicketOpen={isTicketOpen}
        runner={displayedRunner}
        handleCloseTicket={handleCloseTicket}
      >
        <VirtualTicketHeader>
          <VirtualTicketRunnerInfo runner={displayedRunner} />
          <FootOVirtualTicketTimesBanner runnerResult={displayedRunner.overall} />
        </VirtualTicketHeader>
        <VirtualTicketSplits download={hasChipDownload(displayedRunner)}>
          <Grid item xs={2}>
            <Typography sx={headersStyles}>{t("ResultsStage.VirtualTicket.Control")}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography sx={headersStyles}>{t("ResultsStage.VirtualTicket.Partial")}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography sx={headersStyles}>{t("ResultsStage.VirtualTicket.Cumulative")}</Typography>
          </Grid>
          {!isLoading ? (
            displayedRunner.overall.splits.map((split, index) => (
              <FootOVirtualTicketSplit key={split.id} split={split} index={index} />
            ))
          ) : isError ? (
            <GeneralErrorFallback />
          ) : (
            <ListSkeleton
              SkeletonItem={FootOVirtualTicketSplitSkeletonItem}
              gap={"10px"}
              minItems={10}
            />
          )}
        </VirtualTicketSplits>
      </VirtualTicketContainer>
    )
  } else {
    return <></>
  }
}
