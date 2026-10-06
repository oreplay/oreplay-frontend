import { UploadEntry } from "./uploadEntry.ts"

export const UPLOAD_PHASE = {
  finished: "finished",
  selecting: "selecting",
  uploading: "uploading",
} as const
export type UploadPhase = (typeof UPLOAD_PHASE)[keyof typeof UPLOAD_PHASE]

export function uploadPhaseOf(entries: UploadEntry[], isUploading: boolean): UploadPhase {
  if (isUploading) return UPLOAD_PHASE.uploading
  if (entries.length > 0) return UPLOAD_PHASE.finished
  return UPLOAD_PHASE.selecting
}
