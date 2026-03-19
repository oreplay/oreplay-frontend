import { Box } from "@mui/material"
import { CSSProperties, ReactNode } from "react"
import { SxProps, Theme } from "@mui/material/styles"

interface SlotProps {
  box?: SxProps<Theme>
  div?: CSSProperties
}

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
  slotProps?: SlotProps
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, slotProps } = props
  console.log(slotProps)

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      style={slotProps?.div}
    >
      {value === index && <Box sx={slotProps?.box}>{children}</Box>}
    </div>
  )
}
