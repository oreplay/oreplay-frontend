import { AlertColor } from "@mui/material"
import { isAxiosError } from "axios"
import {
  ResUploadedV2,
  UploadedV2Meta,
  UploadMessage,
} from "../../../../../../../../../domain/types/v1api"

export const UPLOAD_MESSAGE_LEVEL = {
  error: "error",
  info: "info",
  warning: "warning",
} as const

export const UPLOAD_STATUS = {
  done: "done",
  failed: "failed",
  pending: "pending",
  uploading: "uploading",
} as const
export type UploadStatus = (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS]

export interface UploadEntry {
  errorKey?: string
  fileName: string
  id: string
  meta?: UploadedV2Meta
  status: UploadStatus
}

export type UpdatedCounts = {
  classes: number
  runners: number
}

const STATUS_KEY_PREFIX = "EventAdmin.DataUpload.status."

const SEVERITY_BY_LEVEL: Record<string, AlertColor> = {
  [UPLOAD_MESSAGE_LEVEL.error]: "error",
  [UPLOAD_MESSAGE_LEVEL.info]: "success",
  [UPLOAD_MESSAGE_LEVEL.warning]: "warning",
}

export function failedUploadMeta(error: unknown): UploadedV2Meta | undefined {
  return isAxiosError<ResUploadedV2>(error) ? error.response?.data?.meta : undefined
}

export function messagesOf(entry: UploadEntry): UploadMessage[] {
  return entry.meta?.messages ?? []
}

export function pendingEntry(id: string, file: File): UploadEntry {
  return { fileName: file.name, id, status: UPLOAD_STATUS.pending }
}

export function severityOf(entry: UploadEntry): AlertColor {
  if (entry.status === UPLOAD_STATUS.failed) return "error"
  if (entry.status !== UPLOAD_STATUS.done) return "info"
  return SEVERITY_BY_LEVEL[entry.meta?.level ?? UPLOAD_MESSAGE_LEVEL.info] ?? "success"
}

export function statusKeyOf(entry: UploadEntry): string {
  return entry.errorKey ?? `${STATUS_KEY_PREFIX}${entry.status}`
}

export function updatedCountsOf(entry: UploadEntry): UpdatedCounts {
  return {
    classes: entry.meta?.updated?.classes ?? 0,
    runners: entry.meta?.updated?.runners ?? 0,
  }
}

export function withChanges(
  entries: UploadEntry[],
  id: string,
  changes: Partial<UploadEntry>,
): UploadEntry[] {
  return entries.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry))
}
