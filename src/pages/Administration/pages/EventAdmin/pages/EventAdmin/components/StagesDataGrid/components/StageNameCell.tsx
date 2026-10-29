import { Box } from "@mui/material"
import StageEndedIcon from "../../../../../../../../components/StageEndedIcon.tsx"

interface StageNameCellProps {
  name: string
  isEnded: boolean
}

export default function StageNameCell({ name, isEnded }: StageNameCellProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, height: "100%", minWidth: 0 }}>
      <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {name}
      </Box>
      {isEnded && <StageEndedIcon />}
    </Box>
  )
}
