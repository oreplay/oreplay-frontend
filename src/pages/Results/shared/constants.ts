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

export const RESULT_STATUS_PRIORITY: Record<string, number> = {
  [RESULT_STATUS.ok]: 1,
  [RESULT_STATUS.nc]: 2,
  [RESULT_STATUS.ot]: 3,
  [RESULT_STATUS.mp]: 4,
  [RESULT_STATUS.dnf]: 5,
  [RESULT_STATUS.dsq]: 6,
  [RESULT_STATUS.dns]: 7,
}
