import { Box } from "@mui/material"
import ControlBadge from "../../../../pages/RogainePoints/components/ControlBadge.tsx"
import { ProcessedSplitModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

interface RogaineVirtualTicketPointsTab {
  controls: bigint[] | null
  splits: ProcessedSplitModel[] | null
}

export default function RogaineVirtualTicketPointsTab({
  controls,
  splits,
}: RogaineVirtualTicketPointsTab) {
  // Extract numbers
  const runnerPunchedControls: bigint[] = []

  if (splits) {
    splits.forEach((split) => {
      const number = split.control?.station
      if (number) {
        runnerPunchedControls.push(BigInt(number))
      }
    })
  }

  // Component
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 1,
        gap: 1,
        marginTop: 2,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {controls?.map((control) => {
        return <ControlBadge number={control} punched={runnerPunchedControls.includes(control)} />
      })}
    </Box>
  )
}
