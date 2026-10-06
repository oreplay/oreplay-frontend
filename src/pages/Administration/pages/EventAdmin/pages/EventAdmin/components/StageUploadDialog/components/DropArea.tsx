import { ChangeEvent, DragEvent, useRef, useState } from "react"
import { Button, Stack, Typography } from "@mui/material"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useTranslation } from "react-i18next"
import { isLeavingArea } from "../shared/dragLeave.ts"
import { XML_FILE_EXTENSION } from "../shared/xmlFiles.ts"
import UploadBox from "./UploadBox.tsx"

interface DropAreaProps {
  onFiles: (files: File[]) => void
}

export default function DropArea({ onFiles }: DropAreaProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []))
    event.target.value = ""
  }

  return (
    <UploadBox
      testId="upload-drop-area"
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
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
        >
          {t("EventAdmin.DataUpload.selectFiles")}
        </Button>
        <input
          ref={inputRef}
          data-testid="upload-file-input"
          type="file"
          accept={XML_FILE_EXTENSION}
          multiple
          hidden
          onChange={handleInputChange}
        />
      </Stack>
    </UploadBox>
  )
}
