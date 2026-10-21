import CloseIcon from "@mui/icons-material/Close"
import { useTranslation } from "react-i18next"

interface VirtualTicketCloseButtonProps {
  onClick: () => void
}

/**
 * Button pinned to the top right corner of a virtual ticket that closes it. Its background is
 * opaque because the ticket scrolls underneath it.
 *
 * @param props.onClick Called when the user presses the button.
 */
export default function VirtualTicketCloseButton({ onClick }: VirtualTicketCloseButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      aria-label={t("common:close")}
      onClick={onClick}
      className="virtual-ticket-close-button absolute right-2 top-3 z-[1] flex h-11 w-11 items-center justify-center rounded-md border-0 bg-white text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 sm:right-3 sm:top-4 sm:h-10 sm:w-10"
    >
      <CloseIcon fontSize="small" />
    </button>
  )
}
