import { useSelectedMenu } from "../../../shared/hooks.ts"
import { BottomNavigation, Paper } from "@mui/material"
import React from "react"
import ErrorBoundary from "../../../../../components/ErrorBoundary/ErrorBoundary.tsx"

type ResultTabsProps = {
  children: React.ReactNode[]
  defaultMenu: number
  menuOptions: React.ReactNode[]
  menuOptionsLabels: string[]
}

export default function ResultTabs(props: ResultTabsProps) {
  // Get functionality for the menu change
  const [selectedMenu, handleMenuChange] = useSelectedMenu(
    props.defaultMenu,
    props.menuOptionsLabels,
  )

  if (
    !props.children ||
    props.children.length != props.menuOptions.length ||
    props.menuOptions.length != props.menuOptionsLabels.length
  )
    throw new Error("Mismatch in props lengths")

  return (
    <>
      <ErrorBoundary>{props.children[selectedMenu]}</ErrorBoundary>
      <Paper sx={{ position: "fixed", bottom: 0, right: 0, left: 0, zIndex: 999 }}>
        <BottomNavigation
          showLabels
          value={selectedMenu}
          onChange={(_, newValue: number) => {
            handleMenuChange(newValue)
          }}
        >
          {props.menuOptions}
        </BottomNavigation>
      </Paper>
    </>
  )
}
