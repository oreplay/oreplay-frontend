import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useTranslation } from "react-i18next"
import { ClassModel } from "../../../../../../../shared/EntityTypes.ts"
import { useState } from "react"

interface ClassSelectorProps {
  activeClass: ClassModel | null
  setActiveClassId: (newActiveClassId: string) => void
  classesList: ClassModel[]
  isLoading: boolean
}

export default function ClassSelector(props: ClassSelectorProps) {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClassClick = (newClass: ClassModel): void => {
    props.setActiveClassId(newClass.id)
    setIsOpen(false)
  }

  return (
    <Box>
      <FormControl
        sx={{
          maxWidth: 150,
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)} // Clicking anywhere opens dialog
      >
        <InputLabel shrink={!!props.activeClass}>{t("ResultsStage.Class")}</InputLabel>
        <OutlinedInput
          readOnly
          notched={!!props.activeClass}
          value={props.activeClass?.short_name || ""}
          endAdornment={
            <InputAdornment position="end">
              <ExpandMoreIcon />
            </InputAdornment>
          }
          label={t("ResultsStage.Class")}
          sx={{
            pointerEvents: "none", // disable internal input interaction
          }}
          inputProps={{
            tabIndex: -1,
          }}
        />
      </FormControl>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth={"xs"} fullWidth>
        <DialogTitle>{t("ResultsStage.Class")}</DialogTitle>
        <DialogContent>
          <List>
            {props.classesList.map((item) => {
              return (
                <ListItemButton onClick={() => handleClassClick(item)}>
                  <ListItemText>{item.short_name}</ListItemText>
                </ListItemButton>
              )
            })}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
