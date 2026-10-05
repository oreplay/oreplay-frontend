import { afterEach, describe, expect, it } from "vitest"
import { AxiosAdapter } from "axios"
import {
  clearAxiosClientInstance,
  createIsolatedAxiosInstance,
  getAxiosClientInstance,
  initAxiosClientInstance,
} from "./AxiosInstance.ts"
import { orvalAxiosInstance } from "./orval-axios-instance.ts"

const BASE_URL = "https://api.example.test"
const RESPONSE_BODY = { data: [{ id: "ranking-1" }], total: 1 }

const respondWithBody: AxiosAdapter = (config) =>
  Promise.resolve({
    config,
    data: RESPONSE_BODY,
    headers: {},
    status: 200,
    statusText: "OK",
  })

describe("orvalAxiosInstance", () => {
  afterEach(() => {
    clearAxiosClientInstance()
  })

  it("resolves to the response body using the shared client", async () => {
    initAxiosClientInstance(BASE_URL)
    getAxiosClientInstance().defaults.adapter = respondWithBody

    const body = await orvalAxiosInstance<typeof RESPONSE_BODY>({ url: "/rankings", method: "GET" })

    expect(body).toEqual(RESPONSE_BODY)
  })

  it("resolves to the response body using the client passed in the options", async () => {
    const isolatedClient = createIsolatedAxiosInstance(BASE_URL)
    isolatedClient.defaults.adapter = respondWithBody

    const body = await orvalAxiosInstance<typeof RESPONSE_BODY>(
      { url: "/rankings", method: "GET" },
      { axiosInstance: isolatedClient },
    )

    expect(body).toEqual(RESPONSE_BODY)
  })

  it("fails when the shared client has not been initialised", async () => {
    await expect(orvalAxiosInstance({ url: "/rankings", method: "GET" })).rejects.toThrow()
  })
})
