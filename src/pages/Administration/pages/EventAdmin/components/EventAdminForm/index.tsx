import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  Select,
  TextField,
  Autocomplete,
  TextFieldProps,
  Grid2 as Grid,
  FormLabel,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { DatePicker } from "@mui/x-date-pickers"
import { DateTime } from "luxon"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import SaveIcon from "@mui/icons-material/Save"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import { useOrganizerSearch } from "../../../../services/EventAdminService.ts"
import { EventDetailModel, OrganizerModel } from "../../../../../../shared/EntityTypes.ts"
import ShareEventDialog from "../../pages/EventAdmin/components/ShareEventDialog.tsx"
import { useForm } from "@tanstack/react-form"
import { validateURL } from "./functions.ts"

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
  handleSubmit: (values: EventAdminFormValues) => void
  handleCancel?: () => void
  handleEdit?: () => void
}

export interface EventAdminFormValues {
  description: string
  website?: string
  organizer: OrganizerModel | null
  startDate: DateTime | null
  endDate: DateTime | null
  scope: string
  isPublic: boolean
}

const WEBSITE_MAX_LENGTH = 120
const EVENT_NAME_MAX_LENGTH = 255

/**
 * This is are all the fields that can be set in an event. It can display the data if an event is
 * passed in its props. Data can be edited if an event is passed and canEdit is set to true. In this
 * case, the handleSubmit can update the data on the server. If no data provided, it can be used to
 * create a new event. Caution! Please note that handle submit must call `event.preventDefault()`.
 * @param props
 */
