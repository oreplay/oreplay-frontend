export interface CloseConfirmationKeys {
  body: string
  confirm: string
  keep: string
  title: string
}

const UPLOADING_KEYS: CloseConfirmationKeys = {
  body: "EventAdmin.DataUpload.cancelUpload.body",
  confirm: "EventAdmin.DataUpload.cancelUpload.confirm",
  keep: "EventAdmin.DataUpload.cancelUpload.keepUploading",
  title: "EventAdmin.DataUpload.cancelUpload.title",
}

const LISTENING_KEYS: CloseConfirmationKeys = {
  body: "EventAdmin.DataUpload.stopListening.body",
  confirm: "EventAdmin.DataUpload.listen.stop",
  keep: "EventAdmin.DataUpload.stopListening.keepListening",
  title: "EventAdmin.DataUpload.stopListening.title",
}

/**
 * Picks the wording of the dialog that asks before closing while data is still being sent.
 * @param isListening whether a folder is being listened to, rather than picked files uploaded.
 * @returns the translation keys of the dialog's title, body and buttons.
 */
export function closeConfirmationKeysOf(isListening: boolean): CloseConfirmationKeys {
  return isListening ? LISTENING_KEYS : UPLOADING_KEYS
}
