import React, { useEffect, useState } from "react"
import { Box, Stack } from "@mui/material"
import { DateTime } from "luxon"
import { NowContext } from "../../shared/context.ts"

interface ResultListContainerProps {
  children: React.ReactNode
}

const ResultListContainer: React.FC<ResultListContainerProps> = ({ children }) => {
  const [now, setNow] = useState<DateTime>(DateTime.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(DateTime.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <NowContext.Provider value={now}>
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
    </NowContext.Provider>
  )
}

export default ResultListContainer
