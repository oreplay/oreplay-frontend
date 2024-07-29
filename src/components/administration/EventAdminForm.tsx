import {
  Box,
  Container,
  FormControl, FormControlLabel,
  InputLabel,
  Select,
  TextField,
  TextFieldProps
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {DatePicker} from "@mui/x-date-pickers";
import {EventDetailModel} from "../../shared/EntityTypes.ts";
import {DateTime} from "luxon";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import React from "react";

/**
 * @property eventDetail an event to be displayed in the form
 * @property canEdit weather the form can be edited
 * @property handleSubmit action to be performed when pressing save. Caution! Remember that handle
 * submit must call `event.preventDefault()`.
 */
interface EventAdminFormProps {
  eventDetail?:EventDetailModel,
  canEdit? : boolean,
  handleSubmit? : (event: React.FormEvent<HTMLFormElement>)=>void
}


/**
 * This is are all the fields that can be set in an event. It can display the data if an event is
 * passed in its props. Data can be edited if an event is passed and canEdit is set to true. In this
 * case, the handleSubmit can update the data on the server. If no data provided, it can be used to
 * create a new event. Caution! Please note that handle submit must call `event.preventDefault()`.
 * @param props
 */
export default function EventAdminForm(props: EventAdminFormProps){
  const {t} = useTranslation();

  const style_props:TextFieldProps = {
    margin:'normal',
    variant:'outlined',
    disabled : !props.canEdit
  }

  return (
    <Container component="form" onSubmit={props.handleSubmit} >
      <Box
        sx={{
          flexWrap: 'wrap',
          flexGrow: 1,
          marginY:'2em'
        }}
      >
        <TextField
          fullWidth
          id="description"
          name="description"
          required
          label={t('EventAdmin.EventName')}
          {...style_props}
          defaultValue={ props.eventDetail ? props.eventDetail.description : undefined  }
        />
        <TextField
          id="organizer"
          name="organizer"
          required
          label={t('EventAdmin.Organizer')}
          {...style_props}
          defaultValue={ 'No viene club' }
        />
        <DatePicker
          name={'startDate'}
          label={t('EventAdmin.StartDate')+' *'}
          slotProps={{textField: {...style_props} }}
          defaultValue={props.eventDetail ? DateTime.fromSQL(props.eventDetail.initial_date) : undefined}
        />
        <DatePicker label={t('EventAdmin.FinishDate')+' *'}
          name={'endDate'}
          slotProps={{textField: {...style_props} }}
          defaultValue={props.eventDetail ? DateTime.fromSQL(props.eventDetail.final_date) : undefined}
        />
        <TextField
          id="website"
          name="website"
          label={t('EventAdmin.Website')}
          {...style_props}
          defaultValue={ props.eventDetail ? props.eventDetail.website : undefined}
        />
        <FormControl  sx={{minWidth:'10em'}} required>
          <InputLabel id='scope-label' >{t('EventAdmin.Scopes.Scope')}</InputLabel>
          <Select
            id = 'scope'
            name={'scope'}
            disabled={!props.canEdit}
            labelId='scope-label'
            label={t('EventAdmin.Scopes.Scope')}
            defaultValue={props.eventDetail ? props.eventDetail.scope : undefined}
          >
            <MenuItem value={'int'}>{t('EventAdmin.Scopes.International')}</MenuItem>
            <MenuItem value={'nat'}>{t('EventAdmin.Scopes.National')}</MenuItem>
            <MenuItem value={'r.h'}>{t('EventAdmin.Scopes.RegionalHigh')}</MenuItem>
            <MenuItem value={'r.l'}>{t('EventAdmin.Scopes.RegionalLow')}</MenuItem>
            <MenuItem value={'loc'}>{t('EventAdmin.Scopes.Local')}</MenuItem>
            <MenuItem value={'clu'}>{t('EventAdmin.Scopes.Club')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{align:'center', minWidth:'6em'}}>
          <FormControlLabel
            id={'isPublic'}
            name={'isPublic'}
            control={<Checkbox checked={props.eventDetail? !(props.eventDetail.is_hidden) : undefined} />}
            label={t('EventAdmin.Public')}
            disabled={!props.canEdit}
          />
        </FormControl>
      </Box>
      {
        props.canEdit ? <Button
          type='submit'
          variant='contained'
        >{t('EventAdmin.Save')}</Button> : <></>
      }
    </Container>
  )
}