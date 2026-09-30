import CloseIcon from "@mui/icons-material/Close"
import SearchIcon from "@mui/icons-material/Search"
import { useTranslation } from "react-i18next"

interface AutocompleteListSearchBarProps {
  value: string
  setValue: (query: string) => void
}

export default function AutocompleteListSearchBar(props: AutocompleteListSearchBarProps) {
  const { t } = useTranslation()
  const hasQuery = props.value !== ""

  return (
    <div className="autocomplete-list-search-bar relative mx-4 my-3 shrink-0">
      <SearchIcon
        fontSize="small"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder={t("common:search")}
        aria-label={t("common:search")}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-10 text-[0.9375rem] outline-none transition-colors placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
      />
      {hasQuery && (
        <button
          type="button"
          onClick={() => props.setValue("")}
          aria-label={t("common:clearSearch")}
          title={t("common:clearSearch")}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
        >
          <CloseIcon fontSize="small" />
        </button>
      )}
    </div>
  )
}
