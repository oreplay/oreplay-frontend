import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ClassModel } from "../../../../../../../shared/EntityTypes.ts"

interface ClassSelectorProps {
  activeClass: ClassModel | null
  setActiveClassId: (newActiveClassId: string) => void
  classesList: ClassModel[]
  isLoading: boolean
}

export default function ClassSelector(props: ClassSelectorProps) {
  const { t } = useTranslation()

  return (
    <Box>
      <FormControl sx={{ minWidth: "10em" }} required>
        <InputLabel>{t("ResultsStage.Class")}</InputLabel>
        <Select
          id="class-selector-Select-Form"
          label={t("ResultsStage.Class")}
          onChange={(event) => props.setActiveClassId(event.target.value)}
          value={props.isLoading ? "loading" : props.activeClass ? props.activeClass.id : ""}
        >
          {props.isLoading ? (
            <MenuItem key={"Loading"} value={"loading"}>
              {t("Loading")}
            </MenuItem>
          ) : (
            props.classesList?.map((class_item) => {
              return (
                <MenuItem key={class_item.id} value={class_item.id}>
                  {class_item.short_name}
                </MenuItem>
              )
            })
          )}
        </Select>
      </FormControl>
    </Box>
  )
}
