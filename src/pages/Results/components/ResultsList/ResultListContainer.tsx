import { ReactNode, FC } from "react"
import { Box } from "@mui/material"
import NowProvider from "../NowProvider.tsx"

interface ResultListContainerProps {
  children: ReactNode
}

const ResultListContainer: FC<ResultListContainerProps> = ({
  children,
}: ResultListContainerProps) => {
  return (
    <NowProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", width: "100%", borderCollapse: "collapse" }}
      >
        {children}
      </Box>
    </NowProvider>
  )
}

export default ResultListContainer
