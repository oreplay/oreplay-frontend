import { DragEventHandler, ReactNode } from "react"
import { AlertColor, Box } from "@mui/material"
import { uploadBoxFrameOf } from "../shared/uploadBoxFrame.ts"

interface UploadBoxProps {
  children: ReactNode
  isHighlighted?: boolean
  onDragLeave?: DragEventHandler<HTMLElement>
  onDragOver?: DragEventHandler<HTMLElement>
  onDrop?: DragEventHandler<HTMLElement>
  severity?: AlertColor
  testId: string
}

export default function UploadBox({
  children,
  isHighlighted = false,
  onDragLeave,
  onDragOver,
  onDrop,
  severity,
  testId,
}: UploadBoxProps) {
  const { backgroundColor, borderColor, borderStyle } = uploadBoxFrameOf(isHighlighted, severity)

  return (
    <Box
      data-testid={testId}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        backgroundColor,
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
      }}
    >
      {children}
    </Box>
  )
}
