import { useRef, useState } from "react"
import { httpErrorMessageKey } from "../../../../../../../../../infrastructure/notifications/httpError.ts"
import { postXmlUpload } from "./postXmlUpload.ts"
import {
  failedUploadMeta,
  pendingEntry,
  UPLOAD_STATUS,
  UploadEntry,
  withChanges,
  withUnfinishedCancelled,
} from "./uploadEntry.ts"

interface QueuedFile {
  entry: UploadEntry
  file: File
}

export function useXmlUploads(eventId: string) {
  const [entries, setEntries] = useState<UploadEntry[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const abortController = useRef<AbortController | null>(null)

  const update = (id: string, changes: Partial<UploadEntry>) =>
    setEntries((current) => withChanges(current, id, changes))

  const uploadOne = async ({ entry, file }: QueuedFile, stageId: string, signal: AbortSignal) => {
    update(entry.id, { status: UPLOAD_STATUS.uploading })
    try {
      const response = await postXmlUpload(eventId, stageId, file, signal)
      update(entry.id, { status: UPLOAD_STATUS.done, meta: response.meta })
    } catch (error) {
      if (signal.aborted) return
      update(entry.id, {
        status: UPLOAD_STATUS.failed,
        errorKey: httpErrorMessageKey(error),
        meta: failedUploadMeta(error),
      })
    }
  }

  const upload = async (files: File[], stageId: string) => {
    const controller = new AbortController()
    abortController.current = controller
    const queue = files.map((file) => ({ entry: pendingEntry(crypto.randomUUID(), file), file }))
    setEntries((current) => [...current, ...queue.map(({ entry }) => entry)])
    setIsUploading(true)
    for (const queued of queue) {
      if (controller.signal.aborted) break
      await uploadOne(queued, stageId, controller.signal)
    }
    setIsUploading(false)
  }

  const cancel = () => {
    abortController.current?.abort()
    setEntries(withUnfinishedCancelled)
  }

  return { cancel, entries, isUploading, upload }
}
