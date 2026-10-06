import { Box, Stack } from "@mui/material"
import { overallSeverityOf, UploadEntry } from "../shared/uploadEntry.ts"
import UploadBox from "./UploadBox.tsx"
import UploadMorePrompt from "./UploadMorePrompt.tsx"
import UploadResultList from "./UploadResultList.tsx"

interface UploadResultBoxProps {
  entries: UploadEntry[]
  isFinished: boolean
  onUploadMore: () => void
}

export default function UploadResultBox({
  entries,
  isFinished,
  onUploadMore,
}: UploadResultBoxProps) {
  const severity = overallSeverityOf(entries)

  return (
    <UploadBox testId="upload-result-box" severity={severity}>
      <Stack spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
          <UploadResultList entries={entries} />
        </Box>
        {isFinished && <UploadMorePrompt severity={severity} onUploadMore={onUploadMore} />}
      </Stack>
    </UploadBox>
  )
}
