import CloseIcon from "@mui/icons-material/Close"
import { useTranslation } from "react-i18next"

interface ClassSelectorCloseButtonProps {
  onClick: () => void
}

export default function ClassSelectorCloseButton(props: ClassSelectorCloseButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      aria-label={t("common:close")}
      onClick={props.onClick}
      className="class-selector-close-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <CloseIcon fontSize="small" />
    </button>
  )
}
