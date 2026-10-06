import { useEffect } from "react"

const LEAVE_PAGE_EVENT = "beforeunload"

function askBeforeLeaving(event: BeforeUnloadEvent) {
  event.preventDefault()
  event.returnValue = true
}

export function useLeavePagePrompt(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return
    window.addEventListener(LEAVE_PAGE_EVENT, askBeforeLeaving)
    return () => window.removeEventListener(LEAVE_PAGE_EVENT, askBeforeLeaving)
  }, [isActive])
}
