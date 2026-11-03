import { Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { UploadEntry } from "../../../shared/uploadEntry.ts"
import UploadResultList from "../../UploadResultList.tsx"

interface FolderListenLogProps {
  entries: UploadEntry[]
}

/**
 * Lists the files uploaded from the folder, or says it is waiting for the first one.
 * @param props.entries the files uploaded since listening started, latest first.
 */
export default function FolderListenLog({ entries }: FolderListenLogProps) {
  const { t } = useTranslation()

  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" data-testid="folder-listen-waiting">
        {t("EventAdmin.DataUpload.listen.waiting")}
      </Typography>
    )
  }
  return <UploadResultList entries={entries} />
}
