import { ReactNode } from "react"
import { Box } from "@mui/material"
import NowProvider from "../../../../../../../components/NowProvider.tsx"

interface RelayResultContainerProps {
  children?: ReactNode
}

export default function RelayResultContainer({ children }: RelayResultContainerProps) {
  return (
    <Box sx={{ display: "table", width: "100%", borderCollapse: "collapse" }}>
      <NowProvider>{children}</NowProvider>
    </Box>
  )
}
