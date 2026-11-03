import { useRef, useState } from "react"
import { pendingEntry, UPLOAD_STATUS, UploadEntry } from "./uploadEntry.ts"
import { uploadXmlFile } from "./uploadXmlFile.ts"
import { useUploadEntries } from "./useUploadEntries.ts"

interface QueuedFile {
  entry: UploadEntry
  file: File
}

/**
 * Uploads the XML files the user picks, one after another, and tracks each one's progress.
 * @param eventId the event the files are uploaded to.
 * @returns the `entries` to show, whether files are still `isUploading`, `upload` to send files
 * to a stage, `cancel` to abort the pending ones and `clear` to empty the list.
 */
export function useXmlUploads(eventId: string) {
  const { append, cancelUnfinished, clear, entries, update } = useUploadEntries()
  const [isUploading, setIsUploading] = useState(false)
  const abortController = useRef<AbortController | null>(null)

  /**
   * Sends one queued file and records how it ended.
   * @param queued the file and the entry that represents it.
   * @param stageId the stage that receives the file.
   * @param signal aborts the request when the user cancels.
   */
  const uploadOne = async ({ entry, file }: QueuedFile, stageId: string, signal: AbortSignal) => {
    update(entry.id, { status: UPLOAD_STATUS.uploading })
    const outcome = await uploadXmlFile(eventId, stageId, file, signal)
    if (outcome) update(entry.id, outcome)
  }

  /**
   * Queues files and uploads them in order, stopping early if the user cancels.
   * @param files the XML files to upload.
   * @param stageId the stage that receives them.
   */
  const upload = async (files: File[], stageId: string) => {
    const controller = new AbortController()
    abortController.current = controller
    const queue = files.map((file) => ({ entry: pendingEntry(crypto.randomUUID(), file), file }))
    append(queue.map(({ entry }) => entry))
    setIsUploading(true)
    for (const queued of queue) {
      if (controller.signal.aborted) break
      await uploadOne(queued, stageId, controller.signal)
    }
    setIsUploading(false)
  }

  /** Aborts the upload in progress and marks the files not sent yet as cancelled. */
  const cancel = () => {
    abortController.current?.abort()
    cancelUnfinished()
  }

  return { cancel, clear, entries, isUploading, upload }
}
