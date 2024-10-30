import {RESULT_STATUS} from "./constants.ts";

export function parseResultStatus(status: string): string {

  switch(status) {
    case RESULT_STATUS.ok:
      return "ok"
    case RESULT_STATUS.dns:
      return "dns"
    case RESULT_STATUS.dnf:
      return "dnf"
    case RESULT_STATUS.mp:
      return "mp"
    case RESULT_STATUS.disqualified:
      return "disqualified"
    case RESULT_STATUS.ot:
      return "ot"
    default:
      throw new Error(`Unknown status: ${status}`)
  }
}