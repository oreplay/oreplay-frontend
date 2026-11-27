import { Participant } from "../../../../../../../domain/types/v1api"
import { parseSecondsToMMSS, parseStartTime } from "../../../../../../../shared/Functions.tsx"

const SUBTITLE_SEPARATOR = " · "

/**
 * Formats the time from the start to the punch.
 * @param elapsedSeconds Seconds from the start to the punch; `null` when the start is unknown.
 * @returns The time as MM:SS or H:MM:SS, or `null` when there is nothing to show.
 */
export function formatPunchElapsedTime(elapsedSeconds: number | null): string | null {
  return elapsedSeconds === null ? null : parseSecondsToMMSS(elapsedSeconds)
}

/**
 * Formats the clock time of a punch, in the viewer's time zone like the start times of the results
 * lists.
 * @param readingTime Time of the punch, as ISO 8601 with offset.
 * @returns The time as HH:mm:ss.
 */
export function formatPunchClockTime(readingTime: string): string {
  return parseStartTime(readingTime) ?? ""
}

/**
 * Builds the line under the participant's name: its class and its club.
 * @param participant The team or runner of the row.
 * @param noClubLabel Text shown in place of the club when the participant has none.
 * @returns Class and club joined, leaving out a missing class.
 */
export function getPunchSubtitle(participant: Participant, noClubLabel: string): string {
  const className = participant.class?.short_name
  const clubName = participant.club?.short_name ?? noClubLabel
  return [className, clubName].filter(Boolean).join(SUBTITLE_SEPARATOR)
}
