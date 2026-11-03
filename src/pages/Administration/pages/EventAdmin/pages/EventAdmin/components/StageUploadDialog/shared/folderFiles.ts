import { hasXmlExtension } from "./xmlFiles.ts"

export const SETTLE_TIME_MS = 2000

const DIRECTORY_PICKER_ID = "oreplay-listen-folder"
const PICKER_DISMISSED_ERROR = "AbortError"
const UNSUPPORTED_PICKER_ERROR = "NotSupportedError"
const UNSUPPORTED_PICKER_MESSAGE = "This browser cannot pick folders"

interface DirectoryPickerOptions {
  id?: string
  mode?: "read" | "readwrite"
}

interface DirectoryPickerHost {
  showDirectoryPicker: (options?: DirectoryPickerOptions) => Promise<FileSystemDirectoryHandle>
}

/**
 * Tells whether a host (normally `window`) offers the File System Access folder picker, which
 * only Chromium-based desktop browsers do.
 * @param host the object that may expose `showDirectoryPicker`.
 * @returns true when the picker is available.
 */
function hasDirectoryPicker(host: object): host is DirectoryPickerHost {
  return "showDirectoryPicker" in host
}

/**
 * Tells whether a folder entry is a file rather than a subfolder.
 * @param handle an entry listed in a folder.
 * @returns true for files.
 */
function isFileHandle(handle: FileSystemHandle): handle is FileSystemFileHandle {
  return handle.kind === "file"
}

/**
 * Reads the current contents of a file entry, tolerating that it disappeared after the folder was
 * listed (the timing software or the user may have just moved or deleted it).
 * @param handle the file entry to read.
 * @returns a snapshot of the file, or `null` when it can no longer be read.
 */
async function readIfPresent(handle: FileSystemFileHandle): Promise<File | null> {
  try {
    return await handle.getFile()
  } catch {
    return null
  }
}

/**
 * Tells whether a file was last written long enough ago to be complete, so a file the timing
 * software is still exporting is not uploaded half-written.
 * @param file the file snapshot.
 * @param nowMillis the current instant, in epoch milliseconds.
 * @returns true once `SETTLE_TIME_MS` have passed since its last modification.
 */
function isSettled(file: File, nowMillis: number): boolean {
  return nowMillis - file.lastModified >= SETTLE_TIME_MS
}

/**
 * Identifies one version of a file: a re-export changes its size or modification time.
 * @param file the file snapshot.
 * @returns a key that stays the same only while the file is unchanged.
 */
export function fileVersionOf(file: File): string {
  return [file.name, file.size, file.lastModified].join("|")
}

/**
 * Chooses the files of a folder scan that still have to be uploaded: complete, not handled yet
 * in their current version, and oldest first so a start list exported before the results is
 * uploaded before them.
 * @param files the XML files found in the folder.
 * @param handledVersions the file versions already uploaded or refused, see `fileVersionOf`.
 * @param nowMillis the current instant, in epoch milliseconds.
 * @returns the files to upload, in the order to upload them.
 */
export function filesToUpload(
  files: File[],
  handledVersions: ReadonlySet<string>,
  nowMillis: number,
): File[] {
  return files
    .filter((file) => isSettled(file, nowMillis) && !handledVersions.has(fileVersionOf(file)))
    .sort((first, second) => first.lastModified - second.lastModified)
}

/**
 * Tells whether this browser can listen to a folder.
 * @param host the object that may expose the folder picker; `window` by default.
 * @returns true in browsers with the File System Access folder picker.
 */
export function isFolderListeningSupported(host: object = window): boolean {
  return hasDirectoryPicker(host)
}

/**
 * Tells whether an error only means the user closed the folder picker without choosing.
 * @param error the error the picker rejected with.
 * @returns true for a dismissed picker, which needs no feedback.
 */
export function isPickerDismissed(error: unknown): boolean {
  return error instanceof DOMException && error.name === PICKER_DISMISSED_ERROR
}

/**
 * Asks the user for the folder to listen to, with permission to delete the files once uploaded.
 * The browser remembers the last folder chosen, so the picker opens there next time.
 * @param host the object that exposes the folder picker; `window` by default.
 * @returns the chosen folder; rejects when the user dismisses the picker or it is unsupported.
 */
export function pickFolder(host: object = window): Promise<FileSystemDirectoryHandle> {
  if (!hasDirectoryPicker(host)) {
    return Promise.reject(new DOMException(UNSUPPORTED_PICKER_MESSAGE, UNSUPPORTED_PICKER_ERROR))
  }
  return host.showDirectoryPicker({ id: DIRECTORY_PICKER_ID, mode: "readwrite" })
}

/**
 * Lists the XML files directly inside a folder (subfolders are not searched, like the desktop
 * client) and reads their current contents.
 * @param folder the folder being listened to.
 * @returns a snapshot of each XML file; files that vanish while reading are left out. Rejects
 * when the folder itself can no longer be read.
 */
export async function readXmlFiles(folder: FileSystemDirectoryHandle): Promise<File[]> {
  const files: File[] = []
  for await (const handle of folder.values()) {
    if (!isFileHandle(handle) || !hasXmlExtension(handle.name)) continue
    const file = await readIfPresent(handle)
    if (file) files.push(file)
  }
  return files
}

/**
 * Deletes an uploaded file from the folder, as the desktop client does, unless it was
 * re-exported meanwhile: the newer version must still be uploaded.
 * @param folder the folder being listened to.
 * @param uploaded the snapshot of the file that was uploaded.
 * @returns true when the file was deleted; false when it changed, vanished or could not be
 * deleted, which is harmless because its uploaded version is never uploaded again.
 */
export async function removeIfUnchanged(
  folder: FileSystemDirectoryHandle,
  uploaded: File,
): Promise<boolean> {
  try {
    const current = await (await folder.getFileHandle(uploaded.name)).getFile()
    if (fileVersionOf(current) !== fileVersionOf(uploaded)) return false
    await folder.removeEntry(uploaded.name)
    return true
  } catch {
    return false
  }
}
