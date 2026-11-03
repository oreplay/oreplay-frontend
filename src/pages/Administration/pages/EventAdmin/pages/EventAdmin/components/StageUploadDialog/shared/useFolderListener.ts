import { useCallback, useEffect, useState } from "react"
import { isFolderListeningSupported, isPickerDismissed, pickFolder } from "./folderFiles.ts"
import { listenToFolder } from "./listenToFolder.ts"
import { uploadingEntry } from "./uploadEntry.ts"
import { isUploadAccepted, uploadXmlFile } from "./uploadXmlFile.ts"
import { useUploadEntries } from "./useUploadEntries.ts"

/**
 * Lets the browser act as the desktop client for one stage: once the user picks a folder, every
 * XML file exported there is uploaded to the stage until listening stops or the component
 * unmounts.
 * @param eventId the event the stage belongs to.
 * @param stageId the stage that receives the files.
 * @returns the `entries` uploaded since listening started (latest first), the `folderName`
 * listened to (`null` when not listening), whether access to a folder was lost
 * (`hasFolderError`), `isListening`, whether the browser `isSupported`, and `start` / `stop`.
 */
export function useFolderListener(eventId: string, stageId: string) {
  const { cancelUnfinished, clear, entries, prepend, update } = useUploadEntries()
  const [folder, setFolder] = useState<FileSystemDirectoryHandle | null>(null)
  const [hasFolderError, setHasFolderError] = useState(false)

  /** Stops listening and marks the upload in progress, if any, as cancelled. */
  const stop = useCallback(() => {
    setFolder(null)
    cancelUnfinished()
  }, [cancelUnfinished])

  /**
   * Uploads one file found in the folder and shows it at the top of the list.
   * @param file the file snapshot to upload.
   * @param signal aborts the request when listening stops.
   * @returns whether the server accepted the file.
   */
  const uploadFile = useCallback(
    async (file: File, signal: AbortSignal) => {
      const entry = uploadingEntry(crypto.randomUUID(), file)
      prepend(entry)
      const outcome = await uploadXmlFile(eventId, stageId, file, signal)
      if (outcome) update(entry.id, outcome)
      return isUploadAccepted(outcome)
    },
    [eventId, prepend, stageId, update],
  )

  useEffect(() => {
    if (!folder) return
    return listenToFolder(folder, {
      onFolderLost: () => {
        setHasFolderError(true)
        stop()
      },
      uploadFile,
    })
  }, [folder, stop, uploadFile])

  /** Asks for a folder and starts listening to it; a dismissed picker changes nothing. */
  const start = async () => {
    try {
      const picked = await pickFolder()
      clear()
      setHasFolderError(false)
      setFolder(picked)
    } catch (error) {
      if (!isPickerDismissed(error)) setHasFolderError(true)
    }
  }

  return {
    entries,
    folderName: folder?.name ?? null,
    hasFolderError,
    isListening: folder !== null,
    isSupported: isFolderListeningSupported(),
    start,
    stop,
  }
}
