import { describe, expect, it } from "vitest"
import { isMobileDevice, isMobileUserAgent } from "./isMobileDevice.ts"

const ANDROID_PHONE =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
const ANDROID_TABLET =
  "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
const FIREFOX_ANDROID = "Mozilla/5.0 (Android 14; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0"
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
const IPADOS_DESKTOP_MODE =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"
const DESKTOP_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
const DESKTOP_FIREFOX = "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0"

describe("isMobileUserAgent", () => {
  it.each([ANDROID_PHONE, FIREFOX_ANDROID, IPHONE])("detects a phone: %s", (userAgent) => {
    expect(isMobileUserAgent(userAgent)).toBe(true)
  })

  it.each([ANDROID_TABLET, IPADOS_DESKTOP_MODE, DESKTOP_CHROME, DESKTOP_FIREFOX])(
    "treats non-phones as desktop: %s",
    (userAgent) => {
      expect(isMobileUserAgent(userAgent)).toBe(false)
    },
  )
})

describe("isMobileDevice", () => {
  it("prefers the client hint over the user agent string", () => {
    expect(isMobileDevice({ userAgent: ANDROID_PHONE, userAgentData: { mobile: false } })).toBe(
      false,
    )
    expect(isMobileDevice({ userAgent: DESKTOP_CHROME, userAgentData: { mobile: true } })).toBe(
      true,
    )
  })

  it("falls back to the user agent string without a client hint", () => {
    expect(isMobileDevice({ userAgent: IPHONE })).toBe(true)
    expect(isMobileDevice({ userAgent: DESKTOP_FIREFOX })).toBe(false)
  })
})
