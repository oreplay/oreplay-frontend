import {ListItem, Stack, Typography} from "@mui/material";
import {RunnerModel} from "../../../../shared/EntityTypes.ts";
import {useTranslation} from "react-i18next";
import { parseDate } from '../../../../shared/Functions.tsx';

/**
 *
 * @param props
 */
export default function FootORunnerResultItem(props:{runner:RunnerModel}) {
  const {t} = useTranslation();
  const runner_result = props.runner.runner_results[0]

  return (
    <ListItem key={props.runner.id}>
        <div>
          <Typography key={props.runner.id+'fn'} color={'text.secondary'}>{`${props.runner.first_name} ${props.runner.last_name}`}</Typography>
          <Typography key={props.runner.id+'cn'} color={'text.secondary'}>{`${props.runner.club.short_name}`}</Typography>
          {props.runner.runner_results[0] ? (
            <Stack direction={'row'}>
              <Typography key={props.runner.id+'ss'} color={'secondary.main'}>
                {`${t('Results.Start')}:`}
              </Typography>
              <Typography key={props.runner.id+'st'} color={'text.secondary'}>
                {`${parseDate(runner_result.start_time)}`
                }
              </Typography>
              <Typography key={props.runner.id+'ff'} color={'secondary.main'}>
                {` ${t('Results.Finish')}: `}
              </Typography>
              <Typography key={props.runner.id+'ft'} color={'text.secondary'}>
                {`${runner_result.finish_time} `}
              </Typography>
              <Typography key={props.runner.id+'tb'} color={'primary.main'}>
                {`+ ${runner_result.time_behind}`}
              </Typography>
            </Stack>
          ): <></> }
        </div>
    </ListItem>
  )
}
/**
<Stack direction={'column'}>¡




</Stack>*/