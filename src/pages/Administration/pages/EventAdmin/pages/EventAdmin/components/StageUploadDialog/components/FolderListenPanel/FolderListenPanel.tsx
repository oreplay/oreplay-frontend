import { UploadEntry } from "../../shared/uploadEntry.ts"
import FolderListenActive from "./components/FolderListenActive.tsx"
import FolderListenIdle from "./components/FolderListenIdle.tsx"
import FolderListenUnsupported from "./components/FolderListenUnsupported.tsx"
import FolderLostAlert from "./components/FolderLostAlert.tsx"

interface FolderListenPanelProps {
  entries: UploadEntry[]
  folderName: string | null
  hasFolderError: boolean
  isSupported: boolean
  onStart: () => void
  onStop: () => void
}

/**
 * Turns the browser into a desktop client for the stage: the user picks the folder the timing
 * software exports to, and every XML file landing there is uploaded.
 * @param props.entries the files uploaded since listening started, latest first.
 * @param props.folderName the folder listened to; `null` while not listening.
 * @param props.hasFolderError whether access to the folder was lost or refused.
 * @param props.isSupported whether this browser can listen to a folder at all.
 * @param props.onStart asks for a folder and starts listening.
 * @param props.onStop stops listening.
 */
export default function FolderListenPanel({
  entries,
  folderName,
  hasFolderError,
  isSupported,
  onStart,
  onStop,
}: FolderListenPanelProps) {
  if (!isSupported) return <FolderListenUnsupported />

  const content =
    folderName === null ? (
      <FolderListenIdle onStart={onStart} />
    ) : (
      <FolderListenActive entries={entries} folderName={folderName} onStop={onStop} />
    )

  return (
    <>
      {hasFolderError && <FolderLostAlert />}
      {content}
    </>
  )
}
