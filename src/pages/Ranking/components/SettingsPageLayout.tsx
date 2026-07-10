import { ReactNode } from "react"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs.tsx"
import Spinner from "./Spinner/Spinner.tsx"
import { buildRankingSettingsBreadcrumbs } from "../shared/breadcrumbs.ts"

interface SettingsPageLayoutProps {
  heading: string
  /** Last breadcrumb label (the ranking title, or e.g. "Duplicate"). */
  currentCrumb: string
  isLoading: boolean
  isMissing: boolean
  children: ReactNode
  /** Additional card(s) rendered after the main card, only once loaded. */
  extraContent?: ReactNode
}

// Shared shell for the ranking settings + duplicate pages: breadcrumbs, heading,
// and a white card that swaps between loading / not-found / content.
export default function SettingsPageLayout({
  heading,
  currentCrumb,
  isLoading,
  isMissing,
  children,
  extraContent,
}: SettingsPageLayoutProps) {
  const { t } = useTranslationRanking()

  const breadcrumbs = buildRankingSettingsBreadcrumbs(
    {
      dashboard: t("translation:Dashboard.Dashboard"),
      ranking: t("Breadcrumbs.rankings"),
    },
    currentCrumb,
  )

  return (
    <div className="rk-settings-page-layout min-h-screen grow bg-surface py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs items={breadcrumbs} label={t("Breadcrumbs.label")} className="mb-6" />
        <h1 className="mb-4 text-2xl font-semibold">{heading}</h1>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            {isLoading ? (
              <Spinner label={t("common:loading")} />
            ) : isMissing ? (
              <p className="text-neutral-500">{t("Settings.notFound")}</p>
            ) : (
              children
            )}
          </div>
          {!isLoading && !isMissing && extraContent}
        </div>
      </div>
    </div>
  )
}
