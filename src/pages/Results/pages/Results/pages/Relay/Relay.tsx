import RelayResults from "./pages/RelayResults/RelayResults.tsx"
import StageLayout from "../../components/Layout/StageLayout.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"

export default function Relay() {
  const [activeClass, setActiveClassId, classesList, areClassesLoading, refreshClasses] =
    useFetchClasses()

  const handleRefreshClick = () => {
    refreshClasses()
  }

  return (
    <StageLayout
      handleRefreshClick={handleRefreshClick}
      classesList={classesList}
      setActiveClassId={setActiveClassId}
      activeClass={activeClass}
      areClassesLoading={areClassesLoading}
    >
      <RelayResults />
    </StageLayout>
  )
}
