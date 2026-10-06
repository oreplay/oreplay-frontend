import { ChangeEvent } from "react"
import { Box } from "@mui/material"
import { XML_FILE_EXTENSION } from "../shared/xmlFiles.ts"

const VISUALLY_HIDDEN = {
  clipPath: "inset(50%)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
} as const

interface XmlFileInputProps {
  onFiles: (files: File[]) => void
}

export default function XmlFileInput({ onFiles }: XmlFileInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []))
    event.target.value = ""
  }

  return (
    <Box
      component="input"
      data-testid="upload-file-input"
      type="file"
      accept={XML_FILE_EXTENSION}
      multiple
      onChange={handleChange}
      sx={VISUALLY_HIDDEN}
    />
  )
}