export default function EventAdminForm(props: EventAdminFormProps) {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      description: props.eventDetail?.description ?? "",
      website: props.eventDetail?.website ?? "",
      organizer: props.eventDetail?.organizer || null,
      startDate: props.eventDetail ? DateTime.fromSQL(props.eventDetail.initial_date) : null,
      endDate: props.eventDetail ? DateTime.fromSQL(props.eventDetail.final_date) : null,
      scope: props.eventDetail?.scope ?? "",
      isPublic: props.eventDetail ? !props.eventDetail.is_hidden : false,
    },
    onSubmit: ({ value }) => props.handleSubmit(value),
  })

  const { data: organizersData, isSuccess: areOrganizersSuccess } = useOrganizerSearch(
    !props.canEdit,
  )

  const style_props: TextFieldProps = {
    variant: "outlined",
    disabled: !props.canEdit,
  }

  return (
    <Container
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      disableGutters
      sx={{ p: 4, borderRadius: 3, backgroundColor: "white" }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <form.Field
            name={"description"}
            validators={{
              onBlur: ({ value }) => (!value ? t("ThisFieldIsRequiredMsg") : undefined),
              onChange: ({ value }) =>
                !value
                  ? undefined
                  : value.length > EVENT_NAME_MAX_LENGTH
                    ? t("EventAdmin.TooLongDescriptionMsg", { count: EVENT_NAME_MAX_LENGTH })
                    : undefined,
            }}
          >
            {(field) => (
              <>
                <FormLabel required error={!!field.state.meta.errors.length}>
                  {t("EventAdmin.EventName")}
                </FormLabel>
                <TextField
                  required
                  fullWidth
                  value={field.state.value}
                  placeholder={t("EventAdmin.EventNamePlaceholder")}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={!!field.state.meta.errors.length}
                  helperText={field.state.meta.errors.join(" ")}
                  {...style_props}
                />
              </>
            )}
          </form.Field>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <form.Field
            name={"website"}
            validators={{
              onChange: ({ value }) =>
                value
                  ? value.length > WEBSITE_MAX_LENGTH
                    ? t("EventAdmin.TooLongMsg", { count: WEBSITE_MAX_LENGTH })
                    : undefined
                  : undefined,
              onBlur: ({ value }) =>
                value
                  ? validateURL(value)
                    ? undefined
                    : t("EventAdmin.InvalidURLMsg")
                  : undefined,
            }}
          >
            {(field) => (
              <>
                <FormLabel error={!!field.state.meta.errors.length}>
                  {t("EventAdmin.Website")}
                </FormLabel>
                <TextField
                  fullWidth
                  id="website"
                  name="website"
                  {...style_props}
                  autoComplete="url"
                  value={field.state.value}
                  placeholder={t("EventAdmin.WebsitePlaceholder")}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  error={!!field.state.meta.errors.length}
                  helperText={field.state.meta.errors.join(" ")}
                />
              </>
            )}
          </form.Field>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field name={"organizer"}>
            {(field) => (
              <>
                <FormLabel required>{t("EventAdmin.Organizer")}</FormLabel>
                <Autocomplete<OrganizerModel, false, false, false>
                  fullWidth
                  id="organizer"
                  value={field.state.value}
                  onChange={(_, newOrganizer) => field.handleChange(newOrganizer)}
                  disabled={style_props.disabled}
                  options={areOrganizersSuccess ? organizersData?.data : []}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <>
                      <TextField
                        {...params}
                        placeholder={t("EventAdmin.OrganizerPlaceholder")}
                        required
                        {...style_props}
                      />
                    </>
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </>
            )}
          </form.Field>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <form.Field name={"startDate"}>
            {(field) => (
              <>
                <FormLabel required>{t("EventAdmin.StartDate")}</FormLabel>
                <DatePicker
                  name={"startDate"}
                  disabled={style_props.disabled}
                  slotProps={{ textField: { ...style_props, fullWidth: true, required: true } }}
                  value={field.state.value}
                  onChange={(date) => field.handleChange(date)}
                />
              </>
            )}
          </form.Field>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <form.Field name={"endDate"}>
            {(field) => (
              <>
                <FormLabel required>{t("EventAdmin.FinishDate")}</FormLabel>
                <DatePicker
                  name={"endDate"}
                  disabled={style_props.disabled}
                  slotProps={{ textField: { ...style_props, fullWidth: true, required: true } }}
                  value={field.state.value}
                  onChange={(date) => {
                    field.handleChange(date)
                  }}
                />
              </>
            )}
          </form.Field>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <form.Field name={"scope"}>
            {(field) => (
              <>
                <FormLabel required>{t("EventAdmin.Scopes.Scope")}</FormLabel>
                <FormControl fullWidth required disabled={style_props.disabled}>
                  <Select
                    id="scope"
                    name={"scope"}
                    labelId="scope-label"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#888" }}>
                            {t("EventAdmin.Scopes.Placeholder")}
                          </span>
                        )
                      }
                      const map: Record<string, string> = {
                        int: t("EventAdmin.Scopes.International"),
                        nat: t("EventAdmin.Scopes.National"),
                        "r.h": t("EventAdmin.Scopes.RegionalHigh"),
                        "r.l": t("EventAdmin.Scopes.RegionalLow"),
                        loc: t("EventAdmin.Scopes.Local"),
                        clu: t("EventAdmin.Scopes.Club"),
                      }
                      return map[selected] || ""
                    }}
                  >
                    <MenuItem value={"int"}>{t("EventAdmin.Scopes.International")}</MenuItem>
                    <MenuItem value={"nat"}>{t("EventAdmin.Scopes.National")}</MenuItem>
                    <MenuItem value={"r.h"}>{t("EventAdmin.Scopes.RegionalHigh")}</MenuItem>
                    <MenuItem value={"r.l"}>{t("EventAdmin.Scopes.RegionalLow")}</MenuItem>
                    <MenuItem value={"loc"}>{t("EventAdmin.Scopes.Local")}</MenuItem>
                    <MenuItem value={"clu"}>{t("EventAdmin.Scopes.Club")}</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </form.Field>
        </Grid>
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <form.Field name={"isPublic"}>
            {(field) => (
              <FormControl fullWidth>
                <FormControlLabel
                  id={"isPublic"}
                  name={"isPublic"}
                  control={
                    <Checkbox
                      onChange={(e) => {
                        field.handleChange(e.target.checked)
                      }}
                      checked={field.state.value}
                    />
                  }
                  label={t("EventAdmin.Public")}
                  disabled={!props.canEdit}
                />
              </FormControl>
            )}
          </form.Field>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "1em",
            marginTop: "24px",
          }}
        >
          <>
            {props.eventDetail ? (
              <ShareEventDialog
                eventId={props.eventDetail.id}
                eventName={props.eventDetail.description}
              />
            ) : (
              <></>
            )}
            {props.canEdit ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={(e) => {
                    e.preventDefault()
                    form.reset()
                    if (props.handleCancel) {
                      props.handleCancel()
                    }
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                  {t("EventAdmin.Save")}
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<EditIcon />} onClick={props.handleEdit}>
                {t("Edit")}
              </Button>
            )}
          </>
        </Box>
      </Grid>
    </Container>
  )
}
