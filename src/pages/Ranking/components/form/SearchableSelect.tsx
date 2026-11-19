import { useEffect, useState } from "react"
import FieldLabel from "./FieldLabel.tsx"
import SpinnerRing from "../SpinnerRing.tsx"
import { FIELD_CLASS } from "./shared/fieldStyles.ts"
import { useDropdown } from "./useDropdown.ts"
import { shouldDropUp, visibleOptions } from "./shared/searchableSelect.ts"

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  options: SearchableSelectOption[]
  noResultsLabel: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  className?: string
  /** When set, search is server-side: the query is reported here and `options`
   * are shown as-is (no local filtering). */
  onSearch?: (query: string) => void
}

/**
 * Text field that filters a list of options and selects one of them. The typed query is cleared
 * whenever the list closes, by selecting or clicking outside, so it reopens unfiltered; while
 * closed the field shows the selected option's label instead.
 * @param props.label - label shown above the field
 * @param props.value - value of the selected option, or null when nothing is selected
 * @param props.onChange - called with the chosen option's value
 * @param props.options - options to choose from
 * @param props.noResultsLabel - text listed when no option matches the query
 * @param props.placeholder - hint shown while the field is empty
 * @param props.disabled - true to block typing and selecting
 * @param props.loading - true to show a spinner while options are being fetched
 * @param props.onSearch - when set, search is server-side: the query is reported here and the options are listed as they are
 * @param props.className - extra classes for the root element
 */
export default function SearchableSelect({
  label,
  value,
  onChange,
  options,
  noResultsLabel,
  placeholder,
  disabled,
  loading,
  className,
  onSearch,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("")
  const [dropUp, setDropUp] = useState(false)
  const { open, setOpen, containerRef } = useDropdown()

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ""

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  const filtered = visibleOptions(options, query, Boolean(onSearch))

  useEffect(() => {
    if (!open || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setDropUp(shouldDropUp(rect, window.innerHeight, filtered.length))
  }, [open, filtered.length, containerRef])

  const select = (option: SearchableSelectOption) => {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <div
      className={["rk-searchable-select flex flex-col gap-1", className].filter(Boolean).join(" ")}
    >
      <FieldLabel label={label} />
      <div ref={containerRef} className="relative">
        <input
          type="text"
          disabled={disabled || loading}
          aria-busy={loading}
          value={open ? query : selectedLabel}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            onSearch?.(event.target.value)
          }}
          className={[FIELD_CLASS, "w-full disabled:bg-neutral-100", loading ? "pr-10" : ""].join(
            " ",
          )}
        />
        {loading && (
          <SpinnerRing className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 border-2 border-primary" />
        )}
        {open && (
          <ul
            className={[
              "absolute z-10 max-h-56 w-full list-none overflow-auto rounded-md border border-neutral-200 bg-white p-1 shadow-md",
              dropUp ? "bottom-full mb-1" : "top-full mt-1",
            ].join(" ")}
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-neutral-500">{noResultsLabel}</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => select(option)}
                    className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-neutral-100"
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
