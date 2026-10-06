import { Divider, Stack } from "@mui/material"
import { UploadEntry } from "../shared/uploadEntry.ts"
import UploadResultItem from "./UploadResultItem.tsx"

interface UploadResultListProps {
  entries: UploadEntry[]
}

export default function UploadResultList({ entries }: UploadResultListProps) {
  return (
    <Stack component="section" aria-live="polite" spacing={1} divider={<Divider flexItem />}>
      {entries.map((entry) => (
        <UploadResultItem key={entry.id} entry={entry} />
      ))}
    </Stack>
  )
}
