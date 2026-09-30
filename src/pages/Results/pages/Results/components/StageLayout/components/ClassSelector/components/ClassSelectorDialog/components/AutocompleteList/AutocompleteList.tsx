import { useMemo, useState } from "react"
import { autocompleteListLayout, filterByName } from "../../../../shared/classSelector.ts"
import AutocompleteListContainer from "./components/AutocompleteListContainer.tsx"
import AutocompleteListItem from "./components/AutocompleteListItem.tsx"
import AutocompleteListSearchBar from "./components/AutocompleteListSearchBar.tsx"

interface AutocompleteListProps<T> {
  itemList: T[]
  nameExtractor: (item: T) => string
  keyExtractor: (item: T) => string
  handleClick: (item: T) => void
  normalizeQuery?: (query: string) => string
  isLoading?: boolean
  selectedKey?: string
}

export default function AutocompleteList<T>({
  itemList,
  nameExtractor,
  keyExtractor,
  handleClick,
  normalizeQuery,
  isLoading,
  selectedKey,
}: AutocompleteListProps<T>) {
  const [query, setQuery] = useState<string>("")

  const displayedList = useMemo(
    () => filterByName(itemList, query, nameExtractor, normalizeQuery),
    [itemList, query, nameExtractor, normalizeQuery],
  )

  const layout = useMemo(
    () => autocompleteListLayout(itemList.map(nameExtractor)),
    [itemList, nameExtractor],
  )

  return (
    <div className="autocomplete-list flex min-h-0 flex-1 flex-col">
      <AutocompleteListSearchBar value={query} setValue={setQuery} />
      <AutocompleteListContainer
        layout={layout}
        isLoading={isLoading}
        isEmpty={displayedList.length === 0}
      >
        {displayedList.map((item) => (
          <AutocompleteListItem
            key={keyExtractor(item)}
            name={nameExtractor(item)}
            layout={layout}
            isSelected={keyExtractor(item) === selectedKey}
            onClick={() => handleClick(item)}
          />
        ))}
      </AutocompleteListContainer>
    </div>
  )
}
