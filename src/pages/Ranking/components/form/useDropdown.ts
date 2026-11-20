import { useEffect, useRef, useState } from "react"

/** Open/close state for a dropdown that closes when clicking outside its
 * container. Attach `containerRef` to the element wrapping the trigger + list. */
export function useDropdown() {
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

  return { open, setOpen, containerRef }
}
