import { rankingSettingsPath } from "../../../../shared/routes.ts"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { useNavigate } from "react-router-dom"
import {
  RankingSettingsFormState,
  defaultRankingSettingsForm,
} from "../../shared/rankingSettingsForm.ts"
import { useRankingCreator } from "../../shared/useRankingCreator.ts"
import { useNotifyError } from "../../../../infrastructure/notifications/useNotifyError.ts"
import SettingsPageLayout from "../../components/SettingsPageLayout.tsx"
import RankingSettingsForm from "../../components/RankingSettingsForm.tsx"

export default function RankingCreate() {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const navigate = useNavigate()
  const { create, isLoading } = useRankingCreator()

  const onCreate = async (state: RankingSettingsFormState) => {
    try {
      const newId = await create(state, "")
      void navigate(rankingSettingsPath(newId))
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <SettingsPageLayout
      heading={t("Create.title")}
      currentCrumb={t("Create.title")}
      isLoading={false}
      isMissing={false}
    >
      <RankingSettingsForm
        initialState={defaultRankingSettingsForm()}
        eventId=""
        stageId=""
        submitLabel={t("common:save")}
        isSubmitting={isLoading}
        onSubmit={(state) => void onCreate(state)}
      />
    </SettingsPageLayout>
  )
}
