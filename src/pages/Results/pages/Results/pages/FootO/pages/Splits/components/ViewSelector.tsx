import React from "react"
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import {
  Timer as TimerIcon,
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon,
  ShowChart,
  BarChart as BarChartIcon,
  Timeline,
} from "@mui/icons-material"
import { useTranslation } from "react-i18next"

export type ViewType =
  | "splits"
  | "accumulated"
  | "timeLoss"
  | "lineChart"
  | "barChart"
  | "positionChart"

interface ViewOption {
  key: ViewType
  labelKey: string
  icon: React.ReactNode
}

interface ViewSelectorProps {
  selectedView: ViewType
  onViewChange: (view: ViewType) => void
}

export default function ViewSelector({ selectedView, onViewChange }: ViewSelectorProps) {
  const theme = useTheme()
  const { t } = useTranslation()

  const viewOptions: ViewOption[] = [
    { key: "splits", labelKey: "view.splits", icon: <TimerIcon /> },
    { key: "accumulated", labelKey: "view.accumulated", icon: <AccessTimeIcon /> },
    { key: "timeLoss", labelKey: "view.timeLoss", icon: <AnalyticsIcon /> },
    { key: "lineChart", labelKey: "view.lineChart", icon: <ShowChart /> },
    { key: "barChart", labelKey: "view.barChart", icon: <BarChartIcon /> },
    { key: "positionChart", labelKey: "view.positionChart", icon: <Timeline /> },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        padding: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        flexWrap: "wrap",
      }}
    >
      {viewOptions.map((option) => {
        const isSelected = selectedView === option.key

        return (
          <Box
            key={option.key}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: isSelected ? "auto" : 48,
            }}
          >
            <IconButton
              onClick={() => onViewChange(option.key)}
              sx={{
                color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                backgroundColor: isSelected ? theme.palette.primary.light : "transparent",
                "&:hover": {
                  backgroundColor: isSelected
                    ? theme.palette.primary.light
                    : theme.palette.action.hover,
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {option.icon}
            </IconButton>

            {isSelected && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  textAlign: "center",
                  mt: 0.5,
                  fontSize: "0.75rem",
                  maxWidth: 120,
                  lineHeight: 1.2,
                }}
              >
                {t(option.labelKey)}
              </Typography>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
