import { Typography } from "@mui/material"
import { RACE_POSITION_SLOT_MIN_WIDTH } from "../../../../../../../shared/racePosition.ts"

interface RelayResultLegNumberProps {
  legNumber: number
}

/**
 * Leg number of a relay leg, written small but in a slot as wide as the team's position slot, with
 * the same right alignment and gap, so the dots and the names line up with the team row above.
 *
 * @param props.legNumber Number of the leg, starting at 1.
 */
export default function RelayResultLegNumber({ legNumber }: RelayResultLegNumberProps) {
  return (
    <Typography
      component="span"
      sx={{
        flexShrink: 0,
        marginRight: 1,
        minWidth: RACE_POSITION_SLOT_MIN_WIDTH,
        textAlign: "end",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <Typography component="span" sx={{ color: "text.secondary", fontSize: "small" }}>
        {`${legNumber}.`}
      </Typography>
    </Typography>
  )
}
