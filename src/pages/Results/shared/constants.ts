import { ControlTypeModel } from "../../../shared/EntityTypes.ts"

export const RESULT_STATUS = {
  ok: "0",
  dns: "1", //did not start
  dnf: "2", //did not finish
  mp: "3", // missing punch
  dsq: "4", //disqualified
  ot: "5", //out of time
  nc: "9", // not competitive
}

export const RESULT_STATUS_TEXT = {
  ok: "ok",
  dns: "dns", //did not start
  dnf: "dnf", //did not finish
  mp: "mp", // missing punch
  dsq: "dsq", //disqualified
  ot: "ot", //out of time
  nc: "nc", // not competitive
}

export const NORMAL_CONTROL: ControlTypeModel = {
  id: "f3cc5efa-065f-4ad6-844b-74e99612889b",
  description: "Normal Control",
}
