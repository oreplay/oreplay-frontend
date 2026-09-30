const PROTOCOL_PATTERN = /^https?:\/\//i

export function parseWebsiteUrl(website?: string | null): URL | null {
  if (!website) {
    return null
  }
  const withProtocol = PROTOCOL_PATTERN.test(website) ? website : `https://${website}`
  try {
    return new URL(withProtocol)
  } catch {
    return null
  }
}
