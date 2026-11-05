import { DateTime } from "luxon"
import { GetEventTokenResponse } from "../../../../../../../shared/EntityTypes.ts"

/**
 * Picks the token an organizer should see out of the event's valid tokens: the one that expires
 * last. The backend lists them in no particular order, so taking the first would show an
 * arbitrary one whenever an event has more than one.
 * @param tokens The event's valid tokens, in any order.
 * @returns The token that expires last, or `null` when the event has none.
 */
export function latestEventToken(tokens: GetEventTokenResponse[]): GetEventTokenResponse | null {
  return tokens.reduce<GetEventTokenResponse | null>(
    (latest, token) =>
      !latest || DateTime.fromISO(token.expires) > DateTime.fromISO(latest.expires)
        ? token
        : latest,
    null,
  )
}
