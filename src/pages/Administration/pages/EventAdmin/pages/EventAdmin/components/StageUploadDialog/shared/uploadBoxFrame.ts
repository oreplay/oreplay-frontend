import { AlertColor } from "@mui/material"

export interface UploadBoxFrame {
  borderColor: string
  borderStyle: "dashed" | "solid"
  isTinted: boolean
}

const DROP_FRAME: UploadBoxFrame = {
  borderColor: "divider",
  borderStyle: "dashed",
  isTinted: false,
}

export const HIGHLIGHT_TINT_OPACITY = 0.08

const HIGHLIGHTED_DROP_FRAME: UploadBoxFrame = {
  borderColor: "primary.main",
  borderStyle: "dashed",
  isTinted: true,
}

export function uploadBoxFrameOf(isHighlighted: boolean, severity?: AlertColor): UploadBoxFrame {
  if (severity) {
    return {
      borderColor: `${severity}.light`,
      borderStyle: "solid",
      isTinted: false,
    }
  }
  return isHighlighted ? HIGHLIGHTED_DROP_FRAME : DROP_FRAME
}
