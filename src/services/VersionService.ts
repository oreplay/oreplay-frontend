import { get } from "./ApiConfig"

interface BackendResponse {
  data: {
    version: string
  }
}

export async function getBackendVersion(): Promise<string> {
  try {
    const response = await get<BackendResponse>("")
    return response.data.version
  } catch {
    throw new Error("Failed to fetch backend version")
  }
}
