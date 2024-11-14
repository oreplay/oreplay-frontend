import {useContext} from "react";
import {useTranslation} from "react-i18next";
import {RunnersContext} from "../../../../shared/context.ts";
import ResultListContainer from "../../components/ResultListContainer.tsx";
import {RunnerModel} from "../../../../../../shared/EntityTypes.ts";
import ResultListItem from "../../components/ResultListItem.tsx";
import {Box, Typography} from "@mui/material";
import {parseSecondsToMMSS, parseStartTime} from "../../../../../../shared/Functions.tsx";
import {parseResultStatus} from "../../../../shared/functions.ts";

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
                    flexGrow: 1,
                    width:'10px'
                  }}
                >
                  <Typography sx={{color:'primary.main'}}>
                    {runner.runner_results[0].position ? `${runner.runner_results[0].position}.` : ''}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display:'flex',
                    flexShrink: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width:'100%',
                    marginLeft:'.3em'
                  }}
                >
                  <Box>
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
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: "space-between",
                      width: '100%'
                    }}
                  >
                    <Box sx={{
                      display:'inline-flex',
                      flexDirection:'row',
                      justifyContent:'space-between',
                      gap:'.1em'
                    }}>
                      <Typography sx={{color:'secondary.main'}}>{`${t('ResultsStage.StartTime')}:`}</Typography>
                      <Typography>{parseStartTime(runner.runner_results[0].start_time)}</Typography>
                    </Box>
                    <Box sx={{
                      display:'inline-flex',
                      flexDirection:'row',
                      justifyContent:'flex-start',
                      gap:'.15em',
                    }}>
                      <Typography sx={{color:'secondary.main'}}>{`${t('ResultsStage.FinishTime')}:`}</Typography>
                      <Typography>{(status==="ok")? (runner.runner_results[0].finish_time != null ? parseSecondsToMMSS(runner.runner_results[0].time_seconds) : "-") : t(`ResultsStage.statusCodes.${status}`) }</Typography>
                      <Typography sx={{color:'primary.main'}}>
                        {
                          ((status==="ok")&&(runner.runner_results[0].finish_time != null))
                            ?
                          `+${parseSecondsToMMSS(runner.runner_results[0].time_behind.toString())}`
                            :
                            ""
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ResultListItem>
            )
          })
        }
      </ResultListContainer>
    )
  }
}