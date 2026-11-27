import { useEffect } from "react"
import { Duration } from "luxon"
import { getControlLiveUrl } from "./controlLiveUrl.ts"

/**
 * How often the stream is reopened. The server signals a control only while someone subscribed to
 * it, or it was signalled, within the last hour, so a stream left open on a quiet control would
 * stop receiving changes.
 */
export const RESUBSCRIBE_MILLISECONDS = Duration.fromObject({ minutes: 30 }).toMillis()

/**
 * Calls `onChange` every time the punches of a control change, while the calling component is
 * mounted. The browser reconnects a dropped stream by itself.
 * @param stageId Identifier of the stage.
 * @param station Code of the control.
 * @param onChange Called on each change; a new function reopens the stream, so pass a stable one.
 */
export function useControlChanges(stageId: string, station: number, onChange: () => unknown) {
  useEffect(() => {
    const url = getControlLiveUrl(stageId, station)

    /**
     * Opens the stream and forwards each of its messages to `onChange`.
     * @returns The open stream.
     */
    function openStream() {
      const stream = new EventSource(url)
      stream.onmessage = () => void onChange()
      return stream
    }

    let stream = openStream()
    const resubscribeTimer = window.setInterval(() => {
      stream.close()
      stream = openStream()
    }, RESUBSCRIBE_MILLISECONDS)

    return () => {
      window.clearInterval(resubscribeTimer)
      stream.close()
    }
  }, [stageId, station, onChange])
}
