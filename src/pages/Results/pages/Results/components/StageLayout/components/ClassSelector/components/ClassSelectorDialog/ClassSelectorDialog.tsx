import "../../../../../../../../../../styles/tokens.css"
import "../../../../../../../../../../styles/tailwind.css"
import { Dialog } from "@mui/material"
import { UseQueryResult } from "react-query"
import { ClassModel, ClubModel, Page } from "../../../../../../../../../../shared/EntityTypes.ts"
import { useIsMobileDevice } from "../../../../../../shared/useIsMobileDevice.ts"
import {
  ClassSelectorTab,
  classSelectorPanelId,
  classSelectorTabId,
  ignoreDashes,
  ignoreDashesAndUnderscores,
} from "../../shared/classSelector.ts"
import AutocompleteList from "./components/AutocompleteList/AutocompleteList.tsx"
import ClassSelectorCloseButton from "./components/ClassSelectorCloseButton.tsx"
import ClassSelectorTabs from "./components/ClassSelectorTabs/ClassSelectorTabs.tsx"

interface ClassSelectorDialogProps {
  isOpen: boolean
  onClose: () => void
  currentTab: ClassSelectorTab
  onTabChange: (tab: ClassSelectorTab) => void
  activeItemId?: string
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
  onClassClick: (classItem: ClassModel) => void
  onClubClick: (club: ClubModel) => void
}

const DESKTOP_PAPER_SX = { minHeight: "min(480px, calc(100% - 64px))", borderRadius: "16px" }
const MOBILE_PAPER_SX = {}

const classShortName = (classItem: ClassModel) => classItem.short_name
const clubShortName = (club: ClubModel) => club.short_name
const entityId = (item: ClassModel | ClubModel) => item.id

export default function ClassSelectorDialog(props: ClassSelectorDialogProps) {
  const isMobileDevice = useIsMobileDevice()
  const paperSx = isMobileDevice ? MOBILE_PAPER_SX : DESKTOP_PAPER_SX
  const isClassesTab = props.currentTab === "classes"

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobileDevice}
      slotProps={{ paper: { sx: paperSx } }}
    >
      <div className="class-selector-dialog tw-root flex min-h-0 flex-auto flex-col bg-white font-sans text-neutral-800">
        <header className="flex items-center gap-2 px-4 pb-1 pt-4">
          <ClassSelectorTabs currentTab={props.currentTab} onTabChange={props.onTabChange} />
          <ClassSelectorCloseButton onClick={props.onClose} />
        </header>
        <div
          role="tabpanel"
          id={classSelectorPanelId(props.currentTab)}
          aria-labelledby={classSelectorTabId(props.currentTab)}
          className="flex min-h-0 flex-auto flex-col"
        >
          {isClassesTab ? (
            <AutocompleteList
              key="classes"
              itemList={props.classesQuery.data?.data ?? []}
              nameExtractor={classShortName}
              keyExtractor={entityId}
              handleClick={props.onClassClick}
              normalizeQuery={ignoreDashes}
              isLoading={props.classesQuery.isLoading}
              layout="wrap"
              selectedKey={props.activeItemId}
            />
          ) : (
            <AutocompleteList
              key="clubs"
              itemList={props.clubsQuery.data?.data ?? []}
              nameExtractor={clubShortName}
              keyExtractor={entityId}
              handleClick={props.onClubClick}
              normalizeQuery={ignoreDashesAndUnderscores}
              isLoading={props.clubsQuery.isLoading}
              layout="list"
              selectedKey={props.activeItemId}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}
