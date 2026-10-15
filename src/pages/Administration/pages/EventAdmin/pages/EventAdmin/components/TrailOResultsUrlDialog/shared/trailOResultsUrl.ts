export const TRAIL_O_RESULTS_HOSTS = ["top.yq.cz", "jaruori.es", "www.jaruori.es"] as const

export const TRAIL_O_RESULTS_URL_MAX_LENGTH = 255

const ALLOWED_PROTOCOLS = ["http:", "https:"]

/**
 * Whether a host is one of the Trail-O results sites, TOP (Trail Open Project) or Jaruori. Only an
 * exact match counts, so subdomains and look-alike domains are rejected.
 *
 * @param hostname Lower-cased host of a parsed URL.
 * @returns `true` for `top.yq.cz`, `jaruori.es` and `www.jaruori.es`.
 */
function isAllowedHost(hostname: string): boolean {
  return TRAIL_O_RESULTS_HOSTS.some((host) => host === hostname)
}

/**
 * Whether a URL points to the results of a Trail-O event published on TOP or Jaruori, the only
 * sites the backend accepts for a stage.
 *
 * @param url Absolute URL; one without protocol is not a URL and is rejected.
 * @returns `true` for an http(s) URL on an allowed host.
 */
export function isTrailOResultsUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url)
    return ALLOWED_PROTOCOLS.includes(protocol) && isAllowedHost(hostname)
  } catch {
    return false
  }
}

/**
 * Whether what the organiser typed can be saved as the results URL of the stage.
 *
 * @param input Raw text of the field; surrounding spaces are ignored.
 * @returns `true` when it is empty, which removes the link, or a TOP or Jaruori URL.
 */
export function isValidTrailOResultsInput(input: string): boolean {
  const url = toExternalUrl(input)
  return url === null || isTrailOResultsUrl(url)
}

/**
 * Turns the text of the field into the value sent to the backend.
 *
 * @param url Raw text of the field.
 * @returns The trimmed URL, or `null` when the field is blank so the link is removed.
 */
export function toExternalUrl(url: string): string | null {
  const trimmedUrl = url.trim()
  return trimmedUrl === "" ? null : trimmedUrl
}
