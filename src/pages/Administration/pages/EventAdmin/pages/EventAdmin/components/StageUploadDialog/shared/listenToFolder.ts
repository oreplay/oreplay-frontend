import { DateTime } from "luxon"
import { filesToUpload, fileVersionOf, readXmlFiles, removeIfUnchanged } from "./folderFiles.ts"

export const LISTEN_INTERVAL_MS = 5000

export interface FolderListenerCallbacks {
  onFolderLost: () => void
  uploadFile: (file: File, signal: AbortSignal) => Promise<boolean>
}

/**
 * Listens to a folder the way the desktop client does: checks it right away and then every
 * `LISTEN_INTERVAL_MS`, uploads each new or re-exported XML file once, and deletes it after an
 * accepted upload. A refused file stays in the folder and is retried only once it changes.
 * Checks never overlap: a slow upload simply delays the next one.
 * @param folder the folder to listen to.
 * @param callbacks.onFolderLost called once when the folder can no longer be read (removed, or
 * its permission revoked); listening stops by itself.
 * @param callbacks.uploadFile uploads one file and resolves to whether it was accepted; the
 * signal aborts it when listening stops.
 * @returns a function that stops listening and aborts the upload in progress.
 */
export function listenToFolder(
  folder: FileSystemDirectoryHandle,
  { onFolderLost, uploadFile }: FolderListenerCallbacks,
): () => void {
  const controller = new AbortController()
  const handledVersions = new Set<string>()
  let isChecking = false

  /** Stops checking the folder and aborts the upload in progress. */
  const stop = () => {
    clearInterval(interval)
    controller.abort()
  }

  /**
   * Uploads one file and, once accepted, removes it from the folder.
   * @param file the snapshot of the file to upload.
   */
  const uploadAndRemove = async (file: File) => {
    handledVersions.add(fileVersionOf(file))
    const isAccepted = await uploadFile(file, controller.signal)
    if (isAccepted) await removeIfUnchanged(folder, file)
  }

  /** Looks for files to upload and uploads them one after another. */
  const check = async () => {
    if (isChecking) return
    isChecking = true
    try {
      const nowMillis = DateTime.now().toMillis()
      for (const file of filesToUpload(await readXmlFiles(folder), handledVersions, nowMillis)) {
        if (controller.signal.aborted) break
        await uploadAndRemove(file)
      }
    } catch {
      if (!controller.signal.aborted) {
        stop()
        onFolderLost()
      }
    } finally {
      isChecking = false
    }
  }

  const interval = setInterval(() => void check(), LISTEN_INTERVAL_MS)
  void check()
  return stop
}
