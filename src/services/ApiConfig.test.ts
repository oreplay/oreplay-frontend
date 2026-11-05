import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { AxiosAdapter, InternalAxiosRequestConfig } from "axios"
import { axiosInstance, get, setApiAuthorization } from "./ApiConfig.ts"

const USER_TOKEN = "user-token"

/**
 * Replaces the network with an adapter that answers every request with its `Authorization` header.
 * @returns The adapter that was in place, to restore it afterwards.
 */
function echoAuthorizationHeader() {
  const original = axiosInstance.defaults.adapter
  const adapter: AxiosAdapter = (config: InternalAxiosRequestConfig) =>
    Promise.resolve({
      data: config.headers.get("Authorization") ?? null,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    })
  axiosInstance.defaults.adapter = adapter
  return original
}

describe("ApiConfig authorization", () => {
  let originalAdapter: typeof axiosInstance.defaults.adapter

  beforeEach(() => {
    originalAdapter = echoAuthorizationHeader()
  })

  afterEach(() => {
    axiosInstance.defaults.adapter = originalAdapter
    setApiAuthorization(null)
  })

  it("sends the signed-in user's token when the request passes none", async () => {
    setApiAuthorization(USER_TOKEN)

    expect(await get<string>("events/event/stages/stage/results")).toBe(`Bearer ${USER_TOKEN}`)
  })

  it("sends no token once the user has signed out", async () => {
    setApiAuthorization(USER_TOKEN)
    setApiAuthorization(null)

    expect(await get<string | null>("events/event/stages/stage/results")).toBeNull()
  })

  it("prefers the token the request passes", async () => {
    setApiAuthorization(USER_TOKEN)

    expect(await get<string>("events/event", "explicit-token")).toBe("Bearer explicit-token")
  })
})
