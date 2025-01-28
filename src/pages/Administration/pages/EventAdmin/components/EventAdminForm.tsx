import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  TextField,
  Grid,
  Autocomplete,
  TextFieldProps,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { DatePicker } from "@mui/x-date-pickers"
import { DateTime } from "luxon"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import React, { useState } from "react"
import SaveIcon from "@mui/icons-material/Save"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import { EventDetailModel, OrganizerModel } from "../../../../../shared/EntityTypes.ts"
import { useOrganizerSearch } from "../../../services/EventAdminService.ts"

/**
 * @property eventDetail an event to be displayed in the form
 * @property canEdit weather the form can be edited
 * @property handleSubmit action to be performed when pressing save. Caution! Remember that handle
 * submit must call `event.preventDefault()`.
 * @property handleCancel action to be performed when pressing Cancel button.
 * @property handleEdit action to be performed when pressing Edit button
 */
interface EventAdminFormProps {
  eventDetail?: EventDetailModel
  canEdit?: boolean
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  handleCancel?: () => void
  handleEdit?: () => void
  selectedOrganizer: OrganizerModel | null
  setSelectedOrganizer: React.Dispatch<React.SetStateAction<OrganizerModel | null>>
}

/**
 * Validate that an string matches a URL pattern
 * @param url
 */
const validateURL = (url: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ) // validate fragment locator

  return urlPattern.test(url)
}

/**
 * This is are all the fields that can be set in an event. It can display the data if an event is
 * passed in its props. Data can be edited if an event is passed and canEdit is set to true. In this
 * case, the handleSubmit can update the data on the server. If no data provided, it can be used to
 * create a new event. Caution! Please note that handle submit must call `event.preventDefault()`.
 * @param props
 */
export default function EventAdminForm(props: EventAdminFormProps) {
  const { t } = useTranslation()

  const [isEventPublic, setIsEventPublic] = useState<boolean>(
    props.eventDetail ? !props.eventDetail.is_hidden : false,
  )
  const [isWebsiteValid, setIsWebsiteValid] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // Estado del término de búsqueda
  const { organizers } = useOrganizerSearch(searchTerm) // Llamar al hook dentro del componente

  const style_props: TextFieldProps = {
    variant: "outlined",
    disabled: !props.canEdit,
  }

  return (
    <Container component="form" onSubmit={props.handleSubmit}>
      <Grid
        container
        spacing={2}
        sx={{
          marginY: "2em",
        }}
      >
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            required
            label={t("EventAdmin.EventName")}
            {...style_props}
            defaultValue={props.eventDetail ? props.eventDetail.description : ""}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={12}>
          <TextField
            fullWidth
            id="website"
            name="website"
            label={t("EventAdmin.Website")}
            {...style_props}
            autoComplete="url"
            defaultValue={props.eventDetail ? props.eventDetail.website : ""}
            error={!isWebsiteValid}
            helperText={!isWebsiteValid ? t("EventAdmin.InvalidURLMsg") : ""}
            onBlur={(e) => {
              const value = e.target.value
              setIsWebsiteValid(!value || validateURL(value)) // Allow empty or valid URL
            }}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Autocomplete<OrganizerModel, false, false, false>
            fullWidth
            id="organizer"
            defaultValue={props.eventDetail ? props.eventDetail.organizer : null}
            options={organizers}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField {...params} label={t("EventAdmin.Organizer")} required {...style_props} />
            )}
            onInputChange={(_, value) => setSearchTerm(value)}
            onChange={(_, newValue) => props.setSelectedOrganizer(newValue)}
            value={props.selectedOrganizer}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Grid>
        <Grid item xs={12} md={2.7} lg={2}>
          <DatePicker
            name={"startDate"}
            label={t("EventAdmin.StartDate") + " *"}
            slotProps={{ textField: { ...style_props, fullWidth:true } }}
            defaultValue={
              props.eventDetail ? DateTime.fromSQL(props.eventDetail.initial_date) : null
            }
          />
        </Grid>
        <Grid item xs={12} md={2.7} lg={2}>
          <DatePicker
            name={"endDate"}
            label={t("EventAdmin.FinishDate") + " *"}
            slotProps={{ textField: { ...style_props, fullWidth:true } }}
            defaultValue={props.eventDetail ? DateTime.fromSQL(props.eventDetail.final_date) : null}
          />
        </Grid>
        <Grid item xs={12} md={2.6} lg={2.5}>
          <FormControl fullWidth required>
            <InputLabel id="scope-label">{t("EventAdmin.Scopes.Scope")}</InputLabel>
            <Select
              id="scope"
              name={"scope"}
              disabled={!props.canEdit}
              labelId="scope-label"
              label={t("EventAdmin.Scopes.Scope")}
              defaultValue={props.eventDetail ? props.eventDetail.scope : ""}
            >
              <MenuItem value={"int"}>{t("EventAdmin.Scopes.International")}</MenuItem>
              <MenuItem value={"nat"}>{t("EventAdmin.Scopes.National")}</MenuItem>
              <MenuItem value={"r.h"}>{t("EventAdmin.Scopes.RegionalHigh")}</MenuItem>
              <MenuItem value={"r.l"}>{t("EventAdmin.Scopes.RegionalLow")}</MenuItem>
              <MenuItem value={"loc"}>{t("EventAdmin.Scopes.Local")}</MenuItem>
              <MenuItem value={"clu"}>{t("EventAdmin.Scopes.Club")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5}>
          <FormControl fullWidth>
            <FormControlLabel
              id={"isPublic"}
              name={"isPublic"}
              control={<Checkbox checked={isEventPublic} />}
              onChange={() => setIsEventPublic(!isEventPublic)}
              label={t("EventAdmin.Public")}
              disabled={!props.canEdit}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "1em",
          }}
        >
          {props.canEdit ? (
            <>
              <Button variant="outlined" startIcon={<CloseIcon />} onClick={props.handleCancel}>
                {t("Cancel")}
              </Button>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                {t("EventAdmin.Save")}
              </Button>
            </>
          ) : (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={props.handleEdit}>
              {t("Edit")}
            </Button>
          )}
        </Box>
      </Grid>
    </Container>
  )
}
