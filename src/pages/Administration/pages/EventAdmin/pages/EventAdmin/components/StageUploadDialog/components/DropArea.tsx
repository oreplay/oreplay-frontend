import { ChangeEvent, DragEvent, useRef, useState } from "react"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useTranslation } from "react-i18next"
import { XML_FILE_EXTENSION } from "../shared/xmlFiles.ts"

interface DropAreaProps {
  disabled: boolean
  isUploading: boolean
  onFiles: (files: File[]) => void
}

export default function DropArea({ disabled, isUploading, onFiles }: DropAreaProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isBlocked = disabled || isUploading

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDragging(!isBlocked)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (!isBlocked) onFiles(Array.from(event.dataTransfer.files))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []))
    event.target.value = ""
  }

  const borderColor = isDragging ? "primary.main" : "divider"
  const backgroundColor = isDragging ? "action.hover" : "transparent"
  const buttonIcon = isUploading ? <CircularProgress size={16} /> : <UploadFileIcon />

  return (
    <Box
      data-testid="upload-drop-area"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        alignItems: "center",
        backgroundColor,
        border: "2px dashed",
        borderColor,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        opacity: disabled ? 0.6 : 1,
        p: 4,
        textAlign: "center",
      }}
    >
      <UploadFileIcon color={isDragging ? "primary" : "action"} fontSize="large" />
      <Typography variant="body2" color="text.secondary">
        {t("EventAdmin.DataUpload.dropHere")}
      </Typography>
      <Button
        variant="outlined"
        startIcon={buttonIcon}
        disabled={isBlocked}
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
    </Box>
  )
}
