import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ResultTabsBarProps } from "../../../shared/resultTabs.ts"

export default function ResultTabsBarMobile(props: ResultTabsBarProps) {
  const { t } = useTranslation()

  return (
    <Paper sx={{ position: "fixed", bottom: 0, right: 0, left: 0, zIndex: 999 }}>
      <BottomNavigation
        showLabels
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
