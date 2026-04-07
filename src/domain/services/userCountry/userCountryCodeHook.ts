import { useQuery, UseQueryOptions } from "react-query"
import { getUserIpInfo } from "./userCountryService.ts"
import { countryCode, userIpInfoResponse } from "./userCountryModel.ts"

/**
 * Query the user's country code to an external service from user's ip.
 * @param options options to pass to useQuery
 */
export function useUserCountryCode(
  options?: UseQueryOptions<userIpInfoResponse, unknown, countryCode>,
) {
  return useQuery<userIpInfoResponse, unknown, countryCode>(["userCountry"], getUserIpInfo, {
    ...options,
    staleTime: Infinity,
    select: (data) => data.country_code,
  })
}
