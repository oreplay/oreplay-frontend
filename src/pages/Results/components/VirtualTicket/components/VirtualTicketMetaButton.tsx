import { ReactElement, ReactNode } from "react"

interface VirtualTicketMetaButtonProps {
  children: ReactNode
  onClick: () => void
  icon?: ReactElement
  isDisabled?: boolean
}

/**
 * Plain text button in the details line of a virtual ticket, such as the runner's class or club.
 *
 * @param props.children The text of the button.
 * @param props.onClick Called when the user presses the button.
 * @param props.icon Decorative icon shown before the text; none when left out.
 * @param props.isDisabled Shows the text without letting it be pressed, e.g. a runner without club.
 */
export default function VirtualTicketMetaButton({
  children,
  onClick,
  icon,
  isDisabled,
}: VirtualTicketMetaButtonProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className="virtual-ticket-meta-button inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent p-0 font-sans text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-default disabled:no-underline disabled:hover:text-neutral-600"
    >
      {icon && <span className="flex text-neutral-500">{icon}</span>}
      {children}
    </button>
  )
}
