import "../../../../../../../styles/tokens.css"
import "../../../../../../../styles/tailwind.css"
import { useTranslation } from "react-i18next"

export default function TrailOMissingExternalResults() {
  const { t } = useTranslation()

  return (
    <section className="trail-o-missing-external-results tw-root flex flex-1 flex-col items-center justify-center px-6 py-12 text-center font-sans">
      <p role="alert" className="m-0 max-w-xl text-[20px] text-red-700">
        {t("ResultsStage.TrailO.MissingExternalResults")}
      </p>
    </section>
  )
}
