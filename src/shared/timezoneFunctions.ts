import { DateTime } from "luxon"
import { TimeZoneId } from "../pages/Administration/pages/EventAdmin/components/EventAdminForm/components/TimeZoneAutocomplete"
import { getUserTimeZone } from "../pages/Administration/pages/EventAdmin/components/EventAdminForm/components/TimeZoneAutocomplete/functions.ts"

/**
 * Helper function to check if two timezones will give the same time offset on a given datetime
 * @param when Moment in time we want to compare the timezones
 * @param timezone1 Firsts timezone
 * @param timezone2 Second timezone
 */
export function checkIfTimezonesMatch(
  when: DateTime,
  timezone1: TimeZoneId,
  timezone2: TimeZoneId,
): boolean {
  const date1 = when.setZone(timezone1)
  const date2 = when.setZone(timezone2)

  return date1.offset === date2.offset
}

export function checkIfEventTimezoneMatchesUser(
  stageStart: DateTime,
  eventTimezone: TimeZoneId,
): boolean {
  const usersTimezone = getUserTimeZone()

  return checkIfTimezonesMatch(stageStart, usersTimezone, eventTimezone)
}
