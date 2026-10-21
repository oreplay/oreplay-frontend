import { ReactNode } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { HEADING_COLUMN_BREAKPOINT } from "./scrollTableLayout.ts"

export default function useIsHeadingColumn(headingColumnHeader: ReactNode) {
  const theme = useTheme()
  const isWideScreen = useMediaQuery(theme.breakpoints.up(HEADING_COLUMN_BREAKPOINT), {
    noSsr: true,
  })
  return headingColumnHeader !== undefined && isWideScreen
}
