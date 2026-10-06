import { DragEventHandler, ReactNode } from "react"
import { AlertColor, Box } from "@mui/material"
import { alpha, Theme } from "@mui/material/styles"
import { HIGHLIGHT_TINT_OPACITY, uploadBoxFrameOf } from "../shared/uploadBoxFrame.ts"

const highlightTintOf = (theme: Theme) => alpha(theme.palette.primary.main, HIGHLIGHT_TINT_OPACITY)

const HIGHLIGHTED_FILE_PICKER = { backgroundColor: highlightTintOf, borderColor: "primary.main" }

interface UploadBoxProps {
  children: ReactNode
  isFilePicker?: boolean
  isHighlighted?: boolean
  onDragLeave?: DragEventHandler<HTMLElement>
  onDragOver?: DragEventHandler<HTMLElement>
  onDrop?: DragEventHandler<HTMLElement>
  severity?: AlertColor
  testId: string
}

export default function UploadBox({
  children,
  isFilePicker = false,
  isHighlighted = false,
  onDragLeave,
  onDragOver,
  onDrop,
  severity,
  testId,
}: UploadBoxProps) {
  const { borderColor, borderStyle, isTinted } = uploadBoxFrameOf(isHighlighted, severity)
  const filePickerStyles = isFilePicker
    ? {
        "&:focus-within": HIGHLIGHTED_FILE_PICKER,
        "&:hover": HIGHLIGHTED_FILE_PICKER,
        cursor: "pointer",
      }
    : {}

  return (
    <Box
      component={isFilePicker ? "label" : "div"}
      data-testid={testId}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        backgroundColor: isTinted ? highlightTintOf : "transparent",
        borderColor,
        borderRadius: 3,
        borderStyle,
        borderWidth: 2,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        overflowY: "auto",
        p: 3,
        ...filePickerStyles,
      }}
    >
      {children}
    </Box>
  )
}
