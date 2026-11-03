import { DateTime } from "luxon"
import { SETTLE_TIME_MS } from "./folderFiles.ts"

export const NOW = DateTime.fromISO("2026-05-10T10:00:00Z")
export const SETTLED_AT = NOW.minus({ milliseconds: SETTLE_TIME_MS }).toMillis()
export const JUST_WRITTEN_AT = NOW.minus({ milliseconds: SETTLE_TIME_MS - 1 }).toMillis()

const MISSING_ENTRY_ERROR = "NotFoundError"
const SUBFOLDER_NAME = "archive"

export interface FakeFolder {
  contents: Map<string, File>
  handle: FileSystemDirectoryHandle
  write: (file: File) => void
}

/**
 * Builds a file snapshot as the File System Access API would return it.
 * @param name the file name, with its extension.
 * @param lastModified when it was last written, in epoch milliseconds; settled by default.
 * @param content the file's text.
 * @returns the file.
 */
export function folderFile(name: string, lastModified = SETTLED_AT, content = "<ResultList/>") {
  return new File([content], name, { lastModified })
}

/**
 * Rejects like the File System Access API does for an entry that no longer exists.
 * @param name the missing entry's name.
 * @returns a rejected promise.
 */
function missingEntry(name: string): Promise<never> {
  return Promise.reject(new DOMException(name, MISSING_ENTRY_ERROR))
}

/**
 * Builds an in-memory folder with the subset of `FileSystemDirectoryHandle` the listener uses,
 * plus a subfolder that must be ignored.
 * @param name the folder name.
 * @param files the files it holds at first.
 * @returns the handle, its live `contents` and `write` to add or replace a file.
 */
export function fakeFolder(name: string, files: File[] = []): FakeFolder {
  const contents = new Map(files.map((file) => [file.name, file]))

  /**
   * Builds the handle of one file, which reads its latest contents.
   * @param fileName the file name.
   * @returns the file handle.
   */
  const fileHandle = (fileName: string) => ({
    getFile: () => {
      const file = contents.get(fileName)
      return file ? Promise.resolve(file) : missingEntry(fileName)
    },
    kind: "file",
    name: fileName,
  })

  const handle = {
    getFileHandle: (fileName: string) =>
      contents.has(fileName) ? Promise.resolve(fileHandle(fileName)) : missingEntry(fileName),
    kind: "directory",
    name,
    removeEntry: (fileName: string) => {
      contents.delete(fileName)
      return Promise.resolve()
    },
    values: async function* () {
      yield await Promise.resolve({ kind: "directory", name: SUBFOLDER_NAME })
      for (const fileName of [...contents.keys()]) yield fileHandle(fileName)
    },
  } as unknown as FileSystemDirectoryHandle

  return { contents, handle, write: (file) => contents.set(file.name, file) }
}
