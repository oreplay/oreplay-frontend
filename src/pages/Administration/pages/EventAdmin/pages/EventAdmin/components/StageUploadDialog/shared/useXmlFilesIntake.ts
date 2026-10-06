import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"
import { splitXmlFiles } from "./xmlFiles.ts"

const IGNORED_FILES_WARNING_DURATION_MS = 5000

export function useXmlFilesIntake(onXmlFiles: (files: File[]) => void) {
  const { t } = useTranslation()
  const notifications = useNotifications()

  return (files: File[]) => {
    const { accepted, rejected } = splitXmlFiles(files)
    if (rejected.length > 0) {
      notifications.show(t("EventAdmin.DataUpload.filesIgnored", { count: rejected.length }), {
        autoHideDuration: IGNORED_FILES_WARNING_DURATION_MS,
        severity: "warning",
      })
    }
    if (accepted.length > 0) onXmlFiles(accepted)
  }
}
