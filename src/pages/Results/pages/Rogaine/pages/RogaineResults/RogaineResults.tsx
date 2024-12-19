import {useContext} from "react";
import {useTranslation} from "react-i18next";
import {RunnersContext} from "../../../../shared/context.ts";
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx";
import ResultListItem from "../../../../components/ResultsList/ResultListItem.tsx";
import {Box, Typography} from "@mui/material";
import {getPositionOrNc, parseResultStatus} from "../../../../shared/functions.ts";
import {parseSecondsToMMSS} from "../../../../../../shared/Functions.tsx";
import {RESULT_STATUS_TEXT} from "../../../../shared/constants.ts";
import {useVirtualTicket} from "../../../../components/VirtualTicket/shared/hooks.ts";
import RogaineVirtualTicket from "../../components/RogaineVirtualTicket/RogaineVirtualTicket.tsx";

export default function RogainePoints () {
  const {t} = useTranslation();

  const [isVirtualTicketOpen,selectedRunner, handleRowClick, handleCloseVirtualTicket] = useVirtualTicket()

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
            const runnerResult = runner.runner_results[0]
            const status = parseResultStatus(runnerResult?.status_code as string)
            const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc

            return (
              <ResultListItem
                key={runner.id}
                onClick={()=>handleRowClick(runner)}
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

                  <Typography>{(statusOkOrNc)? ( (runnerResult.points_final || runnerResult.finish_time)? `${runnerResult.points_final}` : "")  : ""}</Typography>
                </Box>
              </ResultListItem>
            )
          })
        }
        <RogaineVirtualTicket
          isTicketOpen={isVirtualTicketOpen}
          runner={selectedRunner}
          handleCloseTicket={handleCloseVirtualTicket}
        />
      </ResultListContainer>
    )
  }
}
