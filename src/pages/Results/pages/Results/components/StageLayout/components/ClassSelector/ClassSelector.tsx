import { Box } from "@mui/material"
import { ClassModel, ClubModel, Page } from "../../../../../../../../shared/EntityTypes.ts"
import { useEffect, useRef, useState } from "react"
import { UseQueryResult } from "react-query"
import { useParams } from "react-router-dom"
import { useClassClubSearchParams } from "../../../../../../shared/hooks.ts"
import ClassSelectorDialog from "./components/ClassSelectorDialog/ClassSelectorDialog.tsx"
import ClassSelectorTrigger from "./components/ClassSelectorTrigger/ClassSelectorTrigger.tsx"
import { ClassSelectorTab, tabForKind } from "./shared/classSelector.ts"
import { useRecentClassesClubs } from "./shared/useRecentClassesClubs.ts"

interface ClassSelectorProps {
  isClass: boolean
  activeClassClub: ClassModel | ClubModel | null
  setActiveClassClubId: (newActiveClassId: string, isClass: boolean) => void
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
}

export default function ClassSelector(props: ClassSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<ClassSelectorTab>("classes")

  const { getClassClubSearchParamName } = useClassClubSearchParams()
  const { eventId = "" } = useParams()
  const { recentIds, rememberRecent } = useRecentClassesClubs(eventId)
  const activeItemId = props.activeClassClub?.id

  useEffect(() => {
    if (activeItemId) rememberRecent(tabForKind(props.isClass), activeItemId)
  }, [activeItemId, props.isClass, rememberRecent])

  const hasInitialized = useRef(false)
  useEffect(() => {
    if (hasInitialized.current) return

    const [item, isClassInSearchParam] = getClassClubSearchParamName()
    hasInitialized.current = true

    if (item !== null && isClassInSearchParam !== null) {
      setCurrentTab(tabForKind(isClassInSearchParam))
    } else {
      setIsOpen(true)
    }
  }, [getClassClubSearchParamName])

  const handleClassClick = (newClass: ClassModel): void => {
    props.setActiveClassClubId(newClass.id, true)
    setIsOpen(false)
  }

  const handleClubClick = (newClub: ClubModel): void => {
    props.setActiveClassClubId(newClub.id, false)
    setIsOpen(false)
  }

  return (
    <Box>
      <ClassSelectorTrigger
        activeName={props.activeClassClub?.short_name}
        isClass={props.isClass}
        onClick={() => setIsOpen(true)}
      />
      <ClassSelectorDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeItemId={activeItemId}
        recentIds={recentIds}
        classesQuery={props.classesQuery}
        clubsQuery={props.clubsQuery}
        onClassClick={handleClassClick}
        onClubClick={handleClubClick}
      />
    </Box>
  )
}
