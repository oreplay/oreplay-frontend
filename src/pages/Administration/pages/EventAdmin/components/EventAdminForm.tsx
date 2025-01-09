import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  TextField,
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
import { EventDetailModel } from "../../../../../shared/EntityTypes.ts"

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

  const style_props: TextFieldProps = {
    margin: "normal",
    variant: "outlined",
    disabled: !props.canEdit,
  }

  return (
    <Container component="form" onSubmit={props.handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "strerch",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <TextField
          fullWidth
          id="description"
          name="description"
          required
          label={t("EventAdmin.EventName")}
          {...style_props}
          defaultValue={props.eventDetail ? props.eventDetail.description : ""}
        />
        <TextField
          id="organizer"
          name="organizer"
          required
          label={t("EventAdmin.Organizer")}
          {...style_props}
          defaultValue={"No viene club"}
        />
        <DatePicker // BUG, can be edited even when disabled
          name={"startDate"}
          label={t("EventAdmin.StartDate") + " *"}
          slotProps={{ textField: { ...style_props } }}
          defaultValue={props.eventDetail ? DateTime.fromSQL(props.eventDetail.initial_date) : null}
        />
        <DatePicker
          label={t("EventAdmin.FinishDate") + " *"} // BUG, can be edited even when disabled
          name={"endDate"}
          slotProps={{ textField: { ...style_props } }}
          defaultValue={props.eventDetail ? DateTime.fromSQL(props.eventDetail.final_date) : null}
        />
        <TextField
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
        <FormControl sx={{ minWidth: "10em" }} required>
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
        <FormControl sx={{ align: "center", minWidth: "6em" }}>
          <FormControlLabel
            id={"isPublic"}
            name={"isPublic"}
            control={<Checkbox checked={isEventPublic} />}
            onChange={() => setIsEventPublic(!isEventPublic)}
            label={t("EventAdmin.Public")}
            disabled={!props.canEdit}
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          flexWrap: "nowrap",
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
    </Container>
  )
}
