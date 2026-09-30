import { CLASS_SELECTOR_TABS, ClassSelectorTab } from "./classSelector.ts"

export type RecentIds = Record<ClassSelectorTab, string[]>

export const EMPTY_RECENT_IDS: RecentIds = { classes: [], clubs: [] }

export const RECENT_LIMITS: Record<ClassSelectorTab, number> = { classes: 5, clubs: 3 }

const RECENT_IDS_STORAGE_PREFIX = "recentClassesClubs"

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string")
}

export function parseRecentIds(raw: string | null): RecentIds {
  if (raw === null) return EMPTY_RECENT_IDS

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return EMPTY_RECENT_IDS

    const stored = parsed as Record<string, unknown>
    return Object.fromEntries(
      CLASS_SELECTOR_TABS.map((tab) => {
        const ids = stored[tab]
        return [tab, isStringArray(ids) ? ids.slice(0, RECENT_LIMITS[tab]) : []]
      }),
    ) as RecentIds
  } catch {
    return EMPTY_RECENT_IDS
  }
}

export function recentIdsStorageKey(eventId: string) {
  return `${RECENT_IDS_STORAGE_PREFIX}:${eventId}`
}

export function recentItems<T>(
  items: readonly T[],
  recentIds: readonly string[],
  keyExtractor: (item: T) => string,
): T[] {
  const itemsByKey = new Map(items.map((item) => [keyExtractor(item), item]))
  return recentIds.flatMap((id) => {
    const item = itemsByKey.get(id)
    return item === undefined ? [] : [item]
  })
}

export function withRecentId(recentIds: RecentIds, tab: ClassSelectorTab, id: string): RecentIds {
  const withoutId = recentIds[tab].filter((recentId) => recentId !== id)
  return { ...recentIds, [tab]: [id, ...withoutId].slice(0, RECENT_LIMITS[tab]) }
}
