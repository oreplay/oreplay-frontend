import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { MOBILE_BOTTOM_NAVIGATION_HEIGHT_PX } from "../../../shared/mobileLayout.ts"
import { SAFE_AREA_BOTTOM_BAR_INSET } from "../../../../../../../shared/safeArea.ts"
import { ResultTabsBarProps } from "../../../shared/resultTabs.ts"

const NAVIGATION_PAPER_SX = {
  position: "fixed",
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 999,
  paddingBottom: SAFE_AREA_BOTTOM_BAR_INSET,
} as const

export default function ResultTabsBarMobile(props: ResultTabsBarProps) {
  const { t } = useTranslation()

  return (
    <Paper sx={NAVIGATION_PAPER_SX}>
      <BottomNavigation
        showLabels
        sx={{ height: `${MOBILE_BOTTOM_NAVIGATION_HEIGHT_PX}px` }}
        value={props.selectedMenu}
        onChange={(_, newValue: number) => {
          props.onChange(newValue)
        }}
      >
        {props.options.map((option) => (
          <BottomNavigationAction key={option.key} label={t(option.labelKey)} icon={option.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
