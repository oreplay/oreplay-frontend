import AutocompleteListContainer from "./components/AutocompleteListContainer.tsx"
import { Box } from "@mui/material"
import AutocompleteListItem from "./components/AutocompleteListItem.tsx"
import { useMemo, useState } from "react"
import AutocompleteListSearchBar from "./components/AutocompleteListSearchBar.tsx"

interface AutocompleteListProps<T> {
  itemList: T[]
  nameExtractor: (item: T) => string
  keyExtractor: (item: T) => string
  handleClick: (item: T) => void
  normalizeQuery?: (query: string) => string
}

export default function AutocompleteList<T>({
  itemList,
  nameExtractor,
  keyExtractor,
  handleClick,
  normalizeQuery,
}: AutocompleteListProps<T>) {
  // Internal state
  const [query, setQuery] = useState<string>("")

  const internalNormalizeQuery = useMemo(
    () =>
      normalizeQuery
        ? (query: string) => normalizeQuery(query).toLowerCase()
        : (query: string) => query.toLowerCase(),
    [normalizeQuery],
  )

  // Filter the item list based on the search query
  const displayedList = useMemo(() => {
    const normalizeQuery = internalNormalizeQuery(query)
    return itemList.filter((item) =>
      internalNormalizeQuery(nameExtractor(item)).includes(normalizeQuery),
    )
  }, [itemList, query, nameExtractor, internalNormalizeQuery])

  // Actual component
  return (
    <Box sx={{ paddingY: "24px", paddingX: 0 }}>
      <AutocompleteListSearchBar value={query} setValue={setQuery} />
      <AutocompleteListContainer>
        {displayedList.map((item) => {
          return (
            <AutocompleteListItem
              key={keyExtractor(item)}
              name={nameExtractor(item)}
              onClick={() => handleClick(item)}
            />
          )
        })}
      </AutocompleteListContainer>
    </Box>
  )
}
