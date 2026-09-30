import { ReactNode, useId } from "react"
import { useTranslation } from "react-i18next"
import { AutocompleteListLayout } from "../../../../../shared/classSelector.ts"
import AutocompleteListItems from "./AutocompleteListItems.tsx"

interface AutocompleteListRecentProps {
  children: ReactNode
  layout: AutocompleteListLayout
}

export default function AutocompleteListRecent(props: AutocompleteListRecentProps) {
  const { t } = useTranslation()
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="autocomplete-list-recent shrink-0 pt-3">
      <h3
        id={headingId}
        className="m-0 px-5 pb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500"
      >
        {t("ResultsStage.Recent")}
      </h3>
      <AutocompleteListItems layout={props.layout}>{props.children}</AutocompleteListItems>
    </section>
  )
}
