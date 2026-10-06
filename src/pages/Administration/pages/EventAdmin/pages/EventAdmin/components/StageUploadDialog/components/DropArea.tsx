import { DragEvent, useState } from "react"
import { Stack, Typography } from "@mui/material"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useTranslation } from "react-i18next"
import { isLeavingArea } from "../shared/dragLeave.ts"
import UploadBox from "./UploadBox.tsx"
import XmlFileInput from "./XmlFileInput.tsx"

interface DropAreaProps {
  onFiles: (files: File[]) => void
}

export default function DropArea({ onFiles }: DropAreaProps) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    if (isLeavingArea(event.currentTarget, event.relatedTarget)) setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDragging(false)
    onFiles(Array.from(event.dataTransfer.files))
  }

  return (
    <UploadBox
      testId="upload-drop-area"
      isFilePicker
      isHighlighted={isDragging}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Stack spacing={2} sx={{ alignItems: "center", m: "auto", textAlign: "center" }}>
        <UploadFileIcon color={isDragging ? "primary" : "action"} fontSize="large" />
        <Typography variant="body2" color="text.secondary">
          {t("EventAdmin.DataUpload.dropHere")}
        </Typography>
        <XmlFileInput onFiles={onFiles} />
      </Stack>
    </UploadBox>
  )
}
