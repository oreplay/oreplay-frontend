import { useEffect, useRef, useState } from "react"
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ViewOption } from "../shared/viewOption.ts"

interface ViewSelectorProps<View extends string> {
  onViewChange: (view: View) => void
  options: readonly ViewOption<View>[]
  selectedView: View
}

export default function ViewSelector<View extends string>({
  onViewChange,
  options,
  selectedView,
}: ViewSelectorProps<View>) {
  const theme = useTheme()
  const { t } = useTranslation()

  const boxRef = useRef<HTMLDivElement | null>(null)
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      const boxDiv = boxRef.current
      if (boxDiv) {
        setHasScroll(boxDiv.scrollWidth > boxDiv.clientWidth)
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)

    return () => {
      window.removeEventListener("resize", checkScroll)
    }
  }, [])

  return (
    <Box
      ref={boxRef}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: hasScroll ? "flex-start" : "center",
        gap: 1,
        px: 2,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        flexWrap: "nowrap",
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      {options.map((option) => {
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
