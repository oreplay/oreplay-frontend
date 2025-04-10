import { IconButton } from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import { useNotifications } from "@toolpad/core/useNotifications"

/**
 * Props of CopyToClipBoardButton
 * value: value to be copied
 */
export interface CopyToClipBoardButtonParams {
  value: string
}

/**
 * Button to copy content to the clipboard with snackbar
 * @prop value: Value to be copied
 */
export function CopyToClipBoardButton(props: CopyToClipBoardButtonParams) {
  const { t } = useTranslation()
  const notifications = useNotifications()

  const handleClick = () => {
    void navigator.clipboard.writeText(props.value)
    notifications.show(t("Copied to the clipboard"), {
      autoHideDuration: 5000,
      severity: "success",
    })
  }

  return (
    <>
      <Tooltip title={t("Copy")}>
        <IconButton onClick={handleClick}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}
