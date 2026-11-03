export const UPLOAD_MODE = {
  files: "files",
  listen: "listen",
} as const
export type UploadMode = (typeof UPLOAD_MODE)[keyof typeof UPLOAD_MODE]

export const UPLOAD_MODES: UploadMode[] = [UPLOAD_MODE.files, UPLOAD_MODE.listen]

const MODE_LABEL_KEY_PREFIX = "EventAdmin.DataUpload.mode."

/**
 * Gives the translation key of a mode's tab label.
 * @param mode the way of uploading data.
 * @returns the key under `EventAdmin.DataUpload.mode`.
 */
export function modeLabelKeyOf(mode: UploadMode): string {
  return `${MODE_LABEL_KEY_PREFIX}${mode}`
}
