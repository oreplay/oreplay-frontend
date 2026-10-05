import { describe, expect, it } from "vitest"
import {
  ConnectionBarState,
  connectionBarOnConnectivityChange,
  hideConnectionBar,
  initialConnectionBar,
  isShowingBackOnline,
} from "./connectionBar.ts"

const offline: ConnectionBarState = { kind: "offline", isVisible: true }
const backOnline: ConnectionBarState = { kind: "backOnline", isVisible: true }
const hidden: ConnectionBarState = { kind: "backOnline", isVisible: false }

describe("initialConnectionBar", () => {
  it("is hidden when online", () => {
    expect(initialConnectionBar(true)).toEqual(hidden)
  })

  it("shows the offline bar when offline", () => {
    expect(initialConnectionBar(false)).toEqual(offline)
  })
})

describe("connectionBarOnConnectivityChange", () => {
  it.each([hidden, backOnline])("shows the offline bar when connection drops from %o", (state) => {
    expect(connectionBarOnConnectivityChange(state, false)).toEqual(offline)
  })

  it("shows back online when connection returns after being offline", () => {
    expect(connectionBarOnConnectivityChange(offline, true)).toEqual(backOnline)
  })

  it.each([hidden, backOnline, offline])(
    "keeps the same state object when nothing changes",
    (state) => {
      const isOnline = state.kind === "backOnline"
      expect(connectionBarOnConnectivityChange(state, isOnline)).toBe(state)
    },
  )
})

describe("hideConnectionBar", () => {
  it("hides the bar keeping its kind so the exit animation shows the last message", () => {
    expect(hideConnectionBar(backOnline)).toEqual(hidden)
  })

  it("keeps the same state object when already hidden", () => {
    expect(hideConnectionBar(hidden)).toBe(hidden)
  })
})

describe("isShowingBackOnline", () => {
  it.each([
    [backOnline, true],
    [hidden, false],
    [offline, false],
  ])("for %o is %s", (state, expected) => {
    expect(isShowingBackOnline(state)).toBe(expected)
  })
})
