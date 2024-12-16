import {useContext} from "react";
import {useTranslation} from "react-i18next";
import {RunnersContext} from "../../../../shared/context.ts";
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx";
import ResultListItem from "../../../../components/ResultsList/ResultListItem.tsx";
import {Box, Typography} from "@mui/material";
import {getPositionOrNc, parseResultStatus} from "../../../../shared/functions.ts";
import {parseSecondsToMMSS} from "../../../../../../shared/Functions.tsx";
import {RESULT_STATUS_TEXT} from "../../../../shared/constants.ts";

export default function RogainePoints () {
  const {t} = useTranslation();


  // Gather runners data
  const [runnersList,isLoading] = useContext(RunnersContext)

  // Render component
  if (isLoading) {
    return (<p>{t('Loading')}</p>)
  } else {
    return (
      <ResultListContainer>
        {
          runnersList.map((runner) => {
            const status = parseResultStatus(runner.runner_results[0].status_code as string)
            const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc

            return (
              <ResultListItem key={runner.id}>
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
                    {runner.club ? `${runner.club.short_name}` : t('ResultsStage.NoClubMsg')}
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
                  <Typography>{(statusOkOrNc)? ( (runner.runner_results[0].points_final || runner.runner_results[0].finish_time)? `${runner.runner_results[0].points_final}` : "")  : ""}</Typography>
                  <Typography>{(statusOkOrNc)? (runner.runner_results[0].finish_time != null ? parseSecondsToMMSS(runner.runner_results[0].time_seconds) : "-") : t(`ResultsStage.statusCodes.${status}`) }</Typography>

                </Box>
              </ResultListItem>
            )
          })
        }
      </ResultListContainer>
    )
  }
}
