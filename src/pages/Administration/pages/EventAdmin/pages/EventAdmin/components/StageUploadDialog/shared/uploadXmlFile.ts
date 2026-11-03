import { httpErrorMessageKey } from "../../../../../../../../../infrastructure/notifications/httpError.ts"
import { postXmlUpload } from "./postXmlUpload.ts"
import {
  failedUploadMeta,
  UPLOAD_MESSAGE_LEVEL,
  UPLOAD_STATUS,
  UploadEntry,
} from "./uploadEntry.ts"

/**
 * Tells whether the server took a file in: it answered successfully and reported no error.
 * @param outcome how the upload ended, as returned by `uploadXmlFile`; `null` when aborted.
 * @returns true when the file was imported, even with warnings.
 */
export function isUploadAccepted(outcome: Partial<UploadEntry> | null): boolean {
  return (
    outcome?.status === UPLOAD_STATUS.done && outcome.meta?.level !== UPLOAD_MESSAGE_LEVEL.error
  )
}

/**
 * Sends one XML file to a stage and describes how its upload ended.
 * @param eventId the event the stage belongs to.
 * @param stageId the stage that receives the file.
 * @param file the IOF XML 3.0 file to send.
 * @param signal aborts the request when the user cancels.
 * @returns the changes to apply to the file's entry: `done` with the server's meta, or `failed`
 * with the error to show; `null` when the request was aborted, which leaves the entry as it is.
 */
export async function uploadXmlFile(
  eventId: string,
  stageId: string,
  file: File,
  signal: AbortSignal,
): Promise<Partial<UploadEntry> | null> {
  try {
    const response = await postXmlUpload(eventId, stageId, file, signal)
    return { status: UPLOAD_STATUS.done, meta: response.meta }
  } catch (error) {
    if (signal.aborted) return null
    return {
      status: UPLOAD_STATUS.failed,
      errorKey: httpErrorMessageKey(error),
      meta: failedUploadMeta(error),
    }
  }
}
