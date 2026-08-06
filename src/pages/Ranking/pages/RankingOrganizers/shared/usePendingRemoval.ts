import { useState } from "react"

export function usePendingRemoval<T>(onRemove: (item: T) => Promise<boolean>) {
  const [pending, setPending] = useState<T | null>(null)

  const confirm = async () => {
    if (pending && (await onRemove(pending))) setPending(null)
  }

  return {
    pending,
    request: (item: T) => setPending(item),
    cancel: () => setPending(null),
    confirm,
  }
}
