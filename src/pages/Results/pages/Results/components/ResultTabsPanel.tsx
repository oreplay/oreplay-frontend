import { Box } from "@mui/material"
import React from "react"
import ErrorBoundary from "../../../../../components/ErrorBoundary/ErrorBoundary.tsx"
import {
  hasOneChildPerTab,
  ResultTabOption,
  resultTabId,
  resultTabPanelId,
} from "../shared/resultTabs.ts"

type ResultTabsPanelProps = {
  children: React.ReactNode[]
  options: readonly ResultTabOption[]
  selectedMenu: number
}

export default function ResultTabsPanel(props: ResultTabsPanelProps) {
  if (!hasOneChildPerTab(props.children, props.options)) {
    throw new Error("Mismatch in props lengths")
  }

  const selectedKey = props.options[props.selectedMenu].key

  return (
    <Box
      role="tabpanel"
      id={resultTabPanelId(selectedKey)}
      aria-labelledby={resultTabId(selectedKey)}
      sx={{ height: "100%" }}
    >
      <ErrorBoundary>{props.children[props.selectedMenu]}</ErrorBoundary>
    </Box>
  )
}
