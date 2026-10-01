import { useState } from "react"
import { httpErrorMessageKey } from "../../../../../../../../../infrastructure/notifications/httpError.ts"
import { postXmlUpload } from "./postXmlUpload.ts"
import {
  failedUploadMeta,
  pendingEntry,
  UPLOAD_STATUS,
  UploadEntry,
  withChanges,
} from "./uploadEntry.ts"

interface QueuedFile {
  entry: UploadEntry
  file: File
}

export function useXmlUploads(eventId: string) {
  const [entries, setEntries] = useState<UploadEntry[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const update = (id: string, changes: Partial<UploadEntry>) =>
    setEntries((current) => withChanges(current, id, changes))

  const uploadOne = async ({ entry, file }: QueuedFile, stageId: string) => {
    update(entry.id, { status: UPLOAD_STATUS.uploading })
    try {
      const response = await postXmlUpload(eventId, stageId, file)
      update(entry.id, { status: UPLOAD_STATUS.done, meta: response.meta })
    } catch (error) {
      update(entry.id, {
        status: UPLOAD_STATUS.failed,
        errorKey: httpErrorMessageKey(error),
        meta: failedUploadMeta(error),
      })
    }
  }

  const upload = async (files: File[], stageId: string) => {
    const queue = files.map((file) => ({ entry: pendingEntry(crypto.randomUUID(), file), file }))
    setEntries((current) => [...current, ...queue.map(({ entry }) => entry)])
    setIsUploading(true)
    for (const queued of queue) {
      await uploadOne(queued, stageId)
    }
    setIsUploading(false)
  }

  return { entries, isUploading, upload }
}
