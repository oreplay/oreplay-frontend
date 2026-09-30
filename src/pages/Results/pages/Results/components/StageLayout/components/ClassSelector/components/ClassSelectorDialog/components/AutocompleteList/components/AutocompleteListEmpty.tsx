import { useTranslation } from "react-i18next"

export default function AutocompleteListEmpty() {
  const { t } = useTranslation()

  return (
    <p className="autocomplete-list-empty m-0 px-4 py-10 text-center text-sm text-neutral-500">
      {t("common:noResults")}
    </p>
  )
}
