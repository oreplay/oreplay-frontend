import { IconButton } from "@mui/material"
import { keyframes } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useTranslation } from "react-i18next"

const spin = keyframes({ from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } })

interface RefreshButtonProps {
  isFetching?: boolean
  onRefresh: () => Promise<unknown>
}

/**
 * Icon button that reloads the data on screen; the icon spins while a reload is running.
 * @param props.isFetching Whether data is being reloaded right now.
 * @param props.onRefresh Reloads the data.
 */
export default function RefreshButton({ isFetching, onRefresh }: RefreshButtonProps) {
  const { t } = useTranslation()
  const animation = isFetching ? `${spin} .6s linear infinite` : "none"

  return (
    <Tooltip title={t("ResultsStage.Refresh")}>
      <IconButton onClick={() => void onRefresh()}>
        <RefreshIcon sx={{ animation }} />
      </IconButton>
    </Tooltip>
  )
}
