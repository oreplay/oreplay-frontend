import { Box, Stack } from "@mui/material"
import { overallSeverityOf, UploadEntry } from "../../../shared/uploadEntry.ts"
import UploadBox from "../../UploadBox.tsx"
import FolderListenLog from "./FolderListenLog.tsx"
import FolderListenStatus from "./FolderListenStatus.tsx"

interface FolderListenActiveProps {
  entries: UploadEntry[]
  folderName: string
  onStop: () => void
}

/**
 * Shows the folder being listened to and the files uploaded from it.
 * @param props.entries the files uploaded since listening started, latest first.
 * @param props.folderName the name of the folder listened to.
 * @param props.onStop stops listening.
 */
export default function FolderListenActive({
  entries,
  folderName,
  onStop,
}: FolderListenActiveProps) {
  return (
    <UploadBox testId="folder-listen-active" severity={overallSeverityOf(entries)}>
      <Stack spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
        <FolderListenStatus folderName={folderName} onStop={onStop} />
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
          <FolderListenLog entries={entries} />
        </Box>
      </Stack>
    </UploadBox>
  )
}
