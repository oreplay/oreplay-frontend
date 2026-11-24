import "../../../../../../../../../styles/tokens.css"
import "../../../../../../../../../styles/tailwind.css"
import { useTranslation } from "react-i18next"

/**
 * Tells the user that the results uploaded to a relay stage do not come from a relay, so they
 * cannot be shown until the organizer uploads relay results.
 */
export default function NonRelayDataMsg() {
  const { t } = useTranslation()

  return (
    <section className="non-relay-data-msg tw-root flex flex-1 flex-col items-center justify-center px-6 py-12 text-center font-sans">
      <p role="alert" className="m-0 max-w-xl text-[20px] text-red-700">
        {t("ResultsStage.Relay.NonRelayData")}
      </p>
    </section>
  )
}
