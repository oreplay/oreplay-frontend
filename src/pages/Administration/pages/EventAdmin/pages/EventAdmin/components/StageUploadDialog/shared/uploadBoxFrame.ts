import { AlertColor } from "@mui/material"

export interface UploadBoxFrame {
  backgroundColor: string
  borderColor: string
  borderStyle: "dashed" | "solid"
}

const DROP_FRAME: UploadBoxFrame = {
  backgroundColor: "transparent",
  borderColor: "divider",
  borderStyle: "dashed",
}

const HIGHLIGHTED_DROP_FRAME: UploadBoxFrame = {
  backgroundColor: "action.hover",
  borderColor: "primary.main",
  borderStyle: "dashed",
}

export function uploadBoxFrameOf(isHighlighted: boolean, severity?: AlertColor): UploadBoxFrame {
  if (severity) {
    return {
      backgroundColor: "transparent",
      borderColor: `${severity}.light`,
      borderStyle: "solid",
    }
  }
  return isHighlighted ? HIGHLIGHTED_DROP_FRAME : DROP_FRAME
}
