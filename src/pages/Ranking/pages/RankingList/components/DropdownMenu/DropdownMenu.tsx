import { ReactNode, useEffect, useRef, useState } from "react"

export interface DropdownMenuItem {
  label: string
  /** Action items run `onSelect`; link items navigate via `href` (new tab). */
  onSelect?: () => void
  href?: string
}

interface DropdownMenuProps {
  /** Accessible label for the trigger button. */
  triggerLabel: string
  /** Visual content of the trigger (e.g. an icon). */
  trigger: ReactNode
  items: DropdownMenuItem[]
  className?: string
}

const ITEM_CLASS =
  "block w-full rounded px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"

export default function DropdownMenu({
  triggerLabel,
  trigger,
  items,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  return (
    // Stop propagation so interacting with the menu never triggers a clickable
    // ancestor (e.g. the list row navigating to the settings page).
    <div
      ref={containerRef}
      onClick={(event) => event.stopPropagation()}
      className={["rk-dropdown-menu relative", className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false)
        }}
        className="text-neutral-500 transition-colors hover:text-primary"
      >
        {trigger}
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-10 mt-1 min-w-[11rem] list-none rounded-lg border border-neutral-200 bg-white p-1 shadow-md"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              {item.href ? (
                <a
                  role="menuitem"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={ITEM_CLASS}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onSelect?.()
                    setOpen(false)
                  }}
                  className={ITEM_CLASS}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
