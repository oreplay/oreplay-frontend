import React from "react";
import {
  parseStartTime
} from '../../../shared/Functions.tsx'
import {useTranslation} from "react-i18next";
import { Typography } from '@mui/material'

interface StartTimeProps {
  time: string;
}

const StartTime: React.FC<StartTimeProps> = ({ time }) => {
  const {t} = useTranslation();
  if (time === null || time === undefined) {
    return t('ResultsStage.NoStartTime')
  }
  const start = parseStartTime(time)

  return (
    <Typography>{start}</Typography>
  );
};

export default StartTime;
