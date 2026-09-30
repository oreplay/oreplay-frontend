const MOBILE_USER_AGENT_PATTERN = /Mobi|Opera Mini/i

export type UserAgentSource = {
  userAgent: string
  userAgentData?: { mobile: boolean }
}

export function isMobileDevice(source: UserAgentSource) {
  return source.userAgentData?.mobile ?? isMobileUserAgent(source.userAgent)
}

export function isMobileUserAgent(userAgent: string) {
  return MOBILE_USER_AGENT_PATTERN.test(userAgent)
}
