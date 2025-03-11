import { ReactNode, FC } from "react"
import { Box, Stack } from "@mui/material"
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
        sx={{
          height: "100%",
          marginBottom: "2rem",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Stack direction={"column"} spacing={2} sx={{ flexWrap: "wrap" }}>
          {children}
        </Stack>
      </Box>
    </NowProvider>
  )
}

export default ResultListContainer
