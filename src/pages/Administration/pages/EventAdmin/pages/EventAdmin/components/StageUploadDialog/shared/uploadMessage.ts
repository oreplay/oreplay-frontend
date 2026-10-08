import { UploadMessage, UploadMessageContext } from "../../../../../../../../../domain/types/v1api"
import { UPLOAD_MESSAGE_LEVEL } from "./uploadEntry.ts"

export const UPLOAD_MESSAGE_CODES = [
  "bad_request",
  "conflict",
  "duplicated_runner",
  "event_without_time_zone",
  "finish_time_without_seconds",
  "forbidden",
  "invalid_payload",
  "invalid_token",
  "not_found",
  "nothing_changed",
  "result_type_converted",
  "results_without_splits",
  "rows_not_saved",
  "runner_without_results",
  "taking_too_long",
  "team_without_results",
  "team_without_runners",
  "upload_type_guessed",
] as const
export type UploadMessageCode = (typeof UPLOAD_MESSAGE_CODES)[number]

const CODE_BY_ALIAS: Record<string, UploadMessageCode> = {
  record_not_found: "not_found",
  unauthorized: "invalid_token",
}

const MESSAGE_KEY_PREFIX = "EventAdmin.DataUpload.messages."

export const UNKNOWN_ERROR_MESSAGE_KEY = "EventAdmin.DataUpload.unknownMessage.error"
export const UNKNOWN_WARNING_MESSAGE_KEY = "EventAdmin.DataUpload.unknownMessage.warning"

function isKnownCode(code: string): code is UploadMessageCode {
  return (UPLOAD_MESSAGE_CODES as readonly string[]).includes(code)
}

function knownCodeOf(message: UploadMessage): UploadMessageCode | undefined {
  const code = message.code ?? ""
  return isKnownCode(code) ? code : CODE_BY_ALIAS[code]
}

function unknownMessageKeyOf(message: UploadMessage): string {
  return message.level === UPLOAD_MESSAGE_LEVEL.error
    ? UNKNOWN_ERROR_MESSAGE_KEY
    : UNKNOWN_WARNING_MESSAGE_KEY
}

export function messageKeyOf(message: UploadMessage): string {
  const code = knownCodeOf(message)
  return code ? `${MESSAGE_KEY_PREFIX}${code}` : unknownMessageKeyOf(message)
}

export function messageValuesOf(message: UploadMessage): UploadMessageContext {
  return message.context ?? {}
}
