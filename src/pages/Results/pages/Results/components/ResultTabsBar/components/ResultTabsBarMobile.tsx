import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { MOBILE_BOTTOM_NAVIGATION_HEIGHT_PX } from "../../../shared/mobileLayout.ts"
import { ResultTabsBarProps } from "../../../shared/resultTabs.ts"

export default function ResultTabsBarMobile(props: ResultTabsBarProps) {
  const { t } = useTranslation()

  return (
    <Paper sx={{ position: "fixed", bottom: 0, right: 0, left: 0, zIndex: 999 }}>
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
