import {Box, Stack, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {RunnersContext} from "../../../../shared/context.ts";
import {RunnerModel} from "../../../../../../shared/EntityTypes.ts";
import {orderRunnersByStartTime} from "./shared/functions.ts";
import {useTranslation} from "react-i18next";
import {parseStartTime} from "../../../../../../shared/Functions.tsx";

export default function FootOStartTime() {
  const {t} = useTranslation()

  // Get runners and order by start time
  const [rawRunnersList,isLoading] = useContext(RunnersContext)
  const [runnersByStartTime,setRunnersByStartTime] = useState<RunnerModel[]>(rawRunnersList)

  useEffect(() => {
    setRunnersByStartTime( orderRunnersByStartTime(rawRunnersList) )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runnersByStartTime]);

  if (isLoading) {
    return t('Loading')
  } else {
    return (
      <Box sx={{height: "100%", marginBottom:'2rem', maxWidth:'600px'}}>
        <Stack direction={"column"} spacing={2} sx={{flexWrap: 'wrap'}}>
          {
            runnersByStartTime.map((runner) => (
              <Box
                key={runner.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ flexDirection: 'row' }}
              >
                <Box
                  sx={{
                    flexGrow: 1,  // Make this element flexible
                    flexShrink: 1,  // Allow shrinking if needed
                    flexBasis: 0,  // Allow it to take as much space as needed
                    overflowWrap: 'break-word',  // Allow text to wrap
                    wordBreak: 'break-word',  // Break long words to fit
                  }}
                >
                  <Stack direction={'column'}>
                    <Typography>
                      {`${runner.first_name} ${runner.last_name}`}
                    </Typography>
                    <Typography sx={{color:'text.secondary'}}>
                      {`${runner.club.short_name}`}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    flexShrink: 0,
                    display: "flex", // Add this line to enable flex properties for the box
                    flexDirection: "column", // Stack text vertically
                    alignItems: "center", // Center the content horizontally in the box
                    justifyContent: "center", // Center the content vertically in the box
                    textAlign: "center", // Center the text itself inside each Typography component
                  }}
                >
                  <Typography>{parseStartTime(runner.runner_results[0].start_time)}</Typography>
                  <Typography sx={{color:'text.secondary'}}>{`${runner.sicard}`}</Typography>
                </Box>
              </Box>
            )
            )
          }
        </Stack>
      </Box>
    )
  }
}