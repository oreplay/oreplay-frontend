import { Box, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RunnersContext } from "../../../../shared/context.ts";
import { orderRunnersByStartTime } from "./shared/functions.ts";
import { useTranslation } from "react-i18next";
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx";
import ResultListItem from "../../../../components/ResultsList/ResultListItem.tsx";
import StartTime from "../../../../components/StartTime.tsx";
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts";
import { parseResultStatus } from "../../../../shared/functions.ts";

export default function FootOStartTime() {
  const { t } = useTranslation();

  // Get runners and order by start time
  const [rawRunnersList, isLoading] = useContext(RunnersContext);
  const [runnersByStartTime, setRunnersByStartTime] =
    useState<ProcessedRunnerModel[]>(rawRunnersList);

  useEffect(() => {
    setRunnersByStartTime(orderRunnersByStartTime(rawRunnersList));
  }, [rawRunnersList]);

  if (isLoading) {
    return t("Loading");
  } else {
    return (
      <ResultListContainer>
        {runnersByStartTime.map((runner) => (
          <ResultListItem key={runner.id}>
            <Box
              sx={{
                flexGrow: 1, // Make this element flexible
                flexShrink: 1, // Allow shrinking if needed
                flexBasis: 0, // Allow it to take as much space as needed
                overflowWrap: "break-word", // Allow text to wrap
                wordBreak: "break-word", // Break long words to fit
              }}
            >
              <Stack direction={"column"}>
                <Typography>{`${runner.first_name} ${runner.last_name}`}</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {runner.club ? `${runner.club.short_name}` : t("ResultsStage.NoClubMsg")}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                display: "flex", // Add this line to enable flex properties for the box
                flexDirection: "column", // Stack text vertically
                alignItems: "center", // Center the content horizontally in the box
                justifyContent: "flex-start ", // Center the content vertically in the box
                textAlign: "center", // Center the text itself inside each Typography component
              }}
            >
              <StartTime
                displayStatus
                startTime={runner.runner_results[0].start_time}
                status={parseResultStatus(runner.runner_results[0]?.status_code as string)}
              ></StartTime>
              <Typography sx={{ color: "text.secondary" }}>{`${runner.sicard}`}</Typography>
            </Box>
          </ResultListItem>
        ))}
      </ResultListContainer>
    );
  }
}
