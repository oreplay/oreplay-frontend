import {
  Box,
  Dialog,
  DialogContent,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Tab,
  Tabs,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useTranslation } from "react-i18next"
import { ClassModel, ClubModel, Page } from "../../../../../../../shared/EntityTypes.ts"
import { ReactNode, useState } from "react"
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined"
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined"
import { UseQueryResult } from "react-query"

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

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function ClassSelector(props: ClassSelectorProps) {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<number>(0)

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
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth={"xs"} fullWidth>
        <DialogContent>
          <Tabs value={currentTab} onChange={(_, newValue: number) => setCurrentTab(newValue)}>
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
          <CustomTabPanel value={currentTab} index={0}>
            <List>
              {props.classesQuery.data?.data.map((item) => {
                return (
                  <ListItemButton key={item.id} onClick={() => handleClassClick(item)}>
                    <ListItemText>{item.short_name}</ListItemText>
                  </ListItemButton>
                )
              })}
            </List>
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={1}>
            {props.clubsQuery.data?.data.map((item) => {
              return (
                <ListItemButton key={item.id} onClick={() => handleClubClick(item)}>
                  <ListItemText>{item.short_name}</ListItemText>
                </ListItemButton>
              )
            })}
          </CustomTabPanel>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
