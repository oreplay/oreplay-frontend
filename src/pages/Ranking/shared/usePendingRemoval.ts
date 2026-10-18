import { useRef, useState } from "react"

export function usePendingRemoval<T>(onRemove: (item: T) => Promise<boolean>) {
  const [pending, setPending] = useState<T | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const confirmingRef = useRef(false)

  const confirm = async () => {
    if (!pending || confirmingRef.current) return
    confirmingRef.current = true
    setIsConfirming(true)
    try {
      if (await onRemove(pending)) setPending(null)
    } finally {
      confirmingRef.current = false
      setIsConfirming(false)
    }
  }

  return {
    pending,
    isConfirming,
    request: (item: T) => setPending(item),
    cancel: () => setPending(null),
    confirm,
  }
}
