import { useCallback, useState } from "react"
import { UploadEntry, withChanges, withUnfinishedCancelled } from "./uploadEntry.ts"

/**
 * Keeps the list of upload entries shown to the user, with the operations both the manual
 * upload and the folder listener need. Every operation keeps its identity across renders.
 * @returns the current `entries` plus functions to add entries at the end (`append`) or the
 * start (`prepend`), to change one by id (`update`), to mark the unfinished ones as cancelled
 * (`cancelUnfinished`) and to empty the list (`clear`).
 */
export function useUploadEntries() {
  const [entries, setEntries] = useState<UploadEntry[]>([])

  /**
   * Adds entries after the existing ones.
   * @param added the new entries, in their order.
   */
  const append = useCallback(
    (added: UploadEntry[]) => setEntries((current) => [...current, ...added]),
    [],
  )

  /**
   * Adds an entry before the existing ones, so the latest stays on top.
   * @param added the new entry.
   */
  const prepend = useCallback(
    (added: UploadEntry) => setEntries((current) => [added, ...current]),
    [],
  )

  /**
   * Changes the entry with the given id; other entries stay untouched.
   * @param id the id of the entry to change.
   * @param changes the fields to overwrite.
   */
  const update = useCallback(
    (id: string, changes: Partial<UploadEntry>) =>
      setEntries((current) => withChanges(current, id, changes)),
    [],
  )

  /** Marks every pending or uploading entry as cancelled. */
  const cancelUnfinished = useCallback(() => setEntries(withUnfinishedCancelled), [])

  /** Removes every entry. */
  const clear = useCallback(() => setEntries([]), [])

  return { append, cancelUnfinished, clear, entries, prepend, update }
}
