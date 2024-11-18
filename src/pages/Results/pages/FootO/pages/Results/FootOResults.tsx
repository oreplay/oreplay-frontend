import {useContext} from "react";
import {useTranslation} from "react-i18next";
import {RunnersContext} from "../../../../shared/context.ts";
import ResultListContainer from "../../components/ResultListContainer.tsx";
import {RunnerModel} from "../../../../../../shared/EntityTypes.ts";
import ResultListItem from "../../components/ResultListItem.tsx";
import {Box, Typography} from "@mui/material";
import {parseSecondsToMMSS} from "../../../../../../shared/Functions.tsx";
import { getPositionOrNc, parseResultStatus } from "../../../../shared/functions.ts";
import { RESULT_STATUS_TEXT } from '../../../../shared/constants.ts'

export default function FootOResults() {
  const {t} = useTranslation();

  const [runnersList,isLoading] = useContext(RunnersContext)


  if (isLoading) {
    return (<p>{t('Loading')}</p>)
  } else {
    return (
      <ResultListContainer>
        {
          runnersList.map((runner: RunnerModel) => {
            const status = parseResultStatus(runner.runner_results[0].status_code as string)
            const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc

            return (
              <ResultListItem
                key={runner.id}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    display: "flex",          // Enables flex properties
                    flexDirection: "column",  // Stack content vertically
                    justifyContent: "flex-start",  // Align content to the top
                    alignItems: "flex-end",
                    flexGrow: 0,
                    width:'10px'
                  }}
                >
                  <Typography sx={{color:'primary.main'}}>
                    {getPositionOrNc(runner, t)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display:'flex',
                    flexGrow:1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width:'calc(100% -20px)',
                    marginLeft:'.3em',
                  }}
                >
                  <Typography>
                    {`${runner.first_name} ${runner.last_name}`}
                  </Typography>
                  <Typography
                    sx={{
                      color:'text.secondary'
                    }}
                  >
                    {`${runner.club.short_name}`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexShrink: 0,
                    display: "flex",          // Enables flex properties
                    flexDirection: "column",  // Stack content vertically
                    justifyContent: "flex-start",  // Align content to the top
                    alignItems: "flex-end",
                    flexGrow: 1,
                  }}
                >
                  <Typography sx={{color:'secondary.main'}}>{(statusOkOrNc)? (runner.runner_results[0].finish_time != null ? parseSecondsToMMSS(runner.runner_results[0].time_seconds) : "-") : t(`ResultsStage.statusCodes.${status}`) }</Typography>
                  <Typography sx={{color:'primary.main',fontSize:14}}>
                    {
                      ((statusOkOrNc)&&(runner.runner_results[0].finish_time != null))
                        ?
                      `+${parseSecondsToMMSS(runner.runner_results[0].time_behind.toString())}`
                        :
                        ""
                    }
                  </Typography>
                </Box>
              </ResultListItem>
            )
          })
        }
      </ResultListContainer>
    )
  }
}