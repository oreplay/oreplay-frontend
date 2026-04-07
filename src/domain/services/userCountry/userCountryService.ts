import axios from "axios"
import { userIpInfoResponse } from "./userCountryModel.ts"

/**
 * Fetch from an external service localization information from their IP
 */
export async function getUserIpInfo() {
  const response = await axios.get<userIpInfoResponse>("https://ipapi.co/json/")

  return response.data
}
