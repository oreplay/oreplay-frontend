import { Grid2 as Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import RogaineVirtualTicketSplit from "./components/RogaineVirtualTicketSplits.tsx"
import { CSSProperties } from "react"
import { ProcessedSplitModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

const headersStyles: CSSProperties = {
  fontWeight: "bold",
  fontSize: "small",
  textAlign: "center",
}

interface RogaineVirtualTicketSplitsTabProps {
  splitList: ProcessedSplitModel[] | null
}

export default function RogaineVirtualTicketSplitsTab({
  splitList,
}: RogaineVirtualTicketSplitsTabProps) {
  const { t } = useTranslation()

  return (
    <>
      <Grid size={3}>
        <Typography variant="subtitle2" sx={headersStyles}>
          {t("ResultsStage.VirtualTicket.Control")}
        </Typography>
      </Grid>
      <Grid size={4}>
        <Typography variant="subtitle2" sx={headersStyles}>
          {t("ResultsStage.VirtualTicket.Partial")}
        </Typography>
      </Grid>
      <Grid size={5}>
        <Typography variant="subtitle2" sx={headersStyles}>
          {t("ResultsStage.VirtualTicket.Cumulative")}
        </Typography>
      </Grid>
      {splitList?.map((split, index) => (
        <RogaineVirtualTicketSplit key={split.id} split={split} index={index} />
      ))}
    </>
  )
}
