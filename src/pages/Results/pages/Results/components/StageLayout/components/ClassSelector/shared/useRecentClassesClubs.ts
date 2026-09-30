import { useCallback, useEffect, useState } from "react"
import { ClassSelectorTab } from "./classSelector.ts"
import {
  EMPTY_RECENT_IDS,
  RecentIds,
  parseRecentIds,
  recentIdsStorageKey,
  withRecentId,
} from "./recentSelections.ts"

function readRecentIds(storageKey: string): RecentIds {
  try {
    return parseRecentIds(localStorage.getItem(storageKey))
  } catch {
    return EMPTY_RECENT_IDS
  }
}

function writeRecentIds(storageKey: string, recentIds: RecentIds) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(recentIds))
  } catch {
    return
  }
}

export function useRecentClassesClubs(eventId: string) {
  const storageKey = recentIdsStorageKey(eventId)
  const [recentIds, setRecentIds] = useState<RecentIds>(() => readRecentIds(storageKey))

  useEffect(() => {
    writeRecentIds(storageKey, recentIds)
  }, [storageKey, recentIds])

  const rememberRecent = useCallback((tab: ClassSelectorTab, id: string) => {
    setRecentIds((current) => withRecentId(current, tab, id))
  }, [])

  return { recentIds, rememberRecent }
}
