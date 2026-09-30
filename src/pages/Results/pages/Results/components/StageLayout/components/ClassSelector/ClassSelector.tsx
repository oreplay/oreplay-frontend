import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useTranslation } from "react-i18next"
import { ClassModel, ClubModel, Page } from "../../../../../../../../shared/EntityTypes.ts"
import { useEffect, useRef, useState } from "react"
import { UseQueryResult } from "react-query"
import { useClassClubSearchParams } from "../../../../../../shared/hooks.ts"
import ClassSelectorDialog from "./components/ClassSelectorDialog/ClassSelectorDialog.tsx"
import { ClassSelectorTab, tabForSearchParam } from "./shared/classSelector.ts"

interface ClassSelectorProps {
  isClass: boolean
  activeClassClub: ClassModel | ClubModel | null
  setActiveClassClubId: (newActiveClassId: string, isClass: boolean) => void
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
}

export default function ClassSelector(props: ClassSelectorProps) {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<ClassSelectorTab>("classes")

  const { getClassClubSearchParamName } = useClassClubSearchParams()

  const hasInitialized = useRef(false)
  useEffect(() => {
    if (hasInitialized.current) return

    const [item, isClassInSearchParam] = getClassClubSearchParamName()
    hasInitialized.current = true

    if (item !== null && isClassInSearchParam !== null) {
      setCurrentTab(tabForSearchParam(isClassInSearchParam))
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
      <FormControl
        sx={{
          maxWidth: 300,
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)}
      >
        <InputLabel shrink={!!props.activeClassClub}>
          {props.isClass ? t("ResultsStage.Class") : t("ResultsStage.Club")}
        </InputLabel>
        <OutlinedInput
          readOnly
          notched={!!props.activeClassClub}
          value={props.activeClassClub?.short_name || ""}
          endAdornment={
            <InputAdornment position="end">
              <ExpandMoreIcon />
            </InputAdornment>
          }
          label={props.isClass ? t("ResultsStage.Class") : t("ResultsStage.Club")}
          sx={{
            pointerEvents: "none",
          }}
          inputProps={{
            tabIndex: -1,
          }}
        />
      </FormControl>
      <ClassSelectorDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeItemId={props.activeClassClub?.id}
        classesQuery={props.classesQuery}
        clubsQuery={props.clubsQuery}
        onClassClick={handleClassClick}
        onClubClick={handleClubClick}
      />
    </Box>
  )
}
