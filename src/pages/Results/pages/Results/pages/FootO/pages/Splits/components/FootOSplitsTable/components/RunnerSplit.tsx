import { Typography, SxProps, Theme } from "@mui/material";
import {
  parseSecondsToMMSS,
  parseTimeBehind,
} from "../../../../../../../../../../../shared/Functions.tsx";
import { ProcessedSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts";
import { RunnerTimeLossInfo } from "../../utils/timeLossAnalysis.ts";

type RunnerSplitProps = {
  split: ProcessedSplitModel;
  showCumulative?: boolean;
  timeLossInfo?: RunnerTimeLossInfo | null;
  timeLossEnabled?: boolean;
};

type ColorFontWeightStyle = {
  color?: string;
  fontWeight?: string | number;
};

const styles: SxProps<Theme> = {
  fontSize: "small",
};

const getTimeLossStyles = (
  timeLossInfo: RunnerTimeLossInfo | null | undefined,
  timeLossEnabled: boolean
): ColorFontWeightStyle => {
  if (!timeLossEnabled || !timeLossInfo) {
    return {};
  }

  const baseStyles: ColorFontWeightStyle = {};

  switch (timeLossInfo.rank) {
    case 1:
      baseStyles.color = "#006400"; // Dark green
      baseStyles.fontWeight = "bold";
      break;
    case 2:
      baseStyles.color = "#228B22"; // Medium green
      baseStyles.fontWeight = "bold";
      break;
    case 3:
      baseStyles.color = "#76D276"; // Light green
      baseStyles.fontWeight = "bold";
      break;
    default:
      if (timeLossInfo.hasTimeLoss) {
        baseStyles.color = "#FF0000";
        baseStyles.fontWeight = "bold";
      }
  }

  return baseStyles;
};

export default function RunnerSplit({
                                      split,
                                      showCumulative,
                                      timeLossInfo,
                                      timeLossEnabled = false,
                                    }: RunnerSplitProps) {
  const timeLossStyles = getTimeLossStyles(timeLossInfo, timeLossEnabled);

  if (showCumulative) {
    const isScratch = split.cumulative_position === 1;

    const timeStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    };

    const behindStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    };

    return (
      <>
        <Typography sx={timeStyles}>
          {split.cumulative_time !== null ? parseSecondsToMMSS(split.cumulative_time) : "--"}
        </Typography>
        <Typography sx={behindStyles}>
          {split.cumulative_behind !== null
            ? `${parseTimeBehind(split.cumulative_behind)} (${split.cumulative_position})`
            : "--"}
        </Typography>
      </>
    );
  } else {
    const isScratch = split.position === 1;

    const timeStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    };

    const behindStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    };

    return (
      <>
        <Typography sx={timeStyles}>
          {split.time !== null ? parseSecondsToMMSS(split.time) : "--"}
        </Typography>
        <Typography sx={behindStyles}>
          {split.time_behind !== null
            ? `${parseTimeBehind(split.time_behind)} (${split.position})`
            : "--"}
        </Typography>
      </>
    );
  }
}
