import {
  Box,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tab,
  Tabs,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useTranslation } from "react-i18next"
import { ClassModel, ClubModel, Page } from "../../../../../../../../shared/EntityTypes.ts"
import { ReactNode, useEffect, useRef, useState } from "react"
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined"
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined"
import { UseQueryResult } from "react-query"
import AutocompleteList from "./components/autocompleteList/AutocompleteList.tsx"
import { useClassClubSearchParams } from "../../../../../../shared/hooks.ts"
import CloseIcon from "@mui/icons-material/Close"

interface ClassSelectorProps {
  isClass: boolean
  activeClassClub: ClassModel | ClubModel | null
  setActiveClassClubId: (newActiveClassId: string, isClass: boolean) => void
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
}

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

// Auxiliary search normalize functions (to ignore some characters)
const ignoreDashes = (query: string) => query.replace(/-/g, "")
const ignoreDashesAndUnderscores = (query: string) => query.toLowerCase().replace(/[-_]/g, "")

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{ height: "100%" }}
    >
      {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
    </Box>
  )
}

export default function ClassSelector(props: ClassSelectorProps) {
  const { t } = useTranslation()

  // Internal states
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<number>(0)

  // Check if it should be opened or closed
  const { getClassClubSearchParamName } = useClassClubSearchParams()

  const hasInitialized = useRef(false)
  useEffect(() => {
    if (hasInitialized.current) return

    const [item, isClassInSearchParam] = getClassClubSearchParamName()
    hasInitialized.current = true

    if (item !== null && isClassInSearchParam !== null) {
      // Provided in the searchParam
      if (isClassInSearchParam) {
        // isClass
        setCurrentTab(0)
      } else {
        // isClub
        setCurrentTab(1)
      }
    } else {
      // Prompt user to choose class
      setIsOpen(true)
    }
  }, [getClassClubSearchParamName])

  // Click handlers
  const handleClassClick = (newClass: ClassModel): void => {
    props.setActiveClassClubId(newClass.id, true)
    setIsOpen(false)
  }

  const handleClubClick = (newClub: ClubModel): void => {
    props.setActiveClassClubId(newClub.id, false)
    setIsOpen(false)
  }

  // Actual component
  return (
    <Box>
      <FormControl
        sx={{
          maxWidth: 300,
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)} // Clicking anywhere opens dialog
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
            pointerEvents: "none", // disable internal input interaction
          }}
          inputProps={{
            tabIndex: -1,
          }}
        />
      </FormControl>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth={"xs"}
        sx={{
          "& .MuiDialog-paper": {
            height: "90%",
            maxHeight: "none",
          },
        }}
        fullWidth
      >
        <DialogContent sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "inline-flex",
              justifyContent: "space-between",
              width: "100px",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ flexShrink: 1, flexGrow: 1 }}>
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={(_, newValue: number) => setCurrentTab(newValue)}
              >
                <Tab
                  label={t("ResultsStage.Classes")}
                  icon={<LeaderboardOutlinedIcon />}
                  iconPosition={"start"}
                />
                <Tab
                  label={t("ResultsStage.Clubs")}
                  icon={<GroupsOutlinedIcon />}
                  iconPosition={"start"}
                />
              </Tabs>
            </Box>
            <Box>
              <IconButton
                aria-label="close"
                onClick={() => setIsOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomTabPanel value={currentTab} index={0}>
            <AutocompleteList
              itemList={props.classesQuery.data ? props.classesQuery.data.data : []}
              nameExtractor={(classItem: ClassModel) => classItem.short_name}
              keyExtractor={(classItem: ClassModel) => classItem.id}
              handleClick={handleClassClick}
              normalizeQuery={ignoreDashes}
              isLoading={props.classesQuery.isLoading || props.classesQuery.isFetching}
            />
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={1}>
            <AutocompleteList
              itemList={props.clubsQuery.data ? props.clubsQuery.data.data : []}
              nameExtractor={(club: ClubModel) => club.short_name}
              keyExtractor={(club: ClubModel) => club.id}
              handleClick={handleClubClick}
              normalizeQuery={ignoreDashesAndUnderscores}
              isLoading={props.clubsQuery.isLoading || props.clubsQuery.isFetching}
            />
          </CustomTabPanel>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
