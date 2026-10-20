import { useTranslation } from "react-i18next"
import NoChipIcon from "./NoChipIcon.tsx"

/**
 * Empty state of the splits of a virtual ticket when the runner's chip was not read.
 */
export default function VirtualTicketNoDownloadMsg() {
  const { t } = useTranslation()

  return (
    <div className="virtual-ticket-no-download-msg flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8 text-center">
      <NoChipIcon />
      <div>
        <p className="m-0 text-[15px] font-medium text-neutral-800">
          {t("ResultsStage.VirtualTicket.NoDownloadMsg")}
        </p>
        <p className="m-0 mt-1 text-[13px] text-neutral-500">
          {t("ResultsStage.VirtualTicket.NoDownloadHint")}
        </p>
      </div>
    </div>
  )
}
