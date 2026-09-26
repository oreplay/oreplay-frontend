import { Box } from "@mui/material"
import { ReactNode } from "react"
import OnlineControlsRow from "./components/OnlineControlsRow/OnlineControlsRow.tsx"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"

interface ResultListItemProps {
  children: ReactNode
  onClick?: () => void
  runner?: ProcessedRunnerModel
}

export default function ResultListItem({ children, onClick, runner }: ResultListItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          backgroundColor: onClick ? "#fffbf0" : undefined,
          borderRadius: onClick ? 2 : undefined,
          borderBottom: "1px solid #f2f2f2",
        },
        paddingX: 0.5,
        cursor: onClick ? "pointer" : undefined,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: 1,
        }}
      >
        {children}
      </Box>
      {runner && runner.stage.online_splits && (
        <OnlineControlsRow
          onlineSplits={runner.stage.online_splits}
          finishTime={runner.stage.finish_time}
          statusCode={runner.stage.status_code}
        />
      )}
    </Box>
  )
}
