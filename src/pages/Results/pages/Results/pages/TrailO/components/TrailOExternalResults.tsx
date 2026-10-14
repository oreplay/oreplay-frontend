import "../../../../../../../styles/tokens.css"
import "../../../../../../../styles/tailwind.css"
import { useTranslation } from "react-i18next"
import EventDetailURLButton from "../../../../../components/EventDetailURLButton.tsx"

interface TrailOExternalResultsProps {
  url: string
}

const RESULTS_URL_BUTTON_SX = { fontSize: 16 }

/**
 * Tells that the results of the Trail-O stage are published on another website and links to it,
 * asking for confirmation before leaving O-Replay as the event website link does.
 *
 * @param props.url Results page on TOP or Jaruori.
 */
export default function TrailOExternalResults(props: TrailOExternalResultsProps) {
  const { t } = useTranslation()

  return (
    <section className="trail-o-external-results tw-root flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center font-sans">
      <p className="m-0 text-[20px] text-black/[0.87]">
        {t("ResultsStage.TrailO.ExternalResults")}
      </p>
      <EventDetailURLButton url={props.url} sx={RESULTS_URL_BUTTON_SX} />
    </section>
  )
}
