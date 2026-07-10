import { useEffect, useRef, useState } from "react"
import FieldLabel from "./FieldLabel.tsx"
import SpinnerRing from "../SpinnerRing.tsx"
import { FIELD_CLASS } from "./fieldStyles.ts"

const DROPDOWN_MAX_HEIGHT = 224 // matches max-h-56 (14rem)

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
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ""

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  // Server-search mode: the parent already filtered, so show options as-is.
  const filtered = onSearch
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))

  // Flip the list upward when there isn't enough room below (e.g. near the
  // bottom of the page), so it overlays instead of growing the page.
  useEffect(() => {
    if (!open || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const estimated = Math.min(filtered.length * 40 + 8, DROPDOWN_MAX_HEIGHT)
    const spaceBelow = window.innerHeight - rect.bottom
    setDropUp(spaceBelow < estimated && rect.top > spaceBelow)
  }, [open, filtered.length])

  const select = (option: SearchableSelectOption) => {
    onChange(option.value)
    setQuery("")
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
                    className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100"
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
