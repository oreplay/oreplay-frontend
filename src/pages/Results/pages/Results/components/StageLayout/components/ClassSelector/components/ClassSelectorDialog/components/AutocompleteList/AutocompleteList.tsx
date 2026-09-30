import { useMemo, useState } from "react"
import { AutocompleteListLayout, filterByName } from "../../../../shared/classSelector.ts"
import { recentItems } from "../../../../shared/recentSelections.ts"
import AutocompleteListContainer from "./components/AutocompleteListContainer.tsx"
import AutocompleteListItem from "./components/AutocompleteListItem.tsx"
import AutocompleteListRecent from "./components/AutocompleteListRecent.tsx"
import AutocompleteListSearchBar from "./components/AutocompleteListSearchBar.tsx"

interface AutocompleteListProps<T> {
  itemList: T[]
  nameExtractor: (item: T) => string
  keyExtractor: (item: T) => string
  handleClick: (item: T) => void
  normalizeQuery?: (query: string) => string
  isLoading?: boolean
  layout: AutocompleteListLayout
  recentKeys: readonly string[]
  selectedKey?: string
}

export default function AutocompleteList<T>({
  itemList,
  nameExtractor,
  keyExtractor,
  handleClick,
  normalizeQuery,
  isLoading,
  layout,
  recentKeys,
  selectedKey,
}: AutocompleteListProps<T>) {
  const [query, setQuery] = useState<string>("")

  const displayedList = useMemo(
    () => filterByName(itemList, query, nameExtractor, normalizeQuery),
    [itemList, query, nameExtractor, normalizeQuery],
  )

  const recentList = useMemo(
    () => recentItems(itemList, recentKeys, keyExtractor),
    [itemList, recentKeys, keyExtractor],
  )
  const hasRecent = recentList.length > 0

  const renderItem = (item: T, scrollIntoViewWhenSelected: boolean) => (
    <AutocompleteListItem
      key={keyExtractor(item)}
      name={nameExtractor(item)}
      layout={layout}
      isSelected={keyExtractor(item) === selectedKey}
      onClick={() => handleClick(item)}
      scrollIntoViewWhenSelected={scrollIntoViewWhenSelected}
    />
  )

  return (
    <div className="autocomplete-list flex min-h-0 flex-auto flex-col">
      {hasRecent && (
        <AutocompleteListRecent layout={layout}>
          {recentList.map((item) => renderItem(item, false))}
        </AutocompleteListRecent>
      )}
      <AutocompleteListSearchBar value={query} setValue={setQuery} />
      <AutocompleteListContainer
        layout={layout}
        isLoading={isLoading}
        isEmpty={displayedList.length === 0}
      >
        {displayedList.map((item) => renderItem(item, true))}
      </AutocompleteListContainer>
    </div>
  )
}
