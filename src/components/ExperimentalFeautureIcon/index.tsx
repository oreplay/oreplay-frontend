import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import ScienceIcon from "@mui/icons-material/Science"
import { useTheme } from "@mui/material"

export default function ExperimentalFeautureIcon() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Tooltip title={t("ExperimentalFeatureMsg")}>
      <ScienceIcon sx={{ color: theme.palette.info.main, fontSize: "inherit" }} />
    </Tooltip>
  )
}
